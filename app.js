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
const { reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js")
const session = require("express-session");

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


const sessionOptions = {
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
 cookie: {

   expires: Date.now() + 7*24*60*60*1000 ,  // ek hafte bad in milliseconds likha hai
   maxAge: 7 * 24 * 60 * 60 * 1000, // ek hafte tak cookie valid rahegi
   httpOnly: true,

 },
};

app.use(session(sessionOptions));





app.get("/", (req, res) => {
  res.send("HI I AM THE HOME PAGE");
});



  app.use("/listings" , listings );  // bas ham is single line se ab sare k sare lsiting k routes ko chla pa rhe hai because express router ki help se humne unko modular way me likh diya hai routes folder ke listing.js me 
   // aur jo ye /listings likha hai ye vo common part hota hai jo humne sabhi listing ke routes me se nikal liya hai and comma listings jo likha hai us se sare listing vale path me check krega vo 

  app.use("/listings/:id/reviews" , reviews) // ye review vali sari listing ko use karne ke liya hai  jo ki routes folder ke andar review.js me likhi hui hai  
  

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
