document.addEventListener('DOMContentLoaded', () => {
    // Get all necessary form elements from the DOM
    const form = document.getElementById('add-crop-form');
    const messageDiv = document.getElementById('form-message');

    // Containers for dynamic fields
    const stagesContainer = document.getElementById('growth-stages-container');
    const diseasesContainer = document.getElementById('diseases-container');
    const fertilizersContainer = document.getElementById('fertilizers-container');
    const pricesContainer = document.getElementById('prices-container');

    // Buttons to add new dynamic fields
    const addStageBtn = document.getElementById('add-stage-btn');
    const addDiseaseBtn = document.getElementById('add-disease-btn');
    const addFertilizerBtn = document.getElementById('add-fertilizer-btn');
    const addPriceBtn = document.getElementById('add-price-btn');



    // --- Helper functions to create HTML for dynamic entries ---

    // Each function returns a string of HTML for a new entry.
    const createStageHTML = () => `
        <div class="dynamic-entry grid grid-cols-1 md:grid-cols-6 gap-2 items-center">
            <input type="text" name="stageName" placeholder="Stage Name" class="md:col-span-3 p-2 border rounded">
            <input type="text" name="stageDuration" placeholder="Duration (e.g., 0-25 days)" class="md:col-span-2 p-2 border rounded">
            <button type="button" class="remove-btn md:col-span-1 text-red-500 font-bold justify-self-center">X</button>
        </div>
    `;

    // Similar functions for diseases, fertilizers, and prices
    const createDiseaseHTML = () => `
        <div class="dynamic-entry border p-3 rounded-md bg-gray-50 relative" data-type="disease">
            <button type="button" class="remove-btn absolute top-2 right-2 text-red-500 font-bold">X</button>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <input type="text" name="diseaseName" placeholder="Disease Name" class="w-full p-1 border rounded">
                <input type="text" name="symptoms" placeholder="Symptoms" class="w-full p-1 border rounded">
                <input type="text" name="causes" placeholder="Causes (comma-separated)" class="w-full p-1 border rounded">
                <input type="text" name="chemicalControl" placeholder="Chemical Control" class="w-full p-1 border rounded">
                <input type="text" name="organicControl" placeholder="Organic Control" class="w-full p-1 border rounded">
                <input type="file" name="diseaseImage" class="w-full mt-1 text-xs col-span-2">
            </div>
        </div>
    `;
    

    // Function to create HTML for a fertilizer entry
    const createFertilizerHTML = () => `
        <div class="dynamic-entry grid grid-cols-1 md:grid-cols-7 gap-2 items-center">
            <select name="fertilizerType" class="md:col-span-2 p-2 border rounded">
                <option value="general">General</option>
                <option value="organic">Organic</option>
            </select>
            <input type="text" name="fertilizerName" placeholder="Fertilizer/Product Name" class="md:col-span-2 p-2 border rounded">
            <input type="text" name="fertilizerQty" placeholder="Quantity per Acre" class="md:col-span-2 p-2 border rounded">
            <button type="button" class="remove-btn md:col-span-1 text-red-500 font-bold justify-self-center">X</button>
        </div>
    `;


    // Function to create HTML for a price entry
    const createPriceHTML = () => `
        <div class="dynamic-entry grid grid-cols-1 md:grid-cols-7 gap-2 items-center">
            <input type="date" name="priceDate" class="md:col-span-2 p-2 border rounded">
            <select name="priceLocation" class="md:col-span-2 p-2 border rounded">
                <option value="Market"> Market </option>
                <option value="Shop"> Shop </option>
            </select>
            <input type="number" name="priceValue" placeholder="Price (₹/kg)" class="md:col-span-2 p-2 border rounded">
            <button type="button" class="remove-btn md:col-span-1 text-red-500 font-bold justify-self-center">X</button>
        </div>
    `;

    // Add similar createFertilizerHTML and createPriceHTML functions here...
    // --- Event Listeners for adding dynamic fields ---
    addStageBtn.addEventListener('click', () => stagesContainer.insertAdjacentHTML('beforeend', createStageHTML()));
    addDiseaseBtn.addEventListener('click', () => diseasesContainer.insertAdjacentHTML('beforeend', createDiseaseHTML()));
    addFertilizerBtn.addEventListener('click', () => fertilizersContainer.insertAdjacentHTML('beforeend', createFertilizerHTML()));
    addPriceBtn.addEventListener('click', () => pricesContainer.insertAdjacentHTML('beforeend', createPriceHTML()));

   
    // Generic remove button handler using event delegation
    form.addEventListener('click', (event) => {
        if (event.target.classList.contains('remove-btn')) {
            event.target.closest('.dynamic-entry').remove();
        }
    });

    // --- Form Submission Handler ---
    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent default browser form submission

        // Collect all text data into a structured JavaScript object
        const textData = {
            name: form.querySelector('[name="name"]').value,
            sowingSeason: form.querySelector('[name="sowingSeason"]').value,
            growthDuration: form.querySelector('[name="growthDuration"]').value,
            growthStages: [],
            diseases: [],
            fertilizerRecommendation: { general: [], organic: [] }, 
            marketPriceHistory: [] 
            
        };

        // Collect dynamic growth stages
        stagesContainer.querySelectorAll('.dynamic-entry').forEach(entry => {
            const stageName = entry.querySelector('[name="stageName"]').value;
            if (stageName) {
                textData.growthStages.push({
                    stageName: stageName,
                    durationDays: entry.querySelector('[name="stageDuration"]').value
                });
            }
        });

        // Collect dynamic diseases
        diseasesContainer.querySelectorAll('.dynamic-entry').forEach(entry => {
            const diseaseName = entry.querySelector('[name="diseaseName"]').value;
            if (diseaseName) {
                textData.diseases.push({
                    diseaseName: diseaseName,
                    symptoms: entry.querySelector('[name="symptoms"]').value,
                    causes: entry.querySelector('[name="causes"]').value.split(',').map(s => s.trim()),
                    chemicalControl: entry.querySelector('[name="chemicalControl"]').value,
                    organicControl: entry.querySelector('[name="organicControl"]').value
                });
            }
        });


          // Collect dynamic fertilizers
        fertilizersContainer.querySelectorAll('.dynamic-entry').forEach(entry => {
            const type = entry.querySelector('[name="fertilizerType"]').value;
            const name = entry.querySelector('[name-="fertilizerName"]').value;
            if (name) {
                const fertilizerData = {
                    name: name,
                    quantityPerAcre: entry.querySelector('[name="fertilizerQty"]').value
                };
                if (type === 'general') {
                    // Adjust key to match the schema
                    fertilizerData.fertilizer = fertilizerData.name;
                    delete fertilizerData.name;
                    textData.fertilizerRecommendation.general.push(fertilizerData);
                } else {
                    textData.fertilizerRecommendation.organic.push(fertilizerData);
                }
            }
        });

        // Collect dynamic prices
        pricesContainer.querySelectorAll('.dynamic-entry').forEach(entry => {
            const date = entry.querySelector('[name="priceDate"]').value;
            const price = entry.querySelector('[name="priceValue"]').value;
            if (date && price) {
                textData.marketPriceHistory.push({
                    date: date,
                    location: entry.querySelector('[name="priceLocation"]').value,
                    price: parseFloat(price)
                });
            }
        });

        // Create a FormData object to handle both text and files
        const formData = new FormData();
        
        // Append the structured text data as a JSON string
        formData.append('data', JSON.stringify(textData));

        // Append files
        const coverImageInput = form.querySelector('#coverImage');
        if (coverImageInput.files[0]) formData.append('coverImage', coverImageInput.files[0]);

        const galleryImagesInput = form.querySelector('#galleryImages');
        for (const file of galleryImagesInput.files) {
            formData.append('galleryImages', file);
        }

        // Append disease images with a unique key based on their index
        diseasesContainer.querySelectorAll('.dynamic-entry').forEach((entry, index) => {
            const imageInput = entry.querySelector('[name="diseaseImage"]');
            if (imageInput && imageInput.files[0]) {
                formData.append(`diseaseImage_${index}`, imageInput.files[0]);
            }
        });
        
        messageDiv.textContent = 'Saving...';
        messageDiv.className = 'text-blue-600';

        try {
            // 5. Send the FormData object using fetch
            const response = await fetch('/api/crops', {
                method: 'POST',
                // DO NOT set Content-Type header. The browser will set it correctly for FormData.
                body: formData,
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'An error occurred.');

            messageDiv.textContent = result.message;
            messageDiv.className = 'text-green-600 font-bold';
            form.reset();
            // Clear dynamic fields
            stagesContainer.innerHTML = '';
            diseasesContainer.innerHTML = '';
            fertilizersContainer.innerHTML = '';
            pricesContainer.innerHTML = '';

        } catch (error) {
            messageDiv.textContent = `Error: ${error.message}`;
            messageDiv.className = 'text-red-600 font-bold';
        }
    });
});