const loadingScreen = document.getElementById('loadingScreen');

import { showError } from './components/errorHandler.js';
import { startClock } from './components/clock.js';
import { getUserLocation } from './services/geolocation.js';
import { getWeather } from './api/weatherApi.js';
import { updateWeatherUI } from './components/weatherDisplay.js';
import { getCityName } from './api/reverseGeocode.js';
import { initializeFullscreen } from './services/fullscreen.js';
import { initializeTheme } from './services/themeService.js';
import { initializeSettingsPanel } from './components/settingsPanel.js';
import { initializeTemperatureSettings } from './components/temperatureSettings.js';
import { initializeGlassEffect } from './components/glassEffect.js';
import { initializeDynamicBackground } from './components/dynamicBackground.js';
import { renderForecast } from './components/forecast.js';
import { initializeQuotes } from './components/quotes.js';
import { initializeGreeting } from './components/greeting.js';
import { initializeTimeFormat } from './components/timeFormatSettings.js';
import { initializeFavorites } from './components/favorites.js';
import { getActiveCity } from './services/cityService.js';
import { initializeAmbientSound } from './components/ambientSound.js';

document.addEventListener('DOMContentLoaded', async () => {

    startClock();

    initializeGreeting();

    initializeTheme();

    initializeFullscreen();

    initializeSettingsPanel();

    initializeTemperatureSettings();

    initializeGlassEffect();

    initializeDynamicBackground();

    initializeQuotes();

    initializeTimeFormat();

    initializeFavorites();

    initializeAmbientSound();

    try {
        let location;
        let cityName;

        // Check for active favorite city
        const activeCity = getActiveCity();
        if (activeCity) {
            location = {
                latitude: activeCity.latitude,
                longitude: activeCity.longitude
            };
            cityName = activeCity.name;
        } else {
            // Fallback: use geolocation
            location = await getUserLocation();
            // Reverse geocode to get city name
            cityName = await getCityName(location.latitude, location.longitude);
        }

        const weatherData = await getWeather(location.latitude, location.longitude);

        // Store globally for later use (e.g., temperature unit change, favorites)
        window.__weatherData = weatherData;
        window.__cityName = cityName;

        document.getElementById('cityName').textContent = cityName;
        updateWeatherUI(weatherData.current);
        renderForecast(weatherData);

        // Hide loading screen after a short delay for smooth transition
        setTimeout(() => {
            loadingScreen.classList.add('hide');
        }, 1500);

    } catch (error) {
        console.error(error);

        if (error.message && error.message.includes('Location')) {
            showError('Location permission denied');
        } else {
            showError('Unable to load weather');
        }

        // Hide loading screen even on error
        loadingScreen.classList.add('hide');
    }

});