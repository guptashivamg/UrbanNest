const express = require("express");
const router = express.Router();

const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema } = require("../schema.js");
const { reviewSchema } = require("../schema.js");


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

router.get("/new", (req, res) => {
  res.render("listings/new");
});

//********************Show Route************************************* */
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show", { listing });
  })
);

//*******************Create Route*************************************** */

router.post(
  "/",
  validateListing, // middleware to validate the listing and it is defined above on line no. 38
  wrapAsync(async (req, res, next) => {
    
    const newListing = new Listing(req.body);
    console.log("Request body:", req.body);

    newListing
      .save()
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });

    res.redirect("listings");
  })
);

//********************Edit Route*********************************** */

router.get(
  "/:id/edit",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit", { listing });
  })
);

//******************Update Route******************************************** */

router.put(
  "/:id",
  validateListing, // middleware to validate the listing and it is defined above on line no. 38
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const updatedListing = await Listing.findByIdAndUpdate(id, req.body, {
      runValidators: true,
      new: true,
    });
    console.log("Listing updated");
    res.redirect("/listings");
  })
);

//******************Delete Route******************************************** */
router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    console.log("Listing deleted");
    res.redirect("/listings");
  })
);


module.exports = router;