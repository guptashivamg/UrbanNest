
// This file is responsible for initializing the database with data
// and setting up the connection to the database.


// Importing required modules
const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}


const initDB = async () => {
    await Listing.deleteMany({}); // Clear the database first
    initdata.data = initdata.data.map((obj) => ({...obj , owner: "68468311617a957fa7ee7622"  })); // Add owner field to each listing
    await Listing.insertMany(initdata.data); // insert the data in the database 
    console.log("Database initialized with data");

};

initDB();
