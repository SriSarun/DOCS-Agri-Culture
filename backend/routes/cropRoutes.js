
const express = require('express');
const router = express.Router();
const { upload, resizeAndSaveImages } = require('../middleware/upload');



// Import the controller functions
const {
    getAllCrops,
    getFilterOptions,
    addCrop,
    getCropById,
    updateCrop,
    deleteCrop,
    getStatsTotals
} = require('../controllers/cropController');



// Define the routes and associate them with controller functions
router.get('/crops/filters', getFilterOptions);
router.get('/crops/:id', getCropById);
router.get('/crops', getAllCrops);
router.get('/stats/totals', getStatsTotals);



// Routes that handle file uploads
router.post('/crops', upload.any(), resizeAndSaveImages, addCrop);
router.put('/crops/:id', upload.any(), resizeAndSaveImages, updateCrop);
router.delete('/crops/:id', deleteCrop);


module.exports = router;