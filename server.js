const express = require('express');
const { engine } = require('express-handlebars');
// const { connectDB, getDB } = require('./config/db');
const { connectDB } = require('./config/db.js');


// New API router register
const apiRouter = require('./routes/cropRoutes'); 


const app = express();
const PORT = 3000;


// Middleware to parse JSON data from AJAX requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.engine('hbs', engine({ extname: '.hbs', defaultLayout: 'main' }));
app.set('view engine', 'hbs');
app.set('views', './views');
app.use(express.static('public') );


// ===== API Routes =====
app.use('/api', apiRouter);


app.get('/', (req, res) => {
    res.render('home', { title: 'Agriculture Guide' });
});

// ===== Admin Routes =====
app.get('/admin/add', (req, res) => {
    res.render('add-crop', { title: 'Add the new crop' });
});



app.get('/admin/dashboard', (req, res) => {
    res.render('admin-dashboard', { title: 'Admin Dashboard' });
});


app.get('/admin/edit/:id', (req, res) => {
    res.render('edit-crop', { title: 'Edit crop details' });
});


app.get('/crops/:id', (req, res) => {
    res.render('crop-details', { title: 'Crop details' });
});

// // Save new crop data (POST request)
// app.post('/admin/add', async (req, res) => {
//     try {
//         const cropData = {
//             name: req.body.cropName,
//             sowingSeason: req.body.sowingSeason,
//             growthDuration: req.body.growthDuration,
            
//         };

//         const db = getDB();
        
    
//         const result = await db.collection('crops').insertOne(cropData);

//         console.log(`The new crop has been successfully added. ID: ${result.insertedId}`);


//         res.redirect('/admin/add');

//     } catch (err) {
//         console.error('Error saving data:', err);
//         res.status(500).send('An error occurred in the server..');
//     }
// });


connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running at http://localhost:${PORT}`);
    });
});