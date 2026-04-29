# AI-Tool Dokumentation — IPA Tristan Thomas

> Gemäss Detail-Spec müssen alle verwendeten AI-Tools inkl. Prompt dokumentiert werden.

---

## Tool: Claude Code (Anthropic)

---

### Tag 1 — 21.04.2026

| # | Prompt | Output | Zweck |
|---|--------|--------|-------|
| 1 | «Ich will dich schnell auf den neusten Stand bringen was meine repositories und dokumente angeht [...] ich will, dass du ein md File kreierst für die verschiedenen Aufgaben innerhalb der Phasen angegeben im Zeitplan» | `IPA-Aufgaben.md` mit allen 5 Phasen, Tasks, Stunden und Daten aus `Zeitplan_IPA_V2.xlsx` | Aufgabenübersicht erstellen |
| 2 | «kannst diese auch gerne anschauen für mehr Kontext» (zu `ipa_checklist.md`, `ipa_kriterien.md`) | Zusammenfassung der Bewertungskriterien (A01–G11) und Checkliste | Kontext für Kriterien |
| 3 | «Die code-base ist unter /Users/tristant/Documents/DevBlog/devblogsearch/ mit fokus auf /Users/tristant/Documents/DevBlog/devblogsearch/web-components/search» | Vollständige Codebase-Analyse: Klassenstruktur, Methoden, Shadow DOM, Query-Index Felder, Test-Infrastruktur | Codebase analysieren |
| 4 | «kannst du noch eine schnelle md kreieren für die codebase-analyse, damit ich es in apple notes aufschreiben kann» | `codebase-analyse.md` | Analyse dokumentieren |
| 5 | «ich habe noch 3 weitere MDs hinzugefügt: ipa_checklist_full.md, helix-best-practices.md und code-guidelines.md» | Zusammenfassung der technischen Guidelines (ESLint, Stylelint, Shadow DOM, adoptedStyleSheets, etc.) | Kontext für Implementierung |
| 6 | «soll ich dir einfach eine MD kreieren für die verschiedenen Aufgaben» → «ja» | `soll-konzept.md` mit 16 funktionalen und 10 nicht-funktionalen Anforderungen inkl. Out of Scope | Anforderungsanalyse |
| 7 | «eigentlich meinte ich was auf der Benutzeroberfläche umfasst werden soll» | `soll-konzept-ui.md` mit Seitenaufbau-Tabelle, Filtergruppen-Tabelle, Chip-Tabelle, Zustands-Tabelle | UI Soll-Konzept |
| 8 | «Risikomanagement musste ich glaube ich auch noch machen [...] gerne in einer neuen md» | `risikomanagement.md` mit 7 Risiken, Mitigationen und Risikoverfolgungstabelle | Risikomanagement |
| 9 | «was denkst du von meinem Tagesüberblick für mein Lernjournal» | Feedback: Selbstreflexion gut, Soll/Ist und konkrete Resultate ergänzen, «gelassen» ersetzen | Qualitätskontrolle Arbeitsjournal |

---

### Tag 2 — 22.04.2026

| # | Prompt | Output | Zweck |
|---|--------|--------|-------|
| 1 | «Ist es erlaubt ein wireframe mit figma AI zu machen» | Bestätigung: erlaubt gemäss Detail-Spec, Dokumentationspflicht gilt gleich wie bei Claude | Klärung AI-Nutzung |
| 2 | «ich brauche kein use-case/context diagramm oder ein requirements table?» + Kriterienabgleich | Bestätigung A01 vollständig abgedeckt durch vorhandene Anforderungstabellen | Kriteriencheck A01 |
| 3 | «ich glaube, dass ich bei den Funktionalen Anforderungen eher Akzeptanzkriterien als Priorität benötige» | `soll-konzept.md` aktualisiert: Spalte «Priorität» → «Akzeptanzkriterium» für F01–F16 | Anforderungsanalyse verbessern |
| 4 | «Brauche ich bei den Nicht funktionalen Anforderungen auch akzeptanz kriterien anstatt Priorität?» | `soll-konzept.md` aktualisiert: NF01–NF10 ebenfalls mit Akzeptanzkriterien | Anforderungsanalyse verbessern |
| 5 | «kannst du mein Dokument überprüfen schnell damit ich sehen kann auf welchem stand ich bin» (zu `0.1_IPA_Bericht_unvollstaendig_Thomas_Tristan.docx`) | Vollständiger Bericht-Check: offene Abschnitte identifiziert (Zeitplan, Ordnerstruktur, Versionsverwaltung, Arbeitsjournal Tag 2) | Fortschrittscheck |
| 6 | «mach mir eine md mit checkliste für tag 2 der analyse phase» | `tag2-checklist.md` mit Prioritäten 🔴/🟡/🟢 | Tagesplanung |
| 7 | «kannst du schnell schauen ob ich fertig bin mit meiner anforderungsanalyse» | Bestätigung: Anforderungsanalyse vollständig (F01–F16, NF01–NF10, Out of Scope, Risikomanagement) | Qualitätskontrolle |
| 8 | «lass uns einfach den prototyp von neu aufbauen» + Beschreibung der echten Overlay-Struktur aus localhost | Neues `figma-ipa-facet-wireframe-scripter.js`: Frame 01 (Home) + Frame 02 (Search Overlay, 4-col Grid, Sidebar) mit Prototype-Links | Figma Scripter Script |
| 9 | «stelle klar, dass die entsprechenden funktionen wirklich auf dem interaktiven wireframe enthalten sind gemäss G05» | Vollständige Screen-Liste: Screens 4 (aktive Filter), 5 (0 Resultate), 6/6b (Show more) mit Prompts für Figma AI | G05 Wireframe-Planung |
| 10 | Figma AI Prompt-Erstellung für Screen 1–8 (iterativ verfeinert) | Vollständige Figma AI Prompts für alle 8 Screens + 6b: Home, Search-Overlay, Filter-Dropdowns, aktive Chips, 0-Resultate, Show-more, Publikationsdatum, Artikel-Typ | Wireframe erstellen |
| 11 | «dies ist das feedback zu meinem wireframe von meiner fachverantwortlichen person [Hannes Feedback]» | `wireframe-feedback.md` mit originalem Feedback, Antworten zu 3 Punkten, Massnahmentabelle | G05 Feedback dokumentieren |
| 12 | «was kommt heute übrigens ins risiko tracking rein» | R03 (Wireframe validiert Show-more) + R01 (Dual-Handle Slider → Presets-only) als neue Risikoverfolgungseinträge | Risiko-Tracking Tag 2 |
| 13 | «kannst du schnell einen kurzen check machen für die erste Phase» (zu `0.2_IPA_Bericht_Thomas_Tristan.docx`) | Vollständiger Phase-1-Check: 11 Punkte ✅, 5 offene Punkte identifiziert | Fortschrittscheck Phase 1 |

---

### Tag 3 — 24.04.2026

| # | Prompt | Output | Zweck |
|---|--------|--------|-------|
| 1 | «das ist der grobe zeitplan dieser phase aber ich glaub wir müssen es in noch mehr kleinere packages unterteilen [...] kreier bitte ein MD für das» | `phase2-checklist.md` mit 9 Arbeitspaketen (HLD 2.1–2.3, LLD 2.4–2.6, Querschnitt 2.7–2.9) inkl. Kriterienreferenzen | Phase 2 Planung |
| 2 | «nein ich habe immer noch 10 tage tag 10 ist jetzt am 8. mai» + Zeitplan-Anpassung | `Zeitplan_IPA_V3.xlsx` aktualisiert: Krankheitstag eingearbeitet, Phase 2 von 4 auf 9 Pakete erweitert | Zeitplan V3 |
| 3 | «können wir schnell eine checkliste machen nur für was an Tag 3 erledigt werden soll» | `tag3-checklist.md` mit erledigten und offenen Punkten für den Tag | Tagesplanung |
| 4 | «wie würdest du in meiner sprache den vollen abschnitt von system architektur schreiben» | Vollständiger Text 2.1 Systemarchitektur: Bestehende Komponente, Erweiterungsstrategie, Shadow DOM Tabelle, Event-Flow | Entwurf 2.1 |
| 5 | «und tech stack?» | Vollständiger Text 2.2 Tech-Stack: Technologien-Tabelle, Entwicklungstools-Tabelle | Entwurf 2.2 |
| 6 | «Ja jetzt Schnittstellen» + Vergleich mit Codebase-Analyse | Vollständiger Text 2.3 Schnittstellen: query-index.json Tabelle (inkl. adobeCloud+adobeApp Korrektur), URL-Parameter, Shadow DOM Events | Entwurf 2.3 |
| 7 | «warte wenn es mehrere Werte sind können die wirklich kommasepariert in der URL übergeben werden» + Vor-/Nachteile-Analyse | Entscheid: Repeated params (`URLSearchParams.getAll()`) statt kommasepariert — sicherer, kein manuelles Parsing | Designentscheid URL-State |
| 8 | «ja bereit» (Datenmodell & Filterlogik) | Vollständiger Text 2.4: `activeFilters` Objektstruktur, OR/AND Filterlogik-Tabelle, Counts-Berechnung Option A | Entwurf 2.4 |
| 9 | «soll ich nicht auf miro oder irgendwo ein diagramm erstellen [...] draw.io» | 3 draw.io Dateien erstellt: `shadow-dom-erweiterung.drawio`, `event-flow.drawio`, `filterlogik.drawio` | Visualisierungen A03 |
| 10 | «hier noch der bericht die checkliste [...] ich muss jetzt gleich anfangen mein lernjournal zu schreiben» | Fortschrittscheck: 2.1–2.4 vollständig im Word, 2.5–2.9 offen, Platzhalter in 2.4 identifiziert | Fortschrittscheck |
| 11 | Notizen für Arbeitsjournal Tag 3 übergeben | Ausformuliertes Arbeitsjournal Tag 3 in Berichtstil (max. 1 Seite) | Arbeitsjournal Tag 3 |

---

### Tag 4 — 28.04.2026

| # | Prompt | Output | Zweck |
|---|--------|--------|-------|
| 1 | «jetzt ist tag 4 gehen wir weiter zu komponenten und funktionen» | Vollständiger Text 2.5 inkl. Funktionsliste (7 Funktionen), CSS-Klassen, Styling, Mobile-Verhalten | Entwurf 2.5 |
| 2 | «mudd ich aber nicht meine Architektur Entscheidungen begründen» | Begründungsabschnitt zur Funktionsaufteilung ergänzt: Event-Flow als Ausgangspunkt, Testbarkeit als Trennprinzip | Entwurf 2.5 |
| 3 | «Das hängt auch teils mit der Analysephase zusammen oder?» | Anforderungs-Spalte (F-Nummern) in Funktionstabelle ergänzt, Traceability Analyse → Entwurf dokumentiert | Entwurf 2.5 |
| 4 | «Was meinst du genau mit Einzigartige Werte pro Filtergruppe bei generateFacets» | Erklärung mit konkretem Datenbeispiel aus Query-Index | Verständnis Funktionsliste |
| 5 | «soll ich nicht auf miro oder irgendwo ein diagramm erstellen [...] draw.io» + Bericht-Check PDF | Vollständiger Gütestufe-Check aller Entwurfs-Abschnitte: 2.1 G2, 2.2 G1, 2.3 G2, 2.4 G1, 2.5 G2, 2.6 G1, 2.7 G2 | Kriteriencheck |
| 6 | «ich habe gerade nochmals das kriterium G06 mit meiner VF besprochen [...] Systemumfeld» | Systemumfeld-Analyse für 2.5 Sicherheitskonzept ergänzt (5 Systembereiche analysiert) | Entwurf 2.5 G06 |
| 7 | «gibt es aber nicht mehr Schnittstellen, zum Beispiel das search input field gegen XSS» | Code-Analyse blog-search.js: Search-Input bereits geschützt via textContent/createTextNode, als analysierte Schnittstelle dokumentiert | Entwurf 2.5 G06 |
| 8 | «übrigens sachen wie das mit dem XSS via Query-index gegen das muss es keine massnahmen haben» | Sicherheitskonzept überarbeitet: XSS via Query-Index als akzeptiertes Risiko eingestuft, Risikotabelle aktualisiert | Entwurf 2.5 |
| 9 | «jetzt das Testkonzept» | Vollständiges Testkonzept mit 13 Testfällen (Unit + E2E), Testumgebung, Herleitung aus Anforderungen | Entwurf 2.6 |
| 10 | «wir streichen entwicklungspraktiken weil diese nicht zu meinen IPA kriterien gehören» | 2.7 Entwicklungspraktiken aus Entwurfsphase gestrichen | Kriterienabgleich |
| 11 | Notizen für Arbeitsjournal Tag 4 übergeben | Ausformuliertes Arbeitsjournal Tag 4 in Berichtstil | Arbeitsjournal Tag 4 |

---

### Tag 5 — 29.04.2026

| # | Prompt | Output | Zweck |
|---|--------|--------|-------|
| 1 | «gut es ist anfang tag 5 was sind noch die offenen punkte der entwurfsphase» | Übersicht offener Punkte: activeFilters-Platzhalter, Mobile-Verhalten leer, Ingo Feedback, Figma Anpassungen, Screenshots | Tagesplanung |
| 2 | «gut kannst du in draw.io die array darstellung erstellen» + «gibt es auch eine andere plattform wo du es generieren kannst?» | 4 Mermaid-Diagramme generiert: Shadow DOM Erweiterung, Event-Flow, Filterlogik, activeFilters-Struktur | Visualisierungen für Bericht |
| 3 | «sag mir dann noch zu welchen abschnitten ich die visuellen Diagramme hinzufügen soll» | Zuordnung: Shadow DOM + Event-Flow → 2.1, activeFilters → 2.2, Filterlogik → 2.2 nach OR/AND-Tabelle | Diagramm-Platzierung |
| 4 | «ich denke das event flow diagramm ist ein bisschen zu ungenau» | Event-Flow Diagramm überarbeitet: konkreter Benutzeraktions-Text statt abstrakter Knotenbezeichnung | Visualisierung verbessern |
| 5 | «bitte schau nochmals den Abschnitt im dokument an mit der filterlogik und erläuter schnell ob das Diagramm zum Verständnis aushilft» | Analyse: Filterlogik-Diagramm ergänzt die OR/AND-Tabelle sinnvoll — zeigt welche Artikel bei welchem Schritt herausfallen | Kriteriencheck A03 |
| 6 | «mach jetzt nochmals einen check über was im entwurfsabschnitt fehlt» (zu `0.4_IPA_Bericht_Thomas_Tristan.docx`) | Check aller 6 Kapitel: Mobile-Verhalten leer, Ingo Feedback Placeholder, Stakeholder Placeholder in G06, Schlusssatz in Testkonzept | Fortschrittscheck |
| 7 | «hast du überprüft was ich ergänzen muss um bei den verschiedenen Kapiteln auf gütestufe 3 zu kommen» | Präziser Kriterien-Check pro Kapitel (A03, A09, G05, G06, A12): Mobile-Verhalten G2-Blocker, G06 Punkt 4 Blocker, G05 Punkt 3 teilweise | Gütestufe-3-Check |
| 8 | Texte für Mobile-Verhalten, Ingo Feedback Entscheid, Stakeholder-Abstimmung angefordert | 3 fertige Texte geliefert für direkte Übernahme in Word | Entwurf vervollständigen |
| 9 | «so habe jetzt alles korrigiert kannst nochmals überprüfen» | Finaler Check: alle 6 Kapitel auf Gütestufe 3 bestätigt, keine Platzhalter mehr, alle Diagramme eingebettet | Qualitätskontrolle Entwurf |

---

## Tool: Figma AI (Adobe / Figma)

---

### Tag 2 — 22.04.2026

| # | Prompt (Kurzfassung) | Output | Zweck |
|---|--------|--------|-------|
| 1 | «Desktop wireframe 2 screens: Home (nav, hero, Top Stories, All Articles) + Search overlay (4-col card grid, page visible underneath)» | Screen 1 (Home) + Screen 2 (Search-Overlay ohne Filter) | Basis-Wireframe |
| 2 | «Add horizontal filter bar with 5 dropdowns, Kategorie open with checkboxes + counts + Show more» | Screen 3 (Filter-Dropdown offen) | Filter-Ansicht |
| 3 | «Add Screen 4: active chips + Clear all + 2 results» | Screen 4 (aktive Filter mit Chips) | Aktiver Filter-Zustand |
| 4 | «Add Screen 5: 0 results empty state with warning banner» | Screen 5 (0-Resultate Meldung) | Empty State |
| 5 | «Add Screen 6: Autor dropdown open with 10 items + Show more, Screen 6b: all authors expanded» | Screen 6 + 6b (Show more Zustand) | Show-more Funktion |
| 6 | «Add Screen 7: Publikationsdatum open with date presets + range slider» | Screen 7 (Datum-Dropdown mit Presets + Slider) | Datum-Filter |
| 7 | «Add Screen 8: Artikel-Typ open with tag-style buttons» | Screen 8 (Artikel-Typ als Tag-Liste) | Artikel-Typ Filter |

---

## Hinweis zur AI-Nutzung

Alle durch Claude Code generierten Inhalte wurden vom Kandidaten geprüft, angepasst und in den entsprechenden Kontext eingebettet. Die inhaltliche Verantwortung und fachliche Beurteilung liegt beim Kandidaten. Generierte Inhalte basieren auf den vom Kandidaten bereitgestellten Projektdokumenten (Detail-Spec, Zeitplan, Kriterien).
