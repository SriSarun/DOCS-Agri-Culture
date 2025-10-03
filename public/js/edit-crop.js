document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('edit-crop-form');
    const messageDiv = document.getElementById('form-message');
    const stagesContainer = document.getElementById('growth-stages-container');
    const diseasesContainer = document.getElementById('diseases-container');
    const generalFertilizersContainer = document.getElementById('general-fertilizers-container');
    const organicFertilizersContainer = document.getElementById('organic-fertilizers-container');
    const cropId = window.location.pathname.split('/').pop();

   
    // Add event listeners to the form inputs
    const createStageHTML = (data = {}) => { /* ... */ };
    const createDiseaseHTML = (data = {}) => { /* ... */ };
    const populateForm = async () => { /* ... */ }; 

    
    document.getElementById('add-stage-btn').addEventListener('click', () => stagesContainer.insertAdjacentHTML('beforeend', createStageHTML())); 
    // Add event listeners to the form inputs
    form.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-btn')) {
            e.target.closest('.dynamic-entry').remove();
        }
    });

    
    form.addEventListener('submit', async (e) => { /* ... */ }); // 
    
    populateForm();
});