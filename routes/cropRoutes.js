const express = require('express'); // Import express
const router = express.Router(); // Create a new router instance
const upload = require('../middleware/upload'); // Import middleware for file upload

// Import controller functions for crops
const { 
    getAllCrops, 
    getFilterOptions,
    addCrop, 
    getCropById, 
    updateCrop, 
    deleteCrop 
} = require('../controllers/cropController');

// Define the routes for the crops API
router.get('/crops', getAllCrops);
router.get('/crops/filter', getFilterOptions);
router.get('/crops/:id', getCropById);
router.delete('/crops/:id', deleteCrop);
router.get('/crops/:id/price-analytics', getCropPriceAnalytics);

// POST /api/crops - Add a new crop with file uploads
router.post(
    '/crops',
    upload.fields([
        { name: 'coverImage', maxCount: 1 },
        { name: 'galleryImages', maxCount: 5 },
    ]),
    addCrop
);

// PUT /api/crops/:id - Update a crop with file uploads
router.put(
    '/crops/:id',
    upload.fields([
        { name: 'coverImage', maxCount: 1 },
        { name: 'galleryImages', maxCount: 5 },
    ]),
    updateCrop
);

module.exports = router; // Export the router for use in the main app file