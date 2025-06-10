const Listing = require("../models/listing");


module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
  };







  module.exports.renderNewForm = (req, res) => {
  res.render("listings/new");
};








module.exports.showListing =async (req, res) => {
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
  };






  module.exports.createListing = async (req, res, next) => {
    
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
  };






  module.exports.renderEditForm = async (req, res) => {
      const { id } = req.params;
      const listing = await Listing.findById(id);
  
      if(!listing) {
      req.flash("error", "Listing you requested does not exist!");
      res.redirect("/listings");
      }
      
      res.render("listings/edit", { listing });
    };





    module.exports.updateListing = async (req, res) => {
    const { id } = req.params;
    const updatedListing = await Listing.findByIdAndUpdate(id, req.body, {
      runValidators: true,
      new: true,
    });
    console.log("Listing updated");
    req.flash("success", " Listing edited successfully!");
    res.redirect("/listings");
  };

 

 module.exports.deleteListing = async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    console.log("Listing deleted");
    req.flash("success", " Listing deleted successfully!");
    res.redirect("/listings");
  };


