---
name: create-skill
description: >
  Nutze diesen Skill immer wenn der User einen neuen Skill erstellen möchte,
  eine SKILL.md anlegen will, fragt wie Skills funktionieren, einen Skill-Ordner
  aufbauen will, oder Phrasen wie "erstell einen Skill", "neuen Skill anlegen",
  "Skill-Ordner erstellen", "SKILL.md schreiben" verwendet. Auch triggern bei:
  "beibringen wie", "Claude lernen", "Skill für X", "kannst du dir merken wie",
  "mach das wiederverwendbar", "speicher diese Logik".
---

# Skill erstellen — Ablauf

## 1. Anforderungen klären

Bevor du irgendetwas schreibst:
- Was soll der Skill tun? (eine konkrete Aufgabe, kein Sammelbecken)
- Wann soll er triggern? (welche Phrasen, Kontexte, Aufgabentypen)
- Gibt es Ressourcen, die Claude braucht? (Referenzdateien, Templates, Scripts)

Wenn unklar: nachfragen, nicht raten.

## 2. Speicherort bestimmen

```
skills/
├── create-skills/               ← Dieser Skill (Meta)
├── global/                      ← Skills die überall gelten
│   └── skill-name/
└── projekte/                    ← Projektspezifische Skills
    ├── webseite/
    │   └── skill-name/
    ├── sharepoint/
    │   └── skill-name/
    └── trading/
        └── skill-name/
```

Entscheidung: Wird der Skill in mehr als einem Projekt gebraucht → `global/`. Gilt er nur für Webseite, Sharepoint oder Trading → in den jeweiligen Projektordner.

## 3. Ordnerstruktur anlegen

```
skill-name/
├── SKILL.md                     ← Pflicht
├── scripts/                     ← Optional: ausführbarer Code
├── references/                  ← Optional: Dokumente für Kontext
│   └── beispiel-skill.md        ← Minimales Referenzbeispiel
└── assets/                      ← Optional: Templates, Icons
```

Leere Ordner weglassen. Nur anlegen was referenziert wird.

## 4. SKILL.md schreiben

### Frontmatter

```yaml
---
name: skill-name
description: >
  Nutze diesen Skill immer wenn [konkrete Situation].
  Auch bei Phrasen wie "[Phrase 1]", "[Phrase 2]", "[Phrase 3]".
  Trigger bei Aufgaben wie: [Aufgabentyp A], [Aufgabentyp B].
---
```

Aktive Formulierung (`Nutze diesen Skill wenn`) schlägt passive (`Dieser Skill ist für`).
Aktivierungsrate mit Beispielphrasen: ~20% → bis zu 90%.

### Body

Aufbau:
1. Ein-Satz-Beschreibung der Aufgabe
2. Schritt-für-Schritt-Ablauf
3. Entscheidungsregeln für Sonderfälle
4. Ausgabeformat
5. Goldene Regeln: was Claude bei dieser Aufgabe konkret falsch macht

Grenze: unter 500 Zeilen. Mehr Inhalt → in `references/` auslagern, im Body verlinken mit Angabe wann zu lesen.

## 5. Testen und iterieren

Nach dem Schreiben:
1. Skill mit 3–5 realen Prompts aufrufen
2. Output prüfen: Triggert der Skill? Ist der Output korrekt?
3. Schwachstellen in den Goldenen Regeln dokumentieren
4. `description` anpassen wenn Triggering unzuverlässig
5. Wiederholen bis Output konsistent korrekt

Kein Skill ist fertig ohne mindestens einen Testdurchlauf.

## 6. Checkliste

- [ ] Speicherpfad: `global/` oder `projekte/[webseite|sharepoint|trading]/` — kein anderer
- [ ] `name`: eindeutig, lowercase, Bindestriche
- [ ] `description`: aktiv formuliert, konkrete Phrasen, Aufgabentypen
- [ ] Body unter 500 Zeilen
- [ ] Alle referenzierten Dateien existieren im Ordner
- [ ] Kein allgemeines Wissen im Body das Claude ohnehin hat
- [ ] Mit realen Prompts getestet, Output geprüft, iteriert

## Goldene Regeln

Was Claude beim Skill-Erstellen typischerweise falsch macht:

- **Body zu lang**: Allgemeines Wissen einfügen das nicht aufgabenspezifisch ist → Body aufblähen, Kontext verschwenden
- **Passive description**: "Dieser Skill hilft bei X" → Skill wird ignoriert. Immer aktiv: "Nutze diesen Skill wenn..."
- **Zu wenig Trigger-Phrasen**: Nur den Hauptbegriff nennen, Synonyme und verwandte Phrasen vergessen → Undertriggering
- **Hardcodierte Pfade**: Projektspezifische Verzeichnisse in den Skill schreiben → Skill bricht in anderem Kontext
- **Kein Testloop**: Skill schreiben und als fertig betrachten ohne Output zu prüfen → stille Fehler
- **Leere Ordner anlegen**: `scripts/`, `references/` anlegen obwohl leer → irreführend
- **Goldene Regeln als Prinzipien**: Allgemeine Weisheiten statt konkreter Fehler dieser Aufgabe eintragen → Warnungen die nicht warnen

---

## Minimales Beispiel

Für ein funktionierendes Referenzbeispiel: `references/beispiel-skill.md`
Laden wenn: User ein Beispiel sehen will oder unklar ist wie ein fertiger Skill aussieht.