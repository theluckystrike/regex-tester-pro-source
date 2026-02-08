// ==========================================================================
// Regex Tester Pro — Regex Explainer
// Real-time plain-English breakdown of regex patterns
// ==========================================================================

const RegexExplainer = (() => {
    'use strict';

    const tokenPatterns = [
        // Anchors
        { re: /^\^/, desc: '^ — Start of string (or line with m flag)' },
        { re: /^\$/, desc: '$ — End of string (or line with m flag)' },
        { re: /^\\b/, desc: '\\b — Word boundary' },
        { re: /^\\B/, desc: '\\B — Non-word boundary' },

        // Character classes
        { re: /^\\d/, desc: '\\d — Any digit [0-9]' },
        { re: /^\\D/, desc: '\\D — Any non-digit' },
        { re: /^\\w/, desc: '\\w — Any word character [A-Za-z0-9_]' },
        { re: /^\\W/, desc: '\\W — Any non-word character' },
        { re: /^\\s/, desc: '\\s — Any whitespace (space, tab, newline)' },
        { re: /^\\S/, desc: '\\S — Any non-whitespace' },
        { re: /^\\n/, desc: '\\n — Newline character' },
        { re: /^\\t/, desc: '\\t — Tab character' },
        { re: /^\\r/, desc: '\\r — Carriage return' },
        { re: /^\./, desc: '. — Any character (except newline)' },

        // Backreferences
        { re: /^\\(\d+)/, desc: (m) => `\\${m[1]} — Backreference to group ${m[1]}` },

        // Named groups
        { re: /^\(\?<(\w+)>/, desc: (m) => `(?<${m[1]}> — Start named capture group "${m[1]}"` },

        // Lookahead / lookbehind
        { re: /^\(\?=/, desc: '(?= — Positive lookahead (followed by...)' },
        { re: /^\(\?!/, desc: '(?! — Negative lookahead (NOT followed by...)' },
        { re: /^\(\?<=/, desc: '(?<= — Positive lookbehind (preceded by...)' },
        { re: /^\(\?<!/, desc: '(?<! — Negative lookbehind (NOT preceded by...)' },

        // Non-capturing group
        { re: /^\(\?:/, desc: '(?: — Non-capturing group (group without capturing)' },

        // Capturing group
        { re: /^\(/, desc: '( — Start capturing group' },
        { re: /^\)/, desc: ') — End group' },

        // Character class (bracket expression)
        {
            re: /^\[(\^?)((?:[^\]\\]|\\.)*)?\]/, desc: function (m) {
                const negated = m[1] === '^';
                const content = m[2] || '';
                return `[${m[1]}${content}] — ${negated ? 'Any character NOT in' : 'Any character in'}: ${content || 'set'}`;
            }
        },

        // Quantifiers
        { re: /^\{(\d+),(\d+)\}(\??)/, desc: (m) => `{${m[1]},${m[2]}}${m[3]} — Between ${m[1]} and ${m[2]} times${m[3] ? ' (lazy)' : ''}` },
        { re: /^\{(\d+),\}(\??)/, desc: (m) => `{${m[1]},}${m[2]} — ${m[1]} or more times${m[2] ? ' (lazy)' : ''}` },
        { re: /^\{(\d+)\}/, desc: (m) => `{${m[1]}} — Exactly ${m[1]} times` },
        { re: /^\*\?/, desc: '*? — 0 or more times (lazy/non-greedy)' },
        { re: /^\+\?/, desc: '+? — 1 or more times (lazy/non-greedy)' },
        { re: /^\?\?/, desc: '?? — 0 or 1 time (lazy/non-greedy)' },
        { re: /^\*/, desc: '* — 0 or more times (greedy)' },
        { re: /^\+/, desc: '+ — 1 or more times (greedy)' },
        { re: /^\?/, desc: '? — 0 or 1 time (optional)' },

        // Alternation
        { re: /^\|/, desc: '| — OR (alternation)' },

        // Escaped special characters
        { re: /^\\([.*+?^${}()|[\]\\\/])/, desc: (m) => `\\${m[1]} — Literal "${m[1]}" character` },

        // Unicode property escapes
        { re: /^\\p\{([^}]+)\}/i, desc: (m) => `\\p{${m[1]}} — Unicode property: ${m[1]}` },

        // Literal character
        { re: /^(.)/, desc: (m) => `${m[1]} — Literal "${m[1]}"` },
    ];

    function explain(pattern) {
        if (!pattern || typeof pattern !== 'string') return [];

        const explanations = [];
        let remaining = pattern;
        let safety = 0;

        while (remaining.length > 0 && safety < 200) {
            safety++;
            let matched = false;

            for (const token of tokenPatterns) {
                const match = remaining.match(token.re);
                if (match) {
                    const text = typeof token.desc === 'function' ? token.desc(match) : token.desc;
                    explanations.push({
                        token: match[0],
                        description: text
                    });
                    remaining = remaining.slice(match[0].length);
                    matched = true;
                    break;
                }
            }

            if (!matched) {
                // Skip unrecognized character
                explanations.push({
                    token: remaining[0],
                    description: `${remaining[0]} — Literal character`
                });
                remaining = remaining.slice(1);
            }
        }

        return explanations;
    }

    return { explain };
})();
