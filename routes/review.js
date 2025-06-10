const express = require("express");
const router = express.Router({mergeParams:true});

const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema } = require("../schema.js");
const { reviewSchema } = require("../schema.js");
const {isLoggedIn , isReviewAuthor} = require("../middleware.js");

const reviewController = require("../controllers/review.js"); // ye controller ko import kiya hai jis se ki hum sare routes ke callback ko access kr pa rahe hai


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
  wrapAsync(reviewController.createReview) // ye controller ka callback hai jo ki controller folder ke review.js file me likha hua hai
);



//************************Review Delete Route**************************** */

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.deleteReview) // ye controller ka callback hai jo ki controller folder ke review.js file me likha hua hai

);


module.exports = router;