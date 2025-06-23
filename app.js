if(process.env.NODE_ENV !== "production") { // ye check karta hai ki agar hum production me nahi hai to hi ye dotenv ko use karega
  require("dotenv").config(); // ye dotenv ko use karne ke liya hai taki hum apne environment variables ko use kar sake
}


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
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js")
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const userRouter = require("./routes/user.js");


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
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());






app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user; // ye current user ko hamesha render kar dega taki hume user ki information mil sake
  next();
}
);


  app.use("/listings" , listingRouter );  // bas ham is single line se ab sare k sare lsiting k routes ko chla pa rhe hai because express router ki help se humne unko modular way me likh diya hai routes folder ke listing.js me 
   // aur jo ye /listings likha hai ye vo common part hota hai jo humne sabhi listing ke routes me se nikal liya hai and comma listings jo likha hai us se sare listing vale path me check krega vo 

  app.use("/listings/:id/reviews" , reviewRouter) // ye review vali sari listing ko use karne ke liya hai  jo ki routes folder ke andar review.js me likhi hui hai  


  app.use("/", userRouter); // ye user vali sari listing ko use karne ke liya hai  jo ki routes folder ke andar user.js me likhi hui hai
  

//*******************Error handling using custom middleware****************** */

// app.all("*", (req, res, next) => {
//   next(new ExpressError(404, "Page not found"));
// });

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("listings/error.ejs", { err }); // Changed path to listings/error.ejs
});



app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
