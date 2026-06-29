import { getSetting, saveSetting } from './storageService.js';

const FAVORITES_KEY = 'favorites';
const ACTIVE_CITY_KEY = 'activeCity';

// Geocode a city name using Nominatim search
export async function geocodeCity(cityName) {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cityName)}&format=json&limit=1`
        );
        const data = await response.json();
        if (data && data.length > 0) {
            return {
                name: data[0].display_name,
                latitude: parseFloat(data[0].lat),
                longitude: parseFloat(data[0].lon)
            };
        }
        return null;
    } catch (error) {
        console.error('Geocoding error:', error);
        return null;
    }
}

// Get favorites list
export function getFavorites() {
    return getSetting(FAVORITES_KEY) || [];
}

// Save favorites list
export function saveFavorites(favorites) {
    saveSetting(FAVORITES_KEY, favorites);
}

// Add a city to favorites (if not already present)
export function addFavorite(city) {
    const favorites = getFavorites();
    // Check if already exists (by coordinates)
    const exists = favorites.some(f => f.latitude === city.latitude && f.longitude === city.longitude);
    if (!exists) {
        favorites.push(city);
        saveFavorites(favorites);
        return true;
    }
    return false;
}

// Remove a city from favorites by index
export function removeFavorite(index) {
    const favorites = getFavorites();
    favorites.splice(index, 1);
    saveFavorites(favorites);
}

// Get active city
export function getActiveCity() {
    return getSetting(ACTIVE_CITY_KEY) || null;
}

// Set active city (null means use geolocation)
export function setActiveCity(city) {
    if (city) {
        saveSetting(ACTIVE_CITY_KEY, city);
    } else {
        localStorage.removeItem(ACTIVE_CITY_KEY);
    }
}