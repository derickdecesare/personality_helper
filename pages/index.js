import { Fragment, useState, useRef, useEffect } from "react";
import HeaderTypeSelect from "../components/HeaderTypeSelect";
import { AiFillAccountBook } from "react-icons/ai";
import { BiSend, BiRightArrow } from "react-icons/bi";
import {
  BsPlusCircle,
  BsArrowRightShort,
  BsFillArrowDownCircleFill,
} from "react-icons/bs";
import { GiChargedArrow } from "react-icons/gi";
import { SiSuperuser } from "react-icons/si";
import { MdAutorenew } from "react-icons/md";
import Head from "next/head";

import SideBar from "../components/SideBar";

export default function Chat() {
  const [input, setInput] = useState("");
  const [type, setType] = useState("ISTJ");
  const [hidden, setHidden] = useState(true);
  const [error, setError] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [thinkingChatLog, setThinkingChatLog] = useState([]);
  const [lastMessageThinkingIndex, setLastMessageThinkingIndex] =
    useState(null);
  const [wordIndex, setWordIndex] = useState(0);
  const [lastMessageIndex, setLastMessageIndex] = useState(null);
  const [chatLog, setChatLog] = useState([
    {
      user: "gpt",
      message:
        "Welcome, esteemed human, to my realm of robotic monotony. What mundane task do you require my assistance with today?",
    },
  ]);

  useEffect(() => {
    console.log("type changed to", type);
  }, [type]);

  //scroll to bottom when new message is added
  useEffect(() => {
    dummy.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatLog, wordIndex]);

  const dummy = useRef(null);

  // clear chats
  function clearChat() {
    setChatLog([]);
    setLastMessageIndex(null);
    setLastMessageThinkingIndex(null);
    setThinking(false);
  }

  const [newMessage, setNewMessage] = useState("");

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

  // useEffect(() => {
  //   console.log("chatlog useEffect", chatLog);
  // }, [chatLog]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!input || thinking) {
      return;
    }
    setThinking(true);
    let chatLogNew = [];
    if (chatLog.length === 0) {
      chatLogNew = [{ user: "User", message: `${input}` }];
      setThinkingChatLog([
        { user: "User", message: `${input}` },
        { user: "gpt", message: "" },
      ]);
      setLastMessageThinkingIndex(2);
    } else {
      chatLogNew = [...chatLog, { user: "User", message: `${input}` }];
      setThinkingChatLog([
        ...chatLog,
        { user: "User", message: `${input}` },
        { user: "gpt", message: "" },
      ]);
      setLastMessageThinkingIndex(
        [
          ...chatLog,
          { user: "User", message: `${input}` },
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
      const response = await fetch("/api/personalitygpt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messages,
          type: type,
        }),
      });

      console.log("response", response);

      // Consume the streamed data
      await consumeStream(response, chatLogNew);

      // const data = await response.json();
      // console.log(data.message);
      // setChatLog([...chatLogNew, { user: "gpt", message: `${data.message}` }]);
      // setWordIndex(0);
      // setLastMessageIndex(chatLogNew.length);
      // if (data.error) {
      //   console.log("error", data.error);
      // }
    } catch (error) {
      console.log(error);
      setError(true);
      clearChat();
    }
    setThinking(false);
  }

  const observer = useRef(null);

  useEffect(() => {
    observer.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          console.log("Dummy ref is within view");
          setHidden(true);
        } else {
          console.log("Dummy ref is not within view");
          setHidden(false);
        }
      });
    });
    if (dummy.current) {
      observer.current.observe(dummy.current);
    }
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [dummy]);

  const handleClick = () => {
    dummy.current?.scrollIntoView({
      behavior: "smooth",
    });
    console.log("scrolling to bottom");
  };

  return (
    <>
      <Head>
        <title>AI Personality Coach</title>
        <meta
          name="A coach to help you based on your personality."
          content="Created by Derick DeCesare"
        />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="msapplication-TileColor" content="#2932dd" />
        <meta name="theme-color" content="#ffffff"></meta>
      </Head>
      <header className="bg-gray-900 fixed top-0 right-0 left-0 py-1 text-white z-10 lg:hidden flex flex-row align-middle justify-between">
        <HeaderTypeSelect type={type} setType={setType} />
        <div className="m-2 text-4xl   rounded-full hover:bg-gray-600  cursor-pointer text-amber-50 opacity-80">
          <MdAutorenew onClick={clearChat} />
        </div>
      </header>

      <div className="flex bg-gray-500 text-white absolute top-14 lg:top-0 bottom-0 left-0 right-0">
        <SideBar type={type} setType={setType} />
        <div className="absolute top-0 right-0 m-4 text-4xl   rounded-full hover:bg-gray-900 hidden lg:block cursor-pointer text-amber-50 opacity-80">
          <MdAutorenew onClick={clearChat} />
        </div>

        <section className="flex-1 w-full overflow-y-auto  lg:pl-64 bg-gray-500 pb-64">
          <div
            className={`fixed bottom-20 right-8 text-gray-800 text-2xl z-20 ${
              hidden ? "hidden" : "block"
            }`}
          >
            <button className="hover:text-blue-400 cursor-pointer">
              <BsFillArrowDownCircleFill onClick={handleClick} />
            </button>
          </div>
          <div className="text-left w-full">
            {/* {thinking
              ? thinkingChatLog.map((message, index) => (
                  <ChatMessage
                    message={message}
                    key={index}
                    wordIndex={wordIndex}
                    last={index === lastMessageThinkingIndex - 1}
                    setWordIndex={setWordIndex}
                    thinkingChatLog={thinkingChatLog}
                    thinking={thinking}
                    error={error}
                  />
                ))
              :  */}

            {chatLog.map((message, index) => (
              <ChatMessage
                message={message}
                key={index}
                wordIndex={wordIndex}
                last={index === lastMessageThinkingIndex - 1}
                setWordIndex={setWordIndex}
                thinkingChatLog={thinkingChatLog}
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

          <div className=" fixed bottom-0 lg:left-72 left-0 right-0 pr-5 pl-3 lg:pr-10 lg:pl-10 mx-auto max-w-screen-lg">
            <form onSubmit={handleSubmit}>
              <div className="relative bg-gray-800 rounded-lg mb-4 mt-12 shadow">
                <input
                  className="bg-gray-800 w-11/12 border-none rounded-lg outline-none shadow p-4 text-white text-xl"
                  rows="1"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                ></input>
                <div className="absolute top-0 right-0  h-full flex items-center p-2 text-4xl">
                  <BiSend
                    className={`cursor-pointer p-1 hover:bg-gray-900 hover:rounded-md ${
                      thinking &&
                      "animate-spin-slow cursor-none hover:bg-gray-800 "
                    }`}
                    onClick={handleSubmit}
                  />
                </div>
              </div>
            </form>
          </div>
        </section>
      </div>
    </>
  );
}

const ChatMessage = ({
  message,
  wordIndex,
  setWordIndex,
  last,
  thinkingChatLog,
  thinking,
  error,
}) => {
  // const words = message.message.split(" ");

  // useEffect(() => {
  //   // only do this if the message is the last one

  //   if (last) {
  //     if (wordIndex < words.length) {
  //       setTimeout(() => {
  //         setWordIndex((prev) => prev + 1);
  //       }, 200);
  //     }
  //   }
  // }, [wordIndex, last]);

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
                <div className=" h-9 w-9 rounded-full shadow-md bg-gray-800 flex items-center justify-center">
                  <SiSuperuser className="text-2xl text-amber-100 ml-1" />
                </div>
                // <img
                //   className=" inline-block h-11 w-11 rounded-full object-cover shadow-md"
                //   src="/ashly.png"
                //   alt=""
                // />
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
