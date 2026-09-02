# CLAUDE.md

Static website for Wasserballklub Stadtmannschaft Zürich (SMZ). No build step, no framework.

## Rules

- Keep it a single `index.html` with sections per page and the hash router in `js/app.js`. Add a new page by adding `<div class="page" id="page-NAME">` and NAME to the `routes` array.
- Every visible string must exist in both languages: `<span lang="de">..</span><span lang="en">..</span>`. Never leave an English-only or German-only string.
- Never use em dashes or en dashes in copy. Use commas, periods or "bis" / "to".
- Colors and fonts come from the tokens at the top of `css/style.css`. Do not introduce new hex values in components.
- Both themes must stay readable: tokens are redefined under `prefers-color-scheme: dark` and `[data-theme="dark"]`.
- Images go in `assets/img/`, resized to max 1200px wide, JPEG quality ~60.
- Keep facts (training times, prices, board members) in sync with `clubdesk/SMZ_ClubDesk_Umsetzungsguide.md` and the live site smzuerich.com.

## Test

Open `index.html` locally (`python3 -m http.server`), check `#/` and every route in DE and EN at 1280px and 390px width.

## Deploy

Push to `main`. GitHub Pages serves the root.
