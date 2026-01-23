const mongoose=require("mongoose");

const userSchema= new mongoose.Schema({
    email:{type:String,unique:true},
    password: String,

    googleId: String,
    githubId: String,

    provider:{
        type: String,
        enum: ["local","google","github"],
        default:"local",
    },
});

module.exports= mongoose.model("User",userSchema);
