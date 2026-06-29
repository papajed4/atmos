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

    select.addEventListener(
        'change',
        () => {

            saveSetting(
                'temperatureUnit',
                select.value
            );

            window.location.reload();

        }
    );

}