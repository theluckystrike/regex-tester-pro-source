// ==========================================================================
// Regex Tester Pro — Upgrade Prompt Rotation System
// MD 04 Agent 1 + Agent 5: Presell UX, prompt variations, frequency limiting
// ==========================================================================

const UpgradePrompts = (() => {
    'use strict';

    // Prompt variations (rotate to prevent banner blindness)
    const VARIATIONS = [
        {
            id: 'value_focus',
            headline: (stats) => `You've tested ${stats.totalTests || 0} patterns`,
            body: 'Pro members save 2+ hours/week with unlimited AI regex generation.',
            cta: 'See what Pro unlocks',
            type: 'value'
        },
        {
            id: 'social_focus',
            headline: () => 'Join 3,300+ Zovo members',
            body: 'Get Regex Tester Pro plus 8+ other dev tools for one price.',
            cta: 'Explore Zovo Pro',
            type: 'social'
        },
        {
            id: 'feature_focus_ai',
            headline: () => 'Unlock Unlimited AI Generation',
            body: 'Generate any regex from plain English, as many times as you need.',
            cta: 'Try Zovo Pro',
            type: 'feature'
        },
        {
            id: 'feature_focus_flavor',
            headline: () => 'Test in Python, Go, Java & More',
            body: 'Multi-flavor regex support for fullstack developers.',
            cta: 'Unlock All Engines',
            type: 'feature'
        },
        {
            id: 'milestone',
            headline: (stats) => `${stats.totalTests || 0}+ patterns tested — you're a power user`,
            body: 'Unlock advanced features designed for developers like you.',
            cta: 'Go Pro',
            type: 'milestone'
        }
    ];

    // Timing rules (MD 04 Agent 5)
    const RULES = {
        maxPromptsPerSession: 1,
        cooldownMinutes: 60,
        minSessionsBeforeFirstPrompt: 3,
        neverInterruptActiveWork: true
    };

    let shownThisSession = 0;

    async function shouldShowPrompt() {
        if (shownThisSession >= RULES.maxPromptsPerSession) return false;

        const { upgradePromptState } = await chrome.storage.local.get('upgradePromptState');
        const state = upgradePromptState || { lastShown: 0, totalShown: 0, dismissed: 0 };

        // Cooldown check
        if (Date.now() - state.lastShown < RULES.cooldownMinutes * 60000) return false;

        // Minimum sessions check
        const { usage } = await chrome.storage.local.get('usage');
        if ((usage?.sessionCount || 0) < RULES.minSessionsBeforeFirstPrompt) return false;

        return true;
    }

    function getNextPrompt(stats) {
        // Rotate through variations
        const index = (stats.totalTests || 0) % VARIATIONS.length;
        const variation = VARIATIONS[index];
        return {
            ...variation,
            headline: variation.headline(stats)
        };
    }

    async function markShown() {
        shownThisSession++;
        const { upgradePromptState } = await chrome.storage.local.get('upgradePromptState');
        const state = upgradePromptState || { lastShown: 0, totalShown: 0, dismissed: 0 };
        state.lastShown = Date.now();
        state.totalShown++;
        await chrome.storage.local.set({ upgradePromptState: state });
    }

    async function markDismissed() {
        const { upgradePromptState } = await chrome.storage.local.get('upgradePromptState');
        const state = upgradePromptState || { lastShown: 0, totalShown: 0, dismissed: 0 };
        state.dismissed++;
        await chrome.storage.local.set({ upgradePromptState: state });
    }

    // Natural trigger moments (MD 04 Agent 1)
    const TRIGGER_MOMENTS = {
        afterTaskComplete: 'after_task',      // After successful regex test
        usageMilestone: 'milestone',          // 10th, 25th, 50th test
        settingsExploration: 'settings',      // While browsing settings
        returnAfterAbsence: 'reengagement',   // First visit after 3+ days
        softLimitHit: 'soft_limit'            // Near history or AI limit
    };

    function isMilestone(count) {
        return [10, 25, 50, 100, 250, 500].includes(count);
    }

    return {
        VARIATIONS,
        RULES,
        TRIGGER_MOMENTS,
        shouldShowPrompt,
        getNextPrompt,
        markShown,
        markDismissed,
        isMilestone
    };
})();
