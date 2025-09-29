document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('crop-list-container');
    const loadingMessage = document.getElementById('loading-message');

    const loadCrops = async () => {
        try {
            const response = await fetch('/api/crops');

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
           
            loadingMessage.textContent = `error: ${error.message}`;
            loadingMessage.className = 'col-span-full text-center text-red-600 font-bold';
        }
    };

    
    loadCrops();
});