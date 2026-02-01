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
        let intelligenceRaw;
for (let attempt = 1; attempt <= 2; attempt++) {
  intelligenceRaw = await aiService.generateFileIntelligence(truncatedCode);
  try {
    JSON.parse(intelligenceRaw);
    break; // valid JSON
  } catch {
    console.warn(`⚠️ Invalid JSON, retrying (${attempt})...`);
    if (attempt === 2) throw new Error("AI failed twice");
  }
}
console.log("🔍 Raw AI response:", intelligenceRaw);

        let intelligence;
        try {
          // ✅ FIX: Clean the response before parsing
          let cleanedResponse = intelligenceRaw.trim();
          
          // Remove markdown code blocks if present
          cleanedResponse = cleanedResponse.replace(/```json\n?/g, '');
          cleanedResponse = cleanedResponse.replace(/```\n?/g, '');
          cleanedResponse = cleanedResponse.trim();
          
          console.log("🧹 Cleaned response:", cleanedResponse);
          
          function tryFixJson(jsonString) {
  let fixed = jsonString.trim();

  // If JSON doesn't end with }, try to close it
  if (!fixed.endsWith("}")) {
    fixed += "\n}";
  }

  return fixed;
}

try {
  const fixedResponse = tryFixJson(cleanedResponse);
  intelligence = JSON.parse(fixedResponse);
  console.log("✅ Successfully parsed JSON (fixed if needed)");
} catch (err) {
  console.error("❌ AI returned invalid JSON even after fixing");
  console.error("Final response:", cleanedResponse);
  throw err;
}

        } catch (err) {
          console.error("❌ AI returned invalid JSON");
          console.error("Raw response:", intelligenceRaw);
          console.error("Parse error:", err.message);
          
          return res.status(500).json({ 
            message: "AI returned invalid JSON",
            raw: intelligenceRaw.substring(0, 200)
          });
        }

        fileAIcache.set(cacheKey, intelligence);

        res.json({
          source: "ai",
          data: intelligence,
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
  const { owner, repo } = req.params;
  const { path, question } = req.body;
  console.log("📦 Stream params:", { owner, repo, path, question });

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    // Fetch raw file content again
    const code = await getFileContent(owner, repo, path);

    // Truncate for safety
    const MAX_AI_CHARS = 4000;
    const truncatedCode = code.slice(0, MAX_AI_CHARS);

    // Stream chat-style answer using raw code
    const stream = await aiService.answerQuestionStream(truncatedCode, question);
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