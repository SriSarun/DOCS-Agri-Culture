document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('add-crop-form');
    const messageDiv = document.getElementById('form-message');
    const addDiseaseBtn = document.getElementById('add-disease-btn');
    const diseasesContainer = document.getElementById('diseases-container');
    let diseaseCounter = 0;

    // Function to add a new disease entry
    const addDiseaseEntry = () => {
        const index = diseaseCounter++;
        const diseaseHTML = `
            <div class="disease-entry border p-4 rounded-lg bg-gray-50 relative" data-index="${index}">
                <button type="button" class="remove-disease-btn absolute top-2 right-2 text-red-500 hover:text-red-700 font-bold text-xl">&times;</button>
                <h4 class="font-semibold mb-2 text-gray-700">Disease #${index + 1}</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <input type="text" name="diseaseName" placeholder="Disease Name" class="w-full p-2 border rounded" required>
                    <input type="text" name="symptoms" placeholder="Symptoms" class="w-full p-2 border rounded" required>
                    <input type="text" name="causes" placeholder="Causes (separate with commas)" class="md:col-span-2 w-full p-2 border rounded" required>
                    <input type="text" name="chemicalControl" placeholder="Chemical Control" class="w-full p-2 border rounded" required>
                    <input type="text" name="organicControl" placeholder="Organic Control" class="w-full p-2 border rounded" required>
                    <div class="md:col-span-2">
                        <label class="block text-sm font-medium text-gray-600">Disease Image</label>
                        <input type="file" name="diseaseImage" class="w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100" accept="image/*">
                    </div>
                </div>
            </div>
        `;
        diseasesContainer.insertAdjacentHTML('beforeend', diseaseHTML);
    };

    // Add event listener for adding a disease entry
    addDiseaseBtn.addEventListener('click', addDiseaseEntry);

    // Function to remove a disease entry
    diseasesContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('remove-disease-btn')) {
            event.target.closest('.disease-entry').remove();
        }
    });

    // Main form submission function
    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent default form submission

        messageDiv.textContent = 'Collecting data...';
        messageDiv.className = 'text-blue-600';

        // Step 1: Collect text data into an object
        const textData = {
            name: form.querySelector('[name="name"]').value,
            sowingSeason: form.querySelector('[name="sowingSeason"]').value,
            growthDuration: form.querySelector('[name="growthDuration"]').value,
            diseases: []
        };

        // Validate basic form fields
        if (!textData.name || !textData.sowingSeason || !textData.growthDuration) {
            messageDiv.textContent = 'Error: Please fill in all required crop fields.';
            messageDiv.className = 'text-red-600 font-bold';
            return;
        }

        // Step 2: Collect disease data
        let hasInvalidDisease = false;
        diseasesContainer.querySelectorAll('.disease-entry').forEach(entry => {
            const disease = {
                diseaseName: entry.querySelector('[name="diseaseName"]').value,
                symptoms: entry.querySelector('[name="symptoms"]').value,
                causes: entry.querySelector('[name="causes"]').value.split(',').map(s => s.trim()).filter(s => s),
                chemicalControl: entry.querySelector('[name="chemicalControl"]').value,
                organicControl: entry.querySelector('[name="organicControl"]').value
            };

            // Validate disease fields: all must be filled or none
            if (disease.diseaseName && disease.symptoms && disease.causes.length && disease.chemicalControl && disease.organicControl) {
                textData.diseases.push(disease);
            } else if (disease.diseaseName || disease.symptoms || disease.causes.length || disease.chemicalControl || disease.organicControl) {
                hasInvalidDisease = true;
            }
        });

        // Check for incomplete disease entries
        if (hasInvalidDisease) {
            messageDiv.textContent = 'Error: All disease fields must be fully completed or left empty.';
            messageDiv.className = 'text-red-600 font-bold';
            return;
        }

        // Step 3: Create FormData object
        const formData = new FormData();

        // Step 4: Append text data as JSON
        formData.append('data', JSON.stringify(textData));

        // Step 5: Append files to FormData
        const coverImageInput = form.querySelector('#coverImage');
        if (coverImageInput.files[0]) {
            formData.append('coverImage', coverImageInput.files[0]);
        }

        const galleryImagesInput = form.querySelector('#galleryImages');
        for (const file of galleryImagesInput.files) {
            formData.append('galleryImages', file);
        }

        diseasesContainer.querySelectorAll('.disease-entry').forEach((entry, index) => {
            const imageInput = entry.querySelector('[name="diseaseImage"]');
            if (imageInput && imageInput.files[0]) {
                formData.append(`diseaseImage_${index}`, imageInput.files[0]);
            }
        });

        messageDiv.textContent = 'Uploading...';

        try {
            // Step 6: Send FormData to the backend
            const response = await fetch('/api/crops', {
                method: 'POST',
                body: formData // Browser sets Content-Type to multipart/form-data automatically
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.error || 'Something went wrong');
            }

            messageDiv.textContent = 'Crop successfully saved!';
            messageDiv.className = 'text-green-600 font-bold';
            form.reset();
            diseasesContainer.innerHTML = ''; // Clear disease entries
            diseaseCounter = 0; // Reset disease counter
        } catch (error) {
            messageDiv.textContent = `Error: ${error.message}`;
            messageDiv.className = 'text-red-600 font-bold';
        }
    });

    // Show one disease entry by default on page load
    addDiseaseEntry();
});