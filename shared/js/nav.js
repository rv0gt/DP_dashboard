/**
 * Trading Portal – Modulare Navigation
 * Einbindung: <script src="[tief]/shared/js/nav.js" data-active="[seiten-id]"></script>
 *
 * Seiten-IDs: home | trading | datenanalysen | marktanalysen | boerseninformationen | research
 *
 * Navigationsänderungen NUR HIER vornehmen – wirkt auf alle Seiten.
 */
(function () {
    'use strict';

    var script = document.currentScript ||
        (function () {
            var all = document.querySelectorAll('script[data-active]');
            return all[all.length - 1] || null;
        })();

    if (!script) return;

    var srcAttr  = script.getAttribute('src') || '';
    var activeId = script.getAttribute('data-active') || '';

    // Präfix zur Portal-Wurzel ermitteln (aus dem Pfad zu nav.js)
    var navIdx = srcAttr.indexOf('shared/js/nav.js');
    var prefix = navIdx >= 0 ? srcAttr.substring(0, navIdx) : '';

    /* ═══════════════════════════════════════════════════════
       AUTH-CHECK – Redirect zu Login falls nicht angemeldet
       ═══════════════════════════════════════════════════════ */

    var AUTH_URL = window.location.protocol + '//' + window.location.hostname + ':8081';

    function portalLogout() {
        localStorage.removeItem('portal_token');
        localStorage.removeItem('portal_user');
        window.location.href = prefix + 'login.html';
    }

    (function checkAuth() {
        var token = localStorage.getItem('portal_token');
        if (!token) {
            window.location.href = prefix + 'login.html';
            return;
        }
        // Token im Hintergrund verifizieren
        fetch(AUTH_URL + '/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: token })
        })
        .then(function(r) { return r.json(); })
        .then(function(data) {
            if (!data.valid) portalLogout();
        })
        .catch(function() {
            // Auth-Server nicht erreichbar → Token lokal behalten (offline-Toleranz)
        });
    })();

    /* ═══════════════════════════════════════════════════════
       NAV-DEFINITIONEN  –  hier alles zentral anpassen
       ═══════════════════════════════════════════════════════ */

    // Icons in der linken Sidebar
    var SIDEBAR = [
        { id: 'home',                 href: 'home.html',                        label: 'Home',
          icon: 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z' },
        { id: 'trading',              href: 'trading/index.html',               label: 'Trading',
          icon: 'M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z' },
        { id: 'datenanalysen',        href: 'datenanalysen/index.html',         label: 'Datenanalysen',
          icon: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z' },
        { id: 'marktanalysen',        href: 'marktanalysen/index.html',         label: 'Marktanalysen',
          icon: 'M2 19.99l7.5-7.51 4 4 7.09-7.97L22 9.92l-8.5 9.56-4-4-6 6.01-1.5-1.5zm1.5-4.5l6-6.01 4 4L22 3.92l-1.41-1.41-7.09 7.97-4-4L2 13.49l1.5 1.5z' },
        { id: 'boerseninformationen', href: 'boerseninformationen/index.html',  label: 'Börseninformationen',
          icon: 'M4 10v7h3v-7H4zm6 0v7h3v-7h-3zM2 22h19v-3H2v3zm14-12v7h3v-7h-3zm-4.5-9L2 6v2h19V6l-9.5-5z' },
        { id: 'research',             href: 'research/index.html',              label: 'Research',
          icon: 'M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z' },
    ];

    // Analysten-Accounts
    var ANALYSTS = [
        { id: 'swillemin', name: 'St\u00e9phane Willemin', initials: 'SW', color: '#2598C3' },
        { id: 'rvogt',     name: 'Raphael Vogt',          initials: 'RV', color: '#F79645' }
    ];

    /* ═══════════════════════════════════════════════════════
       HTML-BUILDER
       ═══════════════════════════════════════════════════════ */

    function svg(d, size) {
        size = size || 18;
        return '<svg width="' + size + '" height="' + size +
            '" viewBox="0 0 24 24" fill="currentColor"><path d="' + d + '"/></svg>';
    }

    function el(html) {
        var wrap = document.createElement('div');
        wrap.innerHTML = html;
        return wrap.firstElementChild;
    }

    function buildSuiteBar() {
        return '<div class="suite-bar">' +
            '<div class="app-launcher" title="App Launcher">' +
            '<svg width="20" height="20" viewBox="0 0 20 20" fill="white">' +
            '<rect x="1" y="1" width="5" height="5" rx="0.5"/>' +
            '<rect x="7.5" y="1" width="5" height="5" rx="0.5"/>' +
            '<rect x="14" y="1" width="5" height="5" rx="0.5"/>' +
            '<rect x="1" y="7.5" width="5" height="5" rx="0.5"/>' +
            '<rect x="7.5" y="7.5" width="5" height="5" rx="0.5"/>' +
            '<rect x="14" y="7.5" width="5" height="5" rx="0.5"/>' +
            '<rect x="1" y="14" width="5" height="5" rx="0.5"/>' +
            '<rect x="7.5" y="14" width="5" height="5" rx="0.5"/>' +
            '<rect x="14" y="14" width="5" height="5" rx="0.5"/>' +
            '</svg></div>' +
            '<span class="site-title">Trading Portal</span>' +
            '<div class="suite-right">' +
            '<div class="suite-search">' +
            svg('M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z', 14) +
            '<input type="text" placeholder="Suchen..." class="suite-search-input">' +
            '</div>' +
            '<div class="suite-icon" title="Benachrichtigungen">' +
            svg('M12 22c1.1 0 2-.9 2-2h-4a2 2 0 002 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z') +
            '</div>' +
            '<div class="suite-icon" title="Einstellungen">' +
            svg('M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 00.12-.61l-1.92-3.32a.49.49 0 00-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 00-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96a.49.49 0 00-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.07.63-.07.94s.02.64.07.94l-2.03 1.58a.49.49 0 00-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6A3.6 3.6 0 1115.6 12 3.6 3.6 0 0112 15.6z') +
            '</div>' +
            '<div class="suite-icon suite-logout" title="Abmelden">' +
            '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/></svg>' +
            '</div>' +
            '<div class="user-avatar" title="Profil">?</div>' +
            '</div>' +
            '</div>';
    }

    function buildSidebar() {
        var items = SIDEBAR.map(function (s) {
            var cls = s.id === activeId ? ' class="active"' : '';
            return '<li><a href="' + prefix + s.href + '"' + cls + ' title="' + s.label + '">' +
                '<span class="nav-icon">' + svg(s.icon) + '</span>' +
                '</a></li>';
        }).join('');

        return '<nav class="sidebar"><ul class="sidebar-nav">' + items + '</ul></nav>';
    }

    var CHECK_SVG = '<svg class="dd-check" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>';

    /* ═══════════════════════════════════════════════════════
       ACCOUNT & THEME (portal-weit)
       ═══════════════════════════════════════════════════════ */

    function getUser()  { return localStorage.getItem('ma_user') || ''; }
    function setUser(id){ localStorage.setItem('ma_user', id); }

    function getTheme() {
        var userId = getUser();
        if (userId) {
            var t = localStorage.getItem('ma_theme_' + userId);
            if (t) return t;
        }
        return localStorage.getItem('ma_theme') || 'light';
    }
    function setTheme(theme) {
        var userId = getUser();
        if (userId) localStorage.setItem('ma_theme_' + userId, theme);
        localStorage.setItem('ma_theme', theme);
        document.documentElement.setAttribute('data-theme', theme);
    }

    function closeAllDropdowns() {
        document.querySelectorAll('.portal-dropdown.open').forEach(function(d) {
            d.classList.remove('open');
        });
    }

    function initAccountDropdown(avatar, suiteRight) {
        var dd = document.createElement('div');
        dd.className = 'portal-dropdown portal-dd-account';
        dd.innerHTML = '<div class="portal-dropdown-header">Analyst w\u00e4hlen</div>' +
            ANALYSTS.map(function(a) {
                return '<div class="portal-dropdown-item" data-id="' + a.id + '">' +
                    '<div class="dd-avatar" style="background:' + a.color + '">' + a.initials + '</div>' +
                    '<span>' + a.name + '</span>' + CHECK_SVG + '</div>';
            }).join('');
        suiteRight.appendChild(dd);

        function updateAvatar() {
            var userId = getUser();
            var analyst = ANALYSTS.find(function(a) { return a.id === userId; });
            if (analyst) {
                avatar.textContent = analyst.initials;
                avatar.style.background = analyst.color;
                avatar.title = analyst.name;
            } else {
                avatar.textContent = '?';
                avatar.style.background = '#718096';
                avatar.title = 'Nicht angemeldet';
            }
        }

        function markActive() {
            var userId = getUser();
            dd.querySelectorAll('.portal-dropdown-item').forEach(function(opt) {
                opt.classList.toggle('active', opt.getAttribute('data-id') === userId);
            });
        }

        avatar.addEventListener('click', function(e) {
            e.stopPropagation();
            var wasOpen = dd.classList.contains('open');
            closeAllDropdowns();
            if (!wasOpen) { dd.classList.add('open'); markActive(); }
        });

        dd.querySelectorAll('.portal-dropdown-item').forEach(function(opt) {
            opt.addEventListener('click', function(e) {
                e.stopPropagation();
                setUser(opt.getAttribute('data-id'));
                dd.classList.remove('open');
                updateAvatar();
                // Apply user's saved theme
                setTheme(getTheme());
                updateThemeMarks();
                // Notify page-specific code
                document.dispatchEvent(new Event('portalUserChanged'));
            });
        });

        updateAvatar();
        return { updateAvatar: updateAvatar };
    }

    var _themeDd = null;
    function updateThemeMarks() {
        if (!_themeDd) return;
        var current = getTheme();
        _themeDd.querySelectorAll('.portal-dropdown-item').forEach(function(opt) {
            opt.classList.toggle('active', opt.getAttribute('data-theme') === current);
        });
    }

    function initSettingsDropdown(settingsIcon, suiteRight) {
        var dd = document.createElement('div');
        dd.className = 'portal-dropdown portal-dd-settings';
        dd.style.minWidth = '200px';
        dd.innerHTML = '<div class="portal-dropdown-header">Design</div>' +
            '<div class="portal-dropdown-item" data-theme="light">' +
                '<div class="dd-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg></div>' +
                '<span>Light</span>' + CHECK_SVG +
            '</div>' +
            '<div class="portal-dropdown-item" data-theme="dark">' +
                '<div class="dd-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg></div>' +
                '<span>Dark Mode</span>' + CHECK_SVG +
            '</div>';
        suiteRight.appendChild(dd);
        _themeDd = dd;

        settingsIcon.addEventListener('click', function(e) {
            e.stopPropagation();
            var wasOpen = dd.classList.contains('open');
            closeAllDropdowns();
            if (!wasOpen) { dd.classList.add('open'); updateThemeMarks(); }
        });

        dd.querySelectorAll('.portal-dropdown-item').forEach(function(opt) {
            opt.addEventListener('click', function(e) {
                e.stopPropagation();
                setTheme(opt.getAttribute('data-theme'));
                dd.classList.remove('open');
                updateThemeMarks();
            });
        });
    }

    /* ═══════════════════════════════════════════════════════
       SEARCH
       ═══════════════════════════════════════════════════════ */

    var SEARCH_INDEX = [
        { title: 'Home',                  desc: 'Trading Portal \u00dcbersicht',                  href: 'home.html',                                    section: 'Seiten' },
        { title: 'Trading',               desc: 'Paper Strategie 1 \u2013 MES Futures',           href: 'trading/index.html',                           section: 'Seiten' },
        { title: 'Datenanalysen',          desc: 'Interactive Brokers Fehleranalyse',              href: 'datenanalysen/index.html',                     section: 'Seiten' },
        { title: 'Marktanalysen',          desc: '\u00dcbersicht aller Marktanalysen',             href: 'marktanalysen/index.html',                     section: 'Seiten' },
        { title: 'B\u00f6rseninformationen', desc: 'CME/GLOBEX, NYSE',                            href: 'boerseninformationen/index.html',              section: 'Seiten' },
        { title: 'Research',               desc: 'Forschungsartikel & Studien',                   href: 'research/index.html',                          section: 'Seiten' },
        { title: 'W\u00e4hrungsanalyse',   desc: 'DXY, EUR/USD, Wechselkurse',                   href: 'marktanalysen/waehrungsanalyse/index.html',    section: 'Marktanalysen' },
        { title: 'Zinskurvenanalyse',      desc: 'Yield Curve, Spreads, Inversionen',             href: 'marktanalysen/zinskurve/index.html',           section: 'Marktanalysen' },
        { title: 'Inflationsanalyse',      desc: 'CPI, PCE, Inflationserwartungen',               href: 'marktanalysen/inflation/index.html',           section: 'Marktanalysen' },
        { title: 'TMS2 \u2013 Geldmenge', desc: 'True Money Supply, Geldmengenaggregate',        href: 'marktanalysen/tms2/index.html',                section: 'Marktanalysen' },
        { title: 'Employmentanalyse',      desc: 'NFP, Unemployment, Arbeitsmarkt',               href: 'marktanalysen/employment/index.html',          section: 'Marktanalysen' },
        { title: 'Loananalyse',            desc: 'Bankkredite, Kreditwachstum',                   href: 'marktanalysen/loans/index.html',               section: 'Marktanalysen' },
        { title: 'Produktionszyklus',      desc: 'ISM, PMI, Industrieproduktion',                 href: 'marktanalysen/production/index.html',          section: 'Marktanalysen' },
        { title: 'Elektrizit\u00e4t',      desc: 'Stromverbrauch & Produktion',                   href: 'marktanalysen/electricity/index.html',         section: 'Marktanalysen' },
        { title: 'L\u00f6hne',             desc: 'Lohnentwicklung, Average Hourly Earnings',      href: 'marktanalysen/wages/index.html',               section: 'Marktanalysen' },
        { title: 'Credit Spreads',         desc: 'Investment Grade, High Yield, OAS',             href: 'marktanalysen/credit_spreads/index.html',      section: 'Marktanalysen' },
        { title: 'Demographie',            desc: 'Bev\u00f6lkerungsentwicklung, Altersstruktur',   href: 'marktanalysen/demographics/index.html',        section: 'Marktanalysen' },
        { title: 'Housing',                desc: 'Immobilienmarkt, Housing Starts',               href: 'marktanalysen/housing/index.html',             section: 'Marktanalysen' },
        { title: 'Liquidit\u00e4t',        desc: 'Fed Bilanz, Reserven, RRP',                     href: 'marktanalysen/liquidity/index.html',           section: 'Marktanalysen' },
        { title: 'Financial Conditions',   desc: 'FCI, Finanzkonditionen',                        href: 'marktanalysen/financial_conditions/index.html', section: 'Marktanalysen' },
        { title: 'Sentiment',              desc: 'AAII, Put/Call, VIX, Fear & Greed',             href: 'marktanalysen/sentiment/index.html',           section: 'Marktanalysen' },
        { title: 'Valuation',              desc: 'P/E, CAPE, Bewertungskennzahlen',               href: 'marktanalysen/valuation/index.html',           section: 'Marktanalysen' },
        { title: 'Fiskalpolitik',          desc: 'Staatsausgaben, Defizit, Schulden',             href: 'marktanalysen/fiscal/index.html',              section: 'Marktanalysen' },
        { title: 'Konsum',                 desc: 'Retail Sales, Konsumausgaben',                  href: 'marktanalysen/consumption/index.html',         section: 'Marktanalysen' },
        { title: 'Bauwirtschaft',          desc: 'Construction Spending, Permits',                href: 'marktanalysen/construction/index.html',        section: 'Marktanalysen' },
        { title: 'Gewinnmargen',           desc: 'Profit Margins, Unternehmensgewinne',           href: 'marktanalysen/profit_margins/index.html',      section: 'Marktanalysen' },
        { title: 'Investitionen',          desc: 'CapEx, Business Investment',                    href: 'marktanalysen/investment/index.html',          section: 'Marktanalysen' },
        { title: 'Futures Finanzierung',   desc: 'COT, Margin Debt, Futures-Positionierung',     href: 'marktanalysen/futures_financing/index.html',   section: 'Marktanalysen' }
    ];

    function initSearch(searchContainer) {
        var input = searchContainer.querySelector('.suite-search-input');
        if (!input) return;

        searchContainer.style.position = 'relative';

        var resultsDiv = document.createElement('div');
        resultsDiv.className = 'search-results';
        searchContainer.appendChild(resultsDiv);

        var activeIdx = -1;

        function highlight(text, query) {
            if (!query) return text;
            var escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            return text.replace(new RegExp('(' + escaped + ')', 'gi'), '<mark>$1</mark>');
        }

        function search(query) {
            if (!query || query.length < 1) {
                resultsDiv.classList.remove('open');
                resultsDiv.innerHTML = '';
                activeIdx = -1;
                return;
            }

            var q = query.toLowerCase();
            var matches = SEARCH_INDEX.filter(function(item) {
                return item.title.toLowerCase().indexOf(q) !== -1 ||
                       item.desc.toLowerCase().indexOf(q) !== -1;
            });

            if (matches.length === 0) {
                resultsDiv.innerHTML = '<div class="search-results-section">Keine Ergebnisse</div>';
                resultsDiv.classList.add('open');
                activeIdx = -1;
                return;
            }

            // Group by section
            var sections = {};
            matches.forEach(function(m) {
                if (!sections[m.section]) sections[m.section] = [];
                sections[m.section].push(m);
            });

            var html = '';
            var sectionKeys = Object.keys(sections);
            sectionKeys.forEach(function(sec) {
                html += '<div class="search-results-section">' + sec + '</div>';
                sections[sec].forEach(function(item) {
                    html += '<a class="search-result" href="' + prefix + item.href + '">' +
                        '<div class="search-result-icon">' +
                        svg('M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z', 16) +
                        '</div>' +
                        '<div class="search-result-text">' +
                        '<div class="search-result-title">' + highlight(item.title, query) + '</div>' +
                        '<div class="search-result-desc">' + highlight(item.desc, query) + '</div>' +
                        '</div></a>';
                });
            });

            resultsDiv.innerHTML = html;
            resultsDiv.classList.add('open');
            activeIdx = -1;
        }

        function updateActive() {
            var items = resultsDiv.querySelectorAll('.search-result');
            items.forEach(function(it, i) {
                it.classList.toggle('active', i === activeIdx);
            });
            if (activeIdx >= 0 && items[activeIdx]) {
                items[activeIdx].scrollIntoView({ block: 'nearest' });
            }
        }

        input.addEventListener('input', function() {
            search(input.value.trim());
        });

        input.addEventListener('keydown', function(e) {
            var items = resultsDiv.querySelectorAll('.search-result');
            if (!items.length) return;

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                activeIdx = Math.min(activeIdx + 1, items.length - 1);
                updateActive();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                activeIdx = Math.max(activeIdx - 1, 0);
                updateActive();
            } else if (e.key === 'Enter' && activeIdx >= 0 && items[activeIdx]) {
                e.preventDefault();
                items[activeIdx].click();
            } else if (e.key === 'Escape') {
                resultsDiv.classList.remove('open');
                resultsDiv.innerHTML = '';
                activeIdx = -1;
                input.blur();
            }
        });

        input.addEventListener('focus', function() {
            if (input.value.trim()) search(input.value.trim());
        });

        document.addEventListener('click', function(e) {
            if (!searchContainer.contains(e.target)) {
                resultsDiv.classList.remove('open');
                activeIdx = -1;
            }
        });
    }

    /* ═══════════════════════════════════════════════════════
       INJECTION
       ═══════════════════════════════════════════════════════ */

    var layout = document.querySelector('.layout');
    if (!layout) return;

    var parent = layout.parentNode;

    // Suite Bar (ganz oben)
    parent.insertBefore(el(buildSuiteBar()), layout);

    // Sidebar (erstes Kind des Layout-Containers)
    layout.insertBefore(el(buildSidebar()), layout.firstChild);

    // Account & Settings dropdowns
    var avatar = document.querySelector('.user-avatar');
    var settingsIcon = document.querySelector('.suite-icon[title="Einstellungen"]');
    var suiteRight = document.querySelector('.suite-right');
    if (suiteRight) suiteRight.style.position = 'relative';

    if (avatar && suiteRight) initAccountDropdown(avatar, suiteRight);
    if (settingsIcon && suiteRight) initSettingsDropdown(settingsIcon, suiteRight);

    // Logout Button
    var logoutBtn = document.querySelector('.suite-logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            portalLogout();
        });
    }

    // Search
    var searchContainer = document.querySelector('.suite-search');
    if (searchContainer) initSearch(searchContainer);

    // Close dropdowns on outside click
    document.addEventListener('click', function() { closeAllDropdowns(); });

    // Apply saved theme on load
    setTheme(getTheme());

    // Expose helpers for page-specific scripts
    window.portalGetUser = getUser;
    window.portalSetUser = setUser;
    window.portalAnalysts = ANALYSTS;
    window.portalLogout = portalLogout;

})();
