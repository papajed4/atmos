export function showError(message) {

    document.getElementById(
        'temperature'
    ).textContent = '--';

    document.getElementById(
        'weatherCondition'
    ).textContent = message;

    document.getElementById(
        'cityName'
    ).textContent =
        'Atmos';

    document.getElementById(
        'humidity'
    ).textContent = '--';

    document.getElementById(
        'windSpeed'
    ).textContent = '--';

    document.getElementById(
        'uvIndex'
    ).textContent = '--';

}

document.getElementById( 'quote' ).textContent = '"Enable location access to experience Atmos."';