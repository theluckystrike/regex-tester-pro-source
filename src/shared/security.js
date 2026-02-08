// ==========================================================================
// Regex Tester Pro — Security & Input Sanitization
// MD 04 Agent 4: CSP enforcement, input validation, message security
// ==========================================================================

const Security = (() => {
    'use strict';

    // ── HTML Sanitization (prevent XSS in dynamic content) ──
    function sanitizeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // ── Input validation ──
    function validatePattern(pattern) {
        if (typeof pattern !== 'string') return { valid: false, error: 'Pattern must be a string' };
        if (pattern.length > 10000) return { valid: false, error: 'Pattern too long (max 10,000 chars)' };
        try {
            new RegExp(pattern);
            return { valid: true };
        } catch (e) {
            return { valid: false, error: e.message };
        }
    }

    function validateTestString(str) {
        if (typeof str !== 'string') return { valid: false, error: 'Test string must be a string' };
        if (str.length > 100000) return { valid: false, error: 'Test string too long (max 100,000 chars)' };
        return { valid: true };
    }

    function validateFlags(flags) {
        const validFlags = new Set(['g', 'i', 'm', 's', 'u', 'y', 'd']);
        const chars = flags.split('');
        for (const c of chars) {
            if (!validFlags.has(c)) return { valid: false, error: `Invalid flag: ${c}` };
        }
        // Check for duplicates
        if (new Set(chars).size !== chars.length) return { valid: false, error: 'Duplicate flags' };
        return { valid: true };
    }

    // ── Message origin validation (for chrome.runtime messaging) ──
    function validateMessageOrigin(sender) {
        // Only trust messages from our own extension
        return sender.id === chrome.runtime.id;
    }

    function validateMessage(message) {
        if (!message || typeof message !== 'object') return false;
        if (!message.action || typeof message.action !== 'string') return false;
        if (message.action.length > 100) return false;
        return true;
    }

    // ── Storage data validation ──
    function validateStorageData(data) {
        try {
            const json = JSON.stringify(data);
            if (json.length > 5 * 1024 * 1024) { // 5MB limit
                console.warn('[Security] Storage data exceeds 5MB limit');
                return false;
            }
            return true;
        } catch (e) {
            return false;
        }
    }

    // ── License key format validation ──
    function validateLicenseKey(key) {
        if (typeof key !== 'string') return false;
        // Expected format: ZOVO-XXXX-XXXX-XXXX or similar
        return /^[A-Z0-9-]{10,50}$/i.test(key.trim());
    }

    // ── URL validation for external links ──
    function isAllowedURL(url) {
        const allowed = [
            'https://zovo.one',
            'https://chrome.google.com/webstore'
        ];
        return allowed.some(prefix => url.startsWith(prefix));
    }

    // ── Privacy checklist (MD 04 Agent 4) ──
    const PRIVACY_COMPLIANCE = {
        noExternalDataLeaks: true,
        noThirdPartyScripts: true,
        noFingerprinting: true,
        allProcessingLocal: true,
        dataDeletableOnUninstall: true,
        onlyZovoAPICalls: true
    };

    return {
        sanitizeHTML,
        validatePattern,
        validateTestString,
        validateFlags,
        validateMessageOrigin,
        validateMessage,
        validateStorageData,
        validateLicenseKey,
        isAllowedURL,
        PRIVACY_COMPLIANCE
    };
})();
