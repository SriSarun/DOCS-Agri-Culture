const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');

// GET /api/crops  ===== Harvest all crops =====
const getAllCrops = async (req, res) => {
    try {
        const db = getDB();
        const { search, season, duration } = req.query;

        let query = {};

        
        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }
        
       
        if (season) {
            query.sowingSeason = season;
        }

        
        if (duration) {
            query.growthDuration = duration;
        }
        
        const crops = await db.collection('crops').find(query).toArray();
        res.status(200).json(crops);

    } catch (err) {
        console.error('Error in obtaining crops:',err);
        res.status(500).json({ message: 'An error occurred in the server.' })
    }
};

// POST /api/crops  ===== Add a new crop =====
const addCrop = async (req, res) => {
    try {
        
        const cropData = JSON.parse(req.body.data);

       
        if (req.files) {
            if (req.files.coverImage) {
                cropData.coverImage = req.files.coverImage[0].path.replace('public', '');
            }
            if (req.files.galleryImages) {
                cropData.galleryImages = req.files.galleryImages.map(file => file.path.replace('public', ''));
            }
            
            
            Object.keys(req.files).forEach(key => {
                if (key.startsWith('diseaseImage_')) {
                    const index = parseInt(key.split('_')[1]);
                    if (cropData.diseases && cropData.diseases[index]) {
                        cropData.diseases[index].image = req.files[key][0].path.replace('public', '');
                    }
                }
            });
        }
        
        const db = getDB();
        const result = await db.collection('crops').insertOne(cropData);

        res.status(201).json({ 
            message: 'Crop and images added successfully', 
            insertedId: result.insertedId 
        });

    } catch (err) {
        console.error('Error saving data.:', err);
        res.status(500).json({ message: 'An error occurred on the server.' });
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

        
        if ( result.deletedCount === 0) {
            return res.status(404).json({ message: 'Crop not found'});
        }
        res.status(200).json({ message: 'The crop was successfully removed' });

    } catch (err) {
        res.status(500).json({ message: 'server error' });
    }

};


// GET /api/crops/filters - To get filter options
const getFilterOptions = async (req, res) => {
    try {
        const db = getDB();

        const [seasons, durations] = await Promise.all([
            db.collection('crops').distinct('sowingSeason'),
            db.collection('crops').distinct('growthDuration')
        ]);

        res.status(200).json({ seasons, durations });
    } catch (err) {
        console.error('Error getting filter options:', err);
        res.status(500).json({ message: 'server error' });
    }
};


// GET /api/crops/:id/price-analytics - To get the price analytics of a specific crop
const getCropPriceAnalytic = async (req, res) => {
    try {
        const db = getDB();
        const crop = await db.collection('crops').findOne({ _id: new ObjectId(req.params.id) });


        // Check if crop exists and has market price history
        if (!crop || !crop.marketPriceHistory || crop.marketPriceHistory.length === 0) {
            return res.status(404).json({ message: 'No crop found or no market price history available.' });
        }


        // Calculate the average price
        const sortedPrices = [...crop.marketPriceHistory].sort((a, b) => new Date(b.date) - new Date(a.date));
        const latestDate = sortedPrices[0].date;
        const latestPriceComparison = sortedPrices.filter(p => p.date === latestDate);


        // Calculate the average price
        const monthlyData = {};
        sortedPrices.forEach(p => {
            const month = new Date(p.date).toISOString().slice(0, 7); // "YYYY-MM"
            if (!monthlyData[month]) {
                monthlyData[month] = { total: 0, count: 0 };
            }
            monthlyData[month].total += p.price;
            monthlyData[month].count += 1;
        });

        // Calculate the monthly trend
        const monthlyTrend = Object.keys(monthlyData).map(month => ({
            month: month,
            averagePrice: monthlyData[month].total / monthlyData[month].count
        })).sort((a, b) => a.month.localeCompare(b.month));

        res.status(200).json({ latestPriceComparison, monthlyTrend });

    } catch (error) {
        console.error('Error retrieving price analysis:', error);
        res.status(500).json({ message: 'Server error' });
        
    }

};

module.exports = { /*...,*/ getCropPriceAnalytics };

// Export all controller functions
module.exports = {
    getAllCrops,
    getFilterOptions,
    addCrop,
    getCropById,
    updateCrop,
    deleteCrop
};