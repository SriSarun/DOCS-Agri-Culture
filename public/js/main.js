document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements (compare-related elements are removed)
    const container = document.getElementById('crop-list-container');
    const searchBox = document.getElementById('search-box');
    const seasonFilter = document.getElementById('season-filter');
    const durationFilter = document.getElementById('duration-filter');


    // Debounce helper function (remains the same)
    let debounceTimer;
    const debounce = (func, delay) => {
        return function(...args) {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => func.apply(this, args), delay);
        };
    };



    // Function to populate filter dropdowns (remains the same)
    const populateFilters = async () => {
        try {
            const response = await fetch('/api/crops/filters');
            const options = await response.json();
            options.seasons.forEach(s => seasonFilter.add(new Option(s, s)));
            options.durations.forEach(d => durationFilter.add(new Option(d, d)));
        } catch (error) { console.error('Filters loading error:', error); }
    };


    // Function to load and display crops
    const loadCrops = async () => {
        const params = new URLSearchParams();
        if (searchBox.value) params.append('search', searchBox.value);
        if (seasonFilter.value) params.append('season', seasonFilter.value);
        if (durationFilter.value) params.append('duration', durationFilter.value);
        
        try {
            const response = await fetch(`/api/crops?${params.toString()}`);
            const crops = await response.json();
            container.innerHTML = ''; // Clear previous results
            if (crops.length === 0) {
                container.innerHTML = '<p class="col-span-full text-center text-gray-500"> No suitable crops found..</p>';
                return;
            }
            crops.forEach(crop => {
                // REMOVED: The checkbox and the surrounding div are gone.
                // It's now a simple, single link card.
                const cropCard = `
                    <a href="/crops/${crop._id}" class="block bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
                        <div class="p-5">
                            <h2 class="text-xl font-bold text-green-800">${crop.name}</h2>
                            <p class="text-gray-600 mt-2"><strong> Sowing season :</strong> ${crop.sowingSeason || 'N/A'}</p>
                            <p class="text-gray-600"><strong> Growth period:</strong> ${crop.growthDuration || 'N/A'}</p>
                        </div>
                    </a>`;
                container.insertAdjacentHTML('beforeend', cropCard);
            });
        } catch (error) { 
            console.error('Crops loading error:', error);
            container.innerHTML = `<p class="col-span-full text-center text-red-600">error: ${error.message}</p>`;
        }
    };

    // Event listeners for search and filters (remains the same)
    searchBox.addEventListener('input', debounce(loadCrops, 400));
    seasonFilter.addEventListener('change', loadCrops);
    durationFilter.addEventListener('change', loadCrops);

    // Initial page load
    populateFilters();
    loadCrops();
});