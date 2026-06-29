import { updateWeatherUI } from './weatherDisplay.js';
import { renderForecast } from './forecast.js';

import {
    saveSetting,
    getSetting
} from '../services/storageService.js';

export function initializeTemperatureSettings() {

    const select =
        document.getElementById(
            'temperatureUnit'
        );

    const savedUnit =
        getSetting('temperatureUnit')
        || 'celsius';

    select.value = savedUnit;

    select.addEventListener('change', () => {
        saveSetting('temperatureUnit', select.value);

        // If we have stored weather data, refresh the UI without reloading
        if (window.__weatherData) {
            updateWeatherUI(window.__weatherData.current);
            renderForecast(window.__weatherData);
        }
    });

}