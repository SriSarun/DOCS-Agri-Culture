// public/js/edit-crop.js
document.addEventListener('DOMContentLoaded', () => {
    // DOM கூறுகள்
    const form = document.getElementById('edit-crop-form');
    const messageDiv = document.getElementById('form-message');
    const stagesContainer = document.getElementById('growth-stages-container');
    const diseasesContainer = document.getElementById('diseases-container');
    const generalFertilizersContainer = document.getElementById('general-fertilizers-container');
    const organicFertilizersContainer = document.getElementById('organic-fertilizers-container');
    const cropId = window.location.pathname.split('/').pop();

    // --- டைனமிக் HTML-ஐ உருவாக்கும் உதவிச் செயல்பாடுகள் ---
    const createStageHTML = (data = {}) => { /* ... */ };
    const createDiseaseHTML = (data = {}) => { /* ... */ };
    // ... மற்ற HTML உருவாக்கும் செயல்பாடுகள் ...

    // --- படிவத்தை நிரப்புதல் ---
    const populateForm = async () => { /* ... */ };

    // --- UI கையாளுதல் ---
    document.getElementById('add-stage-btn').addEventListener('click', () => stagesContainer.insertAdjacentHTML('beforeend', createStageHTML()));
    // ... மற்ற Add பொத்தான்களுக்கும் ...

    form.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-btn')) {
            e.target.closest('.dynamic-entry').remove();
        }
    });

    // --- படிவ சமர்ப்பிப்பு ---
    form.addEventListener('submit', async (e) => { /* ... */ });
    
    populateForm();
});