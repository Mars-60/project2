const router=require("express").Router();
const aiController=require("../controllers/aiController.js");
const authMiddleware=require("../middlewares/authMiddleware.js");

router.post("/:owner/:repo/analyze-file",aiController.analyzeFile);
router.post("/:owner/:repo/ask",aiController.askQuestion);
router.post(
  "/:owner/:repo/ask-stream",
  aiController.askQuestionStream
);

module.exports=router;

