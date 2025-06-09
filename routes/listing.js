const express = require("express");
const router = express.Router();

const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema } = require("../schema.js");
const { reviewSchema } = require("../schema.js");
const {isLoggedIn , isOwner} = require("../middleware.js");


const ExpressError = require("../utils/ExpressError.js");



const validateListing = (req, res, next) => {
  let {error} = listingSchema.validate(req.body); // listingSchema vo hai jo humne Joi ki help se create kiya hai hmare server side ko validate karne ke liye
 
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  }
  else{
    next();
  }
};



//**********************Index Route********************************************* */
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
  })
);

//*********************New Route************************************* */

router.get("/new", 
  isLoggedIn,  // ye middleware check krega ki user logged in hia ya nhi..if nhi to use login page par redirect kar dega ye middleware
  (req, res) => {
  res.render("listings/new");
});

//********************Show Route************************************* */
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author", // populate the author field of the reviews 
      },
    })
      .populate("owner");
    if(!listing) {
    req.flash("error", "Listing you requested does not exist!");
    res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show", { listing });
  })
);

//*******************Create Route*************************************** */

router.post(
  "/",
  isLoggedIn,
  validateListing, // middleware to validate the listing and it is defined above on line no. 38
  wrapAsync(async (req, res, next) => {
    
    const newListing = new Listing(req.body);
    newListing.owner = req.user._id; // is se jo bhi nayi lisitng create hogi jis bhi username ki uska pta laga jayega 
    console.log("Request body:", req.body);

       newListing
      .save()
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
    
    req.flash("success", "New listing created successfully!");  
    res.redirect("listings");
  })
);

//********************Edit Route*********************************** */

router.get(
  "/:id/edit",
  isLoggedIn , // ye middleware check krega ki user logged in hia ya nhi..if nhi to use login page par redirect kar dega ye middleware
  isOwner, 
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if(!listing) {
    req.flash("error", "Listing you requested does not exist!");
    res.redirect("/listings");
    }
    
    res.render("listings/edit", { listing });
  })
);

//******************Update Route******************************************** */

router.put(
  "/:id",
  isLoggedIn ,// ye middleware check krega ki user logged in hia ya nhi..if nhi to use login page par redirect kar dega ye middleware
  isOwner, // middleware to check if the user is the owner of the listing
  validateListing, // middleware to validate the listing and it is defined above on line no. 38
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const updatedListing = await Listing.findByIdAndUpdate(id, req.body, {
      runValidators: true,
      new: true,
    });
    console.log("Listing updated");
    req.flash("success", " Listing edited successfully!");
    res.redirect("/listings");
  })
);

//******************Delete Route******************************************** */
router.delete(
  "/:id",
  isLoggedIn, 
  isOwner, 
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    console.log("Listing deleted");
    req.flash("success", " Listing deleted successfully!");
    res.redirect("/listings");
  })
);


module.exports = router;