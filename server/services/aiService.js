const OpenAI=require("openai");
const client=new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

//Generate file understandingexports.generateFileIntelligence = async (code) => {
  const response = await client.responses.create({
    model: "gpt-4.1-mini",
    response_format: { type: "json_object" },
    input: `
Analyze the following code and return STRICT JSON with:
{
  "purpose": string,
  "responsibilities": string[],
  "keyFunctions": string[],
  "suggestedQuestions": string[]
}

Code:
${code}
`
  });

  return JSON.parse(response.output_text);


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