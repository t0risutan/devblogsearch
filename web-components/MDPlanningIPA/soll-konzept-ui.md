# Soll-Konzept — Benutzeroberfläche Facettenfilter

## Seitenaufbau Suchergebnis-Seite

| Bereich | Beschreibung |
|---------|-------------|
| Suchleiste | Bestehende Search-Bar oben auf der Seite, unverändert |
| Aktive Filter (Chips) | Horizontale Leiste unterhalb der Suchleiste — zeigt gewählte Filter als Chips mit X-Button; «Clear All» Button rechts |
| Hauptbereich | Zweispaltiges Layout: links Sidebar, rechts Suchergebnisse |
| Sidebar | Filtergruppen vertikal untereinander; auf Mobile ausgeblendet |
| Suchergebnisse | Bestehende Ergebnisliste, unverändert |

---

## Filtergruppen (Sidebar)

| Filtergruppe | UI-Element | Verhalten |
|---|---|---|
| Kategorie | Checkboxen | Mehrfachauswahl möglich; ODER-Verknüpfung |
| Produkt | Checkboxen | Mehrfachauswahl möglich; ODER-Verknüpfung |
| Autor | Checkboxen | Mehrfachauswahl möglich; ODER-Verknüpfung |
| Artikel-Typ | Tag-Liste (klickbare Tags) | Mehrfachauswahl möglich; ODER-Verknüpfung |
| Publikationsdatum | Slider oder Vorauswahl (z.B. «Letzte Woche», «Letztes Jahr») | Zeitfenster einschränken |

Jede Filteroption zeigt die Anzahl zugehöriger Artikel in Klammern an (z.B. «Photoshop (12)»). Bei mehr als 10 Optionen erscheint ein «Show more» Button.

---

## Aktive Filter — Chips

| Element | Verhalten |
|---------|-----------|
| Filter-Chip | Zeigt gewählten Filterwert mit X-Button an |
| X-Button | Entfernt diesen einzelnen Filter |
| «Clear All» Button | Entfernt alle aktiven Filter auf einmal |
| Kein aktiver Filter | Chip-Leiste wird nicht angezeigt |

---

## Zustände der Benutzeroberfläche

| Zustand | Darstellung |
|---------|-------------|
| Keine Filter aktiv | Alle Suchergebnisse sichtbar, Sidebar zeigt alle Optionen |
| Filter aktiv | Nur passende Artikel angezeigt, Filteranzahl dynamisch aktualisiert |
| 0 Resultate | Meldung: «No results match your filters. Try removing some filters.» |
| Keine Filteroptionen vorhanden | Sidebar wird komplett ausgeblendet |
| Mobile | Sidebar ausgeblendet, Suche funktioniert weiterhin normal |
| Netzwerkfehler | Fehlermeldung für den Nutzer sichtbar |
