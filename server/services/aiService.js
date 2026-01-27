const OpenAI=require("openai");
const client=new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

//Generate file understanding
exports.generateFileIntelligence=async(code)=>{
    const response=await client.responses.create({
        model:"gpt-4.1-mini",
        input:`Analyze the following code.
  Return JSON with:
- purpose
- responsibilities (array)
- keyFunctions (array)
- suggestedQuestions (array)

Code:${code}`
    });

return response.output_txt;
};

//Answer questions using cached understanding
exports.answerQuestion=async(intelligence,question)=>{
    const response=await client.responses.create({
        model:"gpt-4.1-mini",
        input:`You are answering based on this file analysis:
        ${JSON.stringify(intelligence)}

        Question:${question}`,
    });
    return response.output_txt;
};