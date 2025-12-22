/**
 * Common JavaScript Functions for Dashboard
 * 
 * This file contains shared functions for:
 * - JSON data loading with error handling
 * - Server status updates
 * - Last update timestamp display
 * - Date/time formatting utilities
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
 * Updates server status badges in the UI
 * @param {Object} status - Server status object with gateway_running and port_4002_listening
 * @param {Object} system - Optional system status object with ram_usage_percent and disk_usage_percent
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
 * @returns {string} Formatted currency string or '—' if invalid
 */
function formatCurrency(num) {
    if (num === null || num === undefined) return '—';
    return new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
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

