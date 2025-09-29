const express = require('express');
const router = express.Router();

const { 
    getAllCrops, 
    addCrop, 
    getCropById, 
    updateCrop, 
    deleteCrop 
} = require('../controllers/cropController');

router.get('/crops', getAllCrops);
router.post('/crops', addCrop);

router.get('/crops/:id', getCropById);
router.put('/crops/:id', updateCrop);
router.delete('/crops/:id', deleteCrop);

module.exports= router;