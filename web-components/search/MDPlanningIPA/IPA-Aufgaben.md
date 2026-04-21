# IPA Aufgaben – Tristan Thomas
**Thema:** Adobe Developers Blog – Facettenfilter-Erweiterung der `blog-search` Web Component  
**Zeitraum:** 21.04.2026 – 06.05.2026 (10 Tage, 80h total)

---

## Phase 1: Analyse & Setup
**Tage 1–2 | 21.04. – 22.04.2026 | 16h**  
**Meilenstein:** Setup complete

| # | Aufgabe | Soll (h) | Status |
|---|---------|----------|--------|
| 1.1 | Codebase-Analyse (`blog-search.js`, CSS, bestehende Tests) | 3 | [ ] |
| 1.2 | `query-index.json` Metadaten analysieren – verfügbare Filterfelder identifizieren | 2 | [ ] |
| 1.3 | Entwicklungsumgebung verifizieren (lokaler Dev-Server, Testing-Framework läuft) | 1 | [ ] |
| 1.4 | Wireframe / Mockup entwerfen (erste Version, iterativ) | 5 | [ ] |
| 1.5 | Arbeitsjournal Tag 1–2 schreiben & Dokumentation pflegen | 3 | [ ] |
| – | Pufferzeit | 2 | – |

**Notizen:**
- Bestehende Funktionen verstehen: `filterData()`, `renderResults()`, Shadow DOM Struktur
- Metadatenfelder im `query-index.json`: Kategorie, Produkt, Autor, Publikationsdatum (bereits vorhanden), Artikel-Typ (noch nicht überall gesetzt)
- Sicherstellen dass Chrome, Safari, Edge lokal testbar sind

---

## Phase 2: Entwurf & Architektur
**Tage 3–4 | 23.04. – 24.04.2026 | 16h**  
**Meilenstein:** Design complete

| # | Aufgabe | Soll (h) | Status |
|---|---------|----------|--------|
| 2.1 | Facetten-Datenmodell & Filterlogik entwerfen (ODER innerhalb Gruppe, UND zwischen Gruppen) | 3 | [ ] |
| 2.2 | Komponentenarchitektur planen – Shadow DOM Struktur, neue Funktionen & deren Schnittstellen | 4 | [ ] |
| 2.3 | Wireframe finalisieren (Sidebar-Layout, Filter-Chips, Empty States) | 4 | [ ] |
| 2.4 | Architekturentscheidungen im Bericht / Arbeitsjournal dokumentieren | 3 | [ ] |
| – | Pufferzeit | 2 | – |

**Geplante neue Funktionen (Architektur):**
- `generateFacets(data)` – Facetten aus query-index Daten aufbauen
- `applyFilters(data, activeFilters)` – Filterlogik (ODER / UND)
- `updateFilterCounts(data)` – Anzahl Artikel pro Filteroption dynamisch
- `renderSidebar(facets)` – Sidebar im Shadow DOM rendern
- `updateURLState(filters)` – Filter als URL-Parameter speichern

**Filtergruppen (in Scope):**
| Filtergruppe | UI-Typ | Metadaten vorhanden? |
|---|---|---|
| Kategorie | Checkbox | Ja |
| Produkt | Checkbox | Ja |
| Autor | Checkbox | Ja |
| Publikationsdatum | Slider / Vorauswahl | Ja |
| Artikel-Typ | Tag-Liste | Nein (muss robust mit fehlenden Daten umgehen) |

---

## Phase 3: Implementierung
**Tage 5–8 | 28.04. – 05.05.2026 | 32h**  
**Meilenstein:** Implementation complete

| # | Aufgabe | Soll (h) | Status |
|---|---------|----------|--------|
| 3.1 | `generateFacets(data)` implementieren | 3 | [ ] |
| 3.2 | `renderSidebar(facets)` implementieren | 4 | [ ] |
| 3.3 | `applyFilters(data, activeFilters)` implementieren | 5 | [ ] |
| 3.4 | `updateFilterCounts(data)` implementieren | 2 | [ ] |
| 3.5 | Filter-Chips (aktive Filter als Chips) & «Clear All» UI | 4 | [ ] |
| 3.6 | `updateURLState(filters)` implementieren (URL-Parameter, kein History-Eintrag) | 3 | [ ] |
| 3.7 | Datum-Slider + ARIA Accessibility + Error Handling (Network-Fehler, fehlerhafte URL-Params) | 4 | [ ] |
| 3.8 | Styling & Feinschliff (CSS-Variablen aus `blog-search.css`, `:host()` Selektoren) | 3 | [ ] |
| – | Pufferzeit | 4 | – |

**Technische Anforderungen:**
- Modular: Neue Facette = nur Array/Objekt im Code ergänzen
- `Show more` Button bei >10 Filteroptionen
- Empty State: Keine Filter vorhanden → Sidebar ausblenden
- Empty State: 0 Resultate → Meldung «No results match your filters. Try removing some filters.»
- Mobile: Sidebar nicht anzeigen, bestehende Suche funktioniert weiter
- Highlighting von Suchbegriffen erhalten

---

## Phase 4: Testing & Bug-fixes
**Tag 9 | 05.05.2026 | 8h**  
**Meilenstein:** Testing complete

| # | Aufgabe | Soll (h) | Status |
|---|---------|----------|--------|
| 4.1 | Unit Test schreiben (min. 1 Edge-Case, einzelne Funktion) | 2 | [ ] |
| 4.2 | E2E Test schreiben (min. 1 Edge-Case, Seiteninteraktion simulieren) | 2 | [ ] |
| 4.3 | Weitere Edge-Case Tests bis total min. 5 Tests mit Begründungen | 1 | [ ] |
| 4.4 | XSS-Sicherheitstest – JS-Code-Strings in URL-Parameter einfügen, kein Code darf ausgeführt werden | 1 | [ ] |
| 4.5 | Bug-Fixes aus Tests | 1 | [ ] |
| – | Pufferzeit | 1 | – |

**Mögliche Edge-Cases (Auswahl, nicht zwingend):**
- Artikel ohne Metadaten-Kategorie → beim Filtern korrekt ignoriert/weggefiltert
- Fehlerhafte URL-Parameter → werden ignoriert, App bleibt funktional
- Filterkombination mit 0 Resultaten → UI zeigt korrekte Meldung
- Manuelles Acceptance-Testing gemäss Spec (Suche «AI» → Filter testen → URL teilen → Reload)

---

## Phase 5: Abschluss
**Tag 10 | 06.05.2026 | 8h**

| # | Aufgabe | Soll (h) | Status |
|---|---------|----------|--------|
| 5.1 | JSDoc für alle Business-Logik Funktionen | 2 | [ ] |
| 5.1 | README.md erstellen (Projektbeschreibung, Setup & Installation) | 2 | [ ] |
| 5.1 | AI-Tool Dokumentation (alle verwendeten Tools inkl. Prompts) | 1 | [ ] |
| 5.1 | IPA-Bericht Abschluss & Review | 2 | [ ] |
| – | Pufferzeit | 1 | – |

---

## Übersicht

| Phase | Tage | Datum | Soll (h) | Ist (h) |
|-------|------|-------|----------|---------|
| 1 – Analyse & Setup | 1–2 | 21.–22.04. | 16 | 0 |
| 2 – Entwurf & Architektur | 3–4 | 23.–24.04. | 16 | 0 |
| 3 – Implementierung | 5–8 | 28.04.–05.05. | 32 | 0 |
| 4 – Testing & Bug-fixes | 9 | 05.05. | 8 | 0 |
| 5 – Abschluss | 10 | 06.05. | 8 | 0 |
| **Total** | | | **80** | **0** |

---

## Wichtige Dokumente
- `IPA-Detail-Spec-01.pdf` – Detailbeschreibung & Anforderungen
- `Zeitplan_IPA_V2.xlsx` – Gantt-Chart mit Soll/Ist
- `Kriterienkatalog_QV_BiVO2021_DE-20251025.pdf` – Bewertungskriterien (PkOrg)
- `1.0_IPA_Bericht_unvollstaendig_Thomas_Tristan.docx` – Arbeitsberichtsvorlage
- `IPA_Arbeitsjournal_Tag_01.docx` – ... `Tag_10.docx` – Journalvorlagen
