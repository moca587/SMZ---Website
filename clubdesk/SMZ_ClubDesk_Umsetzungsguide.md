# SMZ Zürich Website Redesign: Umsetzung in ClubDesk

Ziel: Die neue Seite (siehe Prototyp) innerhalb von ClubDesk umsetzen, damit Mitglieder, Kalender, Formulare und Helferportal weiterhin automatisch synchron bleiben.

Referenz-Look: foothillclubwaterpolo.org, übersetzt auf SMZ Blau (#0071B8) mit Weiss als Aktionsfarbe (Klubfarben Blau und Weiss).

## 1. Was ClubDesk kann und was nicht

Kann: Vorlagen, eigene Farben und Schriften, eigenes CSS (Design > Erweitert), HTML-Blöcke in Seiten, News-, Kalender-, Team-, Sponsoren- und Formular-Module, mehrere Websites (2 bis 5 je nach Plan), eigene Domain ab Plan M.

Kann nicht: Echte Mehrsprachigkeit pro Seite. Lösung für DE/EN siehe Abschnitt 6.

Version auf smzuerich.com: ClubDesk 5.0.15. Die CSS-Datei ist auf dessen DOM-Klassen geschrieben (.cd-navigation-bar, .cd-section, .cd-light, .cd-dark, .cd-footer).

## 2. Vorbereitung (30 Minuten)

1. Im ClubDesk Admin: Webseite > Design. Aktuelle Vorlage notieren (Screenshot).
2. Vorlage wählen mit fixiertem Menü oben und breitem Header (in ClubDesk "Fixed top navigation" oder ähnlich). Kein Seitenmenü.
3. Farben setzen:
   Primär #0071B8, Sekundär #062A4D, Akzent/Buttons #FFFFFF (Weiss auf Blau), Hintergrund #F3F8FC, Text #0B1F33.
4. Schriften: Überschriften "Anton", Fliesstext "Outfit". Falls ClubDesk die Schriften nicht in der Liste hat, werden sie über die CSS-Datei per @import geladen.
5. Datei smz-clubdesk.css öffnen, kompletten Inhalt in das Feld "Eigenes CSS" einfügen. Speichern, Vorschau prüfen.
6. Logo: Bestehendes Logo (512x512) behalten. Es wird rund mit weissem Hintergrund dargestellt.

## 3. Seitenstruktur (neu)

Alte Struktur hatte 12 Hauptpunkte. Neu sind es 6 plus ein Button:

    Jugend  |  Teams  |  Trainings  |  Kalender  |  Verein  |  Kontakt  |  [Mitglied werden]

Zuordnung der alten Seiten:

| Alt | Neu |
|---|---|
| Willkommen | Startseite (neu aufgebaut) |
| News | Startseite (Block) + Verein > News |
| Verein > Media, Geschichte | Verein |
| Teams > Herren 1, 2, 3, Damen | Teams (eine Seite mit Karten) |
| Jugend > Schnuppern, Piranha, U10 bis U18, Nachwuchsförderung | Jugend (eine Seite mit Karten) |
| Wasserball Schüeli | Jugend (Block) |
| Helfereinsatz | Verein (Block, Link zu helfereinsatz.ch) |
| Kontakt, Matchbericht, Vorstand | Kontakt bzw. Verein > Vorstand |
| Shop | Verein (Block) + Footer |
| Kalender | Kalender |
| Ethik und Doping | Verein (Block) |
| Offene Stellen | Verein (Block) |
| Mitglied werden | Eigene Seite, als weisser Button im Menü |

Die alten URLs (z.B. /jugend/schnuppern) in ClubDesk als Weiterleitungen auf die neuen Seiten setzen, damit Links in Flyern und bei Google weiter funktionieren.

## 4. Startseite, Block für Block

Jeder Block ist ein ClubDesk "Abschnitt" (cd-section). Dunkel = Abschnitt auf "Dunkel" stellen, das CSS macht daraus den blauen Verlauf.

1. Ankündigungsleiste (HTML-Block ganz oben im Header)
   `<div class="announce">Saison 2026/27 läuft. Gratis Schnuppertraining für Kinder ab 6 Jahren, jede Woche. <a href="/jugend">Zum Schnuppern</a></div>`

2. Hero (Header-Abschnitt, dunkel). Zwei Spalten.
   Links: Text-Block mit `<p class="eyebrow">Wasserballklub Stadtmannschaft Zürich</p>`, dann H1 `Tauch ein.<span class="tag">#SMZfamilie</span>`, ein Absatz Lead-Text, zwei Buttons (weiss "Gratis Schnuppern", ghost "Unsere Teams").
   Rechts: Bild-Block, Teamfoto SMZ 1.
   Am Ende des Abschnitts ein HTML-Block mit der Welle:
   `<svg class="waves" viewBox="0 0 1440 60" preserveAspectRatio="none"><path d="M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30 L1440,60 L0,60 Z" fill="#F3F8FC"/></svg>`

3. SMZ in Zahlen (dunkel). HTML-Block mit vier Kacheln:
   `<div class="grid-4"><div class="stat"><div class="n">1972</div><div class="l">gegründet im Restaurant Du Pont</div></div> ... </div>`
   Zahlen: 1972, 10 Teams, 6+ Bäder, NLB.

4. Drei Wege ins Wasser (hell). Drei Spalten mit Bild, H3, Meta-Zeile, Text, Link.
   Piranha Schwimmschule (Bild: Piranha-Maskottchen), Wasserballschule und Jugend (Actionfoto), Herren und Damen (Teamfoto oder Actionfoto Herren 1).

5. In drei Schritten ins Team (hell). Drei Spalten, nummeriert 1 2 3.

6. Schnuppern ist gratis (dunkel). Zwei Spalten: links Text und Buttons, rechts eine Tabelle mit den U14 Schnupperzeiten.

7. Das ist der Piranha (dunkel, navy). Bild links, Text rechts. Analog zu "Meet the Surf Squatch" auf der Referenzseite.

8. News (hell). ClubDesk News-Modul, 5 Einträge, erster Eintrag gross. Das CSS stylt die Einträge als Karten.

9. Sponsoren (hell, getönt). ClubDesk Sponsoren-Modul. Häusermann als Goldsponsor mit Klasse `logo-tile gold`.

10. Werde Teil der SMZ Familie (Blau-Verlauf). Zentrierter Text, zwei Buttons: "Mitglied werden" und "Offene Stellen".

11. Footer (dunkel). Vier Spalten: Verein + Adresse, Spielen, Verein, Mehr. Darunter Impressum, Datenschutz.

## 5. Unterseiten

Jede Unterseite beginnt mit einem dunklen Kopf-Abschnitt: Eyebrow, H1, Lead. Danach helle Abschnitte mit Karten (`<div class="grid-3">` oder `grid-2`, darin `<div class="card">`).

Jugend: 6 Karten (Piranha, U10, Fortgeschrittene/U12, U14, U16, U18/U18 Damen) mit Zeiten als Tabelle. Darunter Schüeli (dunkle Karte) und Nachwuchsförderung/FTEM.

Teams: Grosse Karte SMZ 1 mit Foto und Head Coach, Karten Herren 2/U18 und Herren 3, dunkle Karte Damen-Projekt mit Button.

Trainings: Eine Karte pro Bad (Oerlikon, Leimbach, Riedtli, Vogtsrain, Grünau, Aubrücke) mit Adresse und Tabelle. Das ist die Seite, die Eltern am häufigsten öffnen. Sie sollte bei jeder Änderung der Hallenbadzeiten zuerst aktualisiert werden.

Kalender: ClubDesk Kalender-Modul. Das CSS stellt Termine als Zeilen mit grossem Datum dar.

Verein: Meilensteine-Tabelle, Offene Stellen (ClubDesk Stellen- oder News-Modul), Vorstand (Personen-Modul oder HTML-Karten), Helfereinsatz, Shop, Ethik.

Kontakt: ClubDesk Formular links (Vorname, Nachname, E-Mail, Auswahl "Ich möchte", Nachricht), rechts Sekretariat, Social, Sponsor werden.

Mitglied werden: Bestehendes ClubDesk Aufnahme-Formular behalten (inkl. AHV-Nummer und Lizenz-Felder), nur in das neue Layout setzen. Rechts drei Karten: Was du bekommst, Ausrüstung, Fragen.

## 6. Deutsch und Englisch

ClubDesk hat keine Sprachumschaltung pro Seite. Zwei praktikable Wege:

Option A, empfohlen: Zweite ClubDesk-Website "en" anlegen (im Plan enthalten), gleiche Vorlage, gleiches CSS, englische Texte. Domain en.smzuerich.com oder smzuerich.com/en. Im Menü ein HTML-Block:
`<span class="lang"><a class="on" href="https://smzuerich.com">DE</a><a href="https://en.smzuerich.com">EN</a></span>`
Kalender, News und Formulare werden auf der englischen Seite aus denselben ClubDesk-Daten gezogen, nur die statischen Texte werden übersetzt. Die englischen Texte stehen fertig im Prototyp (EN-Schalter).

Option B, schnell: Nur die Seiten Jugend, Trainings und Mitglied werden zweisprachig führen, englischer Text jeweils unter dem deutschen in einem kleineren Absatz. Das entspricht dem, was das aktuelle Formular "Mitglied werden / Become a member" schon macht.

## 7. Bilder, die noch fehlen

Der Prototyp nutzt die drei brauchbaren Fotos der aktuellen Seite (Teamfoto Herren 1, Actionfoto Jugend, Piranha). Für den Foothill-Look braucht es mehr echtes Bildmaterial:

1. Hero: Ein Querformat-Actionfoto aus dem Freibad Letzigraben (Sommer, Himmel, Tribüne). Ersetzt langfristig das Teamfoto.
2. Jugend: Zwei bis drei Fotos aus der Wasserballschule (stehtiefes Wasser, Kinder mit Ball).
3. Damen: Ein Trainingsfoto aus Oerlikon für die Damen-Karte.
4. Vorstand und Trainer: Portraits, quadratisch, gleicher Hintergrund.
5. Sponsoren: Logos als PNG mit transparentem Hintergrund, mindestens 400 px breit.
6. Piranha: Das Maskottchen freigestellt (ohne schwarzen Hintergrund) als PNG.

Tipp: Am Letzitag 2027 einen Fotografen für zwei Stunden buchen. Ein Tag liefert alle Bilder für die ganze Seite.

## 8. Texte, die der Vorstand bestätigen sollte

1. Zahl der Teams und Bäder in "SMZ in Zahlen".
2. Saisonziel NLA für SMZ 1 auf der Teams-Seite.
3. Head Coach Namen auf der Teams-Seite.
4. Aussagen zu Sponsoring-Paketen (Bande, Trikot, Camp). Falls es noch keine Pakete gibt, den Satz auf "Wir stellen gerne ein Paket zusammen" kürzen.
5. Beispieltermine im Kalender des Prototyps sind Platzhalter, im Live-Betrieb kommen sie aus ClubDesk.

## 9. Reihenfolge der Umsetzung

Woche 1: CSS einspielen, Vorlage und Farben setzen, Startseite bauen. Alte Seiten bleiben online.
Woche 2: Jugend, Trainings, Teams. Weiterleitungen setzen.
Woche 3: Verein, Kontakt, Mitglied werden, Kalender. Fotos nachliefern.
Woche 4: Englische Website anlegen (Option A), Texte aus dem Prototyp übernehmen. Live schalten, Vorstand und Trainer informieren.

Danach: Startseite alle 4 bis 6 Wochen prüfen (Ankündigungsleiste, Termine, News). Trainingsseite bei jedem Hallenbadwechsel.
