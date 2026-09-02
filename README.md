# SMZ Zürich Website

Redesign of the Wasserballklub Stadtmannschaft Zürich website (smzuerich.com), styled after foothillclubwaterpolo.org on SMZ's own blue.

Live preview: https://moca587.github.io/SMZ---Website/

## Structure

    index.html          all pages (home + subpages as sections, shown by hash router)
    css/style.css       design tokens, layout, components, light + dark theme
    js/app.js           hash router (#/jugend, #/teams, ...) and DE/EN toggle
    assets/img/         photos and logo
    assets/img/sponsors/  sponsor and partner logos
    clubdesk/           custom CSS + guide for applying the design inside ClubDesk

No build step. Open index.html in a browser or push to main to deploy on GitHub Pages.

## Pages

- `#/` Home: hero, numbers, three ways in, 3 steps, free trial, Piranha mascot, news, sponsors, faces marquee, join
- `#/jugend` Youth: Piranha swim school, U10 to U18, Schüeli, FTEM
- `#/teams` Herren 1, 2, 3 and Damen project
- `#/wasserball` Teams sub-page: age groups with practice times, age group finder, athlete pathway, licence, costs, FAQ
- `#/trainings` Practice times per pool
- `#/kalender` Upcoming events (placeholder data until ClubDesk feed)
- `#/verein` History, open positions, board, coaches, volunteering, shop, ethics
- `#/kontakt` Contact form and sponsoring
- `#/mitglied` Membership application

## Language

Every visible text sits in a pair: `<span lang="de">...</span><span lang="en">...</span>`. The `data-lang` attribute on `<body>` picks which one shows. The choice is remembered in localStorage.

## Design tokens

Club colours only, blue and white: logo blue `#0071B8`, navy `#062A4D`, light blue `#A6D8F7` (accents on dark backgrounds), white (CTA buttons on blue), ground `#F3F8FC`. No yellow, no aqua. Headlines Anton, body Outfit (Google Fonts).

## Content to confirm

- Calendar entries are examples
- Forms show a thank-you message only; wire them to ClubDesk forms or a form service
- Sponsor and partner logos live in `assets/img/sponsors/`, taken from smzuerich.com
- Coach cards on `#/verein` still show "Name folgt" for U14, U16 and the women's team
- Photos come from smzuerich.com. Most are that site's own full-resolution files; `u10-medals` was cropped out of a results graphic and `action-ball` out of the Fruehlingscamp poster, which has no standalone original
- `#/wasserball`: U16 and U18 practice times are missing on the source pages ("Trainingszeiten folgen"); club fee amounts are not on the site; the U10 Friday session ends 18:15 on the Jugend page but 18:30 on the Trainings page (Jugend value used)
