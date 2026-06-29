import { quotes } from '../data/quotes.js';

export function initializeQuotes() {

    const quoteElement =
        document.getElementById('quote');

    function updateQuote() {

        const randomIndex = Math.floor(
            Math.random() * quotes.length
        );

        quoteElement.textContent =
            `"${quotes[randomIndex]}"`;

    }

    updateQuote();

    // Change quote every 3 minutes

    setInterval(updateQuote, 180000);

}