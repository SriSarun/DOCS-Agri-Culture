document.addEventListener('DOMContentLoaded', () => {
    const detailsContainer = document.getElementById('details-container');
    const cropId = window.location.pathname.split('/').pop();

    
    let priceComparisonChart, monthlyTrendChart;
    let currentChartType = 'bar';
    let monthlyTrendData = null;

    
    const renderPriceCharts = async (startDate = '', endDate = '') => {
        try {
            // Build the API URL with optional date filter query parameters.
            const params = new URLSearchParams();
            if (startDate) params.append('startDate', startDate);
            if (endDate) params.append('endDate', endDate);
            
            const response = await fetch(`/api/crops/${cropId}/price-analytics?${params.toString()}`);
            
            // If the response is not OK (e.g., 404 Not Found, meaning no price data),
            // remove the chart section if it exists and stop execution.
            if (!response.ok) {
                const existingContainer = document.getElementById('charts-section');
                if (existingContainer) existingContainer.remove();
                return;
            }
            
            const data = await response.json();
            monthlyTrendData = data.monthlyTrend; // Cache the fetched data.

            // Dynamically create the HTML structure for the entire charts section.
            const chartContainerHTML = `
                <div class="mt-8" id="charts-section">
                    <h2 class="text-2xl font-semibold text-gray-700 mb-4">Price Analysis</h2>
                    
                    <!-- Date Range Filter Form -->
                    <div class="bg-white p-4 rounded-lg shadow-md mb-6 flex flex-col sm:flex-row items-center gap-4">
                        <input type="date" id="startDate" class="flex-1 w-full p-2 border rounded-md">
                        <input type="date" id="endDate" class="flex-1 w-full p-2 border rounded-md">
                        <button id="filter-btn" class="bg-green-700 text-white font-bold py-2 px-6 rounded-lg">Filter</button>
                    </div>

                    <!-- Grid container for the two charts -->
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white p-6 rounded-lg shadow-md">
                        <div>
                            <h3 class="text-lg font-semibold text-center mb-2">Latest Price Comparison</h3>
                            <canvas id="priceComparisonChart"></canvas>
                        </div>
                        <div>
                            <div class="flex justify-between items-center mb-2">
                                <h3 class="text-lg font-semibold">Monthly Trend</h3>
                                <div id="chart-type-toggle" class="flex border rounded-md p-1">
                                    <button data-chart-type="bar" class="chart-toggle-btn active px-2 py-1 text-xs">Bar</button>
                                    <button data-chart-type="line" class="chart-toggle-btn px-2 py-1 text-xs">Line</button>
                                </div>
                            </div>
                            <canvas id="monthlyTrendChart"></canvas>
                        </div>
                    </div>
                </div>`;
            
            // If the charts section already exists from a previous render (e.g., after filtering), remove it first.
            const existingContainer = document.getElementById('charts-section');
            if (existingContainer) existingContainer.remove();
            
            // Insert the newly created HTML into the main details container.
            detailsContainer.insertAdjacentHTML('beforeend', chartContainerHTML);

            // Call the helper functions to actually draw the charts on the new canvas elements.
            drawComparisonChart(data.latestPriceComparison);
            drawMonthlyTrendChart();

        } catch (error) {
            console.error("Could not load price charts:", error);
        }
    };

    
    const drawComparisonChart = (data) => {
        // If a chart instance already exists, destroy it to prevent memory leaks and rendering issues.
        if (priceComparisonChart) priceComparisonChart.destroy();
        const ctx = document.getElementById('priceComparisonChart').getContext('2d');
        priceComparisonChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.map(p => p.location), // e.g., ['Market', 'Shop']
                datasets: [{
                    label: 'Price (₹/kg)',
                    data: data.map(p => p.price), // e.g., [34, 40]
                    backgroundColor: ['#22c55e', '#f97316'] // Green for market, Orange for shop
                }]
            },
            options: {
                indexAxis: 'y', // This makes the bar chart horizontal.
                responsive: true
            }
        });
    };

    const drawMonthlyTrendChart = () => {
        if (!monthlyTrendData) return; // Don't do anything if data hasn't been fetched.
        if (monthlyTrendChart) monthlyTrendChart.destroy(); // Destroy old chart instance.

        const ctx = document.getElementById('monthlyTrendChart').getContext('2d');
        // Specific styling options for the line chart.
        const lineOptions = {
            backgroundColor: 'rgba(22, 101, 52, 0.2)', // Light green area fill
            borderColor: '#166534', // Dark green line
            tension: 0.1, // Makes the line slightly curved
            fill: true
        };
        
        monthlyTrendChart = new Chart(ctx, {
            type: currentChartType, // Use the global variable ('bar' or 'line').
            data: {
                labels: monthlyTrendData.map(m => m.month), // e.g., ['2024-06', '2024-07']
                datasets: [{
                    label: 'Average Price (₹/kg)',
                    data: monthlyTrendData.map(m => m.averagePrice),
                    // Use a ternary operator to apply the correct styling based on the chart type.
                    ...(currentChartType === 'line' ? lineOptions : { backgroundColor: '#166534' })
                }]
            },
            options: {
                responsive: true,
                scales: { y: { beginAtZero: false } } // Start y-axis based on data, not always at 0.
            }
        });
    };

    
    const loadCropDetails = async () => {
        try {
            const response = await fetch(`/api/crops/${cropId}`);
            if (!response.ok) throw new Error('Could not fetch crop data.');
            const crop = await response.json();

            document.title = crop.name; // Set the browser tab title.

            // Combine cover image and gallery images into a single array for the carousel.
            const images = [crop.coverImage, ...(crop.galleryImages || [])].filter(Boolean);
            
            // Build the Swiper.js carousel HTML only if there are images.
            const carouselHTML = images.length ? `
                <div class="swiper mySwiper mb-8 rounded-lg shadow-lg">
                    <div class="swiper-wrapper">
                        ${images.map(img => `
                            <div class="swiper-slide bg-gray-200">
                                <img src="${img}" alt="${crop.name}" class="w-full h-64 md:h-96 object-cover">
                            </div>`).join('')}
                    </div>
                    <div class="swiper-button-next"></div>
                    <div class="swiper-button-prev"></div>
                    <div class="swiper-pagination"></div>
                </div>` : '';
            
            // Build the HTML for the diseases section, including disease images.
            const diseasesHTML = (crop.diseases || []).map(disease => `
                <div class="border border-red-200 rounded-lg p-4 flex flex-col sm:flex-row gap-4">
                    ${disease.image ? `
                        <div class="w-full sm:w-1/4">
                            <img src="${disease.image}" alt="${disease.diseaseName}" class="rounded-md object-cover w-full h-32">
                        </div>
                    ` : ''}
                    <div class="w-full ${disease.image ? 'sm:w-3/4' : ''}">
                        <h3 class="text-lg font-bold text-red-700">${disease.diseaseName}</h3>
                        <p class="mt-2 text-sm"><strong>Symptoms:</strong> ${disease.symptoms}</p>
                        <p class="mt-1 text-sm"><strong>Causes:</strong> ${disease.causes.join(', ')}</p>
                    </div>
                </div>
            `).join('');

            // Assemble the final HTML for the details section.
            detailsContainer.innerHTML = `
                ${carouselHTML}
                <div class="bg-white p-6 sm:p-8 rounded-lg shadow-md">
                    <h1 class="text-3xl font-bold text-green-800 border-b pb-4">${crop.name}</h1>
                    <div class="mt-4">
                        <h2 class="text-2xl font-semibold mb-3">Disease Management</h2>
                        <div class="space-y-4">${diseasesHTML}</div>
                    </div>
                    <!-- Other sections like Growth Stages, Fertilizers can be added here -->
                </div>
            `;

            // If images were found, initialize the Swiper carousel.
            if (images.length) {
                new Swiper(".mySwiper", { 
                    loop: true, 
                    pagination: { el: ".swiper-pagination", clickable: true }, 
                    navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" }
                });
            }
        } catch (error) {
            detailsContainer.innerHTML = `<p class="text-red-500 text-center font-bold">${error.message}</p>`;
        }
    };

    
    const setupEventListeners = () => {
        detailsContainer.addEventListener('click', (event) => {
            // Handler for the date filter button
            if (event.target.id === 'filter-btn') {
                const startDate = document.getElementById('startDate').value;
                const endDate = document.getElementById('endDate').value;
                if (startDate && endDate) {
                    renderPriceCharts(startDate, endDate); // Re-render charts with the selected date range.
                } else {
                    alert('Please select both a start and end date.');
                }
            }
            // Handler for the chart type toggle buttons
            const toggleBtn = event.target.closest('.chart-toggle-btn');
            if (toggleBtn) {
                const newType = toggleBtn.dataset.chartType;
                if (newType !== currentChartType) {
                    currentChartType = newType;
                    drawMonthlyTrendChart(); // Redraw only the monthly chart with the new type.
                    // Update the active button's style.
                    document.querySelectorAll('.chart-toggle-btn').forEach(btn => btn.classList.remove('active'));
                    toggleBtn.classList.add('active');
                }
            }
        });
    };

   
    const loadPage = async () => {
        await loadCropDetails();  // First, load the main crop info.
        await renderPriceCharts(); // Then, load the price charts.
        setupEventListeners();    // Finally, set up the event listeners for interaction.
    };

    // Start the page load process.
    loadPage();
});