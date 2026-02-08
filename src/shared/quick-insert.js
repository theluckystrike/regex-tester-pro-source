// ==========================================================================
// Regex Tester Pro — Quick Insert Palette
// Click-to-insert regex building blocks at the cursor position
// ==========================================================================

const QuickInsert = (() => {
    'use strict';

    const groups = [
        {
            title: 'Characters',
            items: [
                { label: 'Any char', insert: '.', desc: 'Match any character' },
                { label: 'Digit', insert: '\\d', desc: 'Digit 0-9' },
                { label: 'Non-digit', insert: '\\D', desc: 'Non-digit' },
                { label: 'Word', insert: '\\w', desc: 'Word character' },
                { label: 'Non-word', insert: '\\W', desc: 'Non-word' },
                { label: 'Space', insert: '\\s', desc: 'Whitespace' },
                { label: 'Non-space', insert: '\\S', desc: 'Non-whitespace' },
            ]
        },
        {
            title: 'Quantifiers',
            items: [
                { label: '0+', insert: '*', desc: 'Zero or more' },
                { label: '1+', insert: '+', desc: 'One or more' },
                { label: '0-1', insert: '?', desc: 'Optional' },
                { label: 'Lazy', insert: '*?', desc: 'Zero or more (lazy)' },
                { label: '{n}', insert: '{3}', desc: 'Exactly n times' },
                { label: '{n,m}', insert: '{1,5}', desc: 'Between n and m' },
            ]
        },
        {
            title: 'Anchors',
            items: [
                { label: 'Start ^', insert: '^', desc: 'Start of line' },
                { label: 'End $', insert: '$', desc: 'End of line' },
                { label: 'Word \\b', insert: '\\b', desc: 'Word boundary' },
            ]
        },
        {
            title: 'Groups',
            items: [
                { label: 'Group ()', insert: '()', desc: 'Capture group' },
                { label: 'Named', insert: '(?<name>)', desc: 'Named capture' },
                { label: 'Non-cap', insert: '(?:)', desc: 'Non-capturing' },
                { label: 'OR |', insert: '|', desc: 'Alternation' },
            ]
        },
        {
            title: 'Lookaround',
            items: [
                { label: 'Ahead +', insert: '(?=)', desc: 'Positive lookahead' },
                { label: 'Ahead -', insert: '(?!)', desc: 'Negative lookahead' },
                { label: 'Behind +', insert: '(?<=)', desc: 'Positive lookbehind' },
                { label: 'Behind -', insert: '(?<!)', desc: 'Negative lookbehind' },
            ]
        },
        {
            title: 'Common',
            items: [
                { label: 'Email', insert: '[\\w.+-]+@[\\w-]+\\.[\\w.]+', desc: 'Email pattern' },
                { label: 'URL', insert: 'https?://\\S+', desc: 'URL pattern' },
                { label: 'IPv4', insert: '\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}', desc: 'IP address' },
                { label: 'Hex', insert: '#[0-9a-fA-F]{3,8}', desc: 'Hex color' },
            ]
        }
    ];

    function getGroups() {
        return groups;
    }

    return { getGroups };
})();
