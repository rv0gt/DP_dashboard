/**
 * Shared Includes System for Trading Dashboard
 *
 * This module dynamically loads shared head components and navigation
 * Usage: Include this script in your HTML and call initIncludes()
 */

// Configuration - paths relative to HTML file location
const CONFIG = {
    navLinks: [
        { href: 'dashboard_analyse.html', text: 'Dashboard', id: 'nav-dashboard' },
        { href: 'holidays/es_mes_holidays.html', text: 'Holidays', id: 'nav-holidays' }
    ]
};

/**
 * Calculate relative path to root based on current location
 */
function getBasePath() {
    const path = window.location.pathname;
    const depth = (path.match(/\//g) || []).length -
                  (path.indexOf('/01_Webseite/') > -1
                      ? path.substring(0, path.indexOf('/01_Webseite/')).split('/').length
                      : 0);

    // Count subdirectories from 01_Webseite
    const webseiteIndex = path.indexOf('/01_Webseite/');
    if (webseiteIndex === -1) return './';

    const relativePath = path.substring(webseiteIndex + '/01_Webseite/'.length);
    const subDirs = (relativePath.match(/\//g) || []).length;

    if (subDirs === 0) return './';
    return '../'.repeat(subDirs);
}

/**
 * Load shared CSS stylesheet
 */
function loadSharedCSS() {
    const basePath = getBasePath();
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = basePath + 'shared/css/common.css';
    document.head.appendChild(link);
}

/**
 * Load shared JavaScript utilities
 */
function loadSharedJS() {
    return new Promise((resolve, reject) => {
        const basePath = getBasePath();
        const script = document.createElement('script');
        script.src = basePath + 'shared/js/common.js';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

/**
 * Generate navigation HTML
 * @param {string} activeId - ID of the active nav link
 */
function generateNavigation(activeId = null) {
    const basePath = getBasePath();

    const navLinksHtml = CONFIG.navLinks.map(link => {
        const isActive = link.id === activeId ? ' active' : '';
        return `<a href="${basePath}${link.href}" class="nav-link${isActive}" id="${link.id}">${link.text}</a>`;
    }).join('\n            ');

    return `
    <nav class="top-nav">
        <a href="${basePath}dashboard_analyse.html" class="nav-brand">
            <img src="${basePath}shared/assets/Logo.png" alt="Logo" class="nav-brand-logo">
            <span class="nav-brand-text">PortfolioHub</span>
        </a>
        <div class="nav-links">
            ${navLinksHtml}
        </div>
    </nav>`;
}

/**
 * Generate breadcrumb HTML
 * @param {Array} items - Array of {text, href} objects, last item is current page
 */
function generateBreadcrumb(items) {
    const basePath = getBasePath();

    const breadcrumbItems = items.map((item, index) => {
        if (index === items.length - 1) {
            // Last item is current page
            return `<span class="breadcrumb-current">${item.text}</span>`;
        } else {
            const href = item.href.startsWith('http') ? item.href : basePath + item.href;
            return `<a href="${href}">${item.text}</a>
                <span class="breadcrumb-separator">›</span>`;
        }
    }).join('\n                ');

    return `
            <div class="breadcrumb">
                ${breadcrumbItems}
            </div>`;
}

/**
 * Insert navigation into the page
 * @param {string} activeId - ID of the active nav link
 */
function insertNavigation(activeId = null) {
    const navPlaceholder = document.getElementById('nav-placeholder');
    if (navPlaceholder) {
        navPlaceholder.outerHTML = generateNavigation(activeId);
    } else {
        // Insert at beginning of body
        document.body.insertAdjacentHTML('afterbegin', generateNavigation(activeId));
    }
}

/**
 * Initialize shared includes
 * @param {Object} options - Configuration options
 * @param {string} options.activeNav - ID of active navigation link
 * @param {boolean} options.loadCSS - Whether to load shared CSS (default: true)
 * @param {boolean} options.loadJS - Whether to load shared JS utilities (default: true)
 * @param {boolean} options.insertNav - Whether to insert navigation (default: true)
 */
async function initIncludes(options = {}) {
    const {
        activeNav = null,
        loadCSS = true,
        loadJS = true,
        insertNav = true
    } = options;

    if (loadCSS) {
        loadSharedCSS();
    }

    if (loadJS) {
        try {
            await loadSharedJS();
        } catch (e) {
            console.warn('Could not load shared JS:', e);
        }
    }

    if (insertNav) {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => insertNavigation(activeNav));
        } else {
            insertNavigation(activeNav);
        }
    }
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initIncludes,
        generateNavigation,
        generateBreadcrumb,
        getBasePath,
        CONFIG
    };
}
