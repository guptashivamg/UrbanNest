const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema } = require("./schema.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

app.get("/", (req, res) => {
  res.send("HI I AM THE HOME PAGE");
});


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
app.get(
  "/listings",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
  })
);

//*********************New Route************************************* */

app.get("/listings/new", (req, res) => {
  res.render("listings/new");
});

//********************Show Route************************************* */
app.get(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show", { listing });
  })
);

//*******************Create Route*************************************** */

app.post(
  "/listings",
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

app.get(
  "/listings/:id/edit",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit", { listing });
  })
);

//******************Update Route******************************************** */

app.put(
  "/listings/:id",
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
app.delete(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    console.log("Listing deleted");
    res.redirect("/listings");
  })
);

//*******************Error handling using custom middleware****************** */

// app.all("*", (req, res, next) => {
//   next(new ExpressError(404, "Page not found"));
// });

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.render("error.ejs", { err });
  res.status(statusCode).send(message);
});



app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
