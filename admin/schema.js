// Declarative definition of every editable collection.
// The admin builds its lists and forms from this, so adding a field here is
// all that is needed for it to appear in the editor.
//
// Field types: text, textarea, date, number, bool, select, email, image
// Any field whose name ends in _de gets a matching _en required alongside it,
// which is how the "no single language string" rule is enforced at entry.
window.SMZ_SCHEMA = {

  news: {
    label: 'News',
    icon: '📰',
    order: 'published_on.desc',
    title: function (r) { return r.title_de; },
    meta: function (r) { return r.published_on; },
    hint: 'Erscheint auf der Startseite. Der neueste Eintrag wird gross dargestellt.',
    fields: [
      { name: 'published_on', label: 'Datum', type: 'date', required: true, default: today },
      { name: 'title_de', label: 'Titel (DE)', type: 'text', required: true },
      { name: 'title_en', label: 'Title (EN)', type: 'text', required: true },
      { name: 'body_de', label: 'Text (DE)', type: 'textarea', required: true },
      { name: 'body_en', label: 'Text (EN)', type: 'textarea', required: true },
      { name: 'link', label: 'Link', type: 'text', placeholder: '#/teams', hint: 'Optional. Eine Route der Website, z.B. #/jugend' },
      { name: 'featured', label: 'Grosse Karte', type: 'bool' },
      { name: 'published', label: 'Veröffentlicht', type: 'bool', default: true }
    ]
  },

  events: {
    label: 'Kalender',
    icon: '📅',
    order: 'starts_on.asc',
    title: function (r) { return r.title_de; },
    meta: function (r) { return r.starts_on + (r.location ? ' · ' + r.location : ''); },
    hint: 'Nur Termine ab heute erscheinen auf der Kalenderseite.',
    fields: [
      { name: 'starts_on', label: 'Datum', type: 'date', required: true, default: today },
      { name: 'ends_on', label: 'Enddatum', type: 'date', hint: 'Optional, für mehrtägige Anlässe' },
      { name: 'all_month', label: 'Nur Monat zeigen', type: 'bool', hint: 'Zeigt "NOV 2026" statt eines Tages' },
      { name: 'title_de', label: 'Titel (DE)', type: 'text', required: true },
      { name: 'title_en', label: 'Title (EN)', type: 'text', required: true },
      { name: 'location', label: 'Ort', type: 'text', placeholder: 'Hallenbad Oerlikon' },
      { name: 'detail_de', label: 'Detail (DE)', type: 'textarea' },
      { name: 'detail_en', label: 'Detail (EN)', type: 'textarea' },
      { name: 'published', label: 'Veröffentlicht', type: 'bool', default: true }
    ]
  },

  photos: {
    label: 'Fotos',
    icon: '🖼️',
    order: 'sort.asc',
    title: function (r) { return r.caption_de || r.alt || 'Foto'; },
    meta: function (r) { return r.in_marquee ? 'Bilderband' : 'nicht im Bilderband'; },
    thumb: 'image_path',
    hint: 'Bilder werden beim Hochladen automatisch auf 1200px verkleinert.',
    fields: [
      { name: 'image_path', label: 'Bild', type: 'image', required: true },
      { name: 'alt', label: 'Bildbeschreibung', type: 'text', required: true, hint: 'Für Screenreader und wenn das Bild nicht lädt' },
      { name: 'caption_de', label: 'Bildlegende (DE)', type: 'text', required: true },
      { name: 'caption_en', label: 'Caption (EN)', type: 'text', required: true },
      { name: 'in_marquee', label: 'Im Bilderband zeigen', type: 'bool', default: true },
      { name: 'sort', label: 'Reihenfolge', type: 'number', default: 100 },
      { name: 'published', label: 'Veröffentlicht', type: 'bool', default: true }
    ]
  },

  people: {
    label: 'Vorstand & Trainer',
    icon: '👥',
    order: 'sort.asc',
    title: function (r) { return r.name; },
    meta: function (r) { return (r.kind === 'board' ? 'Vorstand' : 'Trainer:in') + ' · ' + (r.role_de || ''); },
    hint: 'Erscheint auf der Vereinsseite, Vorstand und Trainer:innen getrennt.',
    fields: [
      { name: 'kind', label: 'Rolle', type: 'select', required: true, options: [['board', 'Vorstand'], ['coach', 'Trainer:in']] },
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'initials', label: 'Kürzel', type: 'text', hint: 'Im blauen Kreis, z.B. HW oder U10. Leer lassen für die Initialen des Namens.' },
      { name: 'role_de', label: 'Funktion (DE)', type: 'text', required: true },
      { name: 'role_en', label: 'Role (EN)', type: 'text', required: true },
      { name: 'email', label: 'E-Mail', type: 'email' },
      { name: 'sort', label: 'Reihenfolge', type: 'number', default: 100 },
      { name: 'published', label: 'Veröffentlicht', type: 'bool', default: true }
    ]
  },

  sponsors: {
    label: 'Sponsoren',
    icon: '🤝',
    order: 'sort.asc',
    title: function (r) { return r.name; },
    meta: function (r) { return r.tier === 'gold' ? 'Goldsponsor' : 'Partner'; },
    thumb: 'logo_path',
    hint: 'Logos als PNG mit transparentem Hintergrund wirken am besten.',
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'tier', label: 'Stufe', type: 'select', required: true, options: [['partner', 'Partner'], ['gold', 'Goldsponsor']], default: 'partner' },
      { name: 'logo_path', label: 'Logo', type: 'image' },
      { name: 'url', label: 'Website', type: 'text', placeholder: 'https://…' },
      { name: 'label_de', label: 'Bildlegende (DE)', type: 'text', hint: 'Leer lassen, dann wird der Name gezeigt' },
      { name: 'label_en', label: 'Caption (EN)', type: 'text' },
      { name: 'dark_tile', label: 'Dunkle Kachel', type: 'bool', hint: 'Für Logos mit weisser Schrift, die auf Weiss unsichtbar wären' },
      { name: 'sort', label: 'Reihenfolge', type: 'number', default: 100 },
      { name: 'published', label: 'Veröffentlicht', type: 'bool', default: true }
    ]
  }
};

function today() { return new Date().toISOString().slice(0, 10); }
