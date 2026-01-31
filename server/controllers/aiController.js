const {getFileContent}= require("../services/githubService.js");
const aiService=require("../services/aiService.js");

//In-memory cache for ai file understanding
const fileAIcache= new Map();

//Generate file intelligence(runs once per file)
exports.analyzeFile=async(req,res)=>{
    try{
        console.log("🔍 analyzeFile called");
        const{owner,repo}=req.params;
        const {path}=req.body;

        console.log("📦 Params:", {owner, repo, path});

        if(!path){
            return res.status(400).json({message:"File path required"});
        }

        const cacheKey=`${owner}/${repo}:${path}`;

        //Cache hit->instant response
        if(fileAIcache.has(cacheKey)){
            console.log("✅ Cache HIT");
            return res.json({
                source:"cache",
                data:fileAIcache.get(cacheKey),
            });
        }

        console.log("📥 Fetching file content...");
        //Fetch raw code(reuse your existing logic)
        const code=await getFileContent(owner,repo,path);
        console.log("✅ Got code, length:", code.length);

        //Truncate for AI safety
        const MAX_AI_CHARS=4000;
        const truncatedCode=code.slice(0,MAX_AI_CHARS);
        console.log("✂️ Truncated to:", truncatedCode.length);

        console.log("🤖 Calling AI service...");
        //Call AI
        const intelligence=await aiService.generateFileIntelligence(truncatedCode);
        console.log("✅ AI Response received:", intelligence?.substring(0, 100));

        //Save to cache
        fileAIcache.set(cacheKey,intelligence);

        res.json({
            source:"ai",
            data:intelligence,
        });
    }catch (err) {
  console.error("❌ AI ERROR FULL:", err);
  console.error("Stack:", err.stack);
  res.status(500).json({
    message: "AI analysis failed",
    error: err.message,
    stack: err.stack
  });
}

};

exports.askQuestion=async(req,res)=>{
    try{
      console.log("🔍 askQuestion called");
      const{owner,repo}=req.params;
      const{path,question}=req.body;

      console.log("📦 Params:", {owner, repo, path, question});

      if(!path||!question){
        return res.status(400).json({message:"Path and question are required"});
    }

    const cacheKey=`${owner}/${repo}:${path}`;
    const intelligence=fileAIcache.get(cacheKey);

    if(!intelligence){
        console.log("❌ No intelligence in cache for:", cacheKey);
        console.log("Available keys:", Array.from(fileAIcache.keys()));
        return res.status(400).json({
            message:"File not analyzed yet. Analyze file first."
        });
    }

    console.log("🤖 Asking AI...");
    const answer=await aiService.answerQuestion(intelligence,question);
    console.log("✅ Got answer:", answer?.substring(0, 100));
    res.json({answer});

    }catch(err){
        console.error("❌ Error:", err.message);
        console.error("Stack:", err.stack);
        res.status(500).json({message:"Failed to answer question", error: err.message});
    }
};

exports.askQuestionStream = async (req, res) => {
  console.log("🔍 askQuestionStream called");
  const { path, question } = req.body;
  console.log("📦 Stream params:", {path, question});

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    console.log("🤖 Getting stream...");
    const stream = await aiService.answerQuestionStream(path, question);
    console.log("✅ Stream created");

    let chunkCount = 0;
    for await (const chunk of stream) {
      chunkCount++;
      console.log(`📤 Chunk ${chunkCount}:`, chunk.substring(0, 50));
      res.write(`data: ${chunk}\n\n`);
    }

    console.log(`✅ Stream complete. Total chunks: ${chunkCount}`);
    res.write("data: [DONE]\n\n");
    res.end();
  } catch (err) {
    console.error("❌ Stream error:", err);
    console.error("Stack:", err.stack);
    res.write(`data: ⚠️ Streaming failed: ${err.message}\n\n`);
    res.end();
  }
};