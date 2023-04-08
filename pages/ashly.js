import { Fragment, useState, useRef, useEffect } from "react";
import TypeSelect from "../components/TypeSelect";
import { AiFillAccountBook } from "react-icons/ai";
import { BiSend } from "react-icons/bi";
import { BsPlusCircle } from "react-icons/bs";

import SideBarAshly from "../components/SideBarAshly";

export default function Chat() {
  const [visible, setVisible] = useState(false);
  const [word, setWord] = useState("");
  const [remainingTime, setRemainingTime] = useState(5);
  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        setRemainingTime((remainingTime) => remainingTime - 1);
      }, 1000);
    }
    if (remainingTime === 0) {
      setVisible(false);
      setRemainingTime(6);
    }
  }, [visible, remainingTime]);

  const [input, setInput] = useState("");
  const [chatLog, setChatLog] = useState([
    {
      user: "gpt",
      message: "How can I help you today? ",
    },
  ]);
  const [lastMessageThinkingIndex, setLastMessageThinkingIndex] =
    useState(null);
  const [thinking, setThinking] = useState(false);
  const [error, setError] = useState(false);

  //scroll to bottom when new message is added
  useEffect(() => {
    dummy.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatLog]);
  const dummy = useRef(null);

  // clear chats
  function clearChat() {
    setChatLog([]);
  }

  // async function handleSubmit(event) {
  //   event.preventDefault();
  //   let chatLogNew = [];
  //   if (chatLog.length === 0) {
  //     chatLogNew = [{ user: "Ashly", message: `${input}` }];
  //   } else {
  //     chatLogNew = [...chatLog, { user: "Ashly", message: `${input}` }];
  //   }

  //   setInput("");
  //   setChatLog(chatLogNew);
  //   console.log(chatLogNew, ": chatLogNew");
  //   // fetch response to the api combining the chat log array of messages and sending it as a message to localhost:3080 as a post request
  //   const messages = chatLogNew
  //     .map((message) => `${message.user}: ${message.message}\n`)
  //     .join("");

  //   console.log("chatlog to send to api==>", messages);

  //   const response = await fetch("/api/ashlygpt", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       message: messages,
  //     }),
  //   });
  //   const data = await response.json();
  //   console.log(data.message);
  //   setChatLog([...chatLogNew, { user: "gpt", message: `${data.message}` }]);
  // }

  async function consumeStream(response, chatLogNew) {
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let tempMessage = "";
    let counter = 0;
    let firstChunk = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        console.log("Stream complete");
        setThinking(false);

        break;
      }

      const chunk = decoder.decode(value);
      console.log("Received chunk:", chunk);

      // console.log("chatLog", chatLog);
      console.log("chatLogNew", chatLogNew);

      console.log("counter", counter);
      // merge the new chunk with the existing text

      if (counter < 3) {
        firstChunk = chunk.replace(/\n/g, "");

        tempMessage += firstChunk;
      } else {
        tempMessage += chunk;
      }

      console.log("tempMessage", tempMessage);

      if (counter === 0) {
        setChatLog([...chatLogNew, { user: "gpt", message: tempMessage }]);
      } else {
        setChatLog((prev) => [
          ...prev.slice(0, -1),
          { user: "gpt", message: tempMessage },
        ]);
      }

      counter += 1;

      // Process the chunk as needed (e.g., update your state, display in the UI, etc.)
    }
    setThinking(false);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!input || thinking) {
      return;
    }
    setThinking(true);
    let chatLogNew = [];
    if (chatLog.length === 0) {
      chatLogNew = [{ user: "Ashly", message: `${input}` }];
      setLastMessageThinkingIndex(2);
    } else {
      chatLogNew = [...chatLog, { user: "Ashly", message: `${input}` }];

      setLastMessageThinkingIndex(
        [
          ...chatLog,
          { user: "Ashly", message: `${input}` },
          { user: "gpt", message: "" },
        ].length
      );
    }

    setInput("");
    setChatLog(chatLogNew);
    console.log(chatLogNew, ": chatLogNew");
    // fetch response to the api combining the chat log array of messages and sending it as a message to localhost:3080 as a post request
    const messages = chatLogNew
      .map((message) => `${message.user}: ${message.message}\n`)
      .join("");

    console.log("chatlog to send to api==>", messages);
    try {
      const response = await fetch("/api/ashlygpt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messages,
        }),
      });

      console.log("response", response);

      // Consume the streamed data
      await consumeStream(response, chatLogNew);
    } catch (error) {
      console.log(error);
      setError(true);
      clearChat();
    }
    setThinking(false);
  }

  return (
    <div className="flex bg-gray-500 text-white absolute top-0 bottom-0 left-0 right-0">
      {visible && (
        <div className="fixed top-0 left-1/4 p-12 bg-red-400 z-10 rounded-lg">
          <div className="text-white text-3xl">
            You are {word} and I believe in girl!! 💕 🐵 {remainingTime}
          </div>
        </div>
      )}
      <SideBarAshly
        visible={visible}
        setVisible={setVisible}
        setWord={setWord}
        word={word}
      />
      <div className="absolute top-0 right-0 m-4 text-4xl  bg-gray-600 rounded-full hover:bg-gray-900  cursor-pointer text-black">
        <BsPlusCircle onClick={clearChat} />
      </div>

      <section className="flex-1 w-full overflow-y-auto lg:pl-64 bg-gray-500 pb-32">
        <div className="text-left w-full">
          {chatLog.map((message, index) => (
            <ChatMessage
              message={message}
              key={index}
              last={index === lastMessageThinkingIndex - 1}
              thinking={thinking}
              error={error}
            />
          ))}
          {error && (
            <span className="text-red-500 justify-center align-middle flex mt-48">
              There was an error with that request. Refresh the page and try
              again.
            </span>
          )}
        </div>
        <div ref={dummy}></div>
        <div className=" fixed bottom-0 lg:left-72 left-0 right-0  py-2 px-12 ">
          <form onSubmit={handleSubmit}>
            <div className="relative bg-gray-800 rounded-lg mb-6 mt-12 shadow">
              <input
                className="bg-gray-800 w-11/12  border-none rounded-lg outline-none shadow p-6 text-white text-xl"
                rows="1"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              ></input>
              <div className="absolute top-0 right-0  h-full flex items-center p-2 text-4xl">
                <BiSend
                  className="cursor-pointer p-1 hover:bg-gray-900 hover:rounded-md "
                  onClick={handleSubmit}
                />
              </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}

// const ChatMessage = ({ message, dummy }) => {
//   return (
//     <>
//       <div
//         className={`flex w-full mx-auto py-4 pl-8 pr-2 bg-gray-500 justify-center ${
//           message.user === "gpt" && "bg-gray-700"
//         }`}
//       >
//         <div className="flex w-full lg:px-12 py-4  pl-4 pr-12  gap-4 justify-between text-left items-start">
//           <div className="flex gap-8 items-start">
//             <div className={`rounded-full w-11 h-11 shrink-0 items-start`}>
//               {message.user === "gpt" ? (
//                 <img
//                   className="inline-block h-11 w-11 rounded-full shadow-md"
//                   src="/personalitycoach.svg"
//                   alt="Your Company"
//                 />
//               ) : (
//                 <img
//                   className=" inline-block h-11 w-11 rounded-full object-cover shadow-md"
//                   src="/ashly.png"
//                   alt=""
//                 />
//               )}
//             </div>
//             <div className="text-xl text-left leading-loose">
//               {message.message}
//             </div>
//           </div>
//           {/* <AiFillAccountBook className="text-2xl shrink-0" /> */}
//         </div>
//       </div>
//     </>
//   );
// };

const ChatMessage = ({ message, last, thinking, error }) => {
  return (
    <>
      <div
        className={`flex w-full mx-auto py-2 shadow-lg bg-gray-500 justify-center ${
          message.user === "gpt" && "bg-gray-700 shadow-lg"
        }`}
      >
        <div className="flex w-full lg:px-12 max-w-screen-lg  py-4  pl-2 pr-4 justify-between text-left items-start">
          <div className="flex lg:gap-4 gap-2 items-start">
            <div className={`rounded-full w-9 h-9 shrink-0 items-start`}>
              {message.user === "gpt" ? (
                <img
                  className="inline-block h-9 w-9 rounded-full shadow-md"
                  src="/personalitycoach.svg"
                  alt="Your Company"
                />
              ) : (
                <img
                  className=" inline-block h-11 w-11 rounded-full object-cover shadow-md"
                  src="/ashly.png"
                  alt=""
                />
              )}
            </div>
            <div className="text-lg text-left leading-loose  whitespace-pre-line text-gray-100">
              {message.message}
              {thinking && last && <span className="blinking-cursor">|</span>}

              {/* {`test message \n new line <b>bold<b>`-- if you want to render things like bold and italics and cold you can just parse this whole text as react markdown using the react-markdown library} */}
            </div>
          </div>
          {/* <AiFillAccountBook className="text-2xl shrink-0" /> */}
        </div>
      </div>
    </>
  );
};
