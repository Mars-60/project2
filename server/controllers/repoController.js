const githubService = require("../services/githubService");
//In-memory cache
const repoCache=new Map();
const fileCache=new Map();
const axios = require("axios");


const IGNORE_FOLDERS = [
  ".git",
  ".github",
  ".claude",
  ".codesandbox",
  ".vscode",
  ".idea",
  "node_modules",
  "dist",
  "build",
  "coverage",
  "flow-typed",
];

const IGNORE_FILES = [
  ".git-blame-ignore-revs",
  "CLAUDE.md",
  "CODE_OF_CONDUCT.md",
  "CONTRIBUTING.md",
  "CHANGELOG.md",
  "LICENSE",
  "MAINTAINERS",
  "SECURITY.md",

  ".editorconfig",
  ".eslintignore",
  ".eslintrc.js",
  ".gitignore",
  ".gitattributes",
  ".mailmap",
  ".nvmrc",
  ".prettierignore",
  ".prettierrc.js",
  ".watchmanconfig",

  "yarn.lock",
  "package-lock.json",
  "react.code-workspace",
  "dangerfile.js",
  "flow-typed.config.json",
];

//GET repo structure
exports.getRepoTree = async (req, res) => {
  try {
    const { owner, repo } = req.params;
    const cacheKey=`${owner}/${repo}:root`;

    //Check cache first
    if(repoCache.has(cacheKey)){
      return res.json({
        source:"cache",
        data:repoCache.get(cacheKey),
      });
    }

    //Fetch from GitHub
    const data = await githubService.getRepoContents(owner, repo);

    const filtered = data.filter(item => {
      if (item.type === "dir") {
        return !IGNORE_FOLDERS.includes(item.name);
      }
      if (item.type === "file") {
        return !IGNORE_FILES.includes(item.name);
      }
      return true;
    });

    //Save to cache
    repoCache.set(cacheKey,filtered);

    res.json({
      source:"github",
      data:filtered,
    });

  }catch (err) {
  const status = err.response?.status;

  // Repo does not exist
  if (status === 404) {
    return res.status(404).json({
      message: "Repository not found. Please check the link."
    });
  }

  // Private repo
  if (status === 403) {
    return res.status(403).json({
      message: "This repository is private. Please make it public."
    });
  }

  console.error(err.response?.data || err.message);
  res.status(500).json({ message: "Failed to fetch repo" });
}

};


//GET single file content// GET single file content (SAFE VERSION)
exports.getFile = async (req, res) => {
  const { owner, repo } = req.params;
  const { path } = req.query;

  if (!path) {
    return res.status(400).json({ message: "File path required" });
  }

  const cacheKey = `${owner}/${repo}:${path}`;

  // Cache hit
  if (fileCache.has(cacheKey)) {
    return res.json({
      source: "cache",
      path,
      ...fileCache.get(cacheKey),
    });
  }

  try {
    console.log("Using GitHub token:", process.env.GITHUB_API_TOKEN?.slice(0, 6));
    const response = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_API_TOKEN}`,
          Accept: "application/vnd.github+json",
        },
      }
    );

    //  SAFETY CHECK 1: Path is a folder
    if (Array.isArray(response.data)) {
      return res.status(400).json({
        message: "This path is a folder, not a file",
        path,
      });
    }

    //  SAFETY CHECK 2: Unsupported / binary file
    if (
      response.data.type !== "file" ||
      !response.data.content ||
      response.data.encoding !== "base64"
    ) {
      return res.status(400).json({
        message: "Unsupported or binary file",
        path,
      });
    }

    const code = Buffer.from(
      response.data.content,
      "base64"
    ).toString("utf-8");

    const payload = {
      size: response.data.size,
      code,
    };

    // Save to cache
    fileCache.set(cacheKey, payload);

    res.json({
      source: "github",
      path,
      ...payload,
    });
  } catch (err) {
    console.error(
      "File fetch error:",
      err.response?.data || err.message
    );

    res.status(500).json({
      message: "Failed to fetch file",
    });
  }
};



exports.getFullRepoTree = async (req, res) => {
  try {
    const { owner, repo } = req.params;
    const MAX_DEPTH = 3; // hard safety cap
    let depth = Number(req.query.depth) || 2;

    // SAFEGUARD: prevent deep recursion
    if (depth > MAX_DEPTH) {
      return res.status(400).json({
        message: `Max depth allowed is ${MAX_DEPTH}`,
      });
    }

    const cacheKey=`${owner}/${repo}:tree:${depth}`;

    //Cache check
    if(repoCache.has(cacheKey)){
      return res.json({
        source:"cache",
        data:repoCache.get(cacheKey),
      });
    }
    const tree = await githubService.getRepoTreeRecursive(
      owner,
      repo,
      "",
      0,
      depth
    );

    //Cache save
    repoCache.set(cacheKey,tree);

    res.json({
      source:"github",
      data:tree
    });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ message: "Failed to fetch full repo tree" });
  }
};


// GET folder/path contents (for expanding folders)
exports.getFolderContents = async (req, res) => {
  try {
    // REGEX ROUTE → indexed params
    const owner = req.params[0];
    const repo  = req.params[1];
    const rawPath = req.params[2] || "";

    const path = decodeURIComponent(rawPath);

    console.log("Fetching folder contents:", { owner, repo, path });

    const cacheKey = `${owner}/${repo}:${path}`;

    // Cache check
    if (repoCache.has(cacheKey)) {
      return res.json({
        source: "cache",
        data: repoCache.get(cacheKey),
      });
    }

    // Fetch from GitHub
    const data = await githubService.getRepoContents(owner, repo, path);

    const filtered = data.filter(item => {
      if (item.type === "dir") {
        return !IGNORE_FOLDERS.includes(item.name);
      }
      if (item.type === "file") {
        return !IGNORE_FILES.includes(item.name);
      }
      return true;
    });

    repoCache.set(cacheKey, filtered);

    res.json({
      source: "github",
      data: filtered,
    });

  } catch (err) {
    console.error(
      "Error fetching folder contents:",
      err.response?.data || err.message
    );
    res.status(500).json({ message: "Failed to fetch folder contents" });
  }
};
