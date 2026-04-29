# Soll-Konzept — Facettenfilter-Erweiterung blog-search

## Funktionale Anforderungen

| ID | Anforderung | Akzeptanzkriterium | Quelle |
|----|-------------|-------------------|--------|
| F01 | Die Suchergebnis-Seite zeigt eine Sidebar mit Filtergruppen an | Sidebar ist nach einer Suchanfrage sichtbar und enthält mindestens eine Filtergruppe | Detail-Spec |
| F02 | Filtergruppen werden dynamisch aus den Metadaten des `query-index.json` generiert | Filteroptionen entsprechen den tatsächlichen Werten im query-index; neue Werte erscheinen automatisch | Detail-Spec |
| F03 | Folgende Filtergruppen sind implementiert: Kategorie (Checkbox), Produkt (Checkbox), Autor (Checkbox), Publikationsdatum (Slider/Vorauswahl), Artikel-Typ (Tag-Liste) | Alle 5 Filtergruppen sind sichtbar und interaktiv | Detail-Spec |
| F04 | Jede Filteroption zeigt die Anzahl zugehöriger Artikel an | Neben jeder Filteroption steht die korrekte Artikelanzahl in Klammern; Zahl aktualisiert sich bei Filteränderung | Detail-Spec |
| F05 | Mehrere Filter innerhalb einer Gruppe werden mit ODER verknüpft | Auswahl von «Photoshop» und «AEM» zeigt Artikel die mindestens eines der beiden enthalten | Detail-Spec |
| F06 | Filter aus verschiedenen Gruppen werden mit UND verknüpft | Auswahl von «Photoshop» (Produkt) und «Tutorial» (Artikel-Typ) zeigt nur Artikel die beide Kriterien erfüllen | Detail-Spec |
| F07 | Aktive Filter werden oberhalb der Sidebar als Chips mit X-Button dargestellt | Jeder aktive Filter erscheint als Chip; Klick auf X entfernt diesen Filter | Detail-Spec |
| F08 | Ein «Clear All» Button entfernt alle aktiven Filter gleichzeitig | Nach Klick auf «Clear All» sind alle Filter deaktiviert und alle Suchergebnisse sichtbar | Detail-Spec |
| F09 | Suchergebnisse aktualisieren sich direkt ohne «Apply»-Button | Resultate ändern sich unmittelbar bei jeder Filterauswahl ohne zusätzliche Nutzerinteraktion | Detail-Spec |
| F10 | Aktive Filter werden als URL-Parameter gespeichert und sind teilbar | URL enthält aktive Filter als Parameter; Seite neu geladen mit gleicher URL zeigt dieselben Filter | Detail-Spec |
| F11 | Filter-Änderungen werden nicht in die Browser-History eingetragen | Browser-Zurück-Button navigiert zur vorherigen Seite, nicht zum vorherigen Filterzustand | Detail-Spec |
| F12 | Bei mehr als 10 Filteroptionen erscheint ein «Show more» Button | Maximal 10 Optionen sichtbar; «Show more» zeigt alle restlichen Optionen | Detail-Spec |
| F13 | Wenn keine Filteroptionen verfügbar sind, wird die Sidebar nicht angezeigt | Bei leeren Filterdaten ist die Sidebar nicht im DOM sichtbar | Detail-Spec |
| F14 | Wenn Filter zu 0 Resultaten führen, wird eine entsprechende Meldung angezeigt | Meldung «No results match your filters. Try removing some filters.» erscheint bei 0 Treffern | Detail-Spec |
| F15 | Artikel ohne einen bestimmten Metadaten-Wert werden beim Filtern korrekt ignoriert | Artikel ohne Artikel-Typ Feld werden beim Filtern nach Artikel-Typ nicht angezeigt | Detail-Spec |
| F16 | Eine neue Filtergruppe kann durch Ergänzung eines Eintrags in einem Array/Objekt hinzugefügt werden (Modularität) | Neue Facette erscheint in der Sidebar nach Ergänzung des Konfigurationsobjekts ohne weitere Code-Änderungen | Detail-Spec |

---

## Nicht-Funktionale Anforderungen

| ID | Anforderung | Akzeptanzkriterium | Quelle |
|----|-------------|-------------------|--------|
| NF01 | Kompatibilität mit Chrome, Safari und Edge | Alle Filterfunktionen funktionieren fehlerfrei in den aktuellen Versionen von Chrome, Safari und Edge | Detail-Spec |
| NF02 | Sidebar wird auf Mobile nicht angezeigt; bestehende Suche bleibt funktional | Auf Viewport <600px ist die Sidebar nicht sichtbar; Sucheingabe und Resultate funktionieren weiterhin | Detail-Spec |
| NF03 | ARIA-Labels für alle Checkboxen und Filter-Chips | Jede Checkbox und jeder Chip besitzt ein beschreibendes `aria-label`; Screen Reader liest aktive Filter vor | Detail-Spec |
| NF04 | Keyboard-Navigation für alle Filter-Elemente | Alle Filter sind per Tab erreichbar und per Enter/Space aktivierbar; keine Maus erforderlich | Detail-Spec |
| NF05 | Fehlerhafte URL-Parameter werden ignoriert, die Applikation bleibt funktional | Ungültige Filter-Werte in der URL führen zu keinem Fehler; gültige Parameter werden weiterhin korrekt geladen | Detail-Spec |
| NF06 | Bei fehlgeschlagenem Network-Request wird dem Nutzer eine Fehlermeldung angezeigt | Bei simuliertem Netzwerkfehler erscheint eine sichtbare Fehlermeldung; die Seite stürzt nicht ab | Detail-Spec |
| NF07 | Styling konsistent mit bestehendem Developer Blog Design | Sidebar verwendet ausschliesslich CSS-Variablen aus `blog-search.css`; kein Bruch mit dem bestehenden Design sichtbar | Detail-Spec |
| NF08 | Keine externen Runtime-Dependencies | `package.json` enthält keine neuen production dependencies nach Abschluss der Implementierung | Code-Guidelines |
| NF09 | URL-Parameter sind gegen XSS-Angriffe gesichert | Eingeschleuster JavaScript-Code in URL-Parametern wird nicht ausgeführt; `textContent` statt `innerHTML` verwendet | Detail-Spec |
| NF10 | Code erfüllt ESLint (airbnb-base) und Stylelint Standards | `npm run lint` läuft ohne Fehler durch | Code-Guidelines |

---

## Out of Scope

| Thema | Begründung |
|-------|------------|
| Änderungen an der Query-Index Generation | Metadaten existieren bereits |
| Mobile Design der Sidebar | Explizit ausgeschlossen in Detail-Spec |
| Backend / Infrastruktur Änderungen | Kein Zugriff / nicht Teil der IPA |
