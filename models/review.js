const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  comment: String,
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;

// This code defines a Mongoose schema and model for reviews in a MongoDB database.
// The `reviewSchema` includes fields for the comment, rating (with validation), and creation date.



