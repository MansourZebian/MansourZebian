import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { FaRegBell } from "react-icons/fa6";
import axios from "axios";
function Navbar1() {
  const [user, setUser] = useState({});

  const [unreadmsg, setunreadmsg] = useState(1);

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if authentication token exists in localStorage
    const authToken = localStorage.getItem("token");
    if (authToken) {
      const decodedUser = jwtDecode(authToken);
      setUser(decodedUser);
      readmsgbyuser(decodedUser.id);
      // You can validate the token here if needed
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location = "/login";
  };

  const readmsgbyuser = async (id) => {
    try {
      await axios
        .get(`https://backend.riverketaminestudy.com/api/chat/count/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((response) => {
          console.log(response.data.count);
          setunreadmsg(response.data.count);
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex justify-between px-6 py-10">
      <div className="flex ">
        <img src="/profileimg.png" alt="" />
        <div className="mt-2  ">
          <div className=" text-gray-500  ">Account #{user.id}</div>
          <div className=" text-black  font-bold float-start ">
            {user && user.username && user.username.length > 10
              ? `${user.username.slice(0, 10)}..`
              : user.username}
          </div>
        </div>
      </div>

      <a href="/chatting">
        <div className="flex mt-2">
          <FaRegBell className=" w-8 h-10  " color="gray" />
          <p className=" text-white bg-red-500 rounded-full w-5 h-5 flex justify-center items-center ">
            {unreadmsg || 1}
          </p>
        </div>
      </a>
    </div>
  );
}

export default Navbar1;
