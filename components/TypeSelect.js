import React from "react";

export default function TypeSelect({ type, setType }) {
  console.log(type);

  function setTypeRefresh(e) {
    setType(e.target.value);
  }

  return (
    <div className=" flex flex-col items-center mt-10">
      <label
        htmlFor="site"
        className="block text-xl text-center text-white font-bold px-10 pointer-events-none "
      >
        Select Your Personality Type
      </label>
      <select
        id="site"
        name="site"
        className="block w-1/2 rounded-md outline-none border-2 border-blue-400  mt-2 py-3 pl-3 pr-10 text-white  text-base  bg-gray-900 sm:text-md"
        value={type}
        onChange={setTypeRefresh}
      >
        <option>ISTJ</option>
        <option>ISFJ</option>
        <option>INFJ</option>
        <option>INTJ</option>
        <option>ISTP</option>
        <option>INTP</option>
        <option>ISFP</option>
        <option>INFP</option>
        <option>ESTP</option>
        <option>ESFP</option>
        <option>ENFP</option>
        <option>ENTP</option>
        <option>ESTJ</option>
        <option>ESFJ</option>
        <option>ENFJ</option>
        <option>ENTJ</option>
      </select>
    </div>
  );
}
