export async function getWeather(latitude, longitude) {

    try {

        const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,uv_index&daily=weather_code,temperature_2m_max,temperature_2m_min&forecast_days=5&timezone=auto`
        );

        const data = await response.json();

        return data;

    }

    catch (error) {

        console.error('Weather Error:', error);

    }

}