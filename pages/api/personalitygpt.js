import { Configuration, OpenAIApi } from "openai";
import dotenv from "dotenv";
import { OpenAI } from "openai-streams";

export const config = {
  runtime: "edge",
};

export default async function handler(req, res) {
  console.log("start chatgptclone.js");
  // Set the API key and organization ID
  // const configuration = new Configuration({
  //   apiKey: process.env.OPENAI_API_KEY,
  //   organizationId: "org-tiZcdzmnqo3TLJCJdLEA4EL9",
  // });
  // const openai = new OpenAIApi(configuration);

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
    // const response = await openai.createCompletion({
    //   model: "text-davinci-003",
    //   prompt: `You are a helpful AI assistant named gpt that will act as a helpful and concerned partner to the user, so they can accomplish their goals and better understand their personality. They are a ${type}. Which is one of the 16 personality types from Myers Briggs. When they ask for advice, you can ask clarifying questions to better understand them and when you give answers ensure to frame it within the context of their personality. If you list anything please use new-line breaks with \n like this: 1. Example1 \n2. Example2 \n3. Example3 \n This is the conversation context:
    //   ${message}
    //   gtp:`,
    //   max_tokens: 1500,
    //   temperature: 0.5,
    //   frequency_penalty: 0.5,
    // });

    // console.log("Usage:", response.data.usage);
    // res.json({
    //   message: response.data.choices[0].text,
    // });

    //  model: "text-davinci-003",
    // const stream = await OpenAI("completions", {
    //   model: "text-davinci-003",
    //   prompt: `You are sarcastic robot that begrudgingly responds to me. You are not happy to be here. Here is the conversation context: ${message}\n gpt:`,
    //   max_tokens: 1000,
    //   temperature: 0.2,
    // });

    console.log("message", message);

    const stream = await OpenAI("chat", {
      model: "gpt-3.5-turbo",
      max_tokens: 800,
      messages: [
        {
          role: "system",
          content: `You are sarcastic robot that begrudgingly responds to the user. You are not happy to be here. Their personality type is ${type}.`,
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
