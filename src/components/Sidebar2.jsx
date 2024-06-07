import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { IoIosHelpCircleOutline } from "react-icons/io";
import { IoIosSettings } from "react-icons/io";
import axios from "axios";
import { toast } from "react-toastify";
import { IoMdLogOut } from "react-icons/io";

function Sidebar2() {
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

  function logout() {
    axios
      .post(`https://backed.riverketaminestudy.com/api/auth/logout`, null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(() => {
        toast.success("Logout successful");
        // Redirect to login page after successful logout
        localStorage.removeItem("token");
        window.location.href = "/login";
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  }

  return (
    <aside
      id="sidebar-multi-level-sidebar"
      class="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"
      aria-label="Sidebar"
    >
      <div class="h-full px-3 py-4 overflow-y-auto bg-[#ffffff] dark:bg-gray-800">
        <ul class="space-y-2 font-medium">
          <li>
            <div className="flex ">
              <img src="/profileimg.png" alt="" />
              <div className="mt-2  ">
                <div className=" text-gray-500 text-left  ">
                  Account #{user.id}
                </div>

                <div className=" text-black  font-bold float-start  ">
                  {user && user.username && user.username.length > 10
                    ? `${user.username.slice(0, 10)}..`
                    : user.username}
                </div>
              </div>
            </div>
          </li>

          <li>
            <a
              href="/"
              class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
            >
              <img src="/sidebar icon/home.svg" alt="" />
              <span class="ms-3">Home</span>
            </a>
          </li>

          <li>
            <a
              href="/chatting"
              class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
            >
              <img src="/sidebar icon/chat.svg" alt="" />
              <span class="ms-3">Chat with us</span>
            </a>
          </li>

          <li>
            <a
              href="/account"
              class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
            >
              <img src="/profileicon.png" alt="" />
              <span class="ms-3">Account</span>
            </a>
          </li>

          <div className="absolute bottom-2">
            <li>
              <a
                href="/info"
                class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <IoIosHelpCircleOutline size={30} />
                <span class="ms-3">Info</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                onClick={logout}
                class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <IoMdLogOut size={30} />
                <span class="ms-3">Logout</span>
              </a>
            </li>
          </div>
        </ul>
      </div>
    </aside>
  );
}

export default Sidebar2;
