// Import the required packages
const express = require('express'); // Import express
const { engine } = require('express-handlebars'); // Import handlebars
const path = require('path'); // Import path module
const { connectDB } = require('./config/db'); // Import the database connection functions
const cropRoutes = require('./routes/cropRoutes');  // Import the crop routes


// Create an instance of express
const app = express(); 
const PORT = 3000; // Set the port number


// Middleware to parse JSON data from AJAX requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Handlebars Setup
app.engine('hbs', engine({ extname: '.hbs', defaultLayout: 'main' }));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));


// Static Folders
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));



// API Routes 
app.use('/api', cropRoutes); // Use the crop routes for /api path


// Page Rendering Routes
app.get('/', (req, res) => {
    res.render('home', { title: 'Agriculture Guide' }); // render the home page with the title 'Agriculture Guide'

});


// Admin dashboard with custom layout (GET request)
app.get('/admin/dashboard', (req, res) => {
    res.render('admin-dashboard', { 
        title: 'Admin Dashboard',
        layout: 'admin-layout'
    }); 
    
});


// Add new crop with custom layout (GET request)
app.get('/admin/edit/:id', (req, res) => {
    res.render('edit-crop', { 
        title: 'Edit crop details',
        layout: 'admin-layout'
    }); 
});

//  Admin Routes
// Add new crop (GET request)
app.get('/admin/add', (req, res) => {
    res.render('add-crop', { title: 'Add the new crop' }); // render the add-crop page with the title 'Add the new crop'
});


// Admin dashboard (GET request)
app.get('/admin/dashboard', (req, res) => {
    res.render('admin-dashboard', { title: 'Admin Dashboard' }); // render the admin-dashboard page with the title 'Admin Dashboard'

});


// Edit crop (GET request)
app.get('/admin/edit/:id', (req, res) => {
    res.render('edit-crop', { title: 'Edit crop details' });  // render the edit-crop page with the title 'Edit crop details'
    
});


// Crop details (GET request)
app.get('/crops/:id', (req, res) => {
    res.render('crop-details', { title: 'Crop details' }); // render the crop-details page with the title 'Crop details'
    
});




app.use(express.static('public')); // serve static files from the 'public' directory
app.use('/uploads', express.static('public/uploads')); // serve static files from the 'public/uploads' directory




// First connect to the database, then start the server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running at http://localhost:${PORT}`);
    });
})