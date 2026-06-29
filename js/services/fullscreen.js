export function initializeFullscreen() {

    const fullscreenBtn =
        document.getElementById('fullscreenBtn');

    const fullscreenIcon =
        fullscreenBtn.querySelector('i');


    fullscreenBtn.addEventListener('click', () => {

        if (!document.fullscreenElement) {

            document.documentElement.requestFullscreen();

            fullscreenIcon.classList.remove(
                'ri-fullscreen-line'
            );

            fullscreenIcon.classList.add(
                'ri-fullscreen-exit-line'
            );

        } else {

            document.exitFullscreen();

            fullscreenIcon.classList.remove(
                'ri-fullscreen-exit-line'
            );

            fullscreenIcon.classList.add(
                'ri-fullscreen-line'
            );

        }

    });


    document.addEventListener('fullscreenchange', () => {

        if (!document.fullscreenElement) {

            fullscreenIcon.classList.remove(
                'ri-fullscreen-exit-line'
            );

            fullscreenIcon.classList.add(
                'ri-fullscreen-line'
            );

        }

    });

    document.addEventListener('fullscreenchange', () => {

        if (document.fullscreenElement) {

            document.body.classList.add(
                'fullscreen-mode'
            );

        } else {

            document.body.classList.remove(
                'fullscreen-mode'
            );

        }

    });

}