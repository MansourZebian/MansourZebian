import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { IoIosHelpCircleOutline, IoMdLogOut } from "react-icons/io";
import { IoIosSettings } from "react-icons/io";
import axios from "axios";
import { toast } from "react-toastify";
import { FaFileCircleQuestion } from "react-icons/fa6";
function Sidebar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState({});
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    // Check if authentication token exists in localStorage
    const authToken = localStorage.getItem("token");
    if (authToken) {
      const decodedUser = jwtDecode(authToken);
      setUser(decodedUser);
      // You can validate the token here if needed
      setIsAuthenticated(true);
    }

    // Set initial state of isDrawerOpen based on screen size
    const screenWidth = window.innerWidth;
    setIsDrawerOpen(screenWidth > 635);

    // Event listener to handle resizing
    const handleResize = () => {
      const newScreenWidth = window.innerWidth;
      setIsDrawerOpen(newScreenWidth > 635);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup function for removing event listener
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  function logout() {
    axios
      .post(`https://backend.riverketaminestudy.com/api/auth/logout`, null, {
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
    <>
      <button
        onClick={toggleDrawer}
        className="inline-flex float-right p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
        aria-controls="sidebar-multi-level-sidebar"
        data-drawer-target="sidebar-multi-level-sidebar"
        data-drawer-toggle="sidebar-multi-level-sidebar"
        type="button"
      >
        <span className="sr-only">Open sidebar</span>
        <svg
          className="w-6 h-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clipRule="evenodd"
            fillRule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          ></path>
        </svg>
      </button>

      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-screen bg-white dark:bg-gray-800   shadow-lg ${
          isDrawerOpen ? "translate-x-0" : "-translate-x-full"
        } `}
      >
        <div className="px-3 py-4 overflow-y-auto">
          <div className="flex items-center space-x-4 mb-4">
            <img
              className="w-12 h-12 rounded-full"
              src="/profileimg.png"
              alt=""
            />
            <div>
              <div className="text-sm font-medium text-gray-500">
                {user.role}
              </div>
              <div className="text-lg font-bold text-black">
                {user && user.username && user.username.length > 10
                  ? `${user.username.slice(0, 10)}..`
                  : user.username}
              </div>
            </div>
          </div>
          <ul className="space-y-2 font-medium">
            <li>
              <a
                href="/admin"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <img src="/sidebar icon/home.svg" alt="" />
                <span className="ms-3">Home</span>
              </a>
            </li>
            <li>
              <a
                href="/admin/inbox"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <img src="/sidebar icon/inbox.svg" alt="" />
                <span className="ms-3">Inbox</span>
              </a>
            </li>
            <li>
              <a
                href="/admin/inbox"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <img src="/sidebar icon/chat.svg" alt="" />
                <span className="ms-3">Messages</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <img src="/sidebar icon/partner.svg" alt="" />
                <span className="ms-3">Participants</span>
              </a>
            </li>
            <li>
              <a
                href="/admin/filter/Existing"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <span className="ms-3 ml-12">Existing</span>
              </a>
            </li>
            <li>
              <a
                href="/admin/filter/Screening"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <span className="ms-3 ml-12">Screening</span>
              </a>
            </li>
          </ul>
          <div className="absolute bottom-2">
            <ul className="space-y-2 font-medium">
              <li>
                <a
                  href="/admin/screeningquestiontable"
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                >
                  <FaFileCircleQuestion size={30} />
                  <span className="ms-3">Questionaire</span>
                </a>
              </li>
              <li>
                <a
                  href="/admin/setting"
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                >
                  <IoIosSettings size={30} />
                  <span className="ms-3">Settings</span>
                </a>
              </li>
              <li>
                <a
                  href="/admin/help"
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                >
                  <IoIosHelpCircleOutline size={30} />
                  <span className="ms-3">Help</span>
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
            </ul>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
