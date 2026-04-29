# Codebase-Analyse — blog-search Web Component

## Verzeichnisstruktur (relevant)

```
devblogsearch/
├── blocks/                          # EDS Blocks (article-feed, devblog-tags, etc.)
├── scripts/devblog/
│   └── devblog.js                   # Core Utilities: getLibs(), setLibs(), createOptimizedPicture(), SITE config
├── sorted-index/
│   └── sorted-query-index.json      # 84 Artikel, Beispieldaten
├── styles/styles.css                # Globale CSS-Variablen / Design Tokens
├── test/
│   ├── unit-tests/                  # Mocha (.mjs)
│   ├── browser/                     # Web Test Runner (.mjs)
│   └── e2e/                         # Playwright (.spec.js)
└── web-components/search/
    ├── blog-search.js               # Hauptkomponente (413 Zeilen)
    ├── blog-search.css              # Styles (317 Zeilen)
    ├── blog-search-filter-data.js   # Ranking-Algorithmus (80 Zeilen)
    └── test.html                    # Lokale Testseite
```

---

## blog-search.js — Klasse & Methoden

**`class BlogSearch extends HTMLElement`** — Native Web Component, registriert als `<blog-search>`

| Methode | Zweck |
|---------|-------|
| `loadMiloUtils()` | Lädt Milo-Utilities dynamisch via `getLibs()` |
| `fetchData()` | Fetch von `/en/query-index.json` (oder `data-source` Attribut) |
| `handleSearch()` | Hauptlogik: fetch → topic-filter → filterData → renderResults |
| `filterData()` | Import aus `blog-search-filter-data.js` |
| `renderResults()` | Fügt Resultate in `<ul>` ein, Race-Condition-Schutz via renderId |
| `renderResult()` | Erstellt einzelnes `<li>` mit Bild, Tag, Titel, Beschreibung |
| `highlightTextElements()` | Suchbegriffe mit `<mark>` wrappen |
| `clearSearchResults()` | Leert `.search-results` Container |
| `searchInput()` | `<input type="search">` mit 300ms Debounce + Escape-Handler |
| `searchBox()` | Icon + Input kombiniert |
| `connectedCallback()` | Lifecycle-Hook: Shadow DOM init, CSS laden, UI aufbauen |

### Shadow DOM
- `attachShadow({ mode: 'open' })` in `connectedCallback()`
- CSS via **`adoptedStyleSheets`** (kein `<style>` Tag)
- Zwei Varianten: **nav-search** (fixed, Grid-Layout) und **standard** (inline)

### Bestehende Patterns
- **Race-Condition-Schutz:** `currentRenderId` Counter — stale Renders werden abgebrochen
- **Debounce:** 300ms auf User-Input
- **URL-Sync:** `URLSearchParams` + `history.replaceState` (bereits teilweise vorhanden)
- **Topic-Scoping:** Filter auf `/topics/[topic]` URL-Pfad

---

## blog-search-filter-data.js — Ranking-Algorithmus

**`filterData(searchTerms, data)`** — reine Funktion, kein DOM

4-Tier Ranking (höchste Priorität zuerst):
1. Exakte Phrase im **Titel** (sortiert nach Position)
2. Exakte Phrase in **Meta** (title + description + path-slug)
3. Alle Terme im **Titel** (fuzzy, sortiert nach Anzahl Treffer → Position)
4. Alle Terme in **Meta** (fuzzy)

Deduplizierung: doppelte Titel werden entfernt, höchster Rank bleibt.

---

## Query-Index — Felder & Facettenfilter

**Datei:** `/en/query-index.json` (84 Artikel lokal, mehr auf Prod)

| Feld | Typ | Für Facette | Status |
|------|-----|-------------|--------|
| `tags` | JSON-Array-String | Kategorie | vorhanden |
| `adobeCloud` | String | Produkt (Cloud) | vorhanden |
| `adobeApp` | String | Produkt (App) | vorhanden |
| `author` | String | Autor | vorhanden |
| `sortDate` | String (YYYY-MM-DD) | Datum | vorhanden |
| `sortDateTimestamp` | String (Unix) | Datum (alternativ) | vorhanden |
| `articleType` | — | Artikel-Typ | **fehlt** — UI muss mit fehlenden Daten umgehen |

---

## Test-Infrastruktur

| Framework | Befehl | Scope |
|-----------|--------|-------|
| Mocha (Node) | `npm test` | Unit-Tests für `filterData()` |
| Web Test Runner | `npm run test:browser` | Browser-Tests mit DOM |
| Playwright | `npm run test:e2e` | E2E gegen `localhost:3000` |

Bestehende Tests: `blog-search-filter-data.test.mjs` (4 Cases: empty, exact phrase, fuzzy, dedup)

---

## Tooling

| Tool | Config | Befehl |
|------|--------|--------|
| ESLint (airbnb-base) | `.eslintrc.js` | `npm run lint:js` |
| Stylelint (standard) | `.stylelintrc.json` | `npm run lint:css` |
| Beide | — | `npm run lint` |

Wichtig: `.js` Extension in Imports obligatorisch (ESLint-Regel)

---

## Erweiterungspunkte für Facettenfilter

| Was | Wo |
|-----|----|
| Filterlogik vor Rendering einhängen | `handleSearch()` |
| Filter-State (aktive Filter) | neue Property in `BlogSearch` Klasse |
| Sidebar rendern | neuer Aufruf in `connectedCallback()` |
| URL-Parameter für Filter | Erweiterung bestehender `URLSearchParams` Logik |
| Sidebar-Layout (Grid) | `blog-search.css` erweitern |
| Neue Funktionen | `generateFacets()`, `renderSidebar()`, `applyFilters()`, `updateFilterCounts()`, `updateURLState()` |
