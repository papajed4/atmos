export function startClock() {

    const dateTime = document.getElementById('dateTime');

    function updateClock() {

        const now = new Date();

        const options = {
            weekday: 'long',
            month: 'long',
            day: 'numeric'
        };

        const date = now.toLocaleDateString(
            'en-US',
            options
        );

        const time = now.toLocaleTimeString(
            'en-US',
            {
                hour: 'numeric',
                minute: '2-digit'
            }
        );

        dateTime.textContent = `${date} • ${time}`;
    }

    updateClock();

    setInterval(updateClock, 1000);
}