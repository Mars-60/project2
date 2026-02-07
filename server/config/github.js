const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
const User = require("../models/User");

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: "https://gitzy-backend.onrender.com/api/auth/github/callback",
  authorizationURL: "https://github.com/login/oauth/authorize?prompt=select_account"
}, async (accessToken, refreshToken, profile, done) => {
      try {
        let email = null;

        if (profile.emails && profile.emails.length > 0) {
          email = profile.emails[0].value.toLowerCase();
        }

        // Only looks for existing user, doesn't create
        let user = await User.findOne({
          $or: [
            { githubId: profile.id },
            email ? { email } : null,
          ].filter(Boolean),
        });

        if (!user) {
          // User doesn't exist - returns error to redirect to signup
          return done(null, false, { 
            message: 'no_account',
            email: email
          });
        }

        // User exists - links GitHub ID if not already linked
        if (!user.githubId) {
          user.githubId = profile.id;
          await user.save();
        }

        return done(null, user);
      } catch (error) {
        console.error("GitHub auth error:", error);
        return done(error, null);
      }
    }
  )
);

module.exports = passport;