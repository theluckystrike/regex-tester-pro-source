// ==========================================================================
// Regex Tester Pro — Service Worker
// Agent 5: Lifecycle, context menu, alarms, onboarding
// ==========================================================================

// ── Context Menu ──
chrome.runtime.onInstalled.addListener((details) => {
    // Create context menu (remove first to avoid duplicates on update)
    chrome.contextMenus.removeAll(() => {
        chrome.contextMenus.create({
            id: 'test-regex-selection',
            title: 'Test regex on "%s"',
            contexts: ['selection']
        });
    });

    // Setup alarms
    chrome.alarms.create('license-refresh', { periodInMinutes: 1440 }); // 24h
    chrome.alarms.create('ai-quota-reset', { periodInMinutes: 1440 });  // 24h

    // Track install
    if (details.reason === 'install') {
        chrome.storage.local.set({
            usage: {
                aiUsageToday: 0,
                aiUsageDate: new Date().toISOString().slice(0, 10),
                totalTests: 0,
                sessionCount: 1
            }
        });

        // Open onboarding tab
        chrome.storage.local.get('onboardingCompleted', (data) => {
            if (!data.onboardingCompleted) {
                chrome.tabs.create({
                    url: chrome.runtime.getURL('src/onboarding/onboarding.html'),
                    active: true
                });
            }
        });
    }

    // Track update
    if (details.reason === 'update') {
        console.log('[Regex Tester Pro] Updated to v' + chrome.runtime.getManifest().version);
    }
});

// ── Context Menu Handler ──
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'test-regex-selection' && info.selectionText) {
        // Store selected text for the popup to pick up
        chrome.storage.local.set({ pendingTestString: info.selectionText });

        // Open popup — fallback to badge if openPopup() unavailable
        if (typeof chrome.action.openPopup === 'function') {
            chrome.action.openPopup().catch(() => {
                showBadgeNotification();
            });
        } else {
            showBadgeNotification();
        }
    }
});

// Badge notification helper (uses alarm instead of unreliable setTimeout in SW)
function showBadgeNotification() {
    chrome.action.setBadgeText({ text: '!' });
    chrome.action.setBadgeBackgroundColor({ color: '#6366f1' });
    chrome.alarms.create('clear-badge', { delayInMinutes: 0.05 }); // ~3 seconds
}

// ── Alarms ──
chrome.alarms.onAlarm.addListener(async (alarm) => {
    if (alarm.name === 'clear-badge') {
        chrome.action.setBadgeText({ text: '' });
        return;
    }

    if (alarm.name === 'license-refresh') {
        // Refresh license if one exists
        const { zovoLicense } = await chrome.storage.local.get('zovoLicense');
        if (zovoLicense && zovoLicense.key) {
            try {
                const response = await fetch('https://xggdjlurppfcytxqoozs.supabase.co/functions/v1/verify-extension-license', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        licenseKey: zovoLicense.key,
                        extensionId: chrome.runtime.id,
                        extensionName: 'regex-tester-pro'
                    })
                });
                if (response.ok) {
                    const data = await response.json();
                    await chrome.storage.local.set({
                        zovoLicense: {
                            ...zovoLicense,
                            valid: data.valid === true,
                            tier: data.tier || 'pro',
                            expiresAt: data.expiresAt || null,
                            lastChecked: Date.now()
                        }
                    });
                }
            } catch (e) {
                // Network error — keep cached license
            }
        }
    }

    if (alarm.name === 'ai-quota-reset') {
        const { usage } = await chrome.storage.local.get('usage');
        if (usage) {
            const today = new Date().toISOString().slice(0, 10);
            if (usage.aiUsageDate !== today) {
                await chrome.storage.local.set({
                    usage: { ...usage, aiUsageToday: 0, aiUsageDate: today }
                });
            }
        }
    }
});

// ── Session Tracking ──
chrome.runtime.onStartup.addListener(async () => {
    const { usage } = await chrome.storage.local.get('usage');
    if (usage) {
        await chrome.storage.local.set({
            usage: { ...usage, sessionCount: (usage.sessionCount || 0) + 1 }
        });
    }
});
