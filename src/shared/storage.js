// ==========================================================================
// Regex Tester Pro — Chrome Storage Wrapper
// Agent 3: Storage schema, history management, settings
// ==========================================================================

const Storage = (() => {
    'use strict';

    const DEFAULTS = {
        settings: {
            theme: 'system',
            defaultFlags: ['g'],
            autoSaveHistory: true
        },
        history: [],
        usage: {
            aiUsageToday: 0,
            aiUsageDate: new Date().toISOString().slice(0, 10),
            totalTests: 0,
            sessionCount: 0
        },
        zovoLicense: {
            key: null,
            valid: false,
            tier: 'free',
            expiresAt: null,
            lastChecked: null
        }
    };

    async function load() {
        const data = await chrome.storage.local.get(['settings', 'history', 'usage', 'zovoLicense']);
        return {
            settings: { ...DEFAULTS.settings, ...(data.settings || {}) },
            history: Array.isArray(data.history) ? [...data.history] : [],
            usage: { ...DEFAULTS.usage, ...(data.usage || {}) },
            zovoLicense: { ...DEFAULTS.zovoLicense, ...(data.zovoLicense || {}) }
        };
    }

    async function saveSettings(settings) {
        await chrome.storage.local.set({ settings });
    }

    async function saveHistory(history) {
        await chrome.storage.local.set({ history });
    }

    async function saveUsage(usage) {
        await chrome.storage.local.set({ usage });
    }

    async function saveLicense(zovoLicense) {
        await chrome.storage.local.set({ zovoLicense });
    }

    async function getUsage() {
        const { usage } = await chrome.storage.local.get('usage');
        const u = { ...DEFAULTS.usage, ...(usage || {}) };

        // Reset daily counter if new day
        const today = new Date().toISOString().slice(0, 10);
        if (u.aiUsageDate !== today) {
            u.aiUsageToday = 0;
            u.aiUsageDate = today;
            await saveUsage(u);
        }

        return u;
    }

    async function incrementAIUsage() {
        const u = await getUsage();
        u.aiUsageToday++;
        await saveUsage(u);
        return u;
    }

    async function incrementTests() {
        const { usage } = await chrome.storage.local.get('usage');
        const u = { ...DEFAULTS.usage, ...(usage || {}) };
        u.totalTests++;
        await saveUsage(u);
    }

    async function clearAll() {
        await chrome.storage.local.clear();
    }

    return {
        DEFAULTS,
        load,
        saveSettings,
        saveHistory,
        saveUsage,
        saveLicense,
        getUsage,
        incrementAIUsage,
        incrementTests,
        clearAll
    };
})();
