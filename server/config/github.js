const passport=require("passport");
const GitHubStrategy=require("passport-github2").Strategy;
const User=require("../models/User.js");


passport.use(
    new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "/api/auth/github/callback",
    },
    async(_,__,profile,done)=>{
        let user= await User.findOne({githubId: profile.id});

        if(!user){
            user=await User.create({
                githubId: profile.id,
                provider: "github",
            });
        }
        done(null,user);
    })
);