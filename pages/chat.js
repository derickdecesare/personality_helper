import { Fragment, useState, useRef, useEffect } from "react";
import TypeSelect from "../components/TypeSelect";
import { AiFillAccountBook } from "react-icons/ai";
import { BiSend } from "react-icons/bi";
import { BsPlusCircle } from "react-icons/bs";

import SideBar from "../components/SideBar";

export default function Chat() {
  const [input, setInput] = useState("");
  const [chatLog, setChatLog] = useState([
    {
      user: "gpt",
      message: "How can I help you today? ",
    },
    {
      user: "Ashly",
      message: "I want to use chatGpt today ",
    },
  ]);

  //scroll to bottom when new message is added
  useEffect(() => {
    dummy.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatLog]);
  const dummy = useRef(null);

  // clear chats
  function clearChat() {
    setChatLog([]);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    let chatLogNew = [];
    if (chatLog.length === 0) {
      chatLogNew = [{ user: "Ashly", message: `${input}` }];
    } else {
      chatLogNew = [...chatLog, { user: "Ashly", message: `${input}` }];
    }

    setInput("");
    setChatLog(chatLogNew);
    console.log(chatLogNew, ": chatLogNew");
    // fetch response to the api combining the chat log array of messages and sending it as a message to localhost:3080 as a post request
    const messages = chatLogNew
      .map((message) => `${message.user}: ${message.message}\n`)
      .join("");

    console.log("chatlog to send to api==>", messages);

    const response = await fetch("/api/chatgptclone", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: messages,
      }),
    });
    const data = await response.json();
    console.log(data.message);
    setChatLog([...chatLogNew, { user: "gpt", message: `${data.message}` }]);
  }

  return (
    <div className="flex bg-gray-500 text-white absolute top-0 bottom-0 left-0 right-0">
      <SideBar />
      <div className="absolute top-0 right-0 m-4 text-4xl  bg-gray-600 rounded-full hover:bg-gray-900  cursor-pointer text-black">
        <BsPlusCircle onClick={clearChat} />
      </div>

      <section className="flex-1 w-full overflow-y-auto lg:pl-64 bg-gray-500 pb-32">
        <div className="text-left w-full">
          {chatLog.map((message, index) => (
            <ChatMessage message={message} key={index} dummy={dummy} />
          ))}
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

const ChatMessage = ({ message, dummy }) => {
  return (
    <>
      <div
        className={`flex w-full mx-auto py-4 pl-8 pr-2 bg-gray-500 justify-center ${
          message.user === "gpt" && "bg-gray-700"
        }`}
      >
        <div className="flex w-full lg:px-12 py-4  pl-4 pr-12  gap-4 justify-between text-left items-start">
          <div className="flex gap-8 items-start">
            <div className={`rounded-full w-11 h-11 shrink-0 items-start`}>
              {message.user === "gpt" ? (
                <img
                  className="inline-block h-11 w-11 rounded-full"
                  src="/personalitycoach.svg"
                  alt="Your Company"
                />
              ) : (
                <img
                  className=" inline-block h-11 w-11 rounded-full"
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt=""
                />
              )}
            </div>
            <div className="text-xl text-left leading-loose">
              {message.message}
            </div>
          </div>
          {/* <AiFillAccountBook className="text-2xl shrink-0" /> */}
        </div>
      </div>
    </>
  );
};
