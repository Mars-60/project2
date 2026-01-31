const Groq = require("groq-sdk");

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

console.log("🔑 Groq API Key exists:", !!process.env.GROQ_API_KEY);

exports.generateFileIntelligence = async (code) => {
  console.log("🤖 generateFileIntelligence: Starting...");
  console.log("📝 Code length:", code.length);
  
  const response = await client.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      {
        role: "system",
        content:
          "Analyze the following code. Return ONLY a valid JSON object (no markdown, no code blocks) with these fields: purpose, responsibilities, keyFunctions, suggestedQuestions.",
      },
      {
        role: "user",
        content: code,
      },
    ],
  });

  const rawContent = response.choices[0].message.content;
  console.log("✅ Groq raw response:", rawContent);
  
  // Clean up response - remove markdown code blocks if present
  let cleanedContent = rawContent.trim();
  if (cleanedContent.startsWith("```json")) {
    cleanedContent = cleanedContent.replace(/^```json\n?/, "").replace(/\n?```$/, "");
  } else if (cleanedContent.startsWith("```")) {
    cleanedContent = cleanedContent.replace(/^```\n?/, "").replace(/\n?```$/, "");
  }
  
  console.log("✅ Cleaned response:", cleanedContent);
  return cleanedContent;
};

exports.answerQuestion = async (intelligence, question) => {
  console.log("🤖 answerQuestion: Starting...");
  console.log("📝 Question:", question);
  
  const response = await client.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      {
        role: "system",
        content: `You are answering based on this analysis:\n${intelligence}`,
      },
      {
        role: "user",
        content: question,
      },
    ],
  });

  const answer = response.choices[0].message.content;
  console.log("✅ Groq answer received:", answer);
  return answer;
};

// ✅ FIX: Use the same model as other functions
exports.answerQuestionStream = async function* (path, question) {
  console.log("🤖 answerQuestionStream: Starting...");
  console.log("📝 Path:", path, "Question:", question);
  
  const completion = await client.chat.completions.create({
    model: "llama-3.1-8b-instant", // ✅ FIXED: Changed from llama3-70b-8192
    messages: [
      { role: "system", content: `You are analyzing ${path}` },
      { role: "user", content: question }
    ],
    stream: true,
  });

  console.log("✅ Stream started");
  
  for await (const chunk of completion) {
    const token = chunk.choices[0]?.delta?.content;
    if (token) {
      console.log("📤 Token:", token);
      yield token;
    }
  }
  
  console.log("✅ Stream complete");
};