import {
    saveSetting,
    getSetting
} from './storageService.js';


export function initializeTheme() {
    // Default to 'dark' for new visitors, or use saved preference
    const savedTheme = getSetting('theme') || 'dark';

    applyTheme(savedTheme);

    const radios = document.querySelectorAll('input[name="theme"]');
    radios.forEach(radio => {
        if (radio.value === savedTheme) {
            radio.checked = true;
        }
        radio.addEventListener('change', () => {
            applyTheme(radio.value);
            saveSetting('theme', radio.value);
        });
    });
}
function applyTheme(theme) {

    document.body.classList.remove(
        'morning-theme',
        'day-theme',
        'evening-theme',
        'night-theme'
    );


    if (theme === 'light') {

        document.body.classList.add(
            'day-theme'
        );

        return;

    }


    if (theme === 'dark') {

        document.body.classList.add(
            'night-theme'
        );

        return;

    }


    const hour =
        new Date().getHours();


    if (hour >= 5 && hour < 9) {

        document.body.classList.add(
            'morning-theme'
        );

    }

    else if (hour >= 9 && hour < 18) {

        document.body.classList.add(
            'day-theme'
        );

    }

    else if (hour >= 18 && hour < 20) {

        document.body.classList.add(
            'evening-theme'
        );

    }

    else {

        document.body.classList.add(
            'night-theme'
        );

    }

}