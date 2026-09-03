# Backend einrichten

Die Website läuft ohne Backend weiter. Erst wenn die zwei Werte in
`js/config.js` gesetzt sind, holt sie News, Termine, Fotos, Personen und
Sponsoren aus der Datenbank. Vorher zeigt sie die fest eingebauten Inhalte.

Aufwand: etwa 15 Minuten, einmalig.

## 1. Supabase Projekt anlegen

1. Auf [supabase.com](https://supabase.com) mit einer Vereins-E-Mail registrieren.
2. **New project**. Name `smz-website`, Region **Frankfurt (eu-central-1)**,
   weil die Daten damit in der EU bleiben.
3. Ein Datenbank-Passwort setzen und im Passwort-Manager des Vereins ablegen.
   Es wird für den Alltag nicht gebraucht, nur für direkten Datenbankzugriff.

## 2. Tabellen anlegen

1. Im Dashboard links **SQL Editor**, dann **New query**.
2. Den ganzen Inhalt von `supabase/schema.sql` einfügen und **Run** drücken.
3. Es sollte `Success. No rows returned` erscheinen.

Das Skript legt die fünf Tabellen an, schaltet Row Level Security ein und
erstellt den Bilder-Bucket `media`. Es kann gefahrlos mehrfach ausgeführt
werden.

## 3. Website verbinden

1. Dashboard, **Project Settings > API**.
2. **Project URL** und **anon public** Key kopieren.
3. In `js/config.js` eintragen:

```js
window.SMZ_CONFIG = {
  SUPABASE_URL: "https://xxxxxxxx.supabase.co",
  SUPABASE_ANON_KEY: "eyJhbGci…"
};
```

4. Committen und pushen. GitHub Pages baut automatisch neu.

Beide Werte dürfen öffentlich im Repository stehen. Der anon key ist dafür
gemacht, im Browser zu liegen. Geschützt wird die Datenbank durch die Row
Level Security aus Schritt 2: **lesen darf jeder, schreiben nur, wer
angemeldet ist.** Der `service_role` Key aus demselben Bildschirm darf
dagegen **niemals** ins Repository, er umgeht alle Regeln.

## 4. Redaktoren anlegen

Es gibt bewusst keine Selbstregistrierung, sonst könnte sich jeder ein
Konto anlegen und publizieren.

1. Dashboard, **Authentication > Providers > Email**: **Confirm email**
   ausschalten, damit angelegte Konten sofort funktionieren.
2. **Authentication > Users > Add user > Create new user**.
3. E-Mail und ein Startpasswort eingeben, **Auto Confirm User** ankreuzen.
4. Das Passwort der Person persönlich mitteilen, nicht per Mail im Klartext.

Für jedes Vorstandsmitglied, das publizieren soll, einmal wiederholen.

## 5. Redaktion öffnen

`https://moca587.github.io/SMZ---Website/admin/` (oder `/admin/` auf der
eigenen Domain). Anmelden mit E-Mail und Passwort.

Links die fünf Bereiche, rechts die Liste. **+ Neu** legt einen Eintrag an,
**Bearbeiten** ändert einen bestehenden. Nicht veröffentlichte Einträge sind
mit **Entwurf** markiert und erscheinen nicht auf der Website.

Bilder werden beim Hochladen im Browser auf 1200 px verkleinert und als JPEG
mit Qualität 62 gespeichert, PNG-Logos behalten ihre Transparenz. Ein Foto
direkt vom Handy ist damit statt 6 MB noch etwa 150 KB gross.

## Was noch beim Verein bleibt

ClubDesk bleibt für Mitglieder, Beiträge, Formulare und den internen
Bereich zuständig. Dieses Backend betrifft nur die öffentlichen Inhalte der
Website. Siehe die Analyse im Chatverlauf: ClubDesk hat keine API, deshalb
lassen sich die beiden nicht automatisch synchronisieren.

## Kosten und Grenzen

Der Gratis-Plan von Supabase reicht für einen Verein dieser Grösse deutlich:
500 MB Datenbank, 1 GB Bilder, 5 GB Traffic pro Monat.

Ein Punkt zum Vormerken: Gratis-Projekte werden pausiert, wenn eine Woche
lang **überhaupt keine** Anfrage kommt. Eine öffentliche Website, die
täglich besucht wird, hält das Projekt von selbst wach. Wenn die Seite
einmal längere Zeit offline ist, im Dashboard einmal **Restore** drücken.

## Wenn etwas nicht geht

- **Redaktion zeigt "Noch nicht verbunden"**: `js/config.js` ist leer oder
  wurde nicht gepusht.
- **Anmelden schlägt fehl**: Benutzer in Supabase nicht bestätigt, siehe
  Schritt 4.2.
- **Website zeigt weiter die alten Inhalte**: normal, solange eine Tabelle
  leer ist. Jede Tabelle ersetzt ihren Bereich erst, wenn sie Zeilen hat.
  Die Browser-Konsole zeigt Meldungen mit dem Präfix `[smz]`.
- **Bild lädt nicht**: der Bucket `media` muss öffentlich sein. Schritt 2
  setzt das, prüfen unter **Storage > media > Configuration**.
