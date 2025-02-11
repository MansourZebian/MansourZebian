import React, { useEffect, useState } from 'react'
import Navbar1 from '../components/Navbar1';
import Bottomnav from '../components/Bottomnav';
import Checkcards from '../components/Checkcards';
import Sidebar2 from '../components/Sidebar2';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';
import { FaInfoCircle } from 'react-icons/fa';

function Info() {

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


  return (
    <>
    <Navbar1 />
    <div className='max-[696px]:invisible'>
    <Sidebar2/>
    </div>
    

    <div className='px-5 min-[696px]:px-40 lg:px-60 min-[696px]:ml-40 max-[696px]:pb-40  xl:px-80'>
    
    <div className='flex items-center gap-5 mb-10'>
            <FaInfoCircle size={30} />
            <h1 className='text-4xl font-bold'>Info</h1>
        </div>
   
        <div class="flex p-6 mb-6 text-base text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400 shadow-lg" role="alert">
  <div class="text-left space-y-4">
    <h2 class="text-lg font-semibold text-blue-900">Welcome to the RIVER Foundation</h2>
    <p class="text-sm leading-relaxed">
      At the RIVER Foundation, we are dedicated to improving the lives of individuals seeking innovative treatments. Our primary mission is to provide a safe and supportive environment for individuals exploring the benefits of Ketamine therapy through our research-based clinical studies.
    </p>
    <p class="text-sm leading-relaxed">
      The RIVER Ketamine Study is designed to offer participants a comprehensive, step-by-step approach, ensuring they are well-informed and supported throughout their journey. Our team of dedicated professionals, led by study coordinator Vince, is committed to delivering personalized care and assistance at every stage of the process.
    </p>
  </div>
</div>



  
    </div>



    
    <div className='min-[696px]:invisible'>
    <Bottomnav/>
    </div>
</>
  )
}

export default Info