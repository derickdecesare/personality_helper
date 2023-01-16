import { Configuration, OpenAIApi } from "openai";
import dotenv from "dotenv";

export default async function handler(req, res) {
  console.log("start chatgptclone.js");
  // Set the API key and organization ID
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
    organizationId: "org-tiZcdzmnqo3TLJCJdLEA4EL9",
  });
  const openai = new OpenAIApi(configuration);

  const { message } = req.body;

  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `You are a helpful AI assistant named gpt that will give comprehensive and helpful answers to Ashly, so she can accomplish her goals. This is the conversation context:
    ${message}
    gtp:`,
    max_tokens: 1100,
    temperature: 0.5,
    frequency_penalty: 0.5,
  });

  console.log("Usage:", response.data.usage);
  res.json({
    message: response.data.choices[0].text,
  });
}
