import { useState, useEffect } from "react";
import Head from "next/head";
import { useTheme } from "next-themes";
import { BiLoaderCircle } from "react-icons/bi";
import TypeSelect from "../components/TypeSelect";

function Chatbox() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [chatHistory, setChatHistory] = useState("");
  const [type, setType] = useState("Derick");
  const { theme, setTheme } = useTheme();
  let contextChat = "";

  useEffect(() => setMounted(true), []);

  //test
  function handleSubmit(event) {
    event.preventDefault();
    console.log("submitting");
    setLoading(true);
    // Make a request to the server to get the response
    // based on the message entered by the user
    // if (sessionStorage.getItem('contextChat')) {
    //  contextChat = sessionStorage.getItem('contextChat')
    //  console.log(sessionStorage.getItem('contextChat'))
    //  console.log(`contextchat: $contextChat`)
    // }

    fetch("/api/openai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, chatHistory, type }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status == 200) {
          setResponse(data.message);

          // setContextChat(`You: ${message}` + `AI: ${data.message}`);
          setLoading(false);
          setChatHistory(
            (prev) =>
              prev + `  ${type}: ${message}` + "?" + ` You: ${data.message}`
          );
          // if (sessionStorage.getItem('contextChat')) {
          // const storedString = sessionStorage.getItem('contextChat');
          // const updatedString = storedString + `  Allen: ${message}`+"?" + ` You: ${data.message}`
          // sessionStorage.setItem('contextChat', updatedString);
          // } else {
          //   sessionStorage.setItem('contextChat', ` Allen: ${message}`+"?" + `  You: ${data.message}`);
          // }
        } else {
          setError(true);
          setLoading(false);
        }
      });
    setMessage("");
  }

  // console.log(sessionStorage.getItem('contextChat'))

  if (!mounted) return null;
  return (
    <div>
      <Head>
        <title>AI Personality Coach</title>
        <meta name="description" content="Generated by create next app" />
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
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff"></meta>
      </Head>
      <div className="relative bg-blue-500 ">
        <div className="mx-auto max-w-7xl py-3 px-3 sm:px-6 lg:px-8">
          <div className=" sm:px-16 text-center">
            <p className="font-medium text-white">
              <span className=" inline ">Your personality coach</span>
              <button
                className="fixed top-1 right-1 px-2 py-2 bg-blue-900 dark:bg-blue-200 text-white dark:text-black rounded-lg"
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              >
                {theme === "light" ? "Dark" : "Light"}
              </button>
            </p>
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <form className="w-full max-w-sm " onSubmit={handleSubmit}>
          <h2 className="font-bold text-4xl text-center mt-10 mb-5 ">
            Select Who You Are
          </h2>
          <TypeSelect
            type={type}
            setType={setType}
            setChatHistory={setChatHistory}
            setMessage={setMessage}
            setResponse={setResponse}
            className="text-2xl font-semibold text-gray-900 px-5"
          />
          <div className="flex items-center border border-2 rounded-lg m-5 border-blue-500 py-2">
            <input
              className="appearance-none bg-transparent border-none w-full dark:text-white text-gray-700 mr-3 px-2 focus:outline-none"
              type="text"
              placeholder="Ask a question"
              aria-label="Prompt"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
            />
            <button
              className="flex-shrink-0 bg-blue-500 hover:bg-blue-700 border-blue-500 hover:border-blue-700 text-sm border-4 text-white py-1 px-2 mr-2 rounded"
              type="submit"
            >
              Submit
            </button>
          </div>
          {!loading ? (
            <div className="px-5 py-3 mt-3 text-center text-gray-600 dark:text-white">
              {error ? (
                <p>
                  You need to refresh the page, max context has been reached.
                </p>
              ) : (
                <>
                  {response && (
                    <p>
                      <b>AI:</b> {response}
                    </p>
                  )}
                </>
              )}
            </div>
          ) : (
            <div className="px-5 py-3 mt-3 flex justify-center">
              <BiLoaderCircle className="animate-spin-slow text-xl" />
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default Chatbox;
