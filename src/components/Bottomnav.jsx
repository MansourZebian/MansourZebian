import React from "react";
import { FaInfoCircle } from "react-icons/fa";
import { FiPhone } from "react-icons/fi";
import { Link } from "react-router-dom";

function Bottomnav() {
  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-20 bg-white border-t border-gray-200 dark:bg-gray-700 dark:border-gray-600">
      <div className="grid h-full max-w-lg grid-cols-6 mx-auto font-medium">
        <Link
          to="/"
          className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group"
        >
          <img
            src="/svg/home.svg"
            alt="Home"
            className="w-8 h-8 mb-2 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500"
          />
          <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">
            Home
          </span>
        </Link>
        <a
          href={process.env.REACT_APP_DISCORD}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group"
        >
          <img
          style={{transform:"scale(1.5)"}}

            src="/svg/chat.svg"
            alt="Home"
            className="w-8 h-8 mb-2 text-gray-500 dark:text-gray-400"
          />

          <span className="text-sm text-gray-500 dark:text-gray-400">
            Chat
          </span>
        </a>
        
        <Link
          to="/account"
          className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group"
        >
          <img
            src="/svg/profile.svg"
            alt="Home"
            className="w-8 h-8 mb-2 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500"
          />

          <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">
            Account
          </span>
        </Link>

        <Link
          to="https://calendly.com/river-ketamine-program/free-ketamine-consultation"
          target="_blank"
          className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group"
        >
          <FiPhone size={30} className="mb-2 text-gray-400 dark:text-gray-600" style={{strokeWidth:2, stroke:"currentColor"}}  />
          <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">
            Call
          </span>
        </Link>


       

        <Link
          to="/help"
          className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group"
        >
          <FaInfoCircle size={30} className="mb-2 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500" />
          <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">
            Help
          </span>
        </Link>
        <Link
          to="/info"
          className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group"
        >
          <img
            src="/svg/info.svg"
            alt="Home"
            className="w-8 h-8 mb-2 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500"
          />
          <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">
            Info
          </span>
        </Link>


      </div>
    </div>
  );
}

export default Bottomnav;
