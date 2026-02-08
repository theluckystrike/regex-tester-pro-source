# Regex Tester Pro by Zovo

> Open-source Chrome extension for testing, debugging, and generating regular expressions.

This repository contains the complete source code for **Regex Tester Pro**, published on the [Chrome Web Store](https://chrome.google.com/webstore). We believe in full transparency. Every line of code that runs in the extension is right here for you to inspect.

## What This Extension Does

- Tests regex patterns against text with real-time match highlighting
- Generates regex from plain English descriptions using AI
- Exports regex as code in 8 programming languages
- Explains regex patterns token by token in plain English
- Analyzes patterns for ReDoS vulnerabilities
- Works 100% offline after installation

## Privacy and Security

**This extension collects zero data.** Here is exactly what it does and does not do.

**Does NOT**
- Send any data to external servers
- Track usage, analytics, or telemetry
- Access browsing history or page content
- Execute any remote code
- Use eval() or dynamic code generation

**Does**
- Store your settings and saved patterns locally using chrome.storage
- Use the context menu API to let you right-click and test regex on selected text
- Use alarms API to check Pro license status once daily (optional, only if you upgrade)

## Permissions Explained

| Permission | Why |
|------------|-----|
| `storage` | Saves settings, pattern history, and saved patterns on your device |
| `activeTab` | Lets the context menu read selected text from the current page |
| `contextMenus` | Adds "Test with Regex Tester Pro" to right-click menu |
| `alarms` | Checks Pro license validity once per day (only if upgraded) |

## Content Security Policy

The extension enforces a strict CSP that prevents any inline scripts or remote code execution.

```json
"content_security_policy": {
    "extension_pages": "script-src 'self'; object-src 'self';"
}
```

## File Structure

```
manifest.json              Extension manifest (Manifest V3)
assets/icons/              Extension icons (16, 32, 48, 128px)
src/popup/popup.html       Main popup UI
src/popup/popup.css        Styles
src/popup/popup.js         Core application logic
src/background/            Service worker for context menu
src/shared/                Shared modules (regex engine, export, samples, etc.)
```

## How to Verify

1. Clone this repo
2. Open `chrome://extensions` in Chrome
3. Enable "Developer mode"
4. Click "Load unpacked" and select this folder
5. The extension will load from source — identical to the published version

## Built by Zovo

Part of the [Zovo](https://zovo.one) developer tools family.

## License

MIT
