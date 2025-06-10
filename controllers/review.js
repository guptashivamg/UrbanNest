const Listing = require("../models/listing");
const Review = require("../models/review");


module.exports.createReview =async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    const newReview = new Review(req.body.review); // req.body.review => due to name="review[comment]"
    newReview.author = req.user._id; // author ko set kr rhe hai jo ki user ka id hoga jo review post kr rha hia

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    console.log("Review added");
    req.flash("success", " Review Posted successfully!");
    
    res.redirect(`/listings/${id}`);
  };




  module.exports.deleteReview  = async (req, res) => {
    let { id, reviewId } = req.params;
     await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); // review array se reviewId ko match kra k use pull kr ke delete kr denge with the help of pull operator

     await Review.findByIdAndDelete(reviewId);
     req.flash("success", " Review Deleted successfully!");

    res.redirect(`/listings/${id}`); // Redirect to the listing page after deleting the review
  };

  
