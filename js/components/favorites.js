import { getFavorites, addFavorite, removeFavorite, setActiveCity, geocodeCity, getActiveCity } from '../services/cityService.js';
import { getWeather } from '../api/weatherApi.js';
import { updateWeatherUI } from './weatherDisplay.js';
import { renderForecast } from './forecast.js';
import { getCityName } from '../api/reverseGeocode.js';
import { showError } from './errorHandler.js'; // moved import to top

export function initializeFavorites() {
    const favoritesList = document.getElementById('favoritesList');
    const addBtn = document.getElementById('addCityBtn');
    const cityInput = document.getElementById('cityInput');

    // Render the list initially
    renderFavorites();

    // Add city on button click
    addBtn.addEventListener('click', async () => {
        const cityName = cityInput.value.trim();
        if (!cityName) return;

        // Geocode
        const cityData = await geocodeCity(cityName);
        if (!cityData) {
            alert('City not found. Please try again.');
            return;
        }

        const added = addFavorite(cityData);
        if (added) {
            cityInput.value = '';
            renderFavorites();
        } else {
            alert('City already in favorites.');
        }
    });

    // Allow pressing Enter in input field
    cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addBtn.click();
        }
    });
}

// Export renderFavorites so settingsPanel can call it
export function renderFavorites() {
    const favoritesList = document.getElementById('favoritesList');
    const favorites = getFavorites();
    const activeCity = getActiveCity();

    if (favorites.length === 0) {
        favoritesList.innerHTML = `
            <div class="favorites-empty">
                No favorite cities yet.
            </div>
        `;
        return;
    }

    let html = '';
    favorites.forEach((city, index) => {
        const isActive = activeCity && activeCity.latitude === city.latitude && activeCity.longitude === city.longitude;
        const activeClass = isActive ? 'favorite-item-active' : '';
        html += `
            <div class="favorite-item ${activeClass}" data-index="${index}">
                <span class="favorite-name">${city.name}</span>
                <div class="favorite-actions">
                    <button class="favorite-select-btn" data-index="${index}">
                        <i class="ri-check-line"></i>
                    </button>
                    <button class="favorite-remove-btn" data-index="${index}">
                        <i class="ri-close-line"></i>
                    </button>
                </div>
            </div>
        `;
    });

    favoritesList.innerHTML = html;

    // Attach event listeners to select and remove buttons
    favoritesList.querySelectorAll('.favorite-select-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(btn.dataset.index);
            selectFavorite(index);
        });
    });

    favoritesList.querySelectorAll('.favorite-remove-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const index = parseInt(btn.dataset.index);
            removeFavorite(index);
            // If the removed city was active, clear active city
            const active = getActiveCity();
            const favs = getFavorites();
            // If active city no longer in favorites, clear it
            if (active) {
                const stillExists = favs.some(f => f.latitude === active.latitude && f.longitude === active.longitude);
                if (!stillExists) {
                    setActiveCity(null);
                }
            }
            renderFavorites();
            // Optionally reload weather if active city cleared
            if (!getActiveCity()) {
                // We'll rely on the global refresh mechanism.
            }
        });
    });
}

function selectFavorite(index) {
    const favorites = getFavorites();
    const city = favorites[index];
    if (!city) return;

    // Set as active city
    setActiveCity(city);

    // Fetch weather for this city and update UI
    loadWeatherForCity(city);

    // Re-render to update active class
    renderFavorites();
}

async function loadWeatherForCity(city) {
    try {
        const weatherData = await getWeather(city.latitude, city.longitude);
        // Update city name
        document.getElementById('cityName').textContent = city.name;

        updateWeatherUI(weatherData.current);
        renderForecast(weatherData);

        // Store weather data for potential unit changes
        window.__weatherData = weatherData;
    } catch (error) {
        console.error('Failed to load weather for favorite city:', error);
        showError('Unable to load weather for this city.');
    }
}