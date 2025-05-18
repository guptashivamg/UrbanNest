
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");



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


//  app.get("/testListing", async (req, res) => {
//   let sampleListing = new Listing({
//     title: "My new Villa",
//     description: "A beautiful villa in the mountains",
//     price: 1200,
//     location: "Goa",
//     country: "India",
//   });

//   await sampleListing.save();
//   console.log("sample was saved");
//    res.send("success");

//    });

 
 //**********************Index Route********************************************* */
  app.get("/listings", async (req, res) => {
     const allListings = await Listing.find({});
      res.render("./listings/index.ejs" , { allListings });
    });


    //*********************New Route************************************* */

   app.get("/listings/new", (req, res) => {
    res.render("./listings/new.ejs");
    });


    //********************Show Route************************************* */
    app.get("/listings/:id", async (req, res) => {
      const {id} = req.params;
      const listing = await Listing.findById(id);
      res.render("./listings/show.ejs", { listing });

    });

    

    //*******************Create Route*************************************** */
     
    app.post("/listings", async (req, res) => {
      const newListing = new Listing(req.body);
      await newListing.save();
      console.log("New listing created");
      res.redirect("/listings");
    });
      
    //********************Edit Route*********************************** */

    app.get("/listings/:id/edit", async (req, res) => {
      const { id } = req.params;
      const listing = await Listing.findById(id);
      res.render("./listings/edit.ejs", { listing });
    });

    //******************Update Route******************************************** */

    app.put("/listings/:id", async (req, res) => {
      const { id } = req.params;
      const updatedListing = await Listing.findByIdAndUpdate(id, req.body, {
        runValidators: true,
        new: true,
      });
      console.log("Listing updated");
      res.redirect("/listings");
      
    });

    //******************Delete Route******************************************** */
    app.delete("/listings/:id", async (req, res) => {
      const { id } = req.params;
      await Listing.findByIdAndDelete(id);
      console.log("Listing deleted");
      res.redirect("/listings");
    });


app.listen(3000, () => {
    console.log("Server is running on port 3000");
    });