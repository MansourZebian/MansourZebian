import React, { useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode';
import { IoIosHelpCircleOutline } from "react-icons/io";
import { IoIosSettings } from "react-icons/io";
import axios from 'axios';
import { toast } from 'react-toastify';
import { IoMdLogOut } from "react-icons/io";
import { Link, useNavigate } from 'react-router-dom';

function Sidebar2() {

   
    
  const [user, setUser] = useState({});
  const navigate = useNavigate()
  


  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if authentication token exists in localStorage
    const authToken = localStorage.getItem('token');
    if (authToken) {
      const decodedUser = jwtDecode(authToken);
        setUser(decodedUser);
      // You can validate the token here if needed
      setIsAuthenticated(true);
    }
  }, []);

  function logout() {
   axios
     .post(`${process.env.REACT_APP_BACKEND_URL}auth/logout`, null, {
       headers: {
         Authorization: `Bearer ${localStorage.getItem("token")}`
       }
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
    
<aside id="sidebar-multi-level-sidebar" className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">
   <div className="h-full px-3 py-4 overflow-y-auto bg-[#ffffff] dark:bg-gray-800">
      <ul className="space-y-2 font-medium">
      <li>
      <div className='flex '>
    <img src="/profileimg.png" alt="" style={{cursor:"pointer"}}  onClick={()=>navigate('/account')} />
    <div className='mt-2  '> 
    <div className=' text-gray-500 text-left ' style={{cursor:"pointer"}}>UserId #{user.id}</div>
    {/* {console.log('see user',user)} */}
   
    <div className=' text-black  font-bold float-start  ' style={{cursor:"pointer"}}>{user && user.username && user.username.length > 10 ? `${user.username.slice(0, 15)}.` : user.username}
</div>
    </div>
    </div>
         </li>


         <li>
            <Link to="/" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
               <img src="/sidebar icon/home.svg" alt=""/>
               <span className="ms-3">Home</span>
            </Link>
         </li>
         
         <li >
            <a href={process.env.REACT_APP_DISCORD.toString()} target='_blank' className="cursor-pointer flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
               <img src="/sidebar icon/chat.svg" alt=""/>
               <span className="ms-3">Chat on Discord</span>
            </a>
         </li>

         <li>
            <Link to="/account" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
               <img src="/profileicon.png" alt=""/>
               <span className="ms-3">Account</span>
            </Link>
         </li>

         <div className='absolute bottom-2'>
        

         <li >
            <Link to="/info" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
            <IoIosHelpCircleOutline size={30} />
               <span className="ms-3">Info</span>
            </Link>
         </li>
         <li >
            <Link to="/login" onClick={logout} className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
            <IoMdLogOut size={30} />
               <span className="ms-3">Logout</span>
            </Link>
         </li>
         </div>

       

      </ul>
   </div>
</aside>
  )
}

export default Sidebar2