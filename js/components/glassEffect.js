import {
    saveSetting,
    getSetting
} from '../services/storageService.js';

export function initializeGlassEffect() {

    const toggle =
        document.getElementById(
            'glassEffectToggle'
        );

    const savedValue =
        getSetting('glassEffect');

    // Default = ON
    const isEnabled =
        savedValue !== null
            ? savedValue
            : true;

    toggle.checked = isEnabled;

    updateGlassEffect(isEnabled);

    toggle.addEventListener(
        'change',
        () => {

            updateGlassEffect(
                toggle.checked
            );

            saveSetting(
                'glassEffect',
                toggle.checked
            );

        }
    );

}


function updateGlassEffect(enabled) {

    if (enabled) {

        document.body.classList.remove(
            'glass-disabled'
        );

    }

    else {

        document.body.classList.add(
            'glass-disabled'
        );

    }

}