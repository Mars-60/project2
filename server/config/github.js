const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
const User = require("../models/User");

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/api/auth/github/callback",
      scope: ["user:email"],
      // ❌ REMOVE state: true (it requires sessions)
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let email = null;

        if (profile.emails && profile.emails.length > 0) {
          email = profile.emails[0].value.toLowerCase();
        }

        // Only look for existing user, don't create
        let user = await User.findOne({
          $or: [
            { githubId: profile.id },
            email ? { email } : null,
          ].filter(Boolean),
        });

        if (!user) {
          // User doesn't exist - return error to redirect to signup
          return done(null, false, { 
            message: 'no_account',
            email: email
          });
        }

        // User exists - link GitHub ID if not already linked
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