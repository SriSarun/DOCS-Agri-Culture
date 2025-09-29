document.addEventListener('DOMContentLoaded', () => {
    const detailsContainer = document.getElementById('details-container');
    const loadingMessage = document.getElementById('loading-message');

    
    const pathParts = window.location.pathname.split('/');
    const cropId = pathParts[pathParts.length - 1];

    const loadCropDetails = async () => {
        try {
            const response = await fetch(`/api/crops/${cropId}`);
            if (!response.ok) {
                throw new Error('Error in fetching crop details.');
            }
            const crop = await response.json();

           
            loadingMessage.remove();
            
           
            document.title = crop.name;

            
            let contentHTML = `
                <div class="border-b pb-4 mb-6">
                    <h1 class="text-3xl sm:text-4xl font-bold text-green-800">${crop.name}</h1>
                    <p class="text-md text-gray-600 mt-2">Gestation period: ${crop.sowingSeason} | Growth period: ${crop.growthDuration}</p>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                        <h2 class="text-2xl font-semibold text-gray-700 mb-3">Stages of development</h2>
                        <ul class="list-disc list-inside space-y-2">
                            ${crop.growthStages.map(stage => `<li><b>${stage.stageName}:</b> ${stage.durationDays} Days </li>`).join('')}
                        </ul>
                    </div>
                    
                   
                    <div>
                        <h2 class="text-2xl font-semibold text-gray-700 mb-3">Fertilizer recommendation</h2>
                        <div class="bg-gray-50 p-4 rounded-lg">
                            <h3 class="font-bold mb-2">Common fertilizers:</h3>
                            <ul class="list-disc list-inside space-y-1 text-sm">
                                ${crop.fertilizerRecommendation.general.map(f => `<li><b>${f.fertilizer}:</b> ${f.quantityPerAcre}</li>`).join('')}
                            </ul>
                            <h3 class="font-bold mt-4 mb-2">Natural fertilizers:</h3>
                             <ul class="list-disc list-inside space-y-1 text-sm">
                                ${crop.fertilizerRecommendation.organic.map(f => `<li><b>${f.name}:</b> ${f.quantityPerAcre}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                </div>

                
                <div class="mt-8">
                    <h2 class="text-2xl font-semibold text-gray-700 mb-4">Disease management</h2>
                    <div class="space-y-4">
                        ${crop.diseases.map(disease => `
                            <div class="border border-red-200 rounded-lg p-4">
                                <h3 class="text-lg font-bold text-red-700">${disease.diseaseName}</h3>
                                <p class="mt-2 text-sm"><b class="font-semibold">Symptoms:</b> ${disease.symptoms}</p>
                                <p class="mt-1 text-sm"><b class="font-semibold">Reasons:</b> ${disease.causes.join(', ')}</p>
                                <div class="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                                    <p><b class="font-semibold">Chemical method:</b> ${disease.chemicalControl}</p>
                                    <p><b class="font-semibold">Natural method:</b> ${disease.organicControl}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
            
           
            detailsContainer.innerHTML = contentHTML;

        } catch (error) {
            loadingMessage.textContent = `error: ${error.message}`;
            loadingMessage.className = 'text-center text-red-600 font-bold';
        }
    };

    loadCropDetails();
});