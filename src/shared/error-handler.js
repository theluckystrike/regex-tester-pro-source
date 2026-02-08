// ==========================================================================
// Regex Tester Pro — Error Handler & Defensive Coding
// MD 05 Agent 4: Safe wrappers, state recovery, debug logging, error boundaries
// ==========================================================================

const ErrorHandler = (() => {
    'use strict';

    const DEBUG = false; // Set true for development

    // ── Debug Logging ──
    function debugLog(...args) {
        if (DEBUG) {
            console.log('[RegexTesterPro]', ...args);
        }
    }

    function debugWarn(...args) {
        if (DEBUG) {
            console.warn('[RegexTesterPro]', ...args);
        }
    }

    function debugError(...args) {
        console.error('[RegexTesterPro]', ...args);
    }

    // ── Safe Storage Operations (MD 05 Agent 4) ──
    async function safeStorageGet(key, defaultValue = null) {
        try {
            const result = await chrome.storage.local.get(key);
            return result[key] ?? defaultValue;
        } catch (error) {
            debugError('Storage get failed:', error);
            return defaultValue;
        }
    }

    async function safeStorageSet(data) {
        try {
            await chrome.storage.local.set(data);
            return true;
        } catch (error) {
            debugError('Storage set failed:', error);
            // Handle quota exceeded
            if (error.message && error.message.includes('QUOTA')) {
                debugWarn('Storage quota exceeded, attempting cleanup');
                await cleanupStaleData();
                try {
                    await chrome.storage.local.set(data);
                    return true;
                } catch (retryError) {
                    debugError('Storage still full after cleanup:', retryError);
                    return false;
                }
            }
            return false;
        }
    }

    // ── Safe Message Passing ──
    function safeSendMessage(message) {
        return new Promise((resolve) => {
            try {
                chrome.runtime.sendMessage(message, (response) => {
                    if (chrome.runtime.lastError) {
                        debugWarn('Message failed:', chrome.runtime.lastError.message);
                        resolve(null);
                    } else {
                        resolve(response);
                    }
                });
            } catch (error) {
                debugError('Message send error:', error);
                resolve(null);
            }
        });
    }

    // ── Safe Tab Operations ──
    async function safeGetTab(tabId) {
        try {
            return await chrome.tabs.get(tabId);
        } catch (error) {
            debugWarn('Tab not found:', tabId);
            return null;
        }
    }

    async function safeCreateTab(options) {
        try {
            return await chrome.tabs.create(options);
        } catch (error) {
            debugError('Tab create failed:', error);
            return null;
        }
    }

    // ── State Recovery ──
    async function cleanupStaleData() {
        try {
            const { analytics_events } = await chrome.storage.local.get('analytics_events');
            if (analytics_events && analytics_events.length > 100) {
                await chrome.storage.local.set({ analytics_events: analytics_events.slice(-50) });
                debugLog('Cleaned up analytics events');
            }

            // Clean up old upgrade prompt state
            const { upgradePromptState } = await chrome.storage.local.get('upgradePromptState');
            if (upgradePromptState && upgradePromptState.lastShown &&
                Date.now() - upgradePromptState.lastShown > 30 * 86400000) {
                await chrome.storage.local.remove('upgradePromptState');
                debugLog('Cleaned up stale upgrade prompt state');
            }
        } catch (error) {
            debugError('Cleanup failed:', error);
        }
    }

    async function recoverCorruptedStorage() {
        try {
            const data = await chrome.storage.local.get(null);

            // Validate settings
            if (data.settings && typeof data.settings !== 'object') {
                debugWarn('Corrupted settings detected, resetting');
                await chrome.storage.local.set({ settings: Storage.DEFAULTS.settings });
            }

            // Validate history
            if (data.history && !Array.isArray(data.history)) {
                debugWarn('Corrupted history detected, resetting');
                await chrome.storage.local.set({ history: [] });
            }

            // Validate usage
            if (data.usage && typeof data.usage !== 'object') {
                debugWarn('Corrupted usage detected, resetting');
                await chrome.storage.local.set({ usage: Storage.DEFAULTS.usage });
            }

            debugLog('Storage integrity check complete');
        } catch (error) {
            debugError('Storage recovery failed:', error);
        }
    }

    // ── Global Error Handler ──
    function installGlobalHandler() {
        if (typeof window !== 'undefined') {
            window.addEventListener('unhandledrejection', (event) => {
                debugError('Unhandled promise rejection:', event.reason);
                event.preventDefault(); // Prevent console error in production
            });

            window.addEventListener('error', (event) => {
                debugError('Uncaught error:', event.error);
            });
        }
    }

    // ── User-facing error messages ──
    function showUserError(message, recoveryHint) {
        const errorLine = document.getElementById('errorLine');
        if (errorLine) {
            errorLine.textContent = message + (recoveryHint ? ` (${recoveryHint})` : '');
            errorLine.hidden = false;
            setTimeout(() => { errorLine.hidden = true; }, 5000);
        }
    }

    return {
        debugLog,
        debugWarn,
        debugError,
        safeStorageGet,
        safeStorageSet,
        safeSendMessage,
        safeGetTab,
        safeCreateTab,
        cleanupStaleData,
        recoverCorruptedStorage,
        installGlobalHandler,
        showUserError
    };
})();
