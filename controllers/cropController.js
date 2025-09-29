const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');

// GET /api/crops  ===== Harvest all crops =====
const getAllCrops = async (req, res) => {
    try{
        const db = getDB();
        const crops = await db.collection('crops').find({}).toArray();
        res.status(200).json(crops);
    } catch (err) {
        console.error('Error in obtaining crops:',err);
        res.status(500).json({ message: 'An error occurred in the server.' })
    }
};

// POST /api/crops  ===== Add a new crop =====
const addCrop = async (req, res) => {
    try {
        // Get all data coming from the frontend
        const cropData = req.body; 

        const db = getDB();
        const result = await db.collection('crops').insertOne(cropData);

        res.status(201).json({ 
            message: 'Crop added successfully', 
            insertedId: result.insertedId 
        });

    } catch (err) {
        console.error('Error saving data:', err);
        res.status(500).json({ message: 'An error occurred on the server' });
    }
};


// GET /api/crops/:id - To obtain a specific crop
const getCropById = async (req, res) => {
    try{
        const db = getDB();
        const crop = await db.collection('crops').findOne({ _id: new ObjectId(req.params.id)});
        if (!crop) {
            return res.status(404).json({ message: 'Crop not found'});
        }
        res.status(200).json(crop);
        
    }catch (err) {
        res.status(500).json({ message: 'Server Error'});
    }
};

// PUT /api/crops/:id - Update Crop
const updateCrop = async (req, res) => {
    try {
        const db = getDB();
        const { name, sowingSeason, growthDuration } = req.body;
         const result = await db.collection('crops').updateOne(
            { _id: new ObjectId(req.params.id) }, 
            { $set: { name, sowingSeason, growthDuration } } 
        );

        if (result.matchedCount === 0) {
           return res.status(404).json({ message: 'Crop not found' });
        }
        res.status(200).json({ message: 'The crop was successfully renewed'});
    } catch (err) {
        res.status(500).json({ message: 'server error'});
    }

};


// DELETE /api/crops/:id - Delete Crop
const deleteCrop = async (req, res ) => {
    try {
        const db = getDB();
        const result = await db.collection('crops').deleteOne({ _id: new ObjectId(req.params.id) });

        if ( result.deleteCrop === 0) {
            return res.status(404).json({ message: 'Crop not found'});
        }
        res.status(200).json({ message: 'The crop was successfully removed' });

    } catch (err) {
    res.status(500).json({ message: 'server error' });
    }

};


module.exports = {
    getAllCrops,
    addCrop,
    getCropById,
    updateCrop,
    deleteCrop
};