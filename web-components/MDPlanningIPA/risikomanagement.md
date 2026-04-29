# Risikomanagement — IPA Tristan Thomas

## Risikomatrix

| ID | Risiko | Kategorie | Wahrscheinlichkeit | Auswirkung | Priorität |
|----|--------|-----------|-------------------|------------|-----------|
| R01 | Filterlogik komplexer als geplant (kombinierte Filter) | Zeitlich | Mittel | Hoch | Hoch |
| R02 | Testing-Aufwand unterschätzt | Zeitlich | Mittel | Mittel | Mittel |
| R03 | Filter-UI unübersichtlich bei vielen Optionen (>10 Tags/Autoren) | Technisch | Hoch | Mittel | Hoch |
| R04 | URL-Parameter werden zu lang bei vielen aktiven Filtern | Technisch | Tief | Tief | Tief |
| R05 | Artikel-Typ Metadaten fehlen auf alten Artikeln | Technisch | Hoch | Mittel | Hoch |
| R06 | Browser-Kompatibilitätsprobleme (Chrome, Safari, Edge) | Technisch | Tief | Hoch | Mittel |
| R07 | Zeitverzug durch unvorhergesehene Codebase-Komplexität | Zeitlich | Mittel | Hoch | Hoch |

---

## Massnahmen

| ID | Risiko | Mitigation | Status |
|----|--------|------------|--------|
| R01 | Filterlogik zu komplex | Schritt-für-Schritt: zuerst eine Filtergruppe, dann weitere hinzufügen | Offen |
| R02 | Testing-Aufwand unterschätzt | Testfälle früh definieren; automatisierte Tests parallel zur Implementierung schreiben | Offen |
| R03 | Filter-UI unübersichtlich | «Show more» Button bei >10 Optionen implementieren | Offen |
| R04 | URL zu lang | Kurze Parameter-Namen verwenden | Offen |
| R05 | Fehlende Artikel-Typ Metadaten | UI robust gegen fehlende Werte bauen; Artikel ohne dieses Feld werden beim Filter ignoriert | Offen |
| R06 | Browser-Kompatibilität | Regelmässig in allen drei Browsern testen während der Implementierung | Offen |
| R07 | Zeitverzug | Pufferzeit pro Phase eingeplant; Phasen täglich mit Soll/Ist vergleichen | Offen |

---

## Risikoverfolgung

| Datum | ID | Ereignis | Reaktion |
|-------|----|----------|----------|
| 21.04.2026 | R01 | Risiko identifiziert | Mitigation definiert, Schritt-für-Schritt-Vorgehen geplant |
| 21.04.2026 | R05 | Risiko bestätigt – Artikel-Typ Feld fehlt im query-index | UI wird von Beginn an robust gegen fehlende Felder implementiert |

