const passport=require("passport");
const jwt=require("jsonwebtoken");
const router=require("express").Router();
const {signup,login}=require("../controllers/authController.js");

router.post("/signup",signup);
router.post("/login",login);

//Google
router.get("/google",
    passport.authenticate("google",{scope:["email","profile"]})
)

router.get("/google/callback",
    passport.authenticate("google", {session:false}),
    (req,res)=>{
        const token=jwt.sign({id: req.user._id},process.env.JWT_SECRET);
        res.json({token});
    }
);

//GitHub
router.get("/github",
    passport.authenticate("github",{scope:["user:email"]})
)

router.get("/github/callback",
    passport.authenticate("github", {session:false}),
    (req,res)=>{
        const token=jwt.sign({id: req.user._id},process.env.JWT_SECRET);
        res.json({token});
    }
);

module.exports=router;