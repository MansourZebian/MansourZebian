import React, { useEffect, useState } from 'react'
import Sidebar from '../../components/Sidebar'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'
import { toast } from 'react-toastify'
import { jwtDecode } from 'jwt-decode'
import { TbHelpSquareRounded } from 'react-icons/tb'

function Help() {

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


<Sidebar/>
<div class="p-10 sm:ml-64 bg-[#f7f7f7]">

        <div className='flex items-center gap-5'>
        <TbHelpSquareRounded size={40} />
            <h1 className='text-4xl font-bold'>Help</h1>
        </div>

        <div className='float-left mt-10'>
          
<div class="flex p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400" role="alert">

<div className='text-left'>
Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
</div>
</div> 
        </div>

</div>
    </>
  )
}

export default Help