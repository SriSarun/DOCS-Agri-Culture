const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

// MongoDB connection details
const url = 'mongodb://localhost:27017';
const dbName = 'farmingDB';
const client = new MongoClient(url); // MongoDB client instance


// Read crops data from JSON file
const crops = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'crops.json'), 'utf-8'));

// Function to import data into the database
const importData = async () => {
  try {
    await client.connect();
    const db = client.db(dbName);
    await db.collection('crops').deleteMany();
    await db.collection('crops').insertMany(crops);

    console.log('\x1b[32m%s\x1b[0m', ' Data imported successfully.!'); 
  
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', `error: ${error.message}`); 
    process.exit(1);
    
  } finally { // Ensure the client is closed in all cases
    await client.close();
  }
};


// Function to delete all data from the database
const deleteData = async () => {
  try {
    await client.connect();
    const db = client.db(dbName);
    await db.collection('crops').deleteMany();

    console.log('\x1b[33m%s\x1b[0m', 'Data deleted successfully.!'); 
   
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', `error: ${error.message}`);
    process.exit(1);

  } finally { // Ensure the client is closed in all cases
    await client.close();
  }
};


// Determine action based on command-line arguments
if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
} else {
  console.log('Select the activity: -i (To import) or -d (Delete)');
}