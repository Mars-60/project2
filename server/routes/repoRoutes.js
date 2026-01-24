const router=require("express").Router();
const repoController=require("../controllers/repoController.js");
const authMiddleware=require("../middlewares/authMiddleware.js");

//Get repo root structure
router.get("/:owner/:repo",authMiddleware,repoController.getRepoTree);

//Get file content
router.get("/:owner/:repo/file",authMiddleware,repoController.getFile);

router.get("/:owner/:repo/tree",authMiddleware,repoController.getFullRepoTree);
module.exports=router;