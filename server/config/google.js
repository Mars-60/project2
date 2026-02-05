const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/api/auth/google/callback",
      // ❌ REMOVE state: true (it requires sessions)
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value.toLowerCase();
        
        // Check if user exists
        let user = await User.findOne({ email });

        if (!user) {
          // User doesn't exist - return error to redirect to signup
          return done(null, false, { 
            message: 'no_account',
            email: email
          });
        }

        // User exists - link Google ID if not already linked
        if (!user.googleId) {
          user.googleId = profile.id;
          await user.save();
        }

        return done(null, user);
      } catch (error) {
        console.error("Google auth error:", error);
        return done(error, null);
      }
    }
  )
);

module.exports = passport;