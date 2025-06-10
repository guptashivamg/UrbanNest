const Listing = require("../models/listing");
const Review = require("../models/review");
const User = require("../models/user.js");



// Render the user sign up form

module.exports.renderSignupForm =  (req, res) => {
  res.render("users/signup");
}


// User Sign Up Logic


module.exports.signup = async (req, res) => {
    try {
      let { username, email, password } = req.body;
      const newUser = new User({ username, email });
      const registeredUser = await User.register(newUser, password);
      console.log(registeredUser);
      req.login(registeredUser, (err) => { // ye req.login method direct login kar dega user ko after the sign up process and isme bhi callback pass hota hai logout function ki trh hi 
        if (err) {
          
          return next(err);
        }

        req.flash("success", "Welcome to UrbanNest!");
        res.redirect("/listings");

      });

    } catch (err) {
      console.log(err.message);
      res.redirect("/signup");
    }
  };




// Render the login form

  module.exports.renderLoginForm = (req, res) => {
  res.render("users/login");
};



// User Login Logic

module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back to Wanderlust!");
    const redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
  };


  // User Logout Logic

  module.exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      console.log(err);
      return next(err);
    }
    req.flash("success", "Logged out successfully!");
    res.redirect("/listings");
  });
};