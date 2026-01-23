const passport=require("passport");
const GoogleStrategy=require("passport-google-oauth20").Strategy;
const User=require("../models/User.js");

passport.use(
    new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/api/auth/google/callback",
    },
    async(_,__,profile,done)=>{
        let user= await User.findOne({googleId: profile.id});

        if(!user){
            user=await User.create({
                googleId:profile.id,
                email:profile.emails[0].value,
                provider: "google",
            });
        }
        done(null,user);
    })
);