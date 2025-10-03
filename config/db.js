const { MongoClient } = require('mongodb'); // Import the MongoClient class from the mongodb package

const url = 'mongodb://localhost:27017'; // Replace with your MongoDB connection string
const client = new MongoClient(url); // Create a new MongoClient instance

const dbName = 'farmingDB'; // Replace with your database name


let db; // Variable to hold the database connection instance

// Function to connect to the database
const connectDB = async () => {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        db = client.db(dbName);
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1)
    }
};


// Function to get the database instance
const getDB = () => {
    if (!db) {
        throw new Error('Database not initialized. Call connectDB first.');
    }
    return db;
};

module.exports = { connectDB, getDB };