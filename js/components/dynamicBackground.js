import {
    saveSetting,
    getSetting
} from '../services/storageService.js';


export function initializeDynamicBackground() {

    const toggle =
        document.getElementById(
            'dynamicBackgroundToggle'
        );

    const savedValue =
        getSetting('dynamicBackground');

    // Default = ON
    const isEnabled =
        savedValue !== null
            ? savedValue
            : true;

    toggle.checked = isEnabled;

    updateDynamicBackground(isEnabled);

    toggle.addEventListener(
        'change',
        () => {

            updateDynamicBackground(
                toggle.checked
            );

            saveSetting(
                'dynamicBackground',
                toggle.checked
            );

        }
    );

}


function updateDynamicBackground(enabled) {

    if (enabled) {

        document.body.classList.remove(
            'dynamic-bg-disabled'
        );

    }

    else {

        document.body.classList.add(
            'dynamic-bg-disabled'
        );

    }

}