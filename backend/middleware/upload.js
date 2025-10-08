const multer = require('multer');
const sharp = require('sharp');
const path = require('path');

const storage = multer.memoryStorage();

// File filter to ensure only image files are uploaded.
const fileFilter = (req, file, cb) => {
    
    if (file.mimetype.startsWith('image')) {
        cb(null, true); // Accept the file
    } else {
        
        cb(new Error('Only image files are allowed!'), false);
    }
};


// It will handle receiving files and storing them in memory storage.
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 1024 * 1024 * 15 } // Set a generous limit (e.g., 15MB) as we will resize it anyway.
});



// This middleware will run *after* the 'upload' middleware.
const resizeAndSaveImages = async (req, res, next) => {
   
    if (!req.files || req.files.length === 0) {
        return next();
    }

    // The frontend sends text data as a single 'data' field. Parse it here.
    try {
        if (req.body.data) {
            req.body = JSON.parse(req.body.data);
        }
    } catch (e) {
        return next(new Error("Invalid JSON data in the 'data' field."));
    }
    
   
    req.filesByName = {};

    try {
        // Use Promise.all to process all uploaded images in parallel for better performance.
        await Promise.all(
            req.files.map(async file => {
                // Generate a unique filename to prevent conflicts.
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                const filename = `${file.fieldname}-${uniqueSuffix}.jpeg`;
                const outputPath = path.join('public', 'uploads', filename);

                // Use 'sharp' to process the image from the buffer.
                await sharp(file.buffer)
                    .resize({ width: 800, fit: 'inside', withoutEnlargement: true }) // Resize to max 800px width.
                    .toFormat('jpeg')           // Convert the image to JPEG format.
                    .jpeg({ quality: 90 })      // Set JPEG quality to 90%.
                    .toFile(outputPath);        // Save the processed image to the disk.
                
                // Create a new file object with the path of the processed file.
                const processedFile = {
                    ...file,
                    path: outputPath,
                    filename: filename
                };
                
                // Organize the processed files into the req.filesByName object.
                if (!req.filesByName[file.fieldname]) {
                    req.filesByName[file.fieldname] = [];
                }
                req.filesByName[file.fieldname].push(processedFile);
            })
        );
    } catch (err) {
        return next(err); // If an error occurs during processing, pass it to the error handler.
    }

   
    next();
};


module.exports = { upload, resizeAndSaveImages };