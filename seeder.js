const fs = require('fs');
const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017';
const dbName = 'farmingDB';


const client = new MongoClient(url);


const crops = JSON.parse(
  fs.readFileSync(`${__dirname}/data/crops.json`, 'utf-8')
);


const importData = async () => {
  try {
    await client.connect();
    const db = client.db(dbName);
    const cropsCollection = db.collection('crops');

    await cropsCollection.deleteMany();

    await cropsCollection.insertMany(crops);

    console.log('\x1b[32m%s\x1b[0m', ' Data imported successfully.!'); 
    await client.close();
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', `error: ${error.message}`); 
    process.exit(1);
  }
};


const deleteData = async () => {
  try {
    await client.connect();
    const db = client.db(dbName);
    const cropsCollection = db.collection('crops');

    
    await cropsCollection.deleteMany();

    console.log('\x1b[33m%s\x1b[0m', 'Data deleted successfully.!'); 
    await client.close();
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', `error: ${error.message}`);
    process.exit(1);
  }
};


if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
} else {
  console.log('Select the activity: -i (To import) or -d (Delete)');
}