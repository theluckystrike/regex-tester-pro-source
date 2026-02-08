// ==========================================================================
// Regex Tester Pro — Performance & Optimization Module
// MD 04 Agent 2: Debounce, storage caching, lazy loading
// ==========================================================================

const Performance = (() => {
    'use strict';

    // ── Debounce (used for regex engine to prevent excessive re-runs) ──
    function debounce(fn, delay = 100) {
        let timer;
        return function (...args) {
            clearTimeout(timer);
            timer = setTimeout(() => fn.apply(this, args), delay);
        };
    }

    // ── Throttle (used for scroll events) ──
    function throttle(fn, limit = 16) {
        let lastCall = 0;
        return function (...args) {
            const now = Date.now();
            if (now - lastCall >= limit) {
                lastCall = now;
                fn.apply(this, args);
            }
        };
    }

    // ── Storage Cache (minimize chrome.storage reads) ──
    const _cache = new Map();
    const CACHE_TTL = 60000; // 1 minute

    async function cachedGet(key) {
        const cached = _cache.get(key);
        if (cached && Date.now() - cached.time < CACHE_TTL) {
            return cached.value;
        }
        const result = await chrome.storage.local.get(key);
        _cache.set(key, { value: result[key], time: Date.now() });
        return result[key];
    }

    function invalidateCache(key) {
        if (key) {
            _cache.delete(key);
        } else {
            _cache.clear();
        }
    }

    // ── DOM batch updates ──
    function batchDOM(updates) {
        requestAnimationFrame(() => {
            updates.forEach(fn => fn());
        });
    }

    // ── Lazy element initialization ──
    const _initialized = new Set();

    function lazyInit(elementId, initFn) {
        if (_initialized.has(elementId)) return;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    initFn(entry.target);
                    _initialized.add(elementId);
                    observer.disconnect();
                }
            });
        });
        const el = document.getElementById(elementId);
        if (el) observer.observe(el);
    }

    // ── Performance timing ──
    function measure(label, fn) {
        const start = performance.now();
        const result = fn();
        const duration = performance.now() - start;
        if (duration > 16) {
            console.warn(`[Perf] ${label}: ${duration.toFixed(1)}ms (> 16ms frame budget)`);
        }
        return result;
    }

    async function measureAsync(label, fn) {
        const start = performance.now();
        const result = await fn();
        const duration = performance.now() - start;
        if (duration > 100) {
            console.warn(`[Perf] ${label}: ${duration.toFixed(1)}ms (> 100ms target)`);
        }
        return result;
    }

    return {
        debounce,
        throttle,
        cachedGet,
        invalidateCache,
        batchDOM,
        lazyInit,
        measure,
        measureAsync
    };
})();
