const express = require("express");
const router = express.Router();

const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema } = require("../schema.js");
const { reviewSchema } = require("../schema.js");
const {isLoggedIn , isOwner} = require("../middleware.js");


const ExpressError = require("../utils/ExpressError.js");

const listingController = require("../controllers/listings.js"); // ye controller ko import kiya hai jis se ki hum sare routes ke callback ko access kr pa rahe hai 

const multer =require("multer");

const {storage} = require("../cloudConfig.js"); // ye cloudConfig.js file se storage ko import kiya hai jo ki cloudinary ke liye hai

const upload = multer({ storage }); // multer ka use file upload karne ke liye hota hai
















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
  wrapAsync(listingController.index)); //isme jo index ka callback hai vo controller folder ke litings.js file me likha hua hai 

//*********************New Route************************************* */

router.get("/new", 
  isLoggedIn,  // ye middleware check krega ki user logged in hia ya nhi..if nhi to use login page par redirect kar dega ye middleware
  listingController.renderNewForm // ye controller ka callback hai jo ki controller folder ke listings.js file me likha hua hai  
);

//********************Show Route************************************* */
router.get(
  "/:id",
  wrapAsync(listingController.showListing) 
);

//*******************Create Route*************************************** */

router.post(
  "/",
  isLoggedIn,
  validateListing, // middleware to validate the listing and it is defined above on line no. 38
  upload.single("image"), // ye multer ka middleware hai jo ki file ko upload karega aur image ke naam se file ko access karega
  wrapAsync(listingController.createListing) // ye controller ka callback hai jo ki controller folder ke listings.js file me likha hua hai
);


//********************Edit Route*********************************** */

router.get(
  "/:id/edit",
  isLoggedIn , // ye middleware check krega ki user logged in hia ya nhi..if nhi to use login page par redirect kar dega ye middleware
  isOwner, 
  wrapAsync(listingController.renderEditForm) // ye controller ka callback hai jo ki controller folder ke listings.js file me likha hua hai
);

//******************Update Route******************************************** */

router.put(
  "/:id",
  isLoggedIn ,// ye middleware check krega ki user logged in hia ya nhi..if nhi to use login page par redirect kar dega ye middleware
  isOwner, // middleware to check if the user is the owner of the listing
  validateListing, // middleware to validate the listing and it is defined above on line no. 38
  wrapAsync(listingController.updateListing) // ye controller ka callback hai jo ki controller folder ke listings.js file me likha hua hai
);

//******************Delete Route******************************************** */
router.delete(
  "/:id",
  isLoggedIn, 
  isOwner, 
  wrapAsync(listingController.deleteListing)  // ye controller ka callback hai jo ki  controller foolder ke lsitings.js file me likha hua hai 
);


module.exports = router;