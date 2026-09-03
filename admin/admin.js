// SMZ admin. Plain JS, no build step, supabase-js loaded from a CDN.
(function () {
  'use strict';
  var cfg = window.SMZ_CONFIG || {};
  var SCHEMA = window.SMZ_SCHEMA;
  var sb = null, current = null, editing = null, session = null;

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var el = function (t, c, h) { var n = document.createElement(t); if (c) n.className = c; if (h != null) n.innerHTML = h; return n; };
  function esc(v) {
    return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function toast(msg, ms) {
    var t = el('div', 'toast', esc(msg)); document.body.appendChild(t);
    setTimeout(function () { t.remove(); }, ms || 2600);
  }
  function mediaUrl(p) {
    return p ? cfg.SUPABASE_URL.replace(/\/+$/, '') + '/storage/v1/object/public/media/'
      + p.split('/').map(encodeURIComponent).join('/') : '';
  }

  // ------------------------------------------------------------ boot
  if (!cfg.SUPABASE_URL || !cfg.SUPABASE_ANON_KEY) {
    $('#app').innerHTML = '<div class="login"><h2>Noch nicht verbunden</h2>'
      + '<p>Trage die Supabase URL und den anon key in <code>js/config.js</code> ein. '
      + 'Die Anleitung steht in <code>SETUP.md</code>.</p></div>';
    return;
  }
  sb = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY);

  sb.auth.getSession().then(function (r) { setSession(r.data.session); });
  sb.auth.onAuthStateChange(function (_e, s) { setSession(s); });

  function setSession(s) {
    session = s;
    if (s) { renderShell(); } else { renderLogin(); }
  }

  // ------------------------------------------------------------ login
  function renderLogin(msg) {
    $('#app').innerHTML = '';
    var box = el('form', 'login');
    box.innerHTML = '<h2>SMZ Redaktion</h2>'
      + '<p>Anmelden mit der E-Mail-Adresse, die der Vorstand für dich angelegt hat.</p>'
      + '<label>E-Mail<input type="email" name="email" required autocomplete="username"></label>'
      + '<label>Passwort<input type="password" name="password" required autocomplete="current-password"></label>'
      + (msg ? '<p class="err">' + esc(msg) + '</p>' : '')
      + '<button class="btn btn-blue" type="submit">Anmelden</button>'
      + '<p><a href="../index.html" style="color:var(--blue-text)">Zur Website</a></p>';
    box.addEventListener('submit', function (e) {
      e.preventDefault();
      var b = $('button', box); b.disabled = true; b.textContent = 'Anmelden …';
      sb.auth.signInWithPassword({ email: box.email.value.trim(), password: box.password.value })
        .then(function (r) {
          if (r.error) renderLogin(r.error.message === 'Invalid login credentials'
            ? 'E-Mail oder Passwort stimmt nicht.' : r.error.message);
        });
    });
    $('#app').appendChild(box);
  }

  // ------------------------------------------------------------ shell
  function renderShell() {
    $('#app').innerHTML =
      '<div class="bar"><h1>SMZ Redaktion</h1>'
      + '<a class="site" href="../index.html">Website ansehen →</a>'
      + '<span class="who">' + esc(session.user.email) + '</span>'
      + '<button class="btn btn-ghost" id="out" style="color:#fff;border-color:rgba(255,255,255,.35)">Abmelden</button></div>'
      + '<div class="shell"><nav class="side" id="side"></nav><main class="panel" id="panel"></main></div>';
    $('#out').addEventListener('click', function () { sb.auth.signOut(); });
    var side = $('#side');
    Object.keys(SCHEMA).forEach(function (k) {
      var b = el('button', '', '<span>' + SCHEMA[k].icon + '</span> ' + esc(SCHEMA[k].label));
      b.addEventListener('click', function () { open(k); });
      b.dataset.k = k; side.appendChild(b);
    });
    open(current || Object.keys(SCHEMA)[0]);
  }

  function open(k) {
    current = k; editing = null;
    Array.prototype.forEach.call($('#side').children, function (b) { b.classList.toggle('on', b.dataset.k === k); });
    list();
  }

  // ------------------------------------------------------------ list
  function list() {
    var def = SCHEMA[current], panel = $('#panel');
    panel.innerHTML = '<div class="panel-head"><h2>' + esc(def.label) + '</h2>'
      + '<button class="btn btn-blue push" id="new">+ Neu</button></div>'
      + (def.hint ? '<p class="hint">' + esc(def.hint) + '</p>' : '')
      + '<div class="rows" id="rows"><p class="empty">Laden …</p></div>';
    $('#new').addEventListener('click', function () { form(null); });

    var q = sb.from(current).select('*');
    var o = (def.order || 'created_at.desc').split('.');
    q.order(o[0], { ascending: o[1] !== 'desc' }).then(function (r) {
      var box = $('#rows');
      if (r.error) { box.innerHTML = '<p class="empty">Fehler: ' + esc(r.error.message) + '</p>'; return; }
      if (!r.data.length) { box.innerHTML = '<p class="empty">Noch nichts erfasst. Lege den ersten Eintrag an.</p>'; return; }
      box.innerHTML = '';
      r.data.forEach(function (row) {
        var line = el('div', 'row');
        var thumb = def.thumb && row[def.thumb]
          ? '<img class="th" src="' + esc(mediaUrl(row[def.thumb])) + '" alt="">' : '';
        line.innerHTML = thumb
          + '<div class="txt"><b>' + esc(def.title(row) || '(ohne Titel)') + '</b>'
          + '<small>' + esc(def.meta ? def.meta(row) || '' : '') + '</small></div>'
          + (row.published === false ? '<span class="tag off">Entwurf</span>' : '')
          + '<button class="btn btn-ghost">Bearbeiten</button>';
        $('button', line).addEventListener('click', function () { form(row); });
        box.appendChild(line);
      });
    });
  }

  // ------------------------------------------------------------ form
  function form(row) {
    editing = row;
    var def = SCHEMA[current], panel = $('#panel');
    panel.innerHTML = '<div class="panel-head"><h2>' + esc(row ? 'Bearbeiten' : 'Neu') + '</h2>'
      + '<button class="btn btn-ghost push" id="back">← Zurück</button></div>';
    $('#back').addEventListener('click', list);

    var f = el('form', 'form');
    def.fields.forEach(function (fd) {
      var v = row ? row[fd.name] : (typeof fd.default === 'function' ? fd.default() : fd.default);
      f.appendChild(field(fd, v));
    });
    var act = el('div', 'actions');
    act.innerHTML = '<button class="btn btn-blue" type="submit">Speichern</button>'
      + '<button class="btn btn-ghost" type="button" id="cancel">Abbrechen</button>'
      + (row ? '<button class="btn btn-danger push" type="button" id="del">Löschen</button>' : '');
    f.appendChild(act);
    f.appendChild(el('p', 'err', '')).hidden = true;
    panel.appendChild(f);

    $('#cancel', f).addEventListener('click', list);
    if (row) $('#del', f).addEventListener('click', function () {
      if (!confirm('Diesen Eintrag wirklich löschen?')) return;
      sb.from(current).delete().eq('id', row.id).then(function (r) {
        if (r.error) return toast('Fehler: ' + r.error.message, 4000);
        toast('Gelöscht'); list();
      });
    });

    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var err = $('.err', f); err.hidden = true;
      var data = {}, missing = [];
      def.fields.forEach(function (fd) {
        var input = f.elements[fd.name];
        var val;
        if (fd.type === 'bool') val = input.checked;
        else if (fd.type === 'number') val = input.value === '' ? null : Number(input.value);
        else if (fd.type === 'image') val = f.dataset[fd.name] || (row ? row[fd.name] : null) || null;
        else val = input.value.trim() === '' ? null : input.value.trim();
        if (fd.required && (val === null || val === '')) missing.push(fd.label);
        data[fd.name] = val;
      });
      if (missing.length) {
        err.hidden = false; err.textContent = 'Bitte ausfüllen: ' + missing.join(', ');
        err.scrollIntoView({ block: 'center', behavior: 'smooth' }); return;
      }
      var btn = $('button[type=submit]', f); btn.disabled = true; btn.textContent = 'Speichern …';
      var op = row ? sb.from(current).update(data).eq('id', row.id) : sb.from(current).insert(data);
      op.then(function (r) {
        btn.disabled = false; btn.textContent = 'Speichern';
        if (r.error) { err.hidden = false; err.textContent = r.error.message; return; }
        toast('Gespeichert'); list();
      });
    });
  }

  function field(fd, v) {
    var hint = fd.hint ? '<span class="fhint">' + esc(fd.hint) + '</span>' : '';
    if (fd.type === 'bool') {
      var l = el('label', 'check');
      l.innerHTML = '<input type="checkbox" name="' + fd.name + '"' + (v ? ' checked' : '') + '> '
        + esc(fd.label) + hint;
      return l;
    }
    if (fd.type === 'image') return imageField(fd, v);
    var lab = el('label');
    var inner;
    if (fd.type === 'textarea') {
      inner = '<textarea name="' + fd.name + '">' + esc(v || '') + '</textarea>';
    } else if (fd.type === 'select') {
      inner = '<select name="' + fd.name + '">' + fd.options.map(function (o) {
        return '<option value="' + esc(o[0]) + '"' + (String(v) === o[0] ? ' selected' : '') + '>' + esc(o[1]) + '</option>';
      }).join('') + '</select>';
    } else {
      var type = fd.type === 'date' ? 'date' : fd.type === 'number' ? 'number' : fd.type === 'email' ? 'email' : 'text';
      inner = '<input type="' + type + '" name="' + fd.name + '" value="' + esc(v == null ? '' : v) + '"'
        + (fd.placeholder ? ' placeholder="' + esc(fd.placeholder) + '"' : '') + '>';
    }
    lab.innerHTML = esc(fd.label) + (fd.required ? ' *' : '') + inner + hint;
    return lab;
  }

  // ------------------------------------------------------------ image upload
  // Resized in the browser before upload so a 6 MB phone photo never reaches
  // the bucket: max 1200px wide, JPEG quality 0.62, matching the repo rule.
  // PNGs stay PNG so sponsor logos keep their transparency.
  function imageField(fd, v) {
    var wrap = el('label');
    wrap.innerHTML = esc(fd.label) + (fd.required ? ' *' : '')
      + '<div class="drop" tabindex="0">Bild hierher ziehen oder klicken</div>'
      + (fd.hint ? '<span class="fhint">' + esc(fd.hint) + '</span>' : '')
      + '<div class="preview"' + (v ? '' : ' hidden') + '>'
      + '<img src="' + esc(v ? mediaUrl(v) : '') + '" alt="">'
      + '<button class="btn btn-ghost" type="button">Entfernen</button></div>';
    var drop = $('.drop', wrap), prev = $('.preview', wrap), pimg = $('img', prev);
    var input = el('input'); input.type = 'file'; input.accept = 'image/*'; input.hidden = true;
    wrap.appendChild(input);

    function setVal(path) {
      var f = wrap.closest('form') || document.querySelector('.form');
      if (f) f.dataset[fd.name] = path || '';
      if (path) { pimg.src = mediaUrl(path); prev.hidden = false; }
      else { pimg.src = ''; prev.hidden = true; }
    }
    // seed the existing value once the field is in the DOM
    setTimeout(function () { if (v) setVal(v); }, 0);

    $('button', prev).addEventListener('click', function () { setVal(''); });
    drop.addEventListener('click', function () { input.click(); });
    drop.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); input.click(); } });
    ['dragover', 'dragenter'].forEach(function (n) {
      drop.addEventListener(n, function (e) { e.preventDefault(); drop.classList.add('over'); });
    });
    ['dragleave', 'drop'].forEach(function (n) {
      drop.addEventListener(n, function (e) { e.preventDefault(); drop.classList.remove('over'); });
    });
    drop.addEventListener('drop', function (e) { if (e.dataTransfer.files[0]) upload(e.dataTransfer.files[0]); });
    input.addEventListener('change', function () { if (input.files[0]) upload(input.files[0]); });

    function upload(file) {
      if (!/^image\//.test(file.type)) return toast('Das ist kein Bild', 3000);
      drop.textContent = 'Verkleinern …';
      shrink(file).then(function (out) {
        drop.textContent = 'Hochladen …';
        var name = file.name.replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9-_]+/g, '-').toLowerCase().slice(0, 40);
        var path = current + '/' + Date.now() + '-' + (name || 'bild') + out.ext;
        return sb.storage.from('media').upload(path, out.blob, { contentType: out.type, upsert: false })
          .then(function (r) {
            if (r.error) throw r.error;
            setVal(path);
            drop.textContent = 'Bild hierher ziehen oder klicken';
            toast('Bild hochgeladen (' + Math.round(out.blob.size / 1024) + ' KB)');
          });
      }).catch(function (e) {
        drop.textContent = 'Bild hierher ziehen oder klicken';
        toast('Fehler: ' + (e.message || e), 4000);
      });
    }
    return wrap;
  }

  function shrink(file) {
    var isPng = /png$/i.test(file.type);
    return new Promise(function (res, rej) {
      var img = new Image(), url = URL.createObjectURL(file);
      img.onload = function () {
        URL.revokeObjectURL(url);
        var MAX = 1200, w = img.naturalWidth, h = img.naturalHeight;
        if (w > MAX) { h = Math.round(h * MAX / w); w = MAX; }
        var c = document.createElement('canvas'); c.width = w; c.height = h;
        c.getContext('2d').drawImage(img, 0, 0, w, h);
        c.toBlob(function (b) {
          if (!b) return rej(new Error('Bild konnte nicht verarbeitet werden'));
          res({ blob: b, type: isPng ? 'image/png' : 'image/jpeg', ext: isPng ? '.png' : '.jpg' });
        }, isPng ? 'image/png' : 'image/jpeg', isPng ? undefined : 0.62);
      };
      img.onerror = function () { URL.revokeObjectURL(url); rej(new Error('Bild konnte nicht gelesen werden')); };
      img.src = url;
    });
  }
})();
