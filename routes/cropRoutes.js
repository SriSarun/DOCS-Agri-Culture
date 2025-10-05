const express = require('express'); // Import express
const router = express.Router(); // Create a new router instance
const { upload, resizeAndSaveImages } = require('../middleware/upload'); // Import middleware for file upload

// Import controller functions for crops
const {
    getAllCrops,
    getFilterOptions,
    addCrop,
    getCropById,
    updateCrop,
    deleteCrop,
    getCropPriceAnalytics,
    
} = require('../controllers/cropController');


// Define the routes for the crops API
router.get('/crops/filter', getFilterOptions);
router.delete('/crops/:id', deleteCrop);
router.get('/crops/:id', getCropById);
router.get('/crops/:id/price-analytics', getCropPriceAnalytics);
router.get('/crops', getAllCrops);


// POST /api/crops - Add a new crop with file uploads
router.post(
    '/crops',
    upload.any(), 
    resizeAndSaveImages,
    addCrop
);

// PUT /api/crops/:id - Update a crop with file uploads
router.put(
    '/crops/:id',
    upload.any(), 
    resizeAndSaveImages,
    updateCrop
);

module.exports = router; // Export the router for use in the main app file