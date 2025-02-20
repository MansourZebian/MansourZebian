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
        <Sidebar2 />
      </div>


      <div className='px-5 min-[696px]:px-40 lg:px-60 min-[696px]:ml-40 max-[696px]:pb-40  xl:px-80'>

        <div className='flex items-center gap-5 mb-10'>
          <FaInfoCircle size={30} />
          <h1 className='text-4xl font-bold'>Info</h1>
        </div>

        <div
  className="flex p-6 mb-6 text-base text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400 shadow-lg"
  role="alert"
>
  <div className="text-left space-y-4">
    <h2 className="text-lg font-semibold text-blue-900">
      Affordable Ketamine for Depression, Anxiety, and Chronic Pain
    </h2>

    <p className="text-sm leading-relaxed">
    RIVER’s Assimilation Program provides an accessible and affordable way to explore the benefits of at-home ketamine sessions. For just $496, you’ll receive a telehealth consultation with a licensed physician, 8 at-home ketamine sessions, and the option to request up to three refills over four months for only $15 or $25 per dose. With the support of our team, 
    you’ll have guidance every step of the way—from your initial assessment to scheduling and ongoing support.
    </p>

    <p className="text-sm leading-relaxed">
      <a
        href="https://www.riverofchange.org"
        className="text-blue-700 hover:underline font-medium block"
        target="_blank"
        rel="noopener noreferrer"
      >
        www.riverofchange.org
      </a>
      <a
        href="https://www.youtube.com/watch?v=YH_mmHruLPg&t"
        className="text-blue-700 hover:underline font-medium block"
        target="_blank"
        rel="noopener noreferrer"
      >
        Watch on YouTube
      </a>
    </p>
  </div>
</div>


        {/* <div class="flex p-6 mb-6 text-base text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400 shadow-lg" role="alert">
          <div class="text-left space-y-4">
            <h2 class="text-lg font-semibold text-blue-900">Affordable Ketamine for Depression, Anxiety, and Chronic Pain
            </h2>
            <p class="text-sm leading-relaxed">
              RIVER’s Assimilation Program provides an accessible and affordable way to explore the benefits of at-home ketamine sessions. For just $496, you’ll receive a telehealth consultation with a licensed physician, 8 at-home ketamine sessions, and the option to request up to three refills over four months for only $15 or $25 per dose. With the support of our team, you’ll have guidance every step of the way—from your initial assessment to scheduling and ongoing support.
            </p>
            <p class="text-sm leading-relaxed">

              www.riverofchange.org
              https://www.youtube.com/watch?v=YH_mmHruLPg&t
            </p>
          </div>
        </div> */}




      </div>




      <div className='min-[696px]:invisible'>
        <Bottomnav />
      </div>
    </>
  )
}

export default Info