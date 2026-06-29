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

    try {

        const location =
            await getUserLocation();

        const weatherData =
            await getWeather(
                location.latitude,
                location.longitude
            );

        const city =
            await getCityName(
                location.latitude,
                location.longitude
            );

        document.getElementById(
            'cityName'
        ).textContent = city;

        updateWeatherUI(
            weatherData.current
        );

        renderForecast(weatherData);

        setTimeout(() => {

            loadingScreen.classList.add(
                'hide'
            );

        }, 1500);

    }

    catch (error) {

        console.error(error);

        if (
            error.message.includes(
                'Location'
            )
        ) {

            showError(
                'Location permission denied'
            );

        }

        else {

            showError(
                'Unable to load weather'
            );

        }

        loadingScreen.classList.add(
            'hide'
        );

    }

    setTimeout(() => {

        loadingScreen.classList.add('hide');

    }, 1500);

});