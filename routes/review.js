const express = require("express");
const router = express.Router({mergeParams:true});

const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema } = require("../schema.js");
const { reviewSchema } = require("../schema.js");
const {isLoggedIn , isReviewAuthor} = require("../middleware.js");



const ExpressError = require("../utils/ExpressError.js");



const validateReview = (req, res, next) => {
  let {error} = reviewSchema.validate(req.body); // reviewSchema vo hai jo humne Joi ki help se create kiya hai hmare server side ko validate karne ke liye
 
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  }
  else{
    next();
  }
};




//************************Review POst Route************************* */

router.post(
  "/",
  isLoggedIn, // middleware to check if the user is logged in or not
  validateReview, // middleware to validate the review and it is defined above on line no. 55
  wrapAsync(async (req, res) => {
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
  })
);



//************************Review Delete Route**************************** */

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
     await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); // review array se reviewId ko match kra k use pull kr ke delete kr denge with the help of pull operator

     await Review.findByIdAndDelete(reviewId);
     req.flash("success", " Review Deleted successfully!");

    res.redirect(`/listings/${id}`); // Redirect to the listing page after deleting the review
  }
)

);


module.exports = router;