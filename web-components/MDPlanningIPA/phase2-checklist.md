# Phase 2 Checkliste — Entwurf & Architektur
# Tag 3–4 (23.–24. April 2026)

---

## HIGH-LEVEL DESIGN

### 2.1 Systemarchitektur `A03` `A09` `G11`
- [ ] Erweiterung der bestehenden `BlogSearch` Klasse beschreiben
- [ ] Shadow DOM Struktur skizzieren (neue Elemente, wo sie hängen)
- [ ] Zusammenspiel mit bestehendem Code erklären (`filterData()`, `renderResults()`)
- [ ] Event-Flow definieren: Klick → State update → Filter → Render
- [ ] Im Bericht dokumentieren (Abschnitt 2.1)

### 2.2 Tech-Stack `A09`
- [ ] Verwendete Technologien auflisten (JS, Shadow DOM, CSS, keine neuen Dependencies — NF08)
- [ ] Tools auflisten (VSCode/Cursor, Mocha, Playwright, ESLint, Stylelint)
- [ ] Im Bericht dokumentieren (Abschnitt 2.2)

### 2.3 Schnittstellen `A09`
- [ ] `query-index.json` als Input-Schnittstelle beschreiben (Felder → Filtergruppen)
  - `tags` → Kategorie
  - `adobeApp` → Produkt
  - `author` → Autor
  - `sortDateTimestamp` → Publikationsdatum
  - `articleType` → Artikel-Typ (fehlt noch — R05, F15)
- [ ] URL-Parameter als State-Schnittstelle definieren
  - Format: `?cat=UXP&prod=AEM`
  - Mehrere Werte: `?cat=UXP,Firefly`
  - Verhalten bei ungültigen Werten: ignorieren (NF05)
- [ ] Shadow DOM interne Events beschreiben
- [ ] Im Bericht dokumentieren (Abschnitt 2.3)

---

## LOW-LEVEL DESIGN

### 2.4 Datenmodell & Filterlogik `A03` `A09`
- [ ] Datenstruktur für aktive Filter definieren
  - z.B. `Map<string, Set<string>>` oder `{ [group]: string[] }`
- [ ] Filter-Logik schriftlich festhalten
  - OR innerhalb einer Gruppe (F05)
  - AND zwischen verschiedenen Gruppen (F06)
  - Artikel ohne Feld werden ignoriert (F15)
- [ ] Counts-Berechnung definieren (F04)
  - Wann aktualisieren? (bei jedem Filter-Change)
  - Auf welcher Datenbasis? (alle Artikel oder bereits gefilterte?)
- [ ] Im Bericht dokumentieren — Tabelle oder Diagramm (Abschnitt 2.4)

### 2.5 Komponenten & Funktionen `A03` `G11`
- [ ] Funktionsliste mit Name, Parameter, Return-Wert, Zweck:
  - `generateFacets(data)`
  - `renderFilterBar(facets)`
  - `applyFilters(data, activeFilters)`
  - `updateFilterCounts(data, activeFilters)`
  - `renderChips(activeFilters)`
  - `updateURLState(filters)`
  - `loadFiltersFromURL()`
- [ ] CSS-Klassen planen (keine Konflikte mit bestehenden)
- [ ] Mobile: Filter-Leiste auf `<600px` ausblenden (NF02)
- [ ] CSS-Variablen aus `blog-search.css` (NF07)
- [ ] Im Bericht dokumentieren (Abschnitt 2.5)

### 2.6 Wireframe / UI `G05`
- [ ] Screen 7 auf Presets-only anpassen (Hannes Feedback)
- [ ] Scroll-Annotation im Overlay ergänzen (Hannes Feedback)
- [ ] Screenshots (3–4 repräsentative) in Bericht einfügen (Abschnitt 2.6)
- [ ] Figma-Link im Bericht verlinken
- [ ] Feedback von Hannes + Anpassungen dokumentieren `G05.3` `A10`

> **G05 Gütestufe 3:** Feedback muss schriftlich nachgewiesen + Anpassungen beschrieben sein.

---

## QUERSCHNITTLICHE THEMEN

### 2.7 Sicherheitskonzept `G06`
- [ ] XSS-Schutz definieren: `textContent` statt `innerHTML` (NF09)
- [ ] URL-Parameter Validierung beschreiben (NF05)
- [ ] Sicherheitsrisiken im Systemumfeld analysieren
- [ ] Massnahmen mit Hannes abstimmen (G06.4)
- [ ] Im Bericht dokumentieren (Abschnitt 2.7)

> **G06 Gütestufe 3:** Risiken identifiziert + Massnahmen spezifiziert + umgesetzt + mit Stakeholder abgestimmt.

### 2.8 Testkonzept `A12` `G13`
- [ ] Testinfrastruktur beschreiben (Mocha Unit, Playwright E2E)
- [ ] Testfälle pro Anforderung definieren (mind. 5 Edge-Cases — F05, F06, F14, F15, NF05)
- [ ] Erwartete Ergebnisse pro Testfall festhalten
- [ ] XSS-Sicherheitstest planen (NF09, G06)
- [ ] Im Bericht dokumentieren (Abschnitt 2.8)

> **A12 Gütestufe 3:** Testszenarien mit erwarteten Ergebnissen müssen VOR der Implementierung definiert sein.

### 2.9 Entwicklungspraktiken `G11`
- [ ] Git Workflow beschreiben (Branch `search-categories`, Commit-Konventionen)
- [ ] ESLint (airbnb-base) + Stylelint Standards dokumentieren
- [ ] Code-Review Prozess beschreiben (falls vorhanden)
- [ ] Im Bericht dokumentieren (Abschnitt 2.9)

---

## Pufferzeit (Doku)
- [ ] Arbeitsjournal Tag 3 schreiben `A05`
- [ ] Arbeitsjournal Tag 4 schreiben `A05`
- [ ] Risiko-Tracking aktualisieren `A05`
- [ ] Soll/Ist im Zeitplan nachführen `A04`
