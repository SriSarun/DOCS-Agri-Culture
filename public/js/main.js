document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('crop-list-container');
    const searchBox = document.getElementById('search-box');
    const seasonFilter = document.getElementById('season-filter');
    const durationFilter = document.getElementById('duration-filter');

    let debounceTimer;
    const debounce = (func, delay) => {
        return function (...args) {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                func.apply(this, args);
            }, delay);
        };
    };

    // Populate filters from the backend
    const populateFilters = async () => {
        try {
            const response = await fetch('/api/crops/filters');
            const options = await response.json();

            options.seasons.forEach(season => {
                const option = document.createElement('option');
                option.value = season;
                option.textContent = season;
                seasonFilter.appendChild(option);
            });
            options.durations.forEach(duration => {
                const option = document.createElement('option');
                option.value = duration;
                option.textContent = duration;
                durationFilter.appendChild(option);
            });
        } catch (error) {
            console.error('Error fetching filters:', error);
        }
    };

    // Fetch and display crops based on filters and search
    const loadCrops = async () => {
        const params = new URLSearchParams();
        if (searchBox.value) params.append('search', searchBox.value);
        if (seasonFilter.value) params.append('season', seasonFilter.value);
        if (durationFilter.value) params.append('duration', durationFilter.value);

        const queryString = params.toString();
        const url = `/api/crops${queryString ? `?${queryString}` : ''}`;

        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('An error occurred while retrieving the data.');
            }

            const crops = await response.json();
            container.innerHTML = '';

            if (crops.length === 0) {
                container.innerHTML = '<p class="col-span-full text-center text-gray-500">There are no crops to show.</p>';
                return;
            }

            // Create Card
            crops.forEach(crop => {
                const cropCard = `
                    <a href="/crops/${crop._id}" class="block bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
                        <div class="p-5">
                            <h2 class="text-xl font-bold text-green-800">${crop.name}</h2>
                            <p class="text-gray-600 mt-2"><strong>Gestation period:</strong> ${crop.sowingSeason || 'N/A'}</p>
                            <p class="text-gray-600"><strong>Growth period:</strong> ${crop.growthDuration || 'N/A'}</p>
                        </div>
                    </a>
                `;
                container.insertAdjacentHTML('beforeend', cropCard);
            });
        } catch (error) {
            container.innerHTML = `<p class="col-span-full text-center text-red-600">error: ${error.message}</p>`;
        }
    };

    
    const debouncedLoadCrops = debounce(loadCrops, 400);

    searchBox.addEventListener('input', debouncedLoadCrops);
    seasonFilter.addEventListener('change', loadCrops);
    durationFilter.addEventListener('change', loadCrops);

    populateFilters();
    loadCrops();
});