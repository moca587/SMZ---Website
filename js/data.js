// SMZ Zürich: pull published content from Supabase and replace the built in
// content with it. Progressive enhancement on purpose: if the project is not
// configured yet, or the network fails, or a collection is empty, the markup
// already in index.html stays exactly as it is. The site never renders blank.
(function () {
  var cfg = window.SMZ_CONFIG || {};
  if (!cfg.SUPABASE_URL || !cfg.SUPABASE_ANON_KEY) return;

  var REST = cfg.SUPABASE_URL.replace(/\/+$/, '') + '/rest/v1/';
  var MEDIA = cfg.SUPABASE_URL.replace(/\/+$/, '') + '/storage/v1/object/public/media/';

  // ---------------------------------------------------------------- helpers
  function esc(v) {
    return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  // every visible string must exist in both languages; fall back to German so a
  // half filled row can never produce an empty English span
  function t(de, en) {
    var d = esc(de), e = esc(en || de);
    return '<span lang="de">' + d + '</span><span lang="en">' + e + '</span>';
  }
  function img(path) { return path ? MEDIA + path.split('/').map(encodeURIComponent).join('/') : ''; }

  function get(table, query) {
    return fetch(REST + table + '?' + query, {
      headers: { apikey: cfg.SUPABASE_ANON_KEY, Authorization: 'Bearer ' + cfg.SUPABASE_ANON_KEY }
    }).then(function (r) { return r.ok ? r.json() : Promise.reject(new Error(table + ' ' + r.status)); });
  }

  var MONTH_DE = ['JAN', 'FEB', 'MÄR', 'APR', 'MAI', 'JUN', 'JUL', 'AUG', 'SEP', 'OKT', 'NOV', 'DEZ'];
  var MONTH_EN = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  function parts(iso) {
    var p = String(iso).split('-');
    return { y: p[0], m: parseInt(p[1], 10) - 1, d: p[2] };
  }
  function dmy(iso) { var p = parts(iso); return p.d + '.' + String(p.m + 1).padStart(2, '0') + '.' + p.y; }

  // ---------------------------------------------------------------- renderers
  function renderNews(rows) {
    var box = document.querySelector('.news');
    if (!box || !rows.length) return;
    box.innerHTML = rows.map(function (n, i) {
      var feat = (n.featured || i === 0) && i === 0;
      var link = n.link
        ? '<a class="btn-link" href="' + esc(n.link) + '">' + t('Weiterlesen →', 'Read more →') + '</a>'
        : '';
      return '<article class="post' + (feat ? ' feat' : '') + '">'
        + '<div class="date">' + esc(dmy(n.published_on)) + '</div>'
        + '<h3>' + t(n.title_de, n.title_en) + '</h3>'
        + '<p>' + t(n.body_de, n.body_en) + '</p>'
        + link + '</article>';
    }).join('');
  }

  function renderEvents(rows) {
    var box = document.querySelector('.cal');
    if (!box || !rows.length) return;
    var note = box.querySelector('.note');
    box.innerHTML = rows.map(function (e) {
      var p = parts(e.starts_on);
      var big = e.all_month
        ? t(MONTH_DE[p.m], MONTH_EN[p.m]) + '<small>' + esc(p.y) + '</small>'
        : esc(p.d) + '<small>' + t(MONTH_DE[p.m], MONTH_EN[p.m]) + '</small>';
      // location and detail are separate: without this guard an event that has a
      // location but no detail printed the location twice
      var line = (e.detail_de || e.detail_en) ? t(e.detail_de, e.detail_en) : '';
      var loc = e.location ? esc(e.location) : '';
      return '<div class="ev"><div class="d">' + big + '</div>'
        + '<div><b>' + t(e.title_de, e.title_en) + '</b>'
        + '<span>' + loc + (loc && line ? ' · ' : '') + line + '</span></div></div>';
    }).join('');
    if (note) box.appendChild(note);   // keep the standing footnote below the list
  }

  function renderPhotos(rows) {
    var marquee = document.querySelector('.marquee');
    if (!marquee || rows.length < 2) return;
    var rowsEls = marquee.querySelectorAll('.mrow');
    if (rowsEls.length < 2) return;
    var half = Math.ceil(rows.length / 2);
    [rows.slice(0, half), rows.slice(half)].forEach(function (set, i) {
      if (!set.length) return;
      var tile = function (p, dup) {
        return '<button type="button" class="face"' + (dup ? ' tabindex="-1" aria-hidden="true"' : '')
          + ' data-de="' + esc(p.caption_de || p.alt) + '" data-en="' + esc(p.caption_en || p.caption_de || p.alt) + '"'
          + ' aria-label="' + esc(p.alt) + '">'
          + '<img src="' + esc(img(p.image_path)) + '" alt="' + esc(p.alt) + '" loading="lazy"></button>';
      };
      // duplicated so the -50% keyframe still loops seamlessly
      rowsEls[i].innerHTML = set.map(function (p) { return tile(p, false); }).join('')
        + set.map(function (p) { return tile(p, true); }).join('');
    });
  }

  function renderPeople(rows) {
    var grids = document.querySelectorAll('#page-verein .people');
    if (grids.length < 2) return;
    [['board', grids[0]], ['coach', grids[1]]].forEach(function (pair) {
      var set = rows.filter(function (p) { return p.kind === pair[0]; });
      if (!set.length) return;
      pair[1].innerHTML = set.map(function (p) {
        var mail = p.email
          ? '<a href="mailto:' + esc(p.email) + '">' + esc(p.email) + '</a>' : '';
        var initials = p.initials || p.name.split(/\s+/).map(function (w) { return w[0]; }).join('').slice(0, 3);
        var small = initials.length > 2 ? ' style="font-size:15px;line-height:1.05"' : '';
        return '<div class="person"><div class="av"' + small + '>' + esc(initials) + '</div>'
          + '<div><b>' + esc(p.name) + '</b><span>' + t(p.role_de, p.role_en) + '</span>' + mail + '</div></div>';
      }).join('');
    });
  }

  function renderSponsors(rows) {
    var row = document.querySelector('.sponsors .row');
    if (!row || !rows.length) return;
    row.innerHTML = rows.map(function (s) {
      var cls = 'logo-tile' + (s.tier === 'gold' || s.dark_tile ? ' gold' : '');
      var inner = s.logo_path
        ? '<img src="' + esc(img(s.logo_path)) + '" alt="' + esc(s.name) + '" loading="lazy">'
        : esc(s.name);
      var label = (s.label_de || s.label_en)
        ? '<small>' + t(s.label_de, s.label_en) + '</small>'
        : '<small>' + t(s.name, s.name) + '</small>';
      var tile = '<div class="' + cls + '">' + inner + label + '</div>';
      return s.url
        ? '<a href="' + esc(s.url) + '" target="_blank" rel="noopener noreferrer" style="text-decoration:none;display:contents">' + tile + '</a>'
        : tile;
    }).join('');
  }

  // ---------------------------------------------------------------- load
  // Each collection is independent: one failing never blanks another section.
  function load(table, query, render) {
    get(table, query).then(function (rows) {
      try { render(rows); } catch (e) { console.warn('[smz] render ' + table, e); }
    }).catch(function (e) { console.warn('[smz] fetch ' + table, e.message); });
  }

  var today = new Date().toISOString().slice(0, 10);
  load('news', 'select=*&published=eq.true&order=published_on.desc&limit=5', renderNews);
  load('events', 'select=*&published=eq.true&or=(starts_on.gte.' + today + ',ends_on.gte.' + today + ')&order=starts_on.asc&limit=12', renderEvents);
  load('photos', 'select=*&published=eq.true&in_marquee=eq.true&order=sort.asc', renderPhotos);
  load('people', 'select=*&published=eq.true&order=sort.asc', renderPeople);
  load('sponsors', 'select=*&published=eq.true&order=sort.asc', renderSponsors);
})();
