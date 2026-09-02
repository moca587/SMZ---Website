# SMZ Zürich Website

Redesign of the Wasserballklub Stadtmannschaft Zürich website (smzuerich.com), styled after foothillclubwaterpolo.org on SMZ's own blue.

Live preview: https://moca587.github.io/smz-website/

## Structure

    index.html          all pages (home + subpages as sections, shown by hash router)
    css/style.css       design tokens, layout, components, light + dark theme
    js/app.js           hash router (#/jugend, #/teams, ...) and DE/EN toggle
    assets/img/         photos and logo
    clubdesk/           custom CSS + guide for applying the design inside ClubDesk

No build step. Open index.html in a browser or push to main to deploy on GitHub Pages.

## Pages

- `#/` Home: hero, numbers, three ways in, 3 steps, free trial, Piranha mascot, news, sponsors, join
- `#/jugend` Youth: Piranha swim school, U10 to U18, Schüeli, FTEM
- `#/teams` Herren 1, 2, 3 and Damen project
- `#/trainings` Practice times per pool
- `#/kalender` Upcoming events (placeholder data until ClubDesk feed)
- `#/verein` History, open positions, board, volunteering, shop, ethics
- `#/kontakt` Contact form and sponsoring
- `#/mitglied` Membership application

## Language

Every visible text sits in a pair: `<span lang="de">...</span><span lang="en">...</span>`. The `data-lang` attribute on `<body>` picks which one shows. The choice is remembered in localStorage.

## Design tokens

Logo blue `#0071B8`, navy `#062A4D`, sun yellow `#F5C400` (CTA), aqua `#2FD3C6`, ground `#F3F8FC`. Headlines Anton, body Outfit (Google Fonts).

## Content to confirm

- Calendar entries are examples
- Forms show a thank-you message only; wire them to ClubDesk forms or a form service
- Sponsor tiles are text until logos are added to assets/img/sponsors/
