// this seed.js is used to put the data.js data into the MongoAtlas database

const mongoose = require("mongoose");
const Listing = require("../models/listing");
const { data } = require("./data");

const MONGO_URI = "mongodb+srv://shivamgupta:nHIiUA995E4624fi@cluster0.l020qbf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// 👇 Yeh hai tera fixed user ID
const fixedUserId = "685a5e5678c93cf677b40859";

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log("✅ MongoDB Atlas connected");

    await Listing.deleteMany({});
    console.log("🗑️ Old listings deleted");

    // 👇 Har listing me owner ID inject kar diya
    const listingsWithOwner = data.map((listing) => ({
      ...listing,
      owner: fixedUserId,
    }));

    await Listing.insertMany(listingsWithOwner);
    console.log("🌱 Sample listings inserted successfully");

    mongoose.connection.close();
  })
  .catch((err) => {
    console.error("❌ Error:", err);
  });
