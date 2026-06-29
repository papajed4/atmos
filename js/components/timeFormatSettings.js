import { saveSetting, getSetting } from '../services/storageService.js';
import { refreshClock } from './clock.js';

export function initializeTimeFormat() {
    const select = document.getElementById('timeFormatSelect');
    if (!select) return;

    // Load saved preference, default to '12' (12‑hour)
    const savedFormat = getSetting('timeFormat') || '12';
    select.value = savedFormat;

    // Update clock immediately based on saved format
    refreshClock();

    // Listen for changes
    select.addEventListener('change', () => {
        const format = select.value;
        saveSetting('timeFormat', format);
        refreshClock(); // update clock display instantly
    });
}