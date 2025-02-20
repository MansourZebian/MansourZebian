import React, { useEffect, useState } from 'react'
// import Sidebar from '../../components/Sidebar'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'
import { toast } from 'react-toastify'
import { jwtDecode } from 'jwt-decode'
import { TbHelpSquareRounded } from 'react-icons/tb'
import { Link } from 'react-router-dom'
import Sidebar2 from '../components/Sidebar2'
import Bottomnav from '../components/Bottomnav'
// import Sidebar2 from '../components/Sidebar2'

function HelpUser() {

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [user, setUser] = useState({});
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


      <Sidebar2 />
      <div class="p-10 sm:ml-64 bg-[#f7f7f7]">

        <div className='flex items-center gap-5'>
          <TbHelpSquareRounded size={40} />
          <h1 className='text-4xl font-bold'>Help</h1>
        </div>

        <div className='float-left mt-10'>

        <div
  className="flex flex-col p-6 mb-6 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400 shadow-md"
  role="alert"
>
<p className="mb-3 text-start">
  Need help? Our team is here to support you every step of the way. You can schedule a call with a RIVER Pathfinder to get personalized guidance on the program, pricing, and next steps. If you prefer, join our Discord community to ask questions, connect with others, and get real-time support from our team. Whether you need help with scheduling, payment, or general inquiries, we’re just a call or message away.
  </p>
  
  <div className="flex space-x-4">
    <a
      href="https://discord.gg/R8seedfesN"
       target='_blank'
      className="text-blue-700 hover:underline font-medium"
    >
      Join Discord
    </a>

    <a
      href="https://calendly.com/river-ketamine-program/free-ketamine-consultation"
      target='_blank'
      className="text-blue-700 hover:underline font-medium"
    >
      Schedule a Call
    </a>
  </div>
</div>


          {/* <div class="flex p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400" role="alert">

            <div className='text-left'>
              <p>Need help? Our team is here to support you every step of the way. You can schedule a call with a RIVER Pathfinder to get personalized guidance on the program, pricing, and next steps. If you prefer, join our Discord community to ask questions, connect with others, and get real-time support from our team. Whether you need help with scheduling, payment, or general inquiries, we’re just a call or message away.</p>
              <Link to={'https://discord.gg/R8seedfesN'}><p>Join Discord</p></Link>
              <Link to={'https://calendly.com/river-ketamine-program/free-ketamine-consultation'}><p>Schedule a Call</p></Link>
            </div>
          </div> */}
        </div>
        <div className='min-[696px]:invisible'>
        <Bottomnav />
      </div>

      </div>
    </>
  )
}

export default HelpUser