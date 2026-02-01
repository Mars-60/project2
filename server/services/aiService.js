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
        content: `You are a code analysis assistant. You MUST return ONLY valid JSON with no markdown, no explanations, no code blocks.

Return EXACTLY this structure:

{
  "summary": "one sentence summary of what this file does",
  "purpose": "the main purpose of this file",
  "responsibilities": ["responsibility 1", "responsibility 2", "responsibility 3"],
  "keyFunctions": [
    { "name": "functionName", "description": "what it does" },
    { "name": "anotherFunction", "description": "what it does" }
  ],
  "usage": "how this file is typically used in the project"
}

CRITICAL RULES:
- Return ONLY the JSON object
- NO markdown code blocks (no \`\`\`json or \`\`\`)
- NO explanations before or after the JSON
- NO extra text
- Start your response with { and end with }
- Ensure all strings are properly escaped`
      },
      {
        role: "user",
        content: `Analyze this code and return ONLY the JSON structure described:\n\n${code}`
      }
    ],
    temperature: 0.3, // Lower temperature for more consistent formatting
  });

  return response.choices[0].message.content.trim();
};

exports.answerQuestion = async (intelligence, question) => {
  console.log("🤖 answerQuestion: Starting...");
  console.log("📝 Question:", question);
  
  const response = await client.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      {
        role: "system",
        content: `You are a helpful code assistant. Use this analysis to answer questions:\n\n${JSON.stringify(intelligence, null, 2)}`,
      },
      {
        role: "user",
        content: question,
      },
    ],
  });

  const answer = response.choices[0].message.content;
  console.log("✅ Groq answer received:", answer?.substring(0, 100));
  return answer;
};

exports.answerQuestionStream = async function* (code, question) {
  const completion = await client.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      {
        role: "system",
        content:"You are a helpful code assistant. Explain code clearly and concisely. Use markdown formatting for better readability."
},
      {
        role: "user",
        content: `Here's the code:\n\n\`\`\`\n${code}\n\`\`\`\n\nQuestion: ${question}`
      }
    ],
    stream: true,
  });

  for await (const chunk of completion) {
    const token = chunk.choices[0]?.delta?.content;
    if (token) yield token;
  }
};