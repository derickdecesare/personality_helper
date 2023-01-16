
import React, {useState,useEffect} from 'react'

export default function PersonalityTest() {
    // simple state to count which question we are on
    const [count, setCount] = useState(-1)
    const [answers, setAnswers] = useState([])

  function incrementCount() {
    setCount((prev) => prev + 1)
  }

  function decrementCount() {
    setCount((prev) => prev - 1)
  }

  const questions = [
    [
       "I would cross the street before the walk sign turns on, if there are no cars coming."
    ],
    [
        "When trying to find the underlying concept it's more important to go slowly and consider all the data than to go too fast and miss something."
    ],
    [
        "In life, you should put on your oxygen mask before helping others. It makes sense to take care of your own needs before others."
    ],
    [
        "I feel more comfortable with a lot of options and flexibility rather than having clear rules and plans in place."
    ],
    [
        "I enjoy solving complex problems that other people probably wouldn't appreciate."
    ],
    [
        "The biggest problem with the world is that people aren't logical enough."
    ],
    [
        "If I like something I like it. I don't care what other people think about it."
    ],
    [
        "Items that I own (like a phone or a refrigerator) seem to be break more frequently and for more random reasons than other people's things."
    ],
    [
        "I focus more on my own individual needs and goals rather than prioritize the needs and goals of my group or community."
    ],
    [
        "When learning a new skill, I spend a long time looking at all the different information on the topic before starting so that I can learn more than just the basics."
    ],
    [
        "Life and technology moves too fast for me to keep up with all the new things that are coming out."
    ],
    [
        "Finding a helpful role to play in a group or community is more important than becoming rich or famous."
    ],
    [
        "People come to me for emotional advice because I am good at understanding how they are feeling."
    ],
    [
        "People have told me before that I am too chaotic for my own good."
    ],
    [
        "Giving gifts comes naturally to me and I love making people I care about feel special."
    ],
    [
        "Sometimes I feel anxious that a crucial tool I use (like a phone or car) will break and I won't have someone around to help fix it"
    ],
    [
        "If I'm feeling anxious and can't sleep, it's usually because I'm replaying conversations that happened in the past that could have gone better."
    ],
    [
        "People usually ask me to do favors for them because they know that I'll be happy to help."
    ],
    [
        "I prefer to have a clear plan and structure in place before starting a new project or task."
    ],
    [
        "When interacting with others, I prefer to work independently from other people than as part of a team."
    ]

  ]


  console.log(count)

  return (
      // box with a description of the test styled in tailwind css 
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex my-5 mx-auto w-1/2 justify-center">
            <div className="flex flex-col text-center justify-center">
                <h1 className="text-2xl text-center font-bold">{count==-1 ?"Personality Test":`Question ${count +1}`}</h1>
                <h2 className="text-xl text-center pt-5">{count==-1? "Answer each question authentically, your data will not be stored or shared, so by answering honestly you are allowing us to provide you more personalized solutions" : questions[count] }</h2>
                {count>=0 && // radio buttons of strongly disagree, disagree, agree, strongly agree
                    <div className="flex justify-center gap-1">
                        <button 
                        onClick={incrementCount}
                        className="bg-blue-800 hover:bg-blue-700 text-white font-bold py-1 px-2 flex-1 rounded my-5" >Strongly Disagree</button>
                        <button 
                        onClick={incrementCount}
                        className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-1 px-2 flex-1 rounded my-5" >Disagree</button>
                        <button 
                        onClick={incrementCount}
                        className="bg-green-500 hover:bg-green-400 flex-1 text-white font-bold py-1 px-2 rounded my-5" >Agree</button>
                        <button 
                        onClick={incrementCount}
                        className="bg-green-800 hover:bg-green-700 flex-1 text-white font-bold py-1 px-2 rounded my-5" >Strongly Agree</button>
                        </div>
                }
                

                {count==-1 && <button 
                onClick={incrementCount}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded my-5">Start Test</button>}


                    </div>
               {count>=0 && <button 
                onClick={decrementCount}
                className="absolute bottom-0 left-0 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded my-5">Go Back</button>}
                
                    </div>
      
   


  )
}
