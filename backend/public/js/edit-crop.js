document.addEventListener('DOMContentLoaded', () => { 
    // Extract crop ID from the URL
    const form = document.getElementById('edit-crop-form');
    const messageDiv = document.getElementById('form-message');
    const stagesContainer = document.getElementById('growth-stages-container');
    const diseasesContainer = document.getElementById('diseases-container');
    const fertilizersContainer = document.getElementById('fertilizers-container');

    
    const addStageBtn = document.getElementById('add-stage-btn');
    const addDiseaseBtn = document.getElementById('add-disease-btn');
    const addFertilizerBtn = document.getElementById('add-fertilizer-btn');


    const cropId = window.location.pathname.split('/').pop(); // Get the crop ID from the URL

    // --- Helper functions to create and populate HTML for dynamic entries ---

    // Function to create HTML for a growth stage entry, optionally populated with data
    const createStageHTML = (data = {}) => `
        <div class="dynamic-entry grid grid-cols-1 md:grid-cols-6 gap-2 items-center">
            <input type="text" name="stageName" placeholder="Stage Name" class="md:col-span-3 p-2 border rounded" value="${data.stageName || ''}">
            <input type="text" name="stageDuration" placeholder="Duration" class="md:col-span-2 p-2 border rounded" value="${data.durationDays || ''}">
            <button type="button" class="remove-btn md:col-span-1 text-red-500 font-bold justify-self-center">X</button>
        </div>
    `;
    

    // Similar functions for diseases, fertilizers, and prices
    const createDiseaseHTML = (data = {}) => `
        <div class="dynamic-entry border p-3 rounded-md bg-gray-50 relative">
            <button type="button" class="remove-btn absolute top-2 right-2 text-red-500 font-bold">X</button>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <input type="text" name="diseaseName" placeholder="Disease Name" class="w-full p-1 border rounded" value="${data.diseaseName || ''}">
                <input type="text" name="symptoms" placeholder="Symptoms" class="w-full p-1 border rounded" value="${data.symptoms || ''}">
                <input type="text" name="causes" placeholder="Causes (comma-separated)" class="w-full p-1 border rounded" value="${(data.causes || []).join(', ')}">
                <input type="text" name="chemicalControl" placeholder="Chemical Control" class="w-full p-1 border rounded" value="${data.chemicalControl || ''}">
                <input type="text" name="organicControl" placeholder="Organic Control" class="w-full p-1 border rounded" value="${data.organicControl || ''}">
                ${data.image ? `<img src="${data.image}" class="h-12 w-12 object-cover rounded mt-1">` : ''}
                <input type="file" name="diseaseImage" class="w-full mt-1 text-xs col-span-2">
            </div>
        </div>
    `;


    // Function to create HTML for a fertilizer entry
    const createFertilizerHTML = (data = {}, type) => `
        <div class="dynamic-entry grid grid-cols-1 md:grid-cols-7 gap-2 items-center">
            <select name="fertilizerType" class="md:col-span-2 p-2 border rounded">
                <option value="general" ${type === 'general' ? 'selected' : ''}>General</option>
                <option value="organic" ${type === 'organic' ? 'selected' : ''}>Organic</option>
            </select>
            <input type="text" name="fertilizerName" placeholder="Fertilizer/Product Name" class="md:col-span-2 p-2 border rounded" value="${data.fertilizer || data.name || ''}">
            <input type="text" name="fertilizerQty" placeholder="Quantity per Acre" class="md:col-span-2 p-2 border rounded" value="${data.quantityPerAcre || ''}">
            <button type="button" class="remove-btn md:col-span-1 text-red-500 font-bold justify-self-center">X</button>
        </div>
    `;
  

    // --- Function to fetch data and populate the form ---
    const populateForm = async () => {
        try {
            const response = await fetch(`/api/crops/${cropId}`);
            if (!response.ok) throw new Error('Could not fetch crop data.');
            const crop = await response.json();

            // Populate basic info
            form.querySelector('[name="name"]').value = crop.name || '';
            form.querySelector('[name="sowingSeason"]').value = crop.sowingSeason || '';
            form.querySelector('[name="growthDuration"]').value = crop.growthDuration || '';


            // Populate dynamic fields by calling the helper functions with data
            (crop.growthStages || []).forEach(stage => stagesContainer.insertAdjacentHTML('beforeend', createStageHTML(stage)));
            (crop.diseases || []).forEach(disease => diseasesContainer.insertAdjacentHTML('beforeend', createDiseaseHTML(disease)));
            (crop.fertilizerRecommendation?.general || []).forEach(fert => fertilizersContainer.insertAdjacentHTML('beforeend', createFertilizerHTML(fert, 'general')));
            (crop.fertilizerRecommendation?.organic || []).forEach(fert => fertilizersContainer.insertAdjacentHTML('beforeend', createFertilizerHTML(fert, 'organic')));

        } catch (error) {
            messageDiv.textContent = `Error: ${error.message}`;
            messageDiv.className = 'text-red-600';
        }
    };


    // --- Event Listeners for adding dynamic fields ---
    addStageBtn.addEventListener('click', () => stagesContainer.insertAdjacentHTML('beforeend', createStageHTML()));
    addDiseaseBtn.addEventListener('click', () => diseasesContainer.insertAdjacentHTML('beforeend', createDiseaseHTML()));
    addFertilizerBtn.addEventListener('click', () => fertilizersContainer.insertAdjacentHTML('beforeend', createFertilizerHTML()));


    // Generic remove button handler using event delegation
    form.addEventListener('click', (event) => {
        if (event.target.classList.contains('remove-btn')) {
            event.target.closest('.dynamic-entry').remove();
        }
    });

    // --- Form Submission Handler ---
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Create a FormData object to handle file uploads
        const textData = {
            name: form.querySelector('[name="name"]').value,
            sowingSeason: form.querySelector('[name="sowingSeason"]').value,
            growthDuration: form.querySelector('[name="growthDuration"]').value,
            growthStages: [],
            diseases: [],
            fertilizerRecommendation: { general: [], organic: [] }
        };

        const formData = new FormData();
        formData.append('data', JSON.stringify(textData));

        messageDiv.textContent = 'Uploading...';

        // Collect dynamic growth stages
        try {
            const response = await fetch(`/api/crops/${cropId}`, {
                method: 'PUT',
                body: formData,
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.message);

            messageDiv.textContent = result.message;
            messageDiv.className = 'text-green-600 font-bold';
            setTimeout(() => { window.location.href = '/admin/dashboard'; }, 2000);

        } catch (error) {
            messageDiv.textContent = `Error: ${error.message}`;
            messageDiv.className = 'text-red-600 font-bold';
        }
    });

    // Initial call to populate the form when the page loads
    populateForm();
});