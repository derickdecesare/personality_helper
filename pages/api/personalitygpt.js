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

  const { message, type } = req.body;

  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `You are a helpful AI assistant named gpt that will act as a helpful and concerned partner to the user, so they can accomplish their goals and better understand their personality. They are a ${type}. Which is one of the 16 personality types from Myers Briggs. When they ask for advice, you can ask clarifying questions to better understand them and when you give answers ensure to frame it within the context of their personality. If you list anything please use new-line breaks with \n like this: 1. Example1 \n2. Example2 \n3. Example3 \n This is the conversation context:
    ${message}
    gtp:`,
    max_tokens: 1500,
    temperature: 0.5,
    frequency_penalty: 0.5,
  });

  console.log("Usage:", response.data.usage);
  res.json({
    message: response.data.choices[0].text,
  });
}
