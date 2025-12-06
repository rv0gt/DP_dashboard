Um Änderungen am Design (`.html`) oder den Daten (`.json`) sofort zu sehen, ohne zu pushen:
    - cd /home/cheffe/PortfolioHub/01_Investments/03_Systembetrieb/04_Dashboard/01_Dateien
    - python3 -m http.server 8000

Änderungen auf Github pushen: 
    - cd /home/cheffe/PortfolioHub/01_Investments/03_Systembetrieb/04_Dashboard/01_Dateien
    - git add . # 1. Alle neuen HTML-Dateien hinzufügen
    - git commit -m "Kommentar, was geänder wurde" # 2. Commit erstellen
    - git push # 3. Hochladen