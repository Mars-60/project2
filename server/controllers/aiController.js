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
// In your aiController.js or wherever you handle /api/ai/repo/ask

exports.askRepoQuestion = async (req, res) => {
  try {
    const { question, repoTree } = req.body;

    // ✅ CREATE A SUMMARY instead of sending full tree
    const treeSummary = createTreeSummary(repoTree);

    const prompt = `You are analyzing a GitHub repository. Here's a summary of the repository structure:

${treeSummary}

User question: ${question}

Please provide a helpful answer based on the repository structure above.`;

    // Call your AI API (Groq)
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 1024,
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ Repo QnA error:", response.status, JSON.stringify(data));
      return res.status(500).json({
        answer: "Sorry, I encountered an error processing your question.",
      });
    }

    res.json({
      answer: data.choices[0].message.content,
    });

  } catch (error) {
    console.error("❌ Error in askRepoQuestion:", error);
    res.status(500).json({
      answer: "An error occurred while processing your question.",
    });
  }
};

// ✅ HELPER FUNCTION: Create a concise tree summary
function createTreeSummary(tree, maxDepth = 2) {
  const summary = {
    folders: [],
    files: [],
    totalFiles: 0,
    totalFolders: 0,
  };

  function traverse(items, depth = 0, currentPath = "") {
    if (depth > maxDepth) return;

    items.forEach(item => {
      const fullPath = currentPath ? `${currentPath}/${item.name}` : item.name;

      if (item.type === "dir") {
        summary.totalFolders++;
        if (depth < maxDepth) {
          summary.folders.push(fullPath);
        }
        if (item.children && item.children.length > 0) {
          traverse(item.children, depth + 1, fullPath);
        }
      } else if (item.type === "file") {
        summary.totalFiles++;
        if (depth < maxDepth) {
          summary.files.push(fullPath);
        }
      }
    });
  }

  traverse(tree);

  // Create readable summary
  let summaryText = `Repository Structure:\n`;
  summaryText += `- Total Folders: ${summary.totalFolders}\n`;
  summaryText += `- Total Files: ${summary.totalFiles}\n\n`;

  if (summary.folders.length > 0) {
    summaryText += `Main Folders (top ${maxDepth} levels):\n`;
    summary.folders.slice(0, 50).forEach(folder => {
      summaryText += `  - ${folder}\n`;
    });
    if (summary.folders.length > 50) {
      summaryText += `  ... and ${summary.folders.length - 50} more folders\n`;
    }
    summaryText += `\n`;
  }

  if (summary.files.length > 0) {
    summaryText += `Main Files (top ${maxDepth} levels):\n`;
    summary.files.slice(0, 50).forEach(file => {
      summaryText += `  - ${file}\n`;
    });
    if (summary.files.length > 50) {
      summaryText += `  ... and ${summary.files.length - 50} more files\n`;
    }
  }

  return summaryText;
}
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