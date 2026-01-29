const axios= require("axios");

//Service-level cache(per process)
const treeCache=new Map();

const MAX_NODES=1500;//safe limit for traversal
let nodeCount=0;

const MAX_CHILDREN=30;  

const githubClient=axios.create({
    baseURL:"https://api.github.com",
    headers:{
        Authorization:`Bearer ${process.env.GITHUB_API_TOKEN}`,
        Accept:"application/vnd.github+json",
    },
    timeout:8000,
});

//Get repo contents(root or folder)
exports.getRepoContents= async(owner,repo,path="")=>{
    const url=`/repos/${owner}/${repo}/contents/${path}`;
    const response=await githubClient.get(url);
    return response.data;
};

//Get file contentconst axios = require("axios");

exports.getFileContent = async (owner, repo, path) => {
  const response = await axios.get(
    `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json",
      },
    }
  );

  // Folder guard
  if (Array.isArray(response.data)) {
    throw new Error("Path is a folder");
  }

  // Binary guard
  if (
    response.data.type !== "file" ||
    !response.data.content ||
    response.data.encoding !== "base64"
  ) {
    throw new Error("Unsupported file");
  }

  return Buffer.from(
    response.data.content,
    "base64"
  ).toString("utf-8");
};



exports.getRepoTreeRecursive = async (
  owner,
  repo,
  path = "",
  currentDepth = 0,
  maxDepth = 2
) => {
  if (currentDepth > maxDepth) return [];

  if (currentDepth === 0) {
  nodeCount = 0;
  }
  const cacheKey=`${owner}/${repo}:${path}:${currentDepth}:${maxDepth}`;

  //SERVICE-LEVEL CACHE HIT
  if(treeCache.has(cacheKey)){
    return treeCache.get(cacheKey);
  }

  const url=`https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
  const response = await githubClient.get(`/repos/${owner}/${repo}/contents/${path}`);
  const items = await response.data;
  const result = [];

  if(items.length>MAX_CHILDREN){
    const truncatedResult = [{
  type: "dir",
  name: path || repo,
  path,
  truncated: true,
  reason: "Too many files to traverse safely",
}];

treeCache.set(cacheKey, truncatedResult);
return truncatedResult;
  }

  for (const item of items) {

    if(nodeCount>=MAX_NODES){
      break;//safeguard:stop deep traversal
    }
    nodeCount++;

    if (item.type === "file") {
      result.push({
        type: "file",
        name: item.name,
        path: item.path,
      });
    }

    if (item.type === "dir") {
      const children = await exports.getRepoTreeRecursive(
        owner,
        repo,
        item.path,
        currentDepth + 1,
        maxDepth
      );

      result.push({
        type: "dir",
        name: item.name,
        path: item.path,
        children,
      });
    }
  }
  //SAVE RECURSIVE RESULT
  treeCache.set(cacheKey,result);

  return result;
};
