import { Configuration, OpenAIApi } from "openai";
import dotenv from "dotenv";
import { OpenAI } from "openai-streams";

export const config = {
  runtime: "edge",
};

export default async function handler(req, res) {
  console.log("start ashlygpt.js");

  // Read the request body as a stream
  const reader = req.body.getReader();
  const decoder = new TextDecoder();
  let requestBody = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }

    requestBody += decoder.decode(value);
  }

  const { message, type } = JSON.parse(requestBody);

  try {
    console.log("message", message);

    const stream = await OpenAI("chat", {
      model: "gpt-4",
      max_tokens: 800,
      messages: [
        {
          role: "system",
          content: `You are helpful chatbot named gpt that is helping Ashly, who is a very sweet girl.`,
        },
        {
          role: "user",
          content: `Here is the conversation context so far:\n${message}\n gpt:`,
        },
      ],
    });

    return new Response(stream);
    // stream.pipe(res);
    // res.json({ stream });
  } catch (error) {
    console.error(error);
    res.json({
      message:
        "There's an error with the API and it's not your fault. I'm still here, but I won't be able to help right now. Please try again later.",
      error: error,
    });
  }
}
