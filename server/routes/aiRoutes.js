const router=require("express").Router();
const aiController=require("../controllers/aiController.js");
const authMiddleware=require("../middlewares/authMiddleware.js");

router.post("/:owner/:repo/analyze-file",authMiddleware,aiController.analyzeFile);
router.post("/:owner/:repo/ask",authMiddleware,aiController.askQuestion);

module.exports=router;

