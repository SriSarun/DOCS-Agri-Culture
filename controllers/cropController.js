const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');



// GET /api/crops (Search & Filter)
// Retrieves all crops with optional search and filter parameters
const getAllCrops = async (req, res) => {
    try {
        const db = getDB(); // Get MongoDB database instance
        const { search, season, duration } = req.query; // Extract query parameters
        let query = {}; // Initialize empty query object
        if (search) query.name = { $regex: search, $options: 'i' }; // Case-insensitive search by crop name
        if (season) query.sowingSeason = season; // Filter by sowing season
        if (duration) query.growthDuration = duration; // Filter by growth duration
        const crops = await db.collection('crops').find(query).toArray(); // Fetch crops matching the query
        res.status(200).json(crops); // Return crops as JSON

    } catch (err) {
        console.error('Error in getAllCrops:', err);
        res.status(500).json({ message: 'Error fetching crops' }); // Handle errors
    }
};



// GET /api/crops/filters
// Retrieves distinct filter options for seasons and durations
const getFilterOptions = async (req, res) => {
    try {
        const db = getDB(); // Get MongoDB database instance
        const [seasons, durations] = await Promise.all([
            db.collection('crops').distinct('sowingSeason'), // Get unique sowing seasons
            db.collection('crops').distinct('growthDuration') // Get unique growth durations
        ]);
        res.status(200).json({ seasons, durations }); // Return filter options as JSON

    } catch (err) {
        console.error('Error in getFilterOptions:', err);
        res.status(500).json({ message: 'Error fetching filter options' }); // Handle errors
    }
};



// POST /api/crops
// Adds a new crop to the database with optional image uploads
const addCrop = async (req, res) => {
    try {
        const db = getDB();
        const cropData = req.body; 
        const files = req.filesByName; // Use the file object created by our middleware
        
        if (files) {
            if (files.coverImage) cropData.coverImage = '/uploads/' + files.coverImage[0].filename;
            if (files.galleryImages) cropData.galleryImages = files.galleryImages.map(file => '/uploads/' + file.filename);
            
            Object.keys(files).forEach(key => {
                if (key.startsWith('diseaseImage_')) {
                    const index = parseInt(key.split('_')[1]);
                    if (cropData.diseases && cropData.diseases[index]) {
                        cropData.diseases[index].image = '/uploads/' + files[key][0].filename;
                    }
                }
            });
        }
        
        const result = await db.collection('crops').insertOne(cropData);
        res.status(201).json({ message: 'Crop added successfully', insertedId: result.insertedId });

    } catch (err) {
        console.error('Error in addCrop:', err);
        res.status(500).json({ message: 'Server error occurred while adding crop' });
    }
};



// GET /api/crops/:id
// Retrieves a single crop by its ID
const getCropById = async (req, res) => {
    try {
        const db = getDB();
        const crop = await db.collection('crops').findOne({ _id: new ObjectId(req.params.id) });
        if (!crop) return res.status(404).json({ message: 'Crop not found' });
        res.status(200).json(crop);

    } catch (err) {
        console.error('Error in getCropById:', err);
        res.status(500).json({ message: 'Server error occurred' });
    }
};



// PUT /api/crops/:id
// Updates an existing crop by its ID
const updateCrop = async (req, res) => {
    try {
        const db = getDB();
        const cropData = req.body;
        const files = req.filesByName; 
    
        // Handle file uploads (similar to addCrop)
        if (files) {
            if (files.coverImage) cropData.coverImage = '/uploads/' + files.coverImage[0].filename;
            if (files.galleryImages) cropData.galleryImages = files.galleryImages.map(file => '/uploads/' + file.filename);
            
            Object.keys(files).forEach(key => {
                if (key.startsWith('diseaseImage_')) {
                    const index = parseInt(key.split('_')[1]);
                    if (cropData.diseases && cropData.diseases[index]) {
                        cropData.diseases[index].image = '/uploads/' + files[key][0].filename;
                    }
                }
            });
        }
        
        const { _id, ...dataToUpdate } = cropData;
        const result = await db.collection('crops').updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: dataToUpdate }
        );
        if (result.matchedCount === 0) return res.status(404).json({ message: 'Crop not found' });
        res.status(200).json({ message: 'Crop updated successfully' });

    } catch (err) {
        console.error('Error in updateCrop:', err);
        res.status(500).json({ message: 'Server error occurred while updating crop' });
    }
};




// DELETE /api/crops/:id
// Deletes a crop by its ID
const deleteCrop = async (req, res) => {
    try {
        const db = getDB();
        const result = await db.collection('crops').deleteOne({ _id: new ObjectId(req.params.id) });
        if (result.deletedCount === 0) return res.status(404).json({ message: 'Crop not found' });
        res.status(200).json({ message: 'Crop deleted successfully' });

    } catch (err) {
        console.error('Error in deleteCrop:', err);
        res.status(500).json({ message: 'Server error occurred' });
    }
};



// GET /api/crops/:id/price-analytics
// Retrieves price analytics for a specific crop
const getCropPriceAnalytics = async (req, res) => {
    try {
        const db = getDB();
        const { startDate, endDate } = req.query;
        const crop = await db.collection('crops').findOne({ _id: new ObjectId(req.params.id) });

        if (!crop || !crop.marketPriceHistory || crop.marketPriceHistory.length === 0) {
            return res.status(404).json({ message: 'No price data available' });
        }
        
        let pricesToAnalyze = crop.marketPriceHistory;
        if (startDate && endDate) {
            pricesToAnalyze = pricesToAnalyze.filter(p => {
                const priceDate = new Date(p.date);
                return priceDate >= new Date(startDate) && priceDate <= new Date(endDate);
            });
        }
        
        if (pricesToAnalyze.length === 0) {
            return res.status(404).json({ message: 'No data available for the selected range' });
        }

        const sortedPrices = [...pricesToAnalyze].sort((a, b) => new Date(b.date) - new Date(a.date));
        const latestDate = sortedPrices[0].date;
        const latestPriceComparison = sortedPrices.filter(p => p.date === latestDate);

        const monthlyData = {};
        sortedPrices.forEach(p => {
            const month = new Date(p.date).toISOString().slice(0, 7);
            if (!monthlyData[month]) monthlyData[month] = { total: 0, count: 0 };
            monthlyData[month].total += p.price;
            monthlyData[month].count += 1;
        });
        
        const monthlyTrend = Object.keys(monthlyData).map(month => ({
            month: month,
            averagePrice: monthlyData[month].total / monthlyData[month].count
        })).sort((a, b) => a.month.localeCompare(b.month));

        res.status(200).json({ latestPriceComparison, monthlyTrend });

    } catch (err) {
        console.error('Error in getCropPriceAnalytics:', err);
        res.status(500).json({ message: 'Error fetching price analytics' });
    }
};



// Export all controller functions
module.exports = {
    getAllCrops,
    getFilterOptions,
    addCrop,
    getCropById,
    updateCrop,
    deleteCrop,
    getCropPriceAnalytics
};