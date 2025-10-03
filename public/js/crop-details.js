document.addEventListener('DOMContentLoaded', () => {
    const detailsContainer = document.getElementById('details-container');
    const loadingMessage = document.getElementById('loading-message');

    // Get crop ID from URL
    const pathParts = window.location.pathname.split('/');
    const cropId = pathParts[pathParts.length - 1];

    // Fetch crop details from API
    const loadCropDetails = async () => {
        try {
            const response = await fetch(`/api/crops/${cropId}`);
            if (!response.ok) throw new Error('Error in fetching crop details.');            
            const crop = await response.json();

            loadingMessage.remove(); // Remove loading message

            document.title = crop.name; // Set page title to crop name
            

            // Image carousel
            let carouselHTML = '';
            const images = [];
            if (crop.coverImage) images.push(crop.coverImage);
            if (crop.galleryImages) images.push(...crop.galleryImages);

            if (images.length > 0) {
                carouselHTML = `
                    <div class="swiper mySwiper mb-8 rounded-lg shadow-lg">
                        <div class="swiper-wrapper">
                            ${images.map(imagePath => `
                                <div class="swiper-slide bg-gray-200">
                                    <img src="${imagePath}" alt="${crop.name}" class="w-full h-64 md:h-96 object-cover">
                                </div>
                            `).join('')}
                        </div>

                        <!-- Navigation Buttons -->
                        <div class="swiper-button-next text-white"></div>
                        <div class="swiper-button-prev text-white"></div>

                        <!-- Pagination Dots -->
                        <div class="swiper-pagination"></div>
                    </div>
                `;
            }
            
            let contentHTML = `
                ${carouselHTML}
            
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
            

            // Disease section with image support
            const diseasesHTML = crop.diseases.map(disease => `
                <div class="border border-red-200 rounded-lg p-4 flex flex-col sm:flex-row gap-4">
                    ${disease.image ? `
                        <div class="w-full sm:w-1/4">
                            <img src="${disease.image}" alt="${disease.diseaseName}" class="rounded-md object-cover w-full h-32">
                        </div>
                    ` : ''}
                    <div class="w-full ${disease.image ? 'sm:w-3/4' : ''}">
                        <h3 class="text-lg font-bold text-red-700">${disease.diseaseName}</h3>
                        <p class="mt-2 text-sm"><b class="font-semibold">Symptoms:</b> ${disease.symptoms}</p>
                        <p class="mt-1 text-sm"><b class="font-semibold">Reasons:</b> ${disease.causes.join(', ')}</p>
                        
                    </div>
                </div>
            `).join('');
           
            detailsContainer.innerHTML = contentHTML; // Update the innerHTML of the detailsContainer element with the new HTML content


            // Update disease section with image support
            detailsContainer.innerHTML = `
                ${carouselHTML}
                <div class="border-b pb-4 mb-6">
                    <h1 class="text-3xl sm:text-4xl font-bold text-green-800">${crop.name}</h1>
                    <p class="text-md text-gray-600 mt-2">Sowing season: ${crop.sowingSeason} | Growth period: ${crop.growthDuration}</p>
                </div>
                
                <div class="mt-8">
                    <h2 class="text-2xl font-semibold text-gray-700 mb-4">Disease management</h2>
                    <div class="space-y-4">${diseasesHTML}</div>
                </div>
            `;

            // Initialize Swiper
            if (images.length > 0) {
                new Swiper(".mySwiper", {
                    loop: true,
                    pagination: {
                        el: ".swiper-pagination",
                        clickable: true,
                    },
                    navigation: {
                        nextEl: ".swiper-button-next",
                        prevEl: ".swiper-button-prev",
                    },
                    autoplay: {
                        delay: 3000,
                        disableOnInteraction: false,
                    },
                });
            }

        
        } catch (error) {
            loadingMessage.textContent = `error: ${error.message}`;
            loadingMessage.className = 'text-center text-red-600 font-bold';
        }
    };

    loadCropDetails();



    const renderPriceChart = async () => {
        try {
            const response = await fetch(`/api/crops/${cropId}/price-analytics`) 
            if (!response.ok) return; // If there is no data, don't show graphs.
            const data = await response.json();
            
            // Create container HTML
            const chartContainerHTML = `
                <div class="mt-8">
                    <h2 class="text-2xl font-semibold text-gray-700 mb-4">Price analysis</h2>
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white p-6 rounded-lg shadow-md">
                        <div>
                            <h3 class="text-lg font-semibold text-center mb-2">Latest comparison (${new Date(data.latestPriceComparison[0].date).toLocaleDateString()})</h3>
                            <canvas id="priceComparisonChart"></canvas>
                        </div>
                        <div>
                            <h3 class="text-lg font-semibold text-center mb-2">Monthly average price trend</h3>
                            <canvas id="monthlyTrendChart"></canvas>
                        </div>
                    </div>
                </div>`;
            detailsContainer.insertAdjacentHTML('beforeend', chartContainerHTML);


            // Horizontal Bar Chart
            const ctx1 = document.getElementById('priceComparisonChart').getContext('2d');
            new Chart(ctx1, {
                type: 'bar',
                data: {
                    labels: data.latestPriceComparison.map(p => p.location),
                    datasets: [{
                        label: 'Price (Rs/kg)',
                        data: data.latestPriceComparison.map(p => p.price),
                        backgroundColor: ['#22c55e', '#f97316'],
                    }]
                },
                options: { indexAxis: 'y' } // This is what turns the map horizontally.
            });


            // Vertical Bar Chart
            const ctx2 = document.getElementById('monthlyTrendChart').getContext('2d');
            new Chart(ctx2, {
                type: 'bar',
                data: {
                    labels: data.monthlyTrend.map(m => m.month),
                    datasets: [{
                        label: 'Average Price (Rs/kg)',
                        data: data.monthlyTrend.map(m => m.averagePrice),
                        backgroundColor: '#166534',
                        borderColor: '#052e16',
                        borderWidth: 1
                    }]
                },
                options: { scales: { y: { beginAtZero: true } } }  // Ensures the Y axis starts at 0
                
            });

        } catch (error) {
            console.log("Unable to load price charts.");
        }

        // Initial load
        const loadPage = async () => {
            await loadCropDetails();
            await renderPriceChart(); 
        }  
    };
    loadPage();
});