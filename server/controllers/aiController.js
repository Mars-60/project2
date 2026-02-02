const { getFileContent } = require("../services/githubService.js");
const aiService = require("../services/aiService.js");

const fileAIcache = new Map();

exports.analyzeFile = async (req, res) => {
  try {
    console.log("🔍 analyzeFile called");
    const { owner, repo } = req.params;
    const { path } = req.body;

    console.log("📦 Params:", { owner, repo, path });

    if (!path) {
      return res.status(400).json({ message: "File path required" });
    }

    const cacheKey = `${owner}/${repo}:${path}`;

    if (fileAIcache.has(cacheKey)) {
      console.log("✅ Cache HIT");
      return res.json({
        source: "cache",
        data: fileAIcache.get(cacheKey),
      });
    }

    console.log("📥 Fetching file content...");
    const code = await getFileContent(owner, repo, path);
    console.log("✅ Got code, length:", code.length);

    const MAX_AI_CHARS = 12000;
    const truncatedCode = code.slice(0, MAX_AI_CHARS);
    console.log("✂️ Truncated to:", truncatedCode.length);

    let intelligence;
    let rawResponse;
    
    // Try 3 times with exponential backoff
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        console.log(`🤖 AI attempt ${attempt}/3...`);
        rawResponse = await aiService.generateFileIntelligence(truncatedCode);
        
        intelligence = aiService.parseJsonSafely(rawResponse);
        console.log("✅ Successfully parsed JSON");
        break;
        
      } catch (parseError) {
        console.warn(`⚠️ Attempt ${attempt} failed:`, parseError.message);
        
        if (attempt === 3) {
          console.warn("⚠️ Using fallback analysis");
          intelligence = aiService.getFallbackAnalysis(truncatedCode);
        } else {
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
      }
    }

    fileAIcache.set(cacheKey, intelligence);

    res.json({
      source: "ai",
      data: intelligence,
    });

  } catch (err) {
    console.error("❌ ERROR:", err.message);
    
    try {
      const code = await getFileContent(req.params.owner, req.params.repo, req.body.path);
      return res.json({
        source: "fallback",
        data: aiService.getFallbackAnalysis(code.slice(0, 12000)),
      });
    } catch {
      res.status(500).json({
        message: "Analysis failed",
        error: err.message
      });
    }
  }
};

exports.askQuestion = async (req, res) => {
  try {
    const { owner, repo } = req.params;
    const { path, question } = req.body;

    if (!path || !question) {
      return res.status(400).json({ message: "Path and question required" });
    }

    const cacheKey = `${owner}/${repo}:${path}`;
    const intelligence = fileAIcache.get(cacheKey);

    if (!intelligence) {
      return res.status(400).json({
        message: "File not analyzed. Analyze first."
      });
    }

    const answer = await aiService.answerQuestion(intelligence, question);
    
    // Return formatted response
    res.json({ 
      answer,
      formatted: true // Signal to frontend that this is well-formatted
    });

  } catch (err) {
    console.error("❌ Error:", err.message);
    res.status(500).json({ 
      message: "Failed to answer", 
      error: err.message 
    });
  }
};

exports.askQuestionStream = async (req, res) => {
  const { owner, repo } = req.params;
  const { path, question } = req.body;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    const code = await getFileContent(owner, repo, path);
    const MAX_AI_CHARS = 10000;
    const truncatedCode = code.slice(0, MAX_AI_CHARS);

    const stream = await aiService.answerQuestionStream(truncatedCode, question);

    for await (const chunk of stream) {
      res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
    }

    res.write("data: [DONE]\n\n");
    res.end();
    
  } catch (err) {
    console.error("❌ Stream error:", err);
    res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
    res.end();
  }
};
// Optional: Helper to clear cache (useful for debugging)
exports.clearCache = (req, res) => {
  const { owner, repo, path } = req.query;
  
  if (path) {
    const cacheKey = `${owner}/${repo}:${path}`;
    fileAIcache.delete(cacheKey);
    return res.json({ 
      message: `Cleared cache for ${path}`,
      success: true 
    });
  }
  
  const size = fileAIcache.size;
  fileAIcache.clear();
  res.json({ 
    message: `Cache cleared completely (${size} entries removed)`,
    success: true 
  });
};