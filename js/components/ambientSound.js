import { getSetting, saveSetting } from '../services/storageService.js';

// Map weather codes to sound types
const SOUND_MAP = {
    clear: 'calm',
    cloudy: 'calm',
    foggy: 'calm',
    rainy: 'rain',
    stormy: 'storm',
    snowy: 'calm' // or 'snow' if you have the file
};

// Weather code -> type mapping function
function getSoundType(weatherCode) {
    if ([0].includes(weatherCode)) return 'calm';
    if ([1,2,3].includes(weatherCode)) return 'calm';
    if ([45,48].includes(weatherCode)) return 'calm';
    if ([51,53,55,61,63,65,80].includes(weatherCode)) return 'rain';
    if ([95].includes(weatherCode)) return 'storm';
    if ([71].includes(weatherCode)) return 'calm'; // snow
    return 'calm';
}

const audioElements = {};
let currentSoundType = null;
let isEnabled = true;
let volume = 0.5;

export function initializeAmbientSound() {
    // Load saved settings
    const savedEnabled = getSetting('ambientSoundEnabled');
    isEnabled = savedEnabled !== null ? savedEnabled : true;
    const savedVolume = getSetting('ambientVolume');
    volume = savedVolume !== null ? savedVolume : 0.5;

    // Set up UI controls
    const toggle = document.getElementById('ambientSoundToggle');
    const volumeSlider = document.getElementById('ambientVolume');
    const volumeLabel = document.getElementById('volumeLabel');

    if (toggle) {
        toggle.checked = isEnabled;
        toggle.addEventListener('change', () => {
            isEnabled = toggle.checked;
            saveSetting('ambientSoundEnabled', isEnabled);
            updateSoundState();
        });
    }

    if (volumeSlider) {
        volumeSlider.value = volume;
        if (volumeLabel) {
            volumeLabel.textContent = Math.round(volume * 100) + '%';
        }
        volumeSlider.addEventListener('input', () => {
            volume = parseFloat(volumeSlider.value);
            saveSetting('ambientVolume', volume);
            if (volumeLabel) {
                volumeLabel.textContent = Math.round(volume * 100) + '%';
            }
            updateAllVolumes();
        });
    }

    // Preload audio elements for each sound type
    const soundTypes = ['calm', 'rain', 'storm', 'wind']; // we don't have wind yet, but we map it later
    soundTypes.forEach(type => {
        const audio = new Audio();
        audio.loop = true;
        audio.preload = 'auto';
        audio.src = `./assets/sounds/${type}.mp3`;
        audio.volume = volume;
        // If file fails to load, we just keep it silent
        audio.addEventListener('error', () => {
            console.warn(`Ambient sound file "${type}.mp3" not found.`);
        });
        audioElements[type] = audio;
    });

    // If weather data is already loaded, set the sound based on it
    if (window.__weatherData && window.__weatherData.current) {
        const code = window.__weatherData.current.weather_code;
        const type = getSoundType(code);
        currentSoundType = type;
        updateSoundState();
    }
}

// Call this function whenever weather updates
export function updateAmbientSound(weatherCode) {
    const type = getSoundType(weatherCode);
    if (currentSoundType !== type) {
        currentSoundType = type;
        updateSoundState();
    }
}

function updateSoundState() {
    // Pause all
    Object.values(audioElements).forEach(a => a.pause());
    // If disabled or no current type, stop
    if (!isEnabled || !currentSoundType) {
        return;
    }
    const audio = audioElements[currentSoundType];
    if (audio) {
        audio.volume = volume;
        audio.play().catch(e => console.warn('Playback failed:', e));
    }
}

function updateAllVolumes() {
    Object.values(audioElements).forEach(a => a.volume = volume);
}