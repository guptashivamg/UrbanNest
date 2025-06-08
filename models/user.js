const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");


const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        
    }
});
 // hmara jo passport-local-mongoose hai wo username and password field ko by default add kar deta hai isliye yha hum alg se vo dono field mention nahi kar rhe hai 

  
 userSchema.plugin(passportLocalMongoose);

 module.exports = mongoose.model("User", userSchema);

