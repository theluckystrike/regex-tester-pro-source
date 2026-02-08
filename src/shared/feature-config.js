// ==========================================================================
// Regex Tester Pro — Feature Value Matrix & Tier Configuration
// MD 03: Every feature scored across 5 dimensions, tier assignments enforced
// ==========================================================================

const FeatureConfig = (() => {
    'use strict';

    // ── Scoring Dimensions (from MD 03 framework) ──
    // Acquisition (25%), Habit (20%), Upgrade (25%), Differentiation (15%), Cost (15%)

    const FEATURES = {
        realtime_testing: {
            name: 'Real-time Regex Testing',
            scores: { acquisition: 10, habit: 10, upgrade: 1, differentiation: 3, cost: 10 },
            totalScore: 0, // calculated below
            tier: 'free',
            limit: null,
            description: 'Live match highlighting as you type'
        },
        flag_toggles: {
            name: 'Flag Toggles (g,i,m,s,u,y)',
            scores: { acquisition: 7, habit: 9, upgrade: 1, differentiation: 2, cost: 10 },
            tier: 'free',
            limit: null,
            description: 'One-click regex flag switching'
        },
        match_counter: {
            name: 'Match Counter + Positions',
            scores: { acquisition: 6, habit: 8, upgrade: 1, differentiation: 3, cost: 10 },
            tier: 'free',
            limit: null,
            description: 'Total matches with positions'
        },
        capture_groups: {
            name: 'Capture Group Viewer',
            scores: { acquisition: 7, habit: 7, upgrade: 2, differentiation: 4, cost: 10 },
            tier: 'free',
            limit: null,
            description: 'Named and numbered capture groups'
        },
        find_replace: {
            name: 'Find & Replace',
            scores: { acquisition: 6, habit: 6, upgrade: 2, differentiation: 3, cost: 10 },
            tier: 'free',
            limit: null,
            description: 'Regex-based string replacement'
        },
        cheatsheet: {
            name: 'Regex Cheatsheet',
            scores: { acquisition: 5, habit: 6, upgrade: 1, differentiation: 2, cost: 10 },
            tier: 'free',
            limit: null,
            description: 'Quick reference panel'
        },
        dark_mode: {
            name: 'Dark Mode',
            scores: { acquisition: 4, habit: 8, upgrade: 1, differentiation: 1, cost: 10 },
            tier: 'free',
            limit: null,
            description: 'System + manual theme toggle'
        },
        context_menu: {
            name: 'Context Menu Testing',
            scores: { acquisition: 6, habit: 7, upgrade: 2, differentiation: 7, cost: 10 },
            tier: 'free',
            limit: null,
            description: 'Right-click to test regex on selection'
        },
        pattern_history: {
            name: 'Pattern History',
            scores: { acquisition: 5, habit: 9, upgrade: 8, differentiation: 5, cost: 10 },
            tier: 'limited',
            limit: { free: 10, pro: Infinity, type: 'storage' },
            description: 'Save and recall recent patterns'
        },
        ai_generation: {
            name: 'AI Regex Generation',
            scores: { acquisition: 9, habit: 7, upgrade: 10, differentiation: 9, cost: 2 },
            tier: 'limited',
            limit: { free: 3, pro: Infinity, type: 'daily', resetPeriod: 'daily' },
            description: 'Natural language to regex'
        },
        multi_flavor: {
            name: 'Multi-Flavor Support',
            scores: { acquisition: 5, habit: 5, upgrade: 8, differentiation: 8, cost: 8 },
            tier: 'pro',
            limit: null,
            description: 'Python, Go, Java, PCRE, .NET engines'
        },
        code_generation: {
            name: 'Code Generation',
            scores: { acquisition: 4, habit: 4, upgrade: 7, differentiation: 7, cost: 5 },
            tier: 'pro',
            limit: null,
            description: 'Export regex as language-specific code'
        },
        redos_scanner: {
            name: 'ReDoS Vulnerability Scanner',
            scores: { acquisition: 3, habit: 3, upgrade: 6, differentiation: 10, cost: 8 },
            tier: 'pro',
            limit: null,
            description: 'Detect catastrophic backtracking'
        },
        export_patterns: {
            name: 'Export Pattern Library',
            scores: { acquisition: 2, habit: 3, upgrade: 6, differentiation: 5, cost: 10 },
            tier: 'pro',
            limit: null,
            description: 'JSON/CSV export of saved patterns'
        }
    };

    // Calculate weighted total scores
    const WEIGHTS = { acquisition: 0.25, habit: 0.20, upgrade: 0.25, differentiation: 0.15, cost: 0.15 };

    for (const [key, feature] of Object.entries(FEATURES)) {
        const s = feature.scores;
        feature.totalScore = Math.round(
            s.acquisition * WEIGHTS.acquisition +
            s.habit * WEIGHTS.habit +
            s.upgrade * WEIGHTS.upgrade +
            s.differentiation * WEIGHTS.differentiation +
            s.cost * WEIGHTS.cost
        );
    }

    // ── Tier checking ──
    function isFeatureAvailable(featureKey, isPro) {
        const feature = FEATURES[featureKey];
        if (!feature) return false;

        if (feature.tier === 'free') return true;
        if (feature.tier === 'pro') return isPro;
        if (feature.tier === 'limited') return true; // available but with limits
        return false;
    }

    function getFeatureLimit(featureKey, isPro) {
        const feature = FEATURES[featureKey];
        if (!feature || !feature.limit) return Infinity;
        return isPro ? feature.limit.pro : feature.limit.free;
    }

    function getProFeatures() {
        return Object.entries(FEATURES)
            .filter(([, f]) => f.tier === 'pro')
            .map(([key, f]) => ({ key, ...f }));
    }

    function getLimitedFeatures() {
        return Object.entries(FEATURES)
            .filter(([, f]) => f.tier === 'limited')
            .map(([key, f]) => ({ key, ...f }));
    }

    function getFreeFeatures() {
        return Object.entries(FEATURES)
            .filter(([, f]) => f.tier === 'free')
            .map(([key, f]) => ({ key, ...f }));
    }

    function getAllFeatures() {
        return Object.entries(FEATURES).map(([key, f]) => ({ key, ...f }));
    }

    return {
        FEATURES,
        WEIGHTS,
        isFeatureAvailable,
        getFeatureLimit,
        getProFeatures,
        getLimitedFeatures,
        getFreeFeatures,
        getAllFeatures
    };
})();
