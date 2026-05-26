const router = require("express").Router();
const repoController = require("../controllers/repoController.js");

// Specific routes first
router.get("/:owner/:repo/tree", repoController.getFullRepoTree);
router.get("/:owner/:repo/file", repoController.getFile);

// Folder contents (deep paths) — REGEX ROUTE
router.get(
  /^\/([^/]+)\/([^/]+)\/contents\/(.+)$/,
  repoController.getFolderContents
);

// Most general route last
router.get("/:owner/:repo", repoController.getRepoTree);

module.exports = router;
