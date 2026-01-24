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
        try{
          const email=profile.emails?.[0]?.value;

          //Check if user exists with this GitHub ID
        let user= await User.findOne({githubId: profile.id});

        if(user) return done(null,user);

        //If email exists,link GitHub to existing account
        if(email) {
            user=await User.findOne({email});
           
            if(user){
                user.githubId=profile.id;
                user.provider="github";
                await user.save();
                return done(null,user);
            }
        }

        //Else create new user
        user=await User.create({
            githubId:profile.id,
            email,
            provider:"github",
        });
        

        done(null,user);
    }catch(err){
        done(err,null);
    }
}
    )
);