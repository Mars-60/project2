const passport=require("passport");
const jwt=require("jsonwebtoken");
const router=require("express").Router();
const {signup,login}=require("../controllers/authController.js");
const authMiddleware=require("../middlewares/authMiddleware.js");

router.post("/signup",signup);
router.post("/login",login);

router.get("/me",authMiddleware,async(req,res)=>{
    res.json({
        message:"You are authenticated",
        userId:req.user.id,
    });
});

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