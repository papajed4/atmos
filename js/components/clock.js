import { getSetting } from '../services/storageService.js';

let clockInterval = null;

export function startClock() {
    // Initial update
    updateClock();

    // Clear any existing interval (safety)
    if (clockInterval) clearInterval(clockInterval);

    // Update every second
    clockInterval = setInterval(updateClock, 1000);
}

export function refreshClock() {
    // Force an immediate update (used when time format changes)
    updateClock();
}

function updateClock() {
    const dateTime = document.getElementById('dateTime');
    if (!dateTime) return;

    const now = new Date();

    // Date part (always the same)
    const dateOptions = {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
    };
    const dateStr = now.toLocaleDateString('en-US', dateOptions);

    // Time part – format depends on setting
    const format = getSetting('timeFormat') || '12'; // default to 12h

    let timeOptions;
    if (format === '24') {
        timeOptions = {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        };
    } else {
        // 12‑hour format
        timeOptions = {
            hour: 'numeric',
            minute: '2-digit'
        };
        // The above will use the locale's default (usually 12h with AM/PM)
    }

    const timeStr = now.toLocaleTimeString('en-US', timeOptions);

    dateTime.textContent = `${dateStr} • ${timeStr}`;
}