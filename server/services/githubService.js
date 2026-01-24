const axios= require("axios");

const githubClient=axios.create({
    baseURL:"https://api.github.com",
    headers:{
        Authorization:`Bearer ${process.env.GITHUB_API_TOKEN}`,
        Accept:"application/vnd.github+json",
    },
});

//Get repo contents(root or folder)
exports.getRepoContents= async(owner,repo,path="")=>{
    const url=`/repos/${owner}/${repo}/contents/${path}`;
    const response=await githubClient.get(url);
    return response.data;
};

//Get file content
exports.getFileContent=async(owner,repo,path="")=>{
    const url=`/repos/${owner}/${repo}/contents/${path}`;
    const response=await githubClient.get(url);
    
    const encoded=response.data.content;
    const decoded=Buffer.from(encoded,"base64").toString("utf-8");

    return decoded;
};


exports.getRepoTreeRecursive = async (
  owner,
  repo,
  path = "",
  depth = 0,
  maxDepth = 2
) => {
  if (depth > maxDepth) return [];

  const items = await exports.getRepoContents(owner, repo, path);
  const result = [];

  for (const item of items) {
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
        depth + 1,
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

  return result;
};
