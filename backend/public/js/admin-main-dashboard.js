document.addEventListener('DOMContentLoaded', () => {
    const totalCropsStatElement = document.getElementById('total-crops-stat');


    // Function to fetch and display the total number of crops
     const loadStats = async () => {
        // Initially show a loading indicator.
        if (totalCropsStatElement) {
            totalCropsStatElement.textContent = '...';
        }

        try {
            // Call our new API endpoint.
            const response = await fetch('/api/stats/totals');
            if (!response.ok) {
                throw new Error('Could not load stats.');
            }
            
            const stats = await response.json();

            // Update the text content of the paragraph with the fetched count.
            if (totalCropsStatElement) {
                totalCropsStatElement.textContent = stats.totalCrops;
            }

        } catch (error) {
            console.error('Error loading dashboard stats:', error);
            if (totalCropsStatElement) {
                totalCropsStatElement.textContent = 'Error'; // Show an error message in the card.
            }
        }
    };

    // Call the function when the page loads.
    loadStats();

});