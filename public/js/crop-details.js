document.addEventListener('DOMContentLoaded', () => {
    // Get the main container element and the crop ID from the URL
    const detailsContainer = document.getElementById('details-container');
    const cropId = window.location.pathname.split('/').pop();

    // Function to fetch crop details and populate the page
    const loadCropDetails = async () => {
        try {
            const response = await fetch(`/api/crops/${cropId}`);
            if (!response.ok) throw new Error('Could not fetch crop data.');
            const crop = await response.json();

            document.title = crop.name; // Set the browser tab title to the crop's name.


            // Build HTML for Image Carousel 
            const images = [crop.coverImage, ...(crop.galleryImages || [])].filter(Boolean);
            const carouselHTML = images.length ? `
                <div class="swiper mySwiper mb-8 rounded-lg shadow-lg overflow-hidden bg-black"> 
                    <div class="swiper-wrapper">
                        ${images.map(img => `
                            <div class="swiper-slide bg-gray-200 flex items-center justify-center">
                                <!-- FIX: Changed object-cover to object-contain -->
                                <img src="${img}" alt="${crop.name}" class="w-full h-64 md:h-96 shadow-md object-contain">
                            </div>`).join('')}
                    </div>
                    <div class="swiper-button-next text-white"></div>
                    <div class="swiper-button-prev text-white"></div>
                    <div class="swiper-pagination"></div>
                </div>
            ` : '';

            
            // Build HTML for Growth Stages 
            const stagesHTML = (crop.growthStages && crop.growthStages.length > 0) ? `
                <div class="mt-8">
                    <h2 class="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2"> Developmental stages </h2>
                    <ul class="list-disc list-inside space-y-3 text-gray-700">
                        ${crop.growthStages.map(stage => `
                            <li>
                                <span class="font-semibold">${stage.stageName}:</span> ${stage.durationDays}
                            </li>
                        `).join('')}
                    </ul>
                </div>
            ` : '';
            

            // Build HTML for Fertilizers 
            const generalFertilizers = crop.fertilizerRecommendation?.general || [];
            const organicFertilizers = crop.fertilizerRecommendation?.organic || [];
            const fertilizersHTML = (generalFertilizers.length > 0 || organicFertilizers.length > 0) ? `
                <div class="mt-8">
                    <h2 class="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2"> Fertilizer recommendation </h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        ${generalFertilizers.length > 0 ? `
                            <div>
                                <h3 class="text-lg font-semibold text-gray-700 mb-2">General Fertilizers</h3>
                                <ul class="list-disc list-inside space-y-2">
                                    ${generalFertilizers.map(fert => `<li><strong>${fert.fertilizer}:</strong> ${fert.quantityPerAcre}</li>`).join('')}
                                </ul>
                            </div>` : ''}
                        ${organicFertilizers.length > 0 ? `
                            <div>
                                <h3 class="text-lg font-semibold text-gray-700 mb-2">Organic Fertilizers</h3>
                                <ul class="list-disc list-inside space-y-2">
                                    ${organicFertilizers.map(fert => `<li><strong>${fert.name}:</strong> ${fert.quantityPerAcre}</li>`).join('')}
                                </ul>
                            </div>` : ''}
                    </div>
                </div>
            ` : '';


            // Build HTML for Diseases 
            const diseasesHTML = (crop.diseases && crop.diseases.length > 0) ? `
                <div class="mt-8">
                    <h2 class="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2"> Disease management </h2>
                    <div class="space-y-6">
                        ${crop.diseases.map(disease => `
                            <div class="border border-gray-200 rounded-lg p-4 flex flex-col md:flex-row gap-6 bg-gray-50">
                                ${disease.image ? `
                                    <div class="md:w-1/3 flex-shrink-0">
                                        <img src="${disease.image}" alt="${disease.diseaseName}" class="rounded-lg object-cover w-full h-64 md:h-full shadow-md">
                                    </div>
                                ` : ''}
                                <div class="flex-grow">
                                    <h3 class="text-xl font-bold text-red-700">${disease.diseaseName}</h3>
                                    <p class="mt-3 text-sm"><strong> Symptoms:</strong> ${disease.symptoms}</p>
                                    <p class="mt-2 text-sm"><strong> Causes:</strong> ${disease.causes.join(', ')}</p>
                                    <div class="mt-3 pt-3 border-t grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                        <p><strong>Chemical:</strong> ${disease.chemicalControl || 'N/A'}</p>
                                        <p><strong>Organic:</strong> ${disease.organicControl || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : '';


            // Assemble the final HTML 
            detailsContainer.innerHTML = `
                ${carouselHTML}
                <div class="bg-white p-6 sm:p-8 rounded-xl shadow-lg">
                    <div class="border-b pb-4 mb-6">
                        <h1 class="text-4xl font-bold text-green-800">${crop.name}</h1>
                        <p class="text-lg text-gray-600 mt-2">
                            <strong> Sowing season:</strong> ${crop.sowingSeason} | <strong> Growth period:</strong> ${crop.growthDuration}
                        </p>
                    </div>
                    
                    ${stagesHTML}
                    ${fertilizersHTML}
                    ${diseasesHTML}
                </div>
            `;

            // Initialize Swiper Carousel 
            if (images.length) {
                new Swiper(".mySwiper", { 
                    loop: true,
                    autoplay: { delay: 3000, disableOnInteraction: false },
                    pagination: { el: ".swiper-pagination", clickable: true }, 
                    navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" } 
                });
            }

        } catch (error) {
            detailsContainer.innerHTML = `<p class="text-red-500 text-center font-bold">${error.message}</p>`;
        }
    };

    // Start the page load process 
    loadCropDetails();
});