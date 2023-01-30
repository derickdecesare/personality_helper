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

// working example to stream data from openai
// try {
//     const res = await openai.createCompletion({
//         model: "text-davinci-002",
//         prompt: "It was the best of times",
//         max_tokens: 100,
//         temperature: 0,
//         stream: true,
//     }, { responseType: 'stream' });

//     res.data.on('data', data => {
//         const lines = data.toString().split('\n').filter(line => line.trim() !== '');
//         for (const line of lines) {
//             const message = line.replace(/^data: /, '');
//             if (message === '[DONE]') {
//                 return; // Stream finished
//             }
//             try {
//                 const parsed = JSON.parse(message);
//                 console.log(parsed.choices[0].text);
//             } catch(error) {
//                 console.error('Could not JSON parse stream message', message, error);
//             }
//         }
//     });
// } catch (error) {
//     if (error.response?.status) {
//         console.error(error.response.status, error.message);
//         error.response.data.on('data', data => {
//             const message = data.toString();
//             try {
//                 const parsed = JSON.parse(message);
//                 console.error('An error occurred during OpenAI request: ', parsed);
//             } catch(error) {
//                 console.error('An error occurred during OpenAI request: ', message);
//             }
//         });
//     } else {
//         console.error('An error occurred during OpenAI request', error);
//     }
// }

//even larger example
// https://2ality.com/2018/04/async-iter-nodejs.html#generator-%231%3A-from-chunks-to-lines
// async function* chunksToLines(chunksAsync) {
//     let previous = "";
//     for await (const chunk of chunksAsync) {
//       const bufferChunk = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
//       previous += bufferChunk;
//       let eolIndex;
//       while ((eolIndex = previous.indexOf("\n")) >= 0) {
//         // line includes the EOL
//         const line = previous.slice(0, eolIndex + 1).trimEnd();
//         if (line === "data: [DONE]") break;
//         if (line.startsWith("data: ")) yield line;
//         previous = previous.slice(eolIndex + 1);
//       }
//     }
//   }

//   async function* linesToMessages(linesAsync) {
//     for await (const line of linesAsync) {
//       const message = line.substring("data :".length);

//       yield message;
//     }
//   }

//   async function* streamCompletion(data) {
//     yield* linesToMessages(chunksToLines(data));
//   }

//   try {
//     const completion = await openai.createCompletion(
//       {
//         model: "text-davinci-003",
//         max_tokens: 100,
//         prompt: "It was the best of times",
//         stream: true,
//       },
//       { responseType: "stream" }
//     );

//     for await (const message of streamCompletion(completion.data)) {
//       try {
//         const parsed = JSON.parse(message);
//         const { text } = parsed.choices[0];

//         process.stdout.write(text);
//       } catch (error) {
//         console.error("Could not JSON parse stream message", message, error);
//       }
//     }

//     process.stdout.write("\n");
//   } catch (error) {
//     if (error.response?.status) {
//       console.error(error.response.status, error.message);

//       for await (const data of error.response.data) {
//         const message = data.toString();

//         try {
//           const parsed = JSON.parse(message);

//           console.error("An error occurred during OpenAI request: ", parsed);
//         } catch (error) {
//           console.error("An error occurred during OpenAI request: ", message);
//         }
//       }
//     } else {
//       console.error("An error occurred during OpenAI request", error);
//     }
//   }
