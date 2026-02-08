// ==========================================================================
// Regex Tester Pro — Local Analytics
// Agent 4: Usage tracking (local-first, privacy-safe)
// ==========================================================================

const Analytics = (() => {
    'use strict';

    const EVENTS_KEY = 'analytics_events';
    const MAX_EVENTS = 200;

    async function track(eventName, properties = {}) {
        try {
            const { analytics_events: events = [] } = await chrome.storage.local.get(EVENTS_KEY);

            events.push({
                event: eventName,
                properties,
                timestamp: Date.now(),
                version: chrome.runtime.getManifest().version
            });

            // Cap events
            const trimmed = events.slice(-MAX_EVENTS);
            await chrome.storage.local.set({ [EVENTS_KEY]: trimmed });
        } catch (e) {
            // Silently fail — analytics should never break the app
        }
    }

    async function incrementTests() {
        await Storage.incrementTests();
    }

    async function getEvents() {
        const { analytics_events: events = [] } = await chrome.storage.local.get(EVENTS_KEY);
        return events;
    }

    async function getSummary() {
        const events = await getEvents();
        const usage = await Storage.getUsage();

        return {
            totalTests: usage.totalTests,
            totalEvents: events.length,
            aiUsageToday: usage.aiUsageToday,
            sessionCount: usage.sessionCount,
            topEvents: countByKey(events, 'event')
        };
    }

    function countByKey(arr, key) {
        const counts = {};
        arr.forEach(item => {
            counts[item[key]] = (counts[item[key]] || 0) + 1;
        });
        return counts;
    }

    return { track, incrementTests, getEvents, getSummary };
})();
