import React, { useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode';
import { FaRegBell } from 'react-icons/fa6';
function Navbar2() {

    
  const [user, setUser] = useState({});
  


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

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location = '/login';
  };


  return (
    <div className='flex justify-between px-6 py-10'>

    <div className='flex '>
    <img src="/profileimg.png" alt="" />
    <div className='mt-2  '> 
    <div className=' text-gray-500  '>Account #{user.id}</div>
    <div className=' text-black  font-bold float-start '>{user && user.username && user.username.length > 10 ? `${user.username.slice(0, 10)}..` : user.username}
</div>
    </div>
    </div>
    

    <img src="/notificationicon.png" className=' w-8 h-10  mt-2 ' alt="" />
   

    </div>
  )
}

export default Navbar2