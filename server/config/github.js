// github.js
const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
const User = require("../models/User");

// ✅ ADD THESE - Critical for session management
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/api/auth/github/callback",
      scope: ["user:email"],
    },
    async (accessToken, refreshToken, profile, done) => {
  try {
    let email = null;

    if (profile.emails && profile.emails.length > 0) {
      email = profile.emails[0].value.toLowerCase();
    }

    let user = await User.findOne({
      $or: [
        { githubId: profile.id },
        email ? { email } : null,
      ].filter(Boolean),
    });

    if (!user) {
      user = await User.create({
        email,
        githubId: profile.id,
      });
    } else if (!user.githubId) {
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