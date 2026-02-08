// ==========================================================================
// Regex Tester Pro — Zovo Cross-Promotion Catalog
// MD 03: Cross-promotion matrix for portfolio extensions
// ==========================================================================

const ZovoCatalog = (() => {
    'use strict';

    const EXTENSIONS = {
        'regex-tester-pro': {
            name: 'Regex Tester Pro',
            tagline: 'Test, debug and master regex in your browser',
            category: 'developer',
            storeUrl: 'https://zovo.one/extensions/regex-tester-pro',
            icon: 'assets/icons/icon-48.png'
        },
        'json-formatter-pro': {
            name: 'JSON Formatter Pro',
            tagline: 'Format, validate and beautify JSON instantly',
            category: 'developer',
            storeUrl: 'https://zovo.one/extensions/json-formatter-pro'
        },
        'cookie-manager': {
            name: 'Cookie Manager',
            tagline: 'View, edit and export browser cookies',
            category: 'developer',
            storeUrl: 'https://zovo.one/extensions/cookie-manager'
        },
        'clipboard-history-pro': {
            name: 'Clipboard History Pro',
            tagline: 'Never lose copied text again',
            category: 'productivity',
            storeUrl: 'https://zovo.one/extensions/clipboard-history-pro'
        },
        'form-filler-pro': {
            name: 'Form Filler Pro',
            tagline: 'Auto-fill forms with saved profiles',
            category: 'productivity',
            storeUrl: 'https://zovo.one/extensions/form-filler-pro'
        },
        'api-testing-lite': {
            name: 'API Testing Lite',
            tagline: 'Test REST APIs right from your browser',
            category: 'developer',
            storeUrl: 'https://zovo.one/extensions/api-testing-lite'
        }
    };

    // Cross-promotion rules: which extensions to recommend from this one
    const PROMO_RULES = {
        'regex-tester-pro': ['json-formatter-pro', 'cookie-manager', 'api-testing-lite'],
        'json-formatter-pro': ['regex-tester-pro', 'api-testing-lite', 'cookie-manager'],
        'cookie-manager': ['json-formatter-pro', 'regex-tester-pro', 'api-testing-lite'],
        'clipboard-history-pro': ['form-filler-pro', 'json-formatter-pro'],
        'form-filler-pro': ['clipboard-history-pro', 'cookie-manager'],
        'api-testing-lite': ['json-formatter-pro', 'regex-tester-pro', 'cookie-manager']
    };

    // Bundles from MD 03 analysis
    const BUNDLES = {
        developer: {
            name: 'Developer Bundle',
            extensions: ['regex-tester-pro', 'json-formatter-pro', 'cookie-manager', 'api-testing-lite'],
            price: { monthly: 4.99, annual: 39.99 },
            targetUser: 'Web developers'
        },
        productivity: {
            name: 'Productivity Bundle',
            extensions: ['clipboard-history-pro', 'form-filler-pro'],
            price: { monthly: 4.99, annual: 39.99 },
            targetUser: 'VAs, power users'
        },
        all_access: {
            name: 'Zovo All Access',
            extensions: Object.keys(EXTENSIONS),
            price: { monthly: 9.00, annual: 72.00 },
            targetUser: 'Power users who want everything'
        }
    };

    function getRecommendations(currentExtension, limit = 3) {
        const rules = PROMO_RULES[currentExtension] || [];
        return rules.slice(0, limit).map(id => ({
            id,
            ...EXTENSIONS[id]
        })).filter(e => e.name); // only return existing entries
    }

    function getAllBundles() {
        return BUNDLES;
    }

    return {
        EXTENSIONS,
        BUNDLES,
        getRecommendations,
        getAllBundles
    };
})();
