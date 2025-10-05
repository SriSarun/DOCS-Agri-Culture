document.addEventListener('DOMContentLoaded', () => {
    // Get all necessary form elements from the DOM (similar to admin.js)
    const form = document.getElementById('edit-crop-form');
    // ... (get all other elements like containers and buttons) ...
    const cropId = window.location.pathname.split('/').pop();

    // --- Helper functions to create and populate HTML for dynamic entries ---
    
    const createStageHTML = (data = {}) => `
        <div class="dynamic-entry ...">
            <input type="text" name="stageName" value="${data.stageName || ''}" ... >
            <input type="text" name="stageDuration" value="${data.durationDays || ''}" ... >
            ...
        </div>`;
    
    const createDiseaseHTML = (data = {}) => `
        <div class="dynamic-entry ...">
            <input type="text" name="diseaseName" value="${data.diseaseName || ''}" ... >
            <input type="text" name="causes" value="${(data.causes || []).join(', ')}" ... >
            ...
            <input type="file" name="diseaseImage" ...>
            ${data.image ? `<img src="${data.image}" class="h-10 w-10 object-cover rounded mt-1">` : ''}
        </div>`;

    // Add other create...HTML helper functions here...

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
            // ... populate other dynamic fields ...

        } catch (error) {
            messageDiv.textContent = `Error: ${error.message}`;
            messageDiv.className = 'text-red-600';
        }
    };

    // --- Event Listeners for adding/removing fields (same as admin.js) ---
    // ...

    // --- Form Submission Handler ---
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        // 1. Collect text data (same logic as admin.js)
        const textData = { /* ... */ };
        
        // 2. Create FormData
        const formData = new FormData();
        formData.append('data', JSON.stringify(textData));

        // 3. Append files (same logic as admin.js)
        // ...
        
        messageDiv.textContent = 'Updating...';

        try {
            // 4. Send the FormData object using PUT method
            const response = await fetch(`/api/crops/${cropId}`, {
                method: 'PUT',
                body: formData,
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.message);

            messageDiv.textContent = result.message;
            messageDiv.className = 'text-green-600 font-bold';

            // Redirect back to the dashboard after a short delay
            setTimeout(() => { window.location.href = '/admin/dashboard'; }, 2000);

        } catch (error) {
            messageDiv.textContent = `Error: ${error.message}`;
            messageDiv.className = 'text-red-600 font-bold';
        }
    });

    // Initial call to populate the form when the page loads
    populateForm();
});