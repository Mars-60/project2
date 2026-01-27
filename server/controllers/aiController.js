const {getFileContent}= require("../services/githubService.js");
const aiService=require("../services/aiService.js");

//In-memory cache for ai file understanding
const fileAIcache= new Map();

//Generate file intelligence(runs once per file)
exports.analyzeFile=async(req,res)=>{
    try{
        const{owner,repo}=req.params;
        const {path}=req.body;

        if(!path){
            return res.status(400).json({message:"File path required"});
        }

        const cacheKey=`${owner}/${repo}:${path}`;

        //Cache hit->instant response
        if(fileAIcache.has(cacheKey)){
            return res.json({
                source:"cache",
                data:fileAIcache.get(cacheKey),
            });
        }

        //Fetch raw code(reuse your existing logic)
        const code=await getFileContent(owner,repo,path);

        //Truncate for AI safety
        const MAX_AI_CHARS=4000;
        const truncatedCode=code.slice(0,MAX_AI_CHARS);

        //Call AI
        const intelligence=await aiService.generateFileIntelligence(truncatedCode);

        //Save to cache
        fileAIcache.set(cacheKey,intelligence);

        res.json({
            source:"ai",
            data:intelligence,
        });
    }catch(err){
        console.error(err.message);
        res.status(500).json({message:"AI analysis failed"});
    }
};

exports.askQuestion=async(req,res)=>{
    try{
      const{owner,repo}=req.params;
      const{path,question}=req.body;

      if(!path||!question){
        return res.status(400).json({message:"Path and question are required"});
    }

    const cacheKey=`${owner}/${repo}:${path}`;
    const intelligence=fileAIcache.get(cacheKey);

    if(!intelligence){
        return res.status(400).json({
            message:"File not analyzed yet. Analyze file first."
        });
    }

    const answer=await aiService.answerQuestion(intelligence,question);
    res.json({answer});

    }catch(err){
        console.error(err.message);
        res.status(500).json({message:"Failed to answer question"});
    }
};