export function renderForecast(data) {

    const forecastList =
        document.getElementById(
            'forecastList'
        );

    forecastList.innerHTML = '';

    const days =
        data.daily.time;

    days.forEach((day, index) => {

        const date =
            new Date(day);

        const dayName =
            index === 0
                ? 'Today'
                : date.toLocaleDateString(
                    'en-US',
                    { weekday: 'short' }
                );

        const icon =
            getForecastIcon(
                data.daily.weather_code[index]
            );

        const max =
            Math.round(
                data.daily.temperature_2m_max[index]
            );

        const min =
            Math.round(
                data.daily.temperature_2m_min[index]
            );

        const item =
            document.createElement('div');

        item.className =
            'forecast-item';

        item.innerHTML = `

            <span class="forecast-day">
                ${dayName}
            </span>

            <i class="${icon} forecast-icon"></i>

            <span class="forecast-temp">
                ${max}° / ${min}°
            </span>

        `;

        forecastList.appendChild(item);

    });

}


function getForecastIcon(code) {

    if (code === 0)
        return 'ri-sun-line';

    if ([1,2,3].includes(code))
        return 'ri-cloudy-line';

    if ([45,48].includes(code))
        return 'ri-mist-line';

    if ([51,61,63,65,80].includes(code))
        return 'ri-rainy-line';

    if (code === 95)
        return 'ri-thunderstorms-line';

    return 'ri-cloud-line';

}