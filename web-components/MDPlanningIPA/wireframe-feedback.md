# Wireframe Feedback — Tag 2, 22. April 2026

## Feedback von: Hannes Hertach (Verantwortliche Fachkraft)
## Wireframe Version: V1 (Figma, 8 Screens)

---

## Originales Feedback

> The figma mock generally provides a clear picture of how the experience will look like and behave in different scenarios.
>
> The following points are not clear from my side yet:
>
> 1. Does hitting Enter inside the search box do anything, or does it always only search on type? Do the URL parameters for search get updated immediately as I type?
> 2. When many results are found (more than would fit on the page), how does scrolling behave, since we have this overlay now? Does the overlay expand to become larger, or does it scroll inside just this one visible row? Does it scroll vertically or horizontally?
> 3. The date range slider currently only has a single slider I can move. But we would need to set both startDate and endDate, which would be 2 handles to drag.

---

## Antworten / Klärungen

### Punkt 1 — Enter-Taste + URL-Parameter

Die Suche wird bei jedem Tastendruck ausgelöst (Event: `input`, debounced mit 300ms Verzögerung) — kein separater Enter-Druck nötig. Die Enter-Taste löst keine zusätzliche Aktion aus; nur Escape schliesst die Resultate (`clearSearch()`). Die URL-Parameter (`?q=...`) werden ebenfalls bei jedem Keystroke sofort via `history.replaceState` aktualisiert.

**Konsequenz für Wireframe:** Keine Änderung nötig — Verhalten wird im Bericht als Text erklärt.

---

### Punkt 2 — Scrollverhalten des Overlays

Das Overlay ist mit `position: fixed`, `max-height: calc(100vh - 64px)` und `overflow-y: auto` implementiert. Konkret bedeutet das:
- Das Overlay scrollt **vertikal innerhalb sich selbst**
- Es wird nicht grösser als der sichtbare Viewport
- Die Seite dahinter scrollt nicht mit
- Die Artikel-Karten wrappen im 4-Spalten-Grid auf neue Zeilen nach unten — kein horizontales Scrollen

**Konsequenz für Wireframe:** Annotation im Figma hinzufügen die das Scrollverhalten beschreibt.

---

### Punkt 3 — Datum-Slider: zwei Handles

Feedback korrekt — ein einzelner Handle deckt nur ein Datum ab, für Start- und Enddatum werden zwei Handles benötigt. Zwei Lösungsoptionen wurden evaluiert:

| Option | Beschreibung | Entscheid |
|--------|-------------|-----------|
| **A — Nur Presets** | Vordefinierte Optionen: «Last week», «Last month», «Last year», «Any time» | ✅ Bevorzugt |
| **B — Dual-Handle Slider** | Zwei ziehbare Handles für Start- und Enddatum | ❌ Komplexer, fehleranfälliger |

**Entscheid:** Option A (Presets only) wird implementiert. Einfacher, robuster, kein nativer Dual-Range-Slider in HTML. Screen 7 im Wireframe wird entsprechend angepasst.

---

## Massnahmen

| # | Massnahme | Status |
|---|-----------|--------|
| 1 | Scrollverhalten als Annotation in Figma ergänzen | Offen |
| 2 | Screen 7 (Publikationsdatum) auf Presets-only aktualisieren | Offen |
| 3 | Verhalten Enter-Taste + URL-Params im Bericht (Abschnitt Entwurf) dokumentieren | Offen |
