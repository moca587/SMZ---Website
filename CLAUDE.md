# CLAUDE.md

Static website for Wasserballklub Stadtmannschaft Zürich (SMZ). No build step, no framework.

Content (news, calendar, photos, people, sponsors) comes from Supabase at runtime.
The admin lives in `admin/`. Still no build step: supabase-js is loaded from a CDN.

## Rules

- Keep it a single `index.html` with sections per page and the hash router in `js/app.js`. Add a new page by adding `<div class="page" id="page-NAME">` and NAME to the `routes` array.
- Every visible string must exist in both languages: `<span lang="de">..</span><span lang="en">..</span>`. Never leave an English-only or German-only string.
- Never use em dashes or en dashes in copy. Use commas, periods or "bis" / "to".
- Colors and fonts come from the tokens at the top of `css/style.css`. Do not introduce new hex values in components.
- The palette is blue and white only (club colours). No yellow, no aqua, no other accent hue. Primary CTA is white on blue, secondary is blue on white. Use `--blue-text` for blue text on surfaces (it lightens in dark mode) and `--blue` for backgrounds.
- Both themes must stay readable: tokens are redefined under `prefers-color-scheme: dark` and `[data-theme="dark"]`.
- Images go in `assets/img/`, resized to max 1200px wide, JPEG quality ~60.
- Keep facts (training times, prices, board members) in sync with `clubdesk/SMZ_ClubDesk_Umsetzungsguide.md` and the live site smzuerich.com.

## Backend

- `js/data.js` replaces built in content with rows from Supabase. It is progressive
  enhancement: if `js/config.js` is empty, a fetch fails, or a table is empty, the
  markup in `index.html` stays. Never make a section depend on the data arriving.
- Rendered strings must go through the `t(de, en)` helper so both language spans
  exist, and through `esc()` so editor input cannot inject markup.
- Add a field: put it in `supabase/schema.sql` and `admin/schema.js`. The admin
  builds its forms from that file, so nothing else needs touching.
- The admin UI is German only. The bilingual rule is about the public site; the
  editors are the Zürich committee.
- `js/config.js` holds the project URL and anon key. Both are safe to commit. The
  `service_role` key never is.

## Test

Open `index.html` locally (`python3 -m http.server`), check `#/` and every route in DE and EN at 1280px and 390px width.

## Deploy

Push to `main`. GitHub Pages serves the root.
