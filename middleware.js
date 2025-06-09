const Listing = require("./models/listing");
const Review = require("./models/review");




module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated())
  {
    //redirect url save
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged in to create a listing!");
    return res.redirect("/login");
  }
  next();

}




module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};


module.exports.isOwner = async (req, res, next) => { // ye middleware check karega ki user lisitng ka owner hai ya nahi 
   const { id } = req.params;
      let listing = await  Listing.findById(id);
      if(!listing.owner.equals(req.user._id)) {
        req.flash("error", "You are not the owner of this listing!");
        return res.redirect(`/listings/${id}`);
      }

      next();
};


module.exports.isReviewAuthor = async(req, res, next) => { // ye middleware check karega ki user review ka author hai ya nahi 
  const { id } = req.params; 
  const { reviewId } = req.params;
      let review = await  Review.findById(reviewId);
      if(!review.author.equals(req.user._id)) {
        req.flash("error", "You did not created this review !");
        return res.redirect(`/listings/${id}`);
      }

      next();
};
