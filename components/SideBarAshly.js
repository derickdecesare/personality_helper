import React from "react";
import { Fragment, useState } from "react";
import AshlySelect from "../components/AshlySelect";

import { Dialog, Transition } from "@headlessui/react";
import { AiOutlineLogout } from "react-icons/ai";
import {
  Bars3Icon,
  CalendarIcon,
  ChartBarIcon,
  FolderIcon,
  HomeIcon,
  InboxIcon,
  UsersIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const navigation = [
  { name: "Helpful Mode", href: "#", icon: UsersIcon, current: true },
];

export default function SideBarAshly({ visible, setVisible, setWord, word }) {
  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
      {/* Sidebar component, swap this element with another sidebar if you like */}
      <div className="flex min-h-0 flex-1 flex-col justify-between bg-gray-800">
        <div className="flex flex-col overflow-y-auto  justify-end">
          <div className="flex flex-shrink-0 items-center justify-center px-4 py-5 bg-gray-900">
            <img
              className="h-8 w-auto"
              src="/personalitycoach.svg"
              alt="Your Company"
            />
            <h2 className="text-2xl ml-3 font-extrabold whitespace-nowrap text-blue-100">
              Ashly's GPT
            </h2>
          </div>
          <AshlySelect
            visible={visible}
            setVisible={setVisible}
            setWord={setWord}
            word={word}
          />
        </div>
        <div className="flex flex-col">
          <nav className="mt-5 flex-1 mb-5 space-y-1 px-2">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={classNames(
                  item.current
                    ? "bg-gray-900 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white",
                  "group flex items-center justify-center px-2 py-2 text-md font-medium rounded-md"
                )}
              >
                <item.icon
                  className={classNames(
                    item.current
                      ? "text-blue-300"
                      : "text-blue-400 group-hover:text-blue-300",
                    "mr-3 flex-shrink-0 h-6 w-6"
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </a>
            ))}
          </nav>

          <div className="flex flex-shrink-0 bg-gray-900 p-4">
            <a href="#" className="group block w-full flex-shrink-0">
              <div className="flex justify-between items-center">
                <div>
                  <img
                    className=" inline-block h-11 w-11 rounded-full object-cover"
                    src="/ashly.png"
                    alt=""
                  />
                </div>
                <div className="ml-3">
                  <p className="text-md font-medium text-white">
                    Ashly Apfelbeck
                  </p>
                </div>

                <div className="ml-3">
                  <AiOutlineLogout className="text-gray-400 text-4xl hover:text-gray-300" />
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
