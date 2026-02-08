// ==========================================================================
// Regex Tester Pro — Payment & License Verification
// Agent 4: Feature gating, license check, AI quota
// ==========================================================================

const Payments = (() => {
    'use strict';

    const API_BASE = 'https://xggdjlurppfcytxqoozs.supabase.co/functions/v1';
    const FREE_AI_LIMIT = 3;
    const FREE_HISTORY_LIMIT = 10;

    async function isPro() {
        const { zovoLicense } = await chrome.storage.local.get('zovoLicense');
        if (!zovoLicense || !zovoLicense.valid) return false;

        // Check expiry
        if (zovoLicense.expiresAt && new Date(zovoLicense.expiresAt) < new Date()) {
            await Storage.saveLicense({ ...zovoLicense, valid: false });
            return false;
        }

        return true;
    }

    async function validateLicense(key) {
        try {
            const response = await fetch(`${API_BASE}/verify-extension-license`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    licenseKey: key,
                    extensionId: chrome.runtime.id,
                    extensionName: 'regex-tester-pro'
                })
            });

            if (!response.ok) return { valid: false };

            const data = await response.json();
            const license = {
                key,
                valid: data.valid === true,
                tier: data.tier || 'pro',
                expiresAt: data.expiresAt || null,
                lastChecked: Date.now()
            };

            await Storage.saveLicense(license);
            return license;
        } catch (e) {
            // Network error — use cached
            const { zovoLicense } = await chrome.storage.local.get('zovoLicense');
            return zovoLicense || { valid: false };
        }
    }

    async function refreshLicense() {
        const { zovoLicense } = await chrome.storage.local.get('zovoLicense');
        if (!zovoLicense || !zovoLicense.key) return;

        // Only refresh every 24h
        if (zovoLicense.lastChecked && Date.now() - zovoLicense.lastChecked < 86400000) return;

        await validateLicense(zovoLicense.key);
    }

    async function getAIRemaining() {
        const pro = await isPro();
        if (pro) return Infinity;

        const usage = await Storage.getUsage();
        return Math.max(0, FREE_AI_LIMIT - (usage.aiUsageToday || 0));
    }

    async function decrementAI() {
        await Storage.incrementAIUsage();
    }

    function getHistoryLimit() {
        return isPro().then(pro => pro ? Infinity : FREE_HISTORY_LIMIT);
    }

    // MD 09: Paywall hit tracking — triggers drip email sequence via Zovo API
    async function logPaywallHit(feature, context = {}) {
        try {
            const { zovoLicense } = await chrome.storage.local.get('zovoLicense');
            await fetch(`${API_BASE}/log-paywall-hit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    extensionId: 'regex-tester-pro',
                    chromeExtensionId: chrome.runtime.id,
                    featureAttempted: feature,
                    userEmail: zovoLicense?.email || null,
                    context: {
                        ...context,
                        version: chrome.runtime.getManifest().version,
                        timestamp: new Date().toISOString()
                    }
                })
            });
        } catch (e) {
            // Fire and forget — don't break UX on tracking failure
        }
    }

    // MD 09: Send analytics batch to Zovo API
    async function sendAnalyticsBatch() {
        try {
            const { analytics_events } = await chrome.storage.local.get('analytics_events');
            if (!analytics_events || analytics_events.length === 0) return;

            await fetch(`${API_BASE}/collect-analytics`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    extensionId: 'regex-tester-pro',
                    events: analytics_events.slice(-50),
                    version: chrome.runtime.getManifest().version
                })
            });

            // Clear sent events
            await chrome.storage.local.set({ analytics_events: [] });
        } catch (e) {
            // Silently fail — retry on next alarm cycle
        }
    }

    return {
        isPro,
        validateLicense,
        refreshLicense,
        getAIRemaining,
        decrementAI,
        getHistoryLimit,
        logPaywallHit,
        sendAnalyticsBatch,
        FREE_AI_LIMIT,
        FREE_HISTORY_LIMIT
    };
})();
