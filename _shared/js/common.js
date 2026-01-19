/**
 * Common JavaScript Functions for Trading Dashboard
 *
 * This file contains shared functions for:
 * - JSON data loading with error handling
 * - Server status updates
 * - Last update timestamp display
 * - Date/time formatting utilities
 * - Clock updates
 */

/**
 * Loads JSON data from a URL with error handling
 * @param {string} url - The URL to fetch JSON data from
 * @returns {Promise<Object>} The parsed JSON data
 * @throws {Error} If the fetch fails or response is not OK
 */
async function loadJSONData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP Fehler ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Fehler beim Laden der Daten von ${url}:`, error);
        throw error;
    }
}

/**
 * Updates the last update timestamp display
 * @param {string|number} timestamp - ISO timestamp string or timestamp number
 * @param {string} elementId - ID of the element to update (default: 'last-update')
 */
function updateLastUpdate(timestamp, elementId = 'last-update') {
    if (!timestamp) return;

    const element = document.getElementById(elementId);
    if (!element) return;

    try {
        const date = new Date(timestamp);
        element.innerHTML = `Letzte Aktualisierung: ${date.toLocaleString('de-DE')}`;
    } catch (error) {
        console.error('Fehler beim Formatieren des Timestamps:', error);
        element.innerHTML = `Letzte Aktualisierung: ${timestamp}`;
    }
}

/**
 * Creates a status tile HTML string
 * @param {string} label - The label for the tile
 * @param {string} value - The value to display
 * @param {string} statusClass - CSS class for status (online, offline, warning)
 * @returns {string} HTML string
 */
function createStatusTile(label, value, statusClass) {
    return `
        <div class="status-tile">
            <div class="label">${label}</div>
            <div class="value ${statusClass}"><span class="status-icon"></span> ${value}</div>
        </div>
    `;
}

/**
 * Updates server status tiles in the dashboard
 * @param {Object} status - Server status object
 * @param {Object} system - System status object
 * @param {string} timestamp - Timestamp for last update
 */
function updateServerStatusTiles(status, system, timestamp) {
    if (!status) return;

    const container = document.getElementById('server-status');
    const pulseIndicator = document.getElementById('pulse-indicator');
    if (!container) return;

    let html = '';

    // Gateway Status
    const gatewayOnline = status.gateway_running;
    html += createStatusTile(
        'Gateway',
        gatewayOnline ? 'Online' : 'Offline',
        gatewayOnline ? 'online' : 'offline'
    );

    // Port Status
    const portActive = status.port_4002_listening;
    html += createStatusTile(
        'Port 4002',
        portActive ? 'Aktiv' : 'Inaktiv',
        portActive ? 'online' : 'offline'
    );

    if (system) {
        // RAM
        const ramVal = system.ram_usage_percent;
        const ramClass = ramVal > 85 ? 'offline' : 'online';
        html += createStatusTile('RAM', `${ramVal}%`, ramClass);

        // Disk
        const diskVal = system.disk_usage_percent;
        const diskClass = diskVal > 85 ? 'offline' : 'online';
        html += createStatusTile('Disk', `${diskVal}%`, diskClass);

        // Uptime
        const uptimeDays = system.uptime_days;
        if (uptimeDays !== null && uptimeDays !== undefined) {
            const uptimeClass = uptimeDays >= 5 ? 'online' : 'warning';
            const uptimeText = uptimeDays >= 1
                ? `${uptimeDays.toFixed(1)}d`
                : `${(uptimeDays * 24).toFixed(1)}h`;
            html += createStatusTile('Uptime', uptimeText, uptimeClass);
        }
    }

    // Last update
    if (timestamp) {
        const lastUpdate = new Date(timestamp);
        const now = new Date();
        const diffMinutes = (now - lastUpdate) / (1000 * 60);
        const updateClass = diffMinutes < 65 ? 'online' : 'offline';

        const timeStr = lastUpdate.toLocaleTimeString('de-DE', {
            hour: '2-digit',
            minute: '2-digit'
        });
        html += createStatusTile('Aktualisiert', timeStr, updateClass);
    }

    container.innerHTML = html;

    // Pulse Indicator
    const allOnline = gatewayOnline && portActive;
    if (pulseIndicator) {
        pulseIndicator.classList.toggle('offline', !allOnline);
    }
}

/**
 * Updates server status badges (simple version)
 * @param {Object} status - Server status object with gateway_running and port_4002_listening
 * @param {Object} system - Optional system status object
 * @param {string} elementId - ID of the container element (default: 'server-status')
 */
function updateServerStatus(status, system = null, elementId = 'server-status') {
    if (!status) return;

    const container = document.getElementById(elementId);
    if (!container) return;

    // Gateway & Port Status
    const gatewayClass = status.gateway_running ? 'status-online' : 'status-offline';
    const gatewayText = status.gateway_running ? '✓ Gateway Online' : '✗ Gateway Offline';

    const portClass = status.port_4002_listening ? 'status-online' : 'status-offline';
    const portText = status.port_4002_listening ? '✓ Port 4002 Aktiv' : '✗ Port 4002 Inaktiv';

    let html = `
        <span class="status-badge ${gatewayClass}"><span class="status-dot"></span> ${gatewayText}</span>
        <span class="status-badge ${portClass}"><span class="status-dot"></span> ${portText}</span>
    `;

    // RAM & Disk Status (if system data is provided)
    if (system) {
        // RAM: red if > 85%
        const ramVal = system.ram_usage_percent;
        const ramClass = ramVal > 85 ? 'status-offline' : 'status-online';
        html += `<span class="status-badge ${ramClass}"><span class="status-dot"></span> RAM: ${ramVal}%</span>`;

        // Disk: red if > 85%
        const diskVal = system.disk_usage_percent;
        const diskClass = diskVal > 85 ? 'status-offline' : 'status-online';
        html += `<span class="status-badge ${diskClass}"><span class="status-dot"></span> Disk: ${diskVal}%</span>`;
    }

    container.innerHTML = html;
}

/**
 * Updates IB (Interactive Brokers) status badge
 * @param {Object} ibData - IB status data with error_count and active properties
 * @param {string} elementId - ID of the element to update (default: 'ib-status')
 */
function updateIBStatus(ibData, elementId = 'ib-status') {
    const el = document.getElementById(elementId);
    if (!el) return;

    // Show warning if errors exist
    if (ibData.error_count && ibData.error_count > 0) {
        el.className = 'strategy-status status-warning';
        el.textContent = `${ibData.error_count} Fehler`;
    } else if (ibData.active) {
        el.className = 'strategy-status status-active';
        el.textContent = 'Aktiv';
    } else {
        el.className = 'strategy-status status-inactive';
        el.textContent = 'Inaktiv';
    }
}

/**
 * Formats a number as currency (USD)
 * @param {number|null|undefined} num - Number to format
 * @param {number} decimals - Number of decimal places (default: 0)
 * @returns {string} Formatted currency string or '—' if invalid
 */
function formatCurrency(num, decimals = 0) {
    if (num === null || num === undefined) return '—';
    return new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    }).format(num);
}

/**
 * Formats a date/time string to German locale
 * @param {string|Date} date - Date string or Date object
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
function formatDateTime(date, options = {}) {
    try {
        const dateObj = date instanceof Date ? date : new Date(date);
        const defaultOptions = {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        };
        return dateObj.toLocaleString('de-DE', { ...defaultOptions, ...options });
    } catch (error) {
        console.error('Fehler beim Formatieren des Datums:', error);
        return String(date);
    }
}

/**
 * Formats a P&L value with color styling
 * @param {number|null|undefined} num - Number to format
 * @returns {string} HTML string with colored P&L
 */
function formatPnl(num) {
    if (num === null || num === undefined) return '—';
    const formatted = formatCurrency(num, 2);
    const colorClass = num >= 0 ? 'positive' : 'negative';
    return `<span class="${colorClass}">${formatted}</span>`;
}

/**
 * Displays an error message in a container element
 * @param {string} message - Error message to display
 * @param {string} containerId - ID of the container element
 * @param {string} url - Optional URL to include in the error message
 */
function displayError(message, containerId, url = null) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error('Container nicht gefunden:', containerId);
        return;
    }

    let errorHtml = `<span style="color:red; text-align:center; padding:20px;">${message}`;
    if (url) {
        errorHtml += `<br><small>URL: ${url}</small>`;
    }
    errorHtml += `</span>`;

    container.innerHTML = errorHtml;
}

/**
 * Gets the source badge HTML
 * @param {boolean} fromIb - Whether data is from IB
 * @returns {string} HTML string for source badge
 */
function getSourceBadge(fromIb) {
    return fromIb
        ? '<span class="source-indicator source-ib">IB</span>'
        : '<span class="source-indicator source-db">DB</span>';
}

/**
 * Updates clocks for Zurich and Chicago timezones
 */
function updateClocks() {
    const now = new Date();
    const options = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };

    const clockCh = document.getElementById('clock-ch');
    const clockChi = document.getElementById('clock-chi');

    if (clockCh) {
        clockCh.innerText = new Intl.DateTimeFormat('de-CH', {
            ...options,
            timeZone: 'Europe/Zurich'
        }).format(now);
    }

    if (clockChi) {
        clockChi.innerText = new Intl.DateTimeFormat('en-US', {
            ...options,
            timeZone: 'America/Chicago'
        }).format(now);
    }
}

/**
 * Start clock update interval
 */
function startClocks() {
    updateClocks();
    setInterval(updateClocks, 1000);
}

/**
 * Toggle fullwidth mode for a container
 * @param {string} containerId - ID of the container element
 * @param {string} buttonId - ID of the toggle button
 */
function toggleFullwidth(containerId = 'transactions-container', buttonId = 'fullwidth-btn') {
    const container = document.getElementById(containerId);
    const btn = document.getElementById(buttonId);
    if (!container || !btn) return;

    const isFullwidth = container.classList.toggle('fullwidth');
    btn.classList.toggle('active', isFullwidth);

    btn.innerHTML = isFullwidth
        ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
               <path d="M4 14h6m0 0v6m0-6L3 21M20 10h-6m0 0V4m0 6l7-7"/>
           </svg>
           Normal`
        : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
               <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
           </svg>
           Vollbild`;
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        loadJSONData,
        updateLastUpdate,
        createStatusTile,
        updateServerStatusTiles,
        updateServerStatus,
        updateIBStatus,
        formatCurrency,
        formatDateTime,
        formatPnl,
        displayError,
        getSourceBadge,
        updateClocks,
        startClocks,
        toggleFullwidth
    };
}
