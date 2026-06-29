export function initializeGreeting() {

    const greeting =
        document.getElementById('greeting');

    function updateGreeting() {

        const hour =
            new Date().getHours();

        let message = '';

        /*
        ================================================

        CHANGE THIS NAME ANYTIME 😂

        Examples:

        const userName = 'Jed';
        const userName = 'Human';
        const userName = 'Builder';
        const userName = 'Legend';
        const userName = 'Sleep Deprived Developer';

        ================================================
        */

        const userName = 'Jed';

        if (hour >= 5 && hour < 12) {

            message =
                `Good Morning, ${userName}`;

        }

        else if (hour >= 12 && hour < 18) {

            message =
                `Good Afternoon, ${userName}`;

        }

        else {

            message =
                `Good Evening, ${userName}`;

        }

        greeting.textContent = message;

    }

    updateGreeting();

    // Update every minute

    setInterval(updateGreeting, 60000);

}