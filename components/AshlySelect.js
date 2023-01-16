import React from "react";

export default function AshlySelect({ visible, setVisible, setWord, word }) {
  function handleCute(e) {
    setWord(e.target.value);
    setVisible(true);
  }

  return (
    <div className=" flex flex-col items-center mt-10">
      <label
        htmlFor="site"
        className="block text-xl text-center text-white font-bold px-10"
      >
        Select Your Type
      </label>
      <select
        id="site"
        name="site"
        className=" block w-1/2 rounded-md border-2 border-blue-400 mt-2 py-3 pl-3 pr-10 text-white active:border-blue-800 focus:border-blue-400 text-base bg-gray-900 sm:text-md outline-none focus:outline-none"
        value={word}
        onChange={handleCute}
      >
        <option>ISFJ</option>
        <option>Cute</option>
        <option>Smart</option>
        <option>Girl</option>
        <option>Love</option>
        <option>💖</option>
      </select>
    </div>
  );
}
