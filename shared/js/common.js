/**
 * Trading Portal – Shared Utility Functions
 * Used by all trading pages for data loading, formatting, clocks, etc.
 */

// ── Data Loading ──
async function loadJSONData(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP Fehler ${response.status}: ${response.statusText}`);
    return response.json();
}

// ── Formatting ──
function formatCurrency(value, decimals) {
    if (value === null || value === undefined) return '—';
    decimals = decimals !== undefined ? decimals : 0;
    return new Intl.NumberFormat('de-DE', {
        style: 'currency', currency: 'USD',
        minimumFractionDigits: decimals, maximumFractionDigits: decimals
    }).format(value);
}

function formatNumber(val, decimals) {
    if (val === null || val === undefined) return '—';
    decimals = decimals !== undefined ? decimals : 4;
    return parseFloat(val).toLocaleString('de-DE', {
        minimumFractionDigits: decimals, maximumFractionDigits: decimals
    });
}

function formatDateTime(val) {
    if (!val) return '—';
    try {
        return new Date(val).toLocaleString('de-DE', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit', second: '2-digit'
        });
    } catch (e) { return val; }
}

// ── Last Update ──
function updateLastUpdate(timestamp, elementId) {
    elementId = elementId || 'last-update';
    if (!timestamp) return;
    var el = document.getElementById(elementId);
    if (el) el.innerHTML = 'Letzte Aktualisierung: ' + new Date(timestamp).toLocaleString('de-DE');
}

// ── Clocks (Zurich + Chicago) ──
function startClocks() {
    function tick() {
        var now = new Date();
        var opts = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
        try {
            var ch  = new Intl.DateTimeFormat('de-CH', Object.assign({}, opts, { timeZone: 'Europe/Zurich' })).format(now);
            var chi = new Intl.DateTimeFormat('en-US', Object.assign({}, opts, { timeZone: 'America/Chicago' })).format(now);
            var elCh  = document.getElementById('clock-ch');
            var elChi = document.getElementById('clock-chi');
            if (elCh)  elCh.textContent = ch;
            if (elChi) elChi.textContent = chi;
        } catch (e) { /* ignore */ }
    }
    tick();
    setInterval(tick, 1000);
}

// ── Server Status ──
function updateServerStatus(status) {
    var el = document.getElementById('server-status');
    if (!el || !status) return;
    var html = '';
    if (status.ib_gateway) {
        var s = status.ib_gateway;
        var cls = s.connected ? 'sp-status-online' : 'sp-status-offline';
        html += '<span class="sp-status-badge ' + cls + '">IB Gateway: ' + (s.connected ? 'Verbunden' : 'Offline') + '</span>';
    }
    if (status.trading_bot) {
        var s2 = status.trading_bot;
        var cls2 = s2.running ? 'sp-status-online' : 'sp-status-offline';
        html += '<span class="sp-status-badge ' + cls2 + '">Trading Bot: ' + (s2.running ? 'Aktiv' : 'Inaktiv') + '</span>';
    }
    if (html) el.innerHTML = html;
}

// ── Source Badge (IB vs. cached) ──
function getSourceBadge(isFromIB) {
    if (isFromIB === true)  return ' <span style="font-size:10px;opacity:0.6" title="Live von IB">&#x1F7E2;</span>';
    if (isFromIB === false) return ' <span style="font-size:10px;opacity:0.6" title="Cached">&#x1F7E1;</span>';
    return '';
}

