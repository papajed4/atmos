export function showError(message) {
    // ---------- Main weather ----------
    document.getElementById('temperature').textContent = '--';
    document.getElementById('weatherCondition').textContent = message;
    document.getElementById('cityName').textContent = 'Atmos';
    document.getElementById('weatherIcon').className = 'ri-cloud-line'; // neutral icon

    // ---------- Stats ----------
    document.getElementById('humidity').textContent = '--';
    document.getElementById('windSpeed').textContent = '--';
    document.getElementById('uvIndex').textContent = '--';

    // ---------- Background / effects ----------
    // Remove all weather‑state classes so the background reverts to the current theme's default
    document.body.classList.remove(
        'sunny', 'cloudy', 'rainy', 'stormy', 'foggy', 'snowy'
    );

    // ---------- Forecast ----------
    // Clear the forecast list and show a friendly message
    document.getElementById('forecastList').innerHTML = `
        <div class="forecast-item" style="opacity:0.6; justify-content:center; width:100%; text-align:center;">
            Forecast unavailable
        </div>
    `;

    // ---------- Quote ----------
    // Set a relevant quote for the error state
    document.getElementById('quote').textContent = 
        '"Enable location access to experience Atmos."';
}

// The default quote is now set inside showError(), but we keep it here
// as a fallback if showError is called with no message? Not needed.