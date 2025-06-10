const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const  { saveRedirectUrl } = require("../middleware.js");


const userController =require("../controllers/users.js"); // ye controller ko import kiya hai jis se ki hum sare routes ke callback ko access kr pa rahe hai

// **********************User Sign Up Form Rendering route***********************

router.get("/signup", userController.renderSignupForm); // ye controller ka callback hai jo ki controller folder ke users.js file me likha hua hai



//*********************User Sign Up route************************ */
router.post(
  "/signup",
  wrapAsync(userController.signup), // ye controller ka callback hai jo ki controller folder ke users.js file me likha hua hai)
);



//***********************User Login Form Render Route *********************** */

router.get("/login", userController.renderLoginForm); // ye controller ka callback hai jo ki controller folder ke users.js file me likha hua hai




//*********************User Login Route******************************* */

router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
    userController.login // ye controller ka callback hai jo ki controller folder ke users.js file me likha hua hai
);


//*********************User Logout Route******************************* */

router.get("/logout", userController.logout); // ye controller ka callback hai jo ki controller folder ke users.js file me likha hua hai



module.exports = router;
