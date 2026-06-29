export function initializeSettingsPanel() {

    const settingsBtn =
        document.getElementById('settingsBtn');

    const closeBtn =
        document.getElementById('closeSettingsBtn');

    const settingsPanel =
        document.getElementById('settingsPanel');

    const overlay =
        document.getElementById('overlay');


    function openPanel() {

        settingsPanel.classList.add('active');

        overlay.classList.add('active');

        document.body.style.overflow = 'hidden';

    }


    function closePanel() {

        settingsPanel.classList.remove('active');

        overlay.classList.remove('active');

        document.body.style.overflow = '';

    }


    settingsBtn.addEventListener(
        'click',
        openPanel
    );

    closeBtn.addEventListener(
        'click',
        closePanel
    );

    overlay.addEventListener(
        'click',
        closePanel
    );


    document.addEventListener(
        'keydown',
        (event) => {

            if (
                event.key === 'Escape' &&
                settingsPanel.classList.contains('active')
            ) {

                closePanel();

            }

        }
    );

}