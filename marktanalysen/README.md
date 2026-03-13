# Finanzanalyse Dashboard

Interaktives Analyse-Dashboard mit **Währungsanalyse** (PPP, Korrelationen, Bonds, FX-Spreads)
und **Zinskurvenanalyse** (Yield Curve Regimes mit S&P 500 Overlay).

---

## Projektstruktur

```
Aufteilung/
├── main.py                    # Alles ausführen (Update + Generierung)
├── update_waehrung.py         # Nur PPP + FX + Korrelationen updaten
├── update_bonds.py            # Nur Staatsanleihen-Renditen updaten
├── update_zinskurve.py        # Nur Zinskurven-Daten updaten
├── generate.py                # HTML aus Cache-Daten generieren
│
├── config/
│   └── waehrungsanalyse.json  # Konfiguration (Währungen, APIs, Bonds, Pages)
│
├── src/
│   ├── __init__.py
│   ├── data_fetcher.py        # Daten-Abruf: OECD PPP, FRED FX, Investing.com Bonds
│   ├── analysis.py            # Analyse: Paare, Misvaluation, Trends, Korrelationen
│   ├── zinskurve.py           # Zinskurven: FRED Yields, Yahoo SPX, Regime-Analyse
│   └── generator.py           # HTML-Generierung aus Templates + Daten
│
├── templates/
│   ├── index.html             # Hauptseite-Template (Analyse-Kacheln)
│   ├── waehrungsanalyse.html  # Währungsanalyse SPA-Template (4 Tabs)
│   └── zinskurve.html         # Zinskurvenanalyse SPA-Template
│
├── static/
│   └── style.css              # Gemeinsames Design-System
│
├── cache/                     # Zwischengespeicherte Daten (JSON)
│   ├── waehrung_results.json  # PPP/FX/Korrelations-Ergebnisse
│   ├── bond_results.json      # Anleihen-Renditen
│   └── zinskurve_results.json # Yield Curve Regime-Daten
│
├── index.html                 # Generierte Hauptseite
├── waehrungsanalyse/
│   ├── index.html             # Generierte Währungsanalyse-SPA
│   └── data/
│       ├── correlation_data.js    # Lazy-loaded Korrelationsdaten (~2 MB)
│       ├── aggregated_corr.js     # Aggregierte Korrelation (~900 KB)
│       └── corr_matrix.js         # Korrelationsmatrix (~7.5 KB)
│
└── zinskurve/
    └── index.html             # Generierte Zinskurvenanalyse-SPA
```

---

## Schnellstart

### Alles auf einmal

```bash
python main.py
```

### Nur bestimmte Daten aktualisieren

```bash
# Nur Währungsdaten (PPP + Wechselkurse + Korrelationen)
python update_waehrung.py

# Nur Staatsanleihen-Renditen
python update_bonds.py

# Nur Zinskurven-Daten
python update_zinskurve.py

# Danach HTML neu generieren
python generate.py
```

### Typische Workflows

| Szenario | Befehle |
|----------|---------|
| Vollständiges Update | `python main.py` |
| Nur Bond-Daten aktualisieren | `python update_bonds.py && python generate.py` |
| Nur Zinskurve aktualisieren | `python update_zinskurve.py && python generate.py` |
| Nur HTML neu generieren (ohne Daten-Abruf) | `python generate.py` |

---

## Datenfluss

```
┌────────────────────────────────────────────────────────────────────────┐
│                          DATENQUELLEN                                  │
├──────────────────┬──────────────────┬──────────────────────────────────┤
│  OECD (PPP)      │  FRED (FX + Yields)  │  Investing.com (Bonds)     │
│  Yahoo (SPX)     │                      │                             │
└────────┬─────────┴──────────┬───────────┴──────────────┬──────────────┘
         │                    │                          │
         ▼                    ▼                          ▼
┌─────────────────┐ ┌──────────────────┐ ┌─────────────────────────────┐
│update_waehrung  │ │update_zinskurve  │ │ update_bonds                │
│                 │ │                  │ │                             │
│ - OECD PPP      │ │ - FRED DGS2/10/ │ │ - Investing.com Scrape      │
│ - FRED FX       │ │   DGS3MO        │ │ - Bond Yields pro Land      │
│ - 90 Paare      │ │ - Yahoo SPX     │ │   und Laufzeit              │
│ - Misvaluation  │ │ - 9 Regimes     │ │                             │
│ - Trends        │ │ - Statistiken   │ │                             │
│ - Korrelationen │ │                  │ │                             │
└────────┬────────┘ └────────┬─────────┘ └──────────────┬──────────────┘
         │                   │                           │
         ▼                   ▼                           ▼
┌─────────────────┐ ┌──────────────────┐ ┌─────────────────────────────┐
│ cache/           │ │ cache/            │ │ cache/                     │
│ waehrung_results│ │ zinskurve_results│ │ bond_results.json           │
│ .json           │ │ .json            │ │                             │
└────────┬────────┘ └────────┬─────────┘ └──────────────┬──────────────┘
         │                   │                           │
         └───────────────────┼───────────────────────────┘
                             │
                             ▼
                    ┌────────────────┐
                    │  generate.py   │
                    │                │
                    │ Liest Caches   │
                    │ + Templates    │
                    │ → HTML Output  │
                    └────────┬───────┘
                             │
                             ▼
              ┌──────────────────────────────┐
              │      HTML-Ausgabe             │
              ├──────────────────────────────┤
              │ index.html (Hauptseite)      │
              │ waehrungsanalyse/index.html  │
              │ waehrungsanalyse/data/*.js   │
              │ zinskurve/index.html         │
              └──────────────────────────────┘
```

---

## Datenquellen im Detail

### Währungsanalyse (`update_waehrung.py`)

| Quelle | API | Daten |
|--------|-----|-------|
| OECD SDMX | `sdmx.oecd.org` | PPP-Indices ab 1960 für 10 Länder |
| FRED | `pandas_datareader` (API-Key) | Tägliche Wechselkurse (9 Serien) |

**Verarbeitung:**
1. PPP + FX → 90 Währungspaare (10×9) mit täglichen + jährlichen Daten
2. Misvaluation = 100 × ln(FX / PPP) für jedes Paar
3. PPP-Trends (3J/5J annualisiert)
4. Trend-adjustierte Bewertung
5. Korrelation: Misvaluation vs. zukünftige FX-Änderung (1M, 6M, 1Y, 5Y)
6. Aggregierte Korrelation über alle Paare
7. Korrelationsmatrix

### Staatsanleihen (`update_bonds.py`)

| Quelle | Methode | Daten |
|--------|---------|-------|
| Investing.com | Web Scraping | Renditen für 7 Länder × 5 Laufzeiten |

**Länder:** Schweiz, USA, Australien, UK, Deutschland, Finnland, Schweden
**Laufzeiten:** 6M, 1Y, 3Y, 5Y, 10Y

### Zinskurvenanalyse (`update_zinskurve.py`)

| Quelle | Methode | Daten |
|--------|---------|-------|
| FRED | Direkter CSV-Download (kein API-Key) | DGS2, DGS10, DGS3MO (ab 1984) |
| Yahoo Finance | `yfinance` | S&P 500 (^GSPC), wöchentlich |

**Verarbeitung:**
1. 13-Wochen Rolling Change für kurz- und langfristige Yields
2. Klassifikation in 9 Regimes (3×3: ↑/—/↓ × ↑/—/↓)
3. Mode-Smoothing (4-Wochen-Fenster)
4. S&P 500 Rendite-Statistiken pro Regime (annualisiert, t-Test)
5. Zwei Varianten: 3M/10Y und 2Y/10Y

---

## Analyse-Seiten

### Währungsanalyse (4 Tabs)

| Tab | Inhalt | Daten-Laden |
|-----|--------|-------------|
| **PPP-Analyse** | FX vs. PPP Zeitreihen, Bewertungsbalken, Trends | Sofort (inline) |
| **Korrelation** | Scatter, Regression, Residuen, Matrix | Lazy-loaded (~3 MB) |
| **Staatsanleihen** | Renditen-Tabelle, Spread-Heatmap | Sofort (inline) |
| **FX-Rendite** | Erwartete FX-Änderung − Carry-Kosten | Lazy-loaded |

### Zinskurvenanalyse

| Element | Inhalt |
|---------|--------|
| **SPX-Chart** | S&P 500 (log) mit farbigen Regime-Hintergründen |
| **Yield-Chart** | 3M, 2Y, 10Y Treasury Yields |
| **Spread-Chart** | 10Y−Kurzfrist Spread (blau = normal, rot = invertiert) |
| **Statistik-Tabelle** | Rendite p.a., Varianz, Ret/Var, p-Wert pro Regime |

---

## Konfiguration

Die Datei `config/waehrungsanalyse.json` enthält:

- **`dashboard.pages`** — Definierte Analyse-Seiten (Template → Output-Pfad)
- **`api`** — OECD URL, FRED API-Key, Startjahr
- **`currencies`** — 10 Währungen mit FRED-IDs und Portfolio-Flag
- **`bonds`** — Investing.com Slugs, Länder, Laufzeiten, Länder↔Währungs-Mapping

---

## Abhängigkeiten

```bash
pip install requests pandas pandas-datareader numpy scipy beautifulsoup4 yfinance
```

| Paket | Verwendung |
|-------|-----------|
| `requests` | HTTP-Anfragen (OECD, Investing.com) |
| `pandas` | Datenverarbeitung |
| `pandas-datareader` | FRED Wechselkurse |
| `numpy` | Numerische Berechnungen |
| `scipy` | Pearson-Korrelation, t-Tests |
| `beautifulsoup4` | Investing.com Scraping |
| `yfinance` | S&P 500 Daten |

---

## Standard-Kennzahlen für Backtest-Strategietabellen

Alle Backtest-/Strategie-Tabellen verwenden einheitlich folgende Spalten:

| Spalte | Beschreibung | Berechnung |
|--------|-------------|------------|
| **Rendite p.a.** | Annualisierte Rendite (%) | `mean(r) × 252 × 100` (täglich) bzw. `((1+mean)^12 − 1) × 100` (monatlich) |
| **Varianz p.a.** | Annualisierte Varianz (%²) | `var(r) × 252 × 10000` (täglich) bzw. `var(r) × 12 × 10000` (monatlich) |
| **Kelly f*** | Exaktes Kelly-Kriterium | `f* = argmax ∏(1 + f·rᵢ)` — numerische Optimierung via `scipy.optimize.minimize_scalar` über `∑ log(1 + f·rᵢ)` |
| **Max DD** | Maximaler Drawdown (%) | `min((equity − peak) / peak) × 100` |
| **Exposure %** | Anteil investierter Tage/Monate | `n_investiert / n_gesamt × 100` |
| **Rendite p.a. (adj.)** | Exposure-adjustierte Rendite | `Rendite p.a. / (Exposure% / 100)` — Kapitaleffizienz pro investierter Zeit |

**Wichtig:** Bei neuen Strategien/Backtests immer diese 6 Spalten verwenden. Die Kelly-Berechnung ist das **exakte** Kelly-Kriterium (nicht die Näherung μ/σ²).

---

## Cache-System

Jedes Update-Skript speichert seine Ergebnisse als JSON in `cache/`.
`generate.py` liest diese Dateien und erzeugt die HTML-Seiten.

**Vorteil:** Man muss nicht alle Datenquellen neu abrufen, wenn nur eine Quelle
aktualisiert werden soll. Die Cache-Dateien bleiben erhalten bis sie
durch ein erneutes Update überschrieben werden.

| Cache-Datei | Erzeugt von | Größe (ca.) |
|-------------|-------------|-------------|
| `waehrung_results.json` | `update_waehrung.py` | 15-30 MB |
| `bond_results.json` | `update_bonds.py` | < 1 KB |
| `zinskurve_results.json` | `update_zinskurve.py` | 1-2 MB |
