document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('add-crop-form');
    const messageDiv = document.getElementById('form-message');
    const addDiseaseBtn = document.getElementById('add-disease-btn');
    const diseasesContainer = document.getElementById('diseases-container');
    let diseaseCounter = 0;


    addDiseaseBtn.addEventListener('click', () => {
        diseaseCounter++;
        const diseaseHTML = `
            <div class="disease-entry border p-3 rounded-md bg-gray-50 relative" data-index="${diseaseCounter}">
                <button type="button" class="remove-disease-btn absolute top-2 right-2 text-red-500 font-bold">X</button>
                <h4 class="font-semibold mb-2">Disease #${diseaseCounter}</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div>
                        <label class="block font-medium">Disease Name:</label>
                        <input type="text" name="diseaseName" class="w-full p-1 border rounded">
                    </div>
                    <div>
                        <label class="block font-medium">Symptoms:</label>
                        <input type="text" name="symptoms" class="w-full p-1 border rounded">
                    </div>
                    <div>
                        <label class="block font-medium">Causes (separate with commas):</label>
                        <input type="text" name="causes" class="w-full p-1 border rounded">
                    </div>
                    <div>
                        <label class="block font-medium">Chemical Remedy:</label>
                        <input type="text" name="chemicalControl" class="w-full p-1 border rounded">
                    </div>
                    <div>
                        <label class="block font-medium">Organic Method:</label>
                        <input type="text" name="organicControl" class="w-full p-1 border rounded">
                    </div>
                </div>
            </div>
        `;
        diseasesContainer.insertAdjacentHTML('beforeend', diseaseHTML);
    });

    // Remove disease entry function
    diseasesContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('remove-disease-btn')) {
            event.target.closest('.disease-entry').remove();
        }
    });

   
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        //  Collect basic details
        const formData = new FormData(form);
        const data = {
            name: formData.get('name'),
            sowingSeason: formData.get('sowingSeason'),
            growthDuration: formData.get('growthDuration'),
            diseases: [] // Empty array for diseases
        };

        // 2Collect data from each disease entry
        const diseaseEntries = diseasesContainer.querySelectorAll('.disease-entry');
        diseaseEntries.forEach(entry => {
            const disease = {
                diseaseName: entry.querySelector('[name="diseaseName"]').value,
                symptoms: entry.querySelector('[name="symptoms"]').value,
                // Convert causes into an array
                causes: entry.querySelector('[name="causes"]').value.split(',').map(s => s.trim()),
                chemicalControl: entry.querySelector('[name="chemicalControl"]').value,
                organicControl: entry.querySelector('[name="organicControl"]').value
            };
            // Ignore empty diseases
            if (disease.diseaseName) {
                data.diseases.push(disease);
            }
        });

        messageDiv.textContent = 'Saving...';
        messageDiv.className = 'text-blue-600';

        try {
            const response = await fetch('/api/crops', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.message);

            messageDiv.textContent = result.message;
            messageDiv.className = 'text-green-600 font-bold';
            form.reset();
            diseasesContainer.innerHTML = ''; // Clear dynamic inputs

        } catch (error) {
            messageDiv.textContent = `Error: ${error.message}`;
            messageDiv.className = 'text-red-600 font-bold';
        }
    });
});