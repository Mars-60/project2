const passport = require("passport");
const jwt = require("jsonwebtoken");
const router = require("express").Router();
const { signup, login } = require("../controllers/authController.js");
const authMiddleware = require("../middlewares/authMiddleware.js");

router.post("/signup", signup);
router.post("/login", login);

router.get("/me", authMiddleware, async (req, res) => {
  res.json({
    message: "You are authenticated",
    userId: req.user.id,
  });
});

// GOOGLE OAUTH
router.get(
  "/google",
  passport.authenticate("google", { 
    scope: ["email", "profile"],
    session: false //  Explicitly disable session
  })
);

router.get(
  "/google/callback",
  (req, res, next) => {
    passport.authenticate("google", { session: false }, (err, user, info) => {
      if (err) {
        console.error("Google callback error:", err);
        return res.redirect(`${process.env.CLIENT_URL}?error=auth_failed`);
      }

      // User not found - account doesn't exist
      if (!user && info && info.message === 'no_account') {
        return res.redirect(
          `${process.env.CLIENT_URL}?error=no_account&email=${encodeURIComponent(info.email)}&message=${encodeURIComponent('This account does not exist. Please sign up first.')}`
        );
      }

      // Other authentication failure
      if (!user) {
        return res.redirect(`${process.env.CLIENT_URL}?error=auth_failed`);
      }

      // Success - generate token
      try {
        const token = jwt.sign(
          { id: user._id, email: user.email },
          process.env.JWT_SECRET,
          { expiresIn: "7d" }
        );

        res.redirect(
          `${process.env.CLIENT_URL}/auth/callback?token=${token}&email=${encodeURIComponent(user.email)}`
        );
      } catch (error) {
        console.error("Token generation error:", error);
        res.redirect(`${process.env.CLIENT_URL}?error=auth_failed`);
      }
    })(req, res, next);
  }
);

// GITHUB OAUTH
router.get(
  "/github",
  passport.authenticate("github", {
    scope: ["user:email"],
    session: false,
    prompt: "select_account"   // FORCE account chooser
  })
);


router.get(
  "/github/callback",
  (req, res, next) => {
    passport.authenticate("github", { session: false }, (err, user, info) => {
      if (err) {
        console.error("GitHub callback error:", err);
        return res.redirect(`${process.env.CLIENT_URL}?error=auth_failed`);
      }

      // User not found - account doesn't exist
      if (!user && info && info.message === 'no_account') {
        return res.redirect(
          `${process.env.CLIENT_URL}?error=no_account&email=${encodeURIComponent(info.email || '')}&message=${encodeURIComponent('This account does not exist. Please sign up first.')}`
        );
      }

      // Other authentication failure
      if (!user) {
        return res.redirect(`${process.env.CLIENT_URL}?error=auth_failed`);
      }

      // Success - generate token
      try {
        const token = jwt.sign(
          { id: user._id, email: user.email },
          process.env.JWT_SECRET,
          { expiresIn: "7d" }
        );

        res.redirect(
          `${process.env.CLIENT_URL}/auth/callback?token=${token}&email=${encodeURIComponent(user.email)}`
        );
      } catch (error) {
        console.error("Token generation error:", error);
        res.redirect(`${process.env.CLIENT_URL}?error=auth_failed`);
      }
    })(req, res, next);
  }
);

module.exports = router;