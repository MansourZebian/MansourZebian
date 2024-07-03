import React, { useEffect, useState } from "react";
import Navbar1 from "../components/Navbar1";
import Bottomnav from "../components/Bottomnav";
import Checkcards from "../components/Checkcards";
import Sidebar2 from "../components/Sidebar2";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import { FaInfoCircle } from "react-icons/fa";

function Info() {
  const [user, setUser] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    // Check if authentication token exists in localStorage
    const authToken = localStorage.getItem("token");
    if (authToken) {
      const decodedUser = jwtDecode(authToken);
      setUser(decodedUser);
      // You can validate the token here if needed

      setIsAuthenticated(true);
    }
  }, []);

  return (
    <>
      <Navbar1 />
      <div className="max-[696px]:invisible">
        <Sidebar2 />
      </div>

      <div className="px-5 min-[696px]:px-40 lg:px-60 min-[696px]:ml-40 max-[696px]:pb-40  xl:px-80">
        <div className="flex items-center gap-5 mb-10">
          <FaInfoCircle size={30} />
          <h1 className="text-4xl font-bold">Info</h1>
        </div>

        <div
          class="flex p-4 mb-4 text-md text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400"
          role="alert"
        >
          <div className="text-left">
          Affordable Ketamine for
          Depression, Anxiety, and Chronic
          Pain. <br /> 
          <a className='text-red-700 underline' href='https://riverofchange.org/'>Learn More.</a>
  
          </div>
        </div>
      </div>

      <div className="min-[696px]:invisible">
        <Bottomnav />
      </div>
    </>
  );
}

export default Info;
