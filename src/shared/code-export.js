// ==========================================================================
// Regex Tester Pro — Code Export Generator
// Generate copy-ready regex code in multiple programming languages
// ==========================================================================

const CodeExport = (() => {
    'use strict';

    const languages = [
        { id: 'javascript', name: 'JavaScript', icon: '🟨' },
        { id: 'python', name: 'Python', icon: '🐍' },
        { id: 'java', name: 'Java', icon: '☕' },
        { id: 'php', name: 'PHP', icon: '🐘' },
        { id: 'go', name: 'Go', icon: '🔵' },
        { id: 'ruby', name: 'Ruby', icon: '💎' },
        { id: 'csharp', name: 'C#', icon: '🟣' },
        { id: 'rust', name: 'Rust', icon: '🦀' },
    ];

    function generate(pattern, flags, lang) {
        const esc = pattern.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/"/g, '\\"');

        switch (lang) {
            case 'javascript':
                return `// JavaScript\nconst regex = /${pattern}/${flags};\nconst matches = text.match(regex);\nconsole.log(matches);`;

            case 'python':
                const pyFlags = [];
                if (flags.includes('i')) pyFlags.push('re.IGNORECASE');
                if (flags.includes('m')) pyFlags.push('re.MULTILINE');
                if (flags.includes('s')) pyFlags.push('re.DOTALL');
                const pyFlagStr = pyFlags.length ? ', ' + pyFlags.join(' | ') : '';
                return `# Python\nimport re\n\npattern = r"${pattern}"\nmatches = re.findall(pattern, text${pyFlagStr})\nprint(matches)`;

            case 'java':
                const javaFlags = [];
                if (flags.includes('i')) javaFlags.push('Pattern.CASE_INSENSITIVE');
                if (flags.includes('m')) javaFlags.push('Pattern.MULTILINE');
                if (flags.includes('s')) javaFlags.push('Pattern.DOTALL');
                const javaFlagStr = javaFlags.length ? ', ' + javaFlags.join(' | ') : '';
                return `// Java\nimport java.util.regex.*;\n\nPattern pattern = Pattern.compile("${esc}"${javaFlagStr});\nMatcher matcher = pattern.matcher(text);\nwhile (matcher.find()) {\n    System.out.println(matcher.group());\n}`;

            case 'php':
                const phpFlags = flags.replace('g', '');
                return `// PHP\n$pattern = '/${pattern}/${phpFlags}';\npreg_match_all($pattern, $text, $matches);\nprint_r($matches[0]);`;

            case 'go':
                return `// Go\nimport "regexp"\n\nre := regexp.MustCompile(\`${pattern}\`)\nmatches := re.FindAllString(text, -1)\nfmt.Println(matches)`;

            case 'ruby':
                const rbFlags = [];
                if (flags.includes('i')) rbFlags.push('i');
                if (flags.includes('m')) rbFlags.push('m');
                const rbFlagStr = rbFlags.join('');
                return `# Ruby\npattern = /${pattern}/${rbFlagStr}\nmatches = text.scan(pattern)\nputs matches`;

            case 'csharp':
                const csFlags = [];
                if (flags.includes('i')) csFlags.push('RegexOptions.IgnoreCase');
                if (flags.includes('m')) csFlags.push('RegexOptions.Multiline');
                if (flags.includes('s')) csFlags.push('RegexOptions.Singleline');
                const csFlagStr = csFlags.length ? ', ' + csFlags.join(' | ') : '';
                return `// C#\nusing System.Text.RegularExpressions;\n\nvar regex = new Regex(@"${pattern}"${csFlagStr});\nvar matches = regex.Matches(text);\nforeach (Match m in matches)\n    Console.WriteLine(m.Value);`;

            case 'rust':
                return `// Rust\nuse regex::Regex;\n\nlet re = Regex::new(r"${pattern}").unwrap();\nfor cap in re.find_iter(&text) {\n    println!("{}", cap.as_str());\n}`;

            default:
                return `// ${lang}\n// Pattern: ${pattern}\n// Flags: ${flags}`;
        }
    }

    function getLanguages() {
        return languages;
    }

    return { generate, getLanguages };
})();
