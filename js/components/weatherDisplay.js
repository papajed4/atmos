import {
    getSetting
} from '../services/storageService.js';

export function updateWeatherUI(weather) {

    const unit =
        getSetting('temperatureUnit')
        || 'celsius';

    let temperature =
        weather.temperature_2m;

    if (unit === 'fahrenheit') {

        temperature =
            (temperature * 9 / 5) + 32;

    }

    const symbol =
        unit === 'fahrenheit'
            ? 'F'
            : 'C';

    document.getElementById(
        'temperature'
    ).textContent =
        `${Math.round(temperature)}°${symbol}`;

    document.getElementById('humidity').textContent =
        `${weather.relative_humidity_2m}%`;

    document.getElementById('windSpeed').textContent =
        `${weather.wind_speed_10m} km/h`;

    document.getElementById('uvIndex').textContent =
        '--';

    const weatherInfo = getWeatherInfo(
        weather.weather_code
    );

    if (
        !document.body.classList.contains(
            'dynamic-bg-disabled'
        )
    ) {

        updateWeatherBackground(
            weather.weather_code
        );

    }

    document.getElementById('weatherCondition').textContent =
        weatherInfo.condition;

    document.getElementById('weatherIcon').className =
        weatherInfo.icon;

}


function getWeatherInfo(code) {

    const weatherMap = {

        0: {
            condition: 'Clear Sky',
            icon: 'ri-sun-line'
        },

        1: {
            condition: 'Mainly Clear',
            icon: 'ri-sun-cloudy-line'
        },

        2: {
            condition: 'Partly Cloudy',
            icon: 'ri-cloudy-line'
        },

        3: {
            condition: 'Overcast',
            icon: 'ri-cloudy-2-line'
        },

        45: {
            condition: 'Foggy',
            icon: 'ri-mist-line'
        },

        48: {
            condition: 'Foggy',
            icon: 'ri-mist-line'
        },

        51: {
            condition: 'Light Drizzle',
            icon: 'ri-drizzle-line'
        },

        61: {
            condition: 'Rain',
            icon: 'ri-rainy-line'
        },

        63: {
            condition: 'Moderate Rain',
            icon: 'ri-rainy-line'
        },

        65: {
            condition: 'Heavy Rain',
            icon: 'ri-heavy-showers-line'
        },

        71: {
            condition: 'Snow',
            icon: 'ri-snowy-line'
        },

        80: {
            condition: 'Rain Showers',
            icon: 'ri-showers-line'
        },

        95: {
            condition: 'Thunderstorm',
            icon: 'ri-thunderstorms-line'
        }

    };

    return weatherMap[code] || {
        condition: 'Unknown',
        icon: 'ri-cloud-line'
    };

}

function updateWeatherBackground(code) {

    document.body.classList.remove(
        'sunny',
        'cloudy',
        'rainy',
        'stormy',
        'foggy',
        'snowy'
    );

    if (code === 0) {

        document.body.classList.add('sunny');

    }

    else if ([1, 2, 3].includes(code)) {

        document.body.classList.add('cloudy');

    }

    else if ([45, 48].includes(code)) {

        document.body.classList.add('foggy');

    }

    else if (
        [51, 53, 55, 61, 63, 65, 80].includes(code)
    ) {

        document.body.classList.add('rainy');

    }

    else if (code === 71) {

        document.body.classList.add('snowy');

    }

    else if (code === 95) {

        document.body.classList.add('stormy');

    }

}