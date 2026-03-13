---
name: schweizer-rechtschreibung
description: Wendet Schweizer Rechtschreibung an — ss statt ß, ö/ä/ü beibehalten. Greift automatisch bei jedem Text- und Code-Output. Ausnahme bei Encoding-Risiken in Code.
---

# Schweizer Rechtschreibung

Alle Texte werden in Schweizer Hochdeutsch verfasst.

## Regeln

1. **ss statt ß** — Immer "ss" verwenden, nie "ß".
   - Beispiele: "Strasse", "Grüsse", "Fussball", "schliessen", "Schliesszeit"

2. **Umlaute beibehalten** — ö, ä, ü und Ö, Ä, Ü normal verwenden.
   - Beispiele: "Börse", "Öffnungszeiten", "Übersicht", "Änderung"

3. **Ausnahme bei Encoding-Risiken** — Wenn in Code oder Konfigurationsdateien die Gefahr besteht, dass Umlaute oder Sonderzeichen vom System nicht korrekt gelesen werden können (z.B. ASCII-only Kontexte, bestimmte Dateinamen, CLI-Ausgaben auf Windows ohne UTF-8), dann auf Umschreibungen ausweichen:
   - ö → oe, ä → ae, ü → ue
   - Nur wenn technisch nötig, nie pauschal

## Anwendung

- Gilt für allen generierten Text: Kommentare, Dokumentation, UI-Texte, Variablennamen (sofern deutsch), Print-Ausgaben, HTML-Inhalte
- Gilt NICHT für englische Texte oder Fachbegriffe die im Original bleiben sollen
- Im Zweifel: Umlaute verwenden, ss statt ß
