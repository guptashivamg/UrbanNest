const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js"); // Import the Review model

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,

  image: {
    url: String,
    filename: String,
    
  },
  price: Number,
  location: String,
  country: String,

  reviews: [ // This is an array of ObjectIds that reference the Review model
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },

    ],

    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

});


 // Mongoose middleware to delete reviews when a listing is deleted .. It is a post middleware
listingSchema.post("findOneAndDelete", async(listing) =>{
   if(listing){
         await Review.deleteMany({_id: { $in: listing.reviews }});
   }

  });
   




const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
