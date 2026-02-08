// ==========================================================================
// Regex Tester Pro — ReDoS Performance Analyzer
// Detects dangerous patterns that could cause catastrophic backtracking
// ==========================================================================

const PerfAnalyzer = (() => {
    'use strict';

    // Patterns that indicate potential ReDoS vulnerability
    const dangerPatterns = [
        {
            // Nested quantifiers like (a+)+ or (a*)*
            re: /\([^)]*[+*][^)]*\)[+*]/,
            severity: 'danger',
            label: 'Nested quantifiers detected',
            tip: 'Patterns like (a+)+ cause exponential backtracking. Use atomic groups or possessive quantifiers.'
        },
        {
            // Overlapping alternation with quantifiers like (a|a)+
            re: /\([^)]*\|[^)]*\)[+*]/,
            severity: 'warning',
            label: 'Quantified alternation',
            tip: 'Alternation inside a quantified group can cause excessive backtracking if branches overlap.'
        },
        {
            // Repeated groups with wildcards like (.*).*
            re: /\.\*.*\.\*/,
            severity: 'warning',
            label: 'Multiple greedy wildcards',
            tip: 'Multiple .* segments force the engine to try many permutations. Consider making one lazy (.*?) or anchoring.'
        },
        {
            // Star height > 1: quantifier applied to group containing quantifier
            re: /\([^)]*\{[^}]+\}[^)]*\)[+*{]/,
            severity: 'danger',
            label: 'Repeated group with inner quantifier',
            tip: 'A quantified group containing quantifiers creates exponential complexity.'
        },
        {
            // Catastrophic: (\w+\s*)+ or similar
            re: /\(\\?[wdsSbB][+*][^)]*\)[+*]/,
            severity: 'danger',
            label: 'Character class with quantifier inside quantified group',
            tip: 'This pattern is a classic ReDoS vector. Refactor to avoid nesting quantifiers.'
        },
        {
            // Very long alternation chains
            re: /(\|[^|)]+){10,}/,
            severity: 'info',
            label: 'Long alternation chain',
            tip: 'Many alternatives slow matching. Consider combining into a character class if possible.'
        },
        {
            // Backtracking-prone lookahead with quantifier
            re: /\(\?[=!][^)]*[+*][^)]*\).*[+*]/,
            severity: 'warning',
            label: 'Lookahead with quantifier before repeated content',
            tip: 'Lookaheads combined with quantifiers can multiply backtracking paths.'
        }
    ];

    function analyze(pattern) {
        if (!pattern || typeof pattern !== 'string') {
            return { score: 'safe', label: 'Safe', issues: [], color: '#22c55e' };
        }

        const issues = [];

        for (const dp of dangerPatterns) {
            if (dp.re.test(pattern)) {
                issues.push({
                    severity: dp.severity,
                    label: dp.label,
                    tip: dp.tip
                });
            }
        }

        // Length-based complexity warning
        if (pattern.length > 200) {
            issues.push({
                severity: 'info',
                label: 'Very long pattern (' + pattern.length + ' chars)',
                tip: 'Long patterns may be harder to maintain. Consider breaking into named groups or using comments.'
            });
        }

        // Determine overall score
        const hasDanger = issues.some(i => i.severity === 'danger');
        const hasWarning = issues.some(i => i.severity === 'warning');

        if (hasDanger) {
            return { score: 'danger', label: 'Dangerous', issues, color: '#ef4444', icon: '🔴' };
        } else if (hasWarning) {
            return { score: 'warning', label: 'Caution', issues, color: '#f59e0b', icon: '🟡' };
        } else if (issues.length > 0) {
            return { score: 'info', label: 'OK', issues, color: '#06b6d4', icon: '🔵' };
        } else {
            return { score: 'safe', label: 'Safe', issues: [], color: '#22c55e', icon: '🟢' };
        }
    }

    // Quick benchmark - time the regex against test string
    function benchmark(pattern, flags, testString) {
        if (!pattern || !testString) return null;

        try {
            const re = new RegExp(pattern, flags);
            const iterations = 100;
            const start = performance.now();
            for (let i = 0; i < iterations; i++) {
                re.exec(testString);
                re.lastIndex = 0;
            }
            const elapsed = performance.now() - start;
            const avgMs = elapsed / iterations;

            let speed;
            if (avgMs < 0.1) speed = 'lightning';
            else if (avgMs < 1) speed = 'fast';
            else if (avgMs < 10) speed = 'moderate';
            else if (avgMs < 100) speed = 'slow';
            else speed = 'critical';

            return { avgMs: Math.round(avgMs * 100) / 100, speed, iterations };
        } catch {
            return null;
        }
    }

    return { analyze, benchmark };
})();
