import { getSetting } from '../services/storageService.js';

export function formatTemperature(celsius, includeSymbol = true) {
    // Safety check
    if (typeof celsius !== 'number' || isNaN(celsius)) {
        return '--';
    }

    const unit = getSetting('temperatureUnit') || 'celsius';
    let temp = celsius;
    let symbol = 'C';

    if (unit === 'fahrenheit') {
        temp = (celsius * 9 / 5) + 32;
        symbol = 'F';
    }

    const rounded = Math.round(temp);
    return includeSymbol ? `${rounded}°${symbol}` : rounded;
}