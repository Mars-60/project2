const Groq = require("groq-sdk");

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

console.log("🔑 Groq API Key exists:", !!process.env.GROQ_API_KEY);

exports.generateFileIntelligence = async (code) => {
  const response = await client.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      {
        role: "system",
        content: `You are a code analysis assistant. Analyze the code and return a well-structured JSON response.

Return this EXACT structure with proper formatting:

{
  "summary": "Brief one-sentence summary",
  "purpose": "Clear explanation of the file's main purpose",
  "responsibilities": [
    "First responsibility",
    "Second responsibility",
    "Third responsibility"
  ],
  "keyFunctions": [
    {
      "name": "functionName",
      "description": "What this function does"
    }
  ],
  "usage": "How this file is used in the project"
}

CRITICAL RULES:
- Return ONLY valid JSON
- NO markdown code blocks
- NO extra text or explanations
- Start with { and end with }
- Keep descriptions concise and clear`
      },
      {
        role: "user",
        content: `Analyze this code:\n\n${code}`
      }
    ],
    temperature: 0.1,
  });

  return response.choices[0].message.content.trim();
};

exports.cleanJsonResponse = (rawResponse) => {
  let cleaned = rawResponse.trim();
  
  // Remove markdown code blocks
  cleaned = cleaned.replace(/```json\s*/g, '');
  cleaned = cleaned.replace(/```\s*/g, '');
  
  // Extract JSON object
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  
  if (firstBrace !== -1 && lastBrace !== -1) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }
  
  // Fix common issues
  cleaned = cleaned
    .replace(/,(\s*[}\]])/g, '$1') // Remove trailing commas
    .replace(/([{,]\s*)(\w+):/g, '$1"$2":'); // Quote unquoted keys
  
  return cleaned;
};

exports.parseJsonSafely = (rawResponse) => {
  const strategies = [
    () => JSON.parse(rawResponse),
    () => JSON.parse(exports.cleanJsonResponse(rawResponse)),
    () => {
      const match = rawResponse.match(/\{[\s\S]*\}/);
      if (match) return JSON.parse(exports.cleanJsonResponse(match[0]));
      throw new Error("No JSON found");
    }
  ];
  
  for (const strategy of strategies) {
    try {
      return strategy();
    } catch (e) {
      continue;
    }
  }
  
  throw new Error("All parsing strategies failed");
};

exports.getFallbackAnalysis = (code) => {
  const lines = code.split('\n').length;
  const hasFunction = /function\s+\w+|const\s+\w+\s*=\s*\(|=>\s*{/.test(code);
  const hasClass = /class\s+\w+/.test(code);
  
  return {
    summary: "Code analysis incomplete - manual review recommended",
    purpose: `This is a ${lines}-line code file` + (hasClass ? ' with class definitions' : '') + (hasFunction ? ' containing functions' : ''),
    responsibilities: [
      "Contains code logic that requires manual analysis",
      "See raw file for complete details"
    ],
    keyFunctions: hasFunction ? [
      { name: "Multiple functions detected", description: "Function analysis unavailable - please review code directly" }
    ] : [],
    usage: "Usage patterns require manual code review"
  };
};

// ✨ NEW: Improved answer function with better formatting
exports.answerQuestion = async (intelligence, question) => {
  console.log("🤖 answerQuestion: Starting...");
  console.log("📝 Question:", question);
  
  const response = await client.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      {
        role: "system",
        content: `You are a helpful code assistant with access to this file analysis:

${JSON.stringify(intelligence, null, 2)}

When answering questions:
- Structure your response with clear sections
- Use bullet points for lists
- Add line breaks between paragraphs
- Be concise but thorough
- Format code snippets with proper syntax
- Use headers (##) for major sections if needed`
      },
      {
        role: "user",
        content: question
      }
    ],
    temperature: 0.3,
  });

  return response.choices[0].message.content;
};

// ✨ NEW: Much better streaming with proper formatting
exports.answerQuestionStream = async function* (code, question) {
  const completion = await client.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      {
        role: "system",
        content: `You are a helpful code assistant. Follow these formatting rules:

1. Break content into clear sections with headers (## Section Name)
2. Use bullet points (-) for lists
3. Add blank lines between paragraphs
4. Use code blocks (\`\`\`language) for code snippets
5. Keep explanations organized and easy to scan
6. Use **bold** for emphasis on key points
7. Structure your answer logically: Overview → Details → Examples → Summary

Make your response visually clean and well-organized.`
      },
      {
        role: "user",
        content: `Here's the code:\n\`\`\`\n${code}\n\`\`\`\n\nQuestion: ${question}`
      }
    ],
    stream: true,
    temperature: 0.3,
  });

  for await (const chunk of completion) {
    const token = chunk.choices[0]?.delta?.content;
    if (token) yield token;
  }
};

// Repo-level question answering
exports.answerRepoQuestion = async (repoTree, question) => {
  const response = await client.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      {
        role: "system",
        content: `You are a GitHub repository assistant.

You are given the repository structure as JSON.
Answer questions about:
- What the repo does
- Folder structure
- Where to start
- Architecture overview

Be clear, structured, and beginner-friendly.`
      },
      {
        role: "user",
        content: `Repository structure:\n${JSON.stringify(repoTree, null, 2)}\n\nQuestion: ${question}`
      }
    ],
    temperature: 0.3,
  });

  return response.choices[0].message.content;
};
