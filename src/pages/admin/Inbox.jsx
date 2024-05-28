import React, { useEffect, useRef, useState } from 'react'
import Sidebar from '../../components/Sidebar'
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup';
import { toast } from 'react-toastify';
function Inbox() {


    const [data, setData] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const [user, setUser] = useState({});
    const [isDisabled, setIsDisabled] = useState(false);

    const [chatData , setChatData] = useState([]);

    const [ receiverid, setReceiverid] = useState('');

    const chatContainerRef = useRef(null);

    useEffect(() => {
      // Scroll to the bottom of the chat container when chatData changes
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    }, [chatData]);

 

    useEffect(() => {
      // Check if authentication token exists in localStorage
      const authToken = localStorage.getItem('token');
      if (authToken) {
        const decodedUser = jwtDecode(authToken);
          setUser(decodedUser);
        // You can validate the token here if needed
         getChats(decodedUser.id); 
        setIsAuthenticated(true);
      }
      
    }, []);

    useEffect(() => {
      const interval = setInterval(() => {
        // Refresh chat every 5 seconds
        if (user.id) {
          RefreshChat(receiverid);
          readmsgbyuser(user.id);
        }
      }, 5000);
  
      return () => clearInterval(interval); // Cleanup interval on unmount
  
    }, [user.id, receiverid]);
  


    const getChats =  async(id) => { 
        await axios.get(`${process.env.REACT_APP_BACKEND_URL}chat/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          })
          .then((response) => {
            setData(response.data);
          
           
            console.log(response.data);
          }).catch((error) => {
            console.log(error);
          });

     }

     const RefreshChat =  async(id) => {
      await axios.get(`${process.env.REACT_APP_BACKEND_URL}chat/${user.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      })
      .then((response) => {
        setData(response.data);
      setChatData(response.data.filter((chat)=> chat.senderid === id || chat.uid === id));
        console.log(response.data);
      }).catch((error) => {
        console.log(error);
      });
     }

     const readmsgbyuser = async(id) => {
      try{
        await axios.post(`${process.env.REACT_APP_BACKEND_URL}chat/readmsgbyuser/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        })
        .then((response) => {
          console.log("readmsgbyuser",response.data);
        }).catch((error) => {
          console.log(error);
        });
      }catch(error){
        console.log(error);
      }
     }


    const handleChat = (id)=>{

      setReceiverid(id);

      //.filter((chat) => chat.senderId === uid || chat.receiverId === uid)
      setChatData(data.filter((chat)=> chat.senderid === id || chat.uid === id));

     }

  
     



  return (
    <>


<Sidebar/>
<div class="p-10 sm:ml-64 bg-[#f7f7f7]">

<div className='min-[1025px]:flex items-center gap-5'>

<div className='bg-white min-[1025px]:w-[28%] max-[1025px]:mb-10 shadow-lg h-[70vh] p-4 rounded-lg overflow-y-auto overflow-x-auto '>
    
{data.length == 0 && <div className='text-center mt-10 text-gray-500'>No User Found</div>}
   
{data.length > 0 && 
  data
    .slice()
    .reverse()
    .filter((message, index, self) => 
      index === self.findIndex((m) => m.uid !== user.id )
    ) // Filter out duplicate messages based on sender's ID
    .map((message, index) => (
      <div className='flex border-b pb-4 mt-4'  key={index}>
        <img src="/profileimg.png" alt="" />
        <div className='mt-2'> 
         <a href='#' onClick={() => handleChat(message.User.id)}> <div  className='text-gray-500 font-bold text-left '>{message.User.username}</div></a>
         <div className='text-black float-start'>
  {data
    .filter(chat => chat.senderid === message.User.id || chat.uid === message.User.id)
    .filter(chat => chat.message !== "97ca33b8cbe28233cf300826e85c26bc")
    [data
      .filter(chat => chat.senderid === message.User.id || chat.uid === message.User.id)
      .filter(chat => chat.message !== "97ca33b8cbe28233cf300826e85c26bc")
      .length - 1
    ].message}
</div>
        </div>
      </div>
    ))
}



</div>

<div className=' relative bg-white min-[1025px]:w-[68%] shadow-lg h-[70vh] p-4 rounded-lg '>

<div className='overflow-y-auto overflow-x-auto  h-[55vh] '  ref={chatContainerRef}>
    {/* Chat messages */}

    {chatData.length == 0 && <div className='text-center mt-10 text-gray-500'>No messages found</div>}
   

    {chatData.length > 0 && chatData.filter((msg)=> msg.message !== "97ca33b8cbe28233cf300826e85c26bc" ).map((message, index) => (
        
   <>
   <div className='mt-2'  style={{ clear: 'both' }}></div> {/* Clearing element */}
    {message.senderid !== user.id ? (
        <div className='float-left w-[40%] p-4 rounded-lg bg-[#c6caef] text-left'>
        <p>{message.message}</p>
        </div>
    ):(
<div className='flex justify-end items-center'>
        <div className='text-white p-4 rounded-lg bg-[#8399fb] text-left'>
            <p>{message.message}</p>
        </div>
        <div>
            <img src="/profileimg.png" height={40} width={40} alt="" />
        </div>
    </div>
    )}
    

    

    

    </>

    ))}
    {/* Send msg */}

    {receiverid !== '' && 

    <div className='absolute bottom-0 left-0 p-4 w-full  '>
      <Formik initialValues={{message: ''}} 
      onSubmit={async (values, {resetForm}) => {
        const formData = new FormData();
        formData.append('message', values.message);
        formData.append('senderid', user.id);
        formData.append('uid', receiverid);
     
        try {
          const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}chat/send`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${localStorage.getItem("token")}`
            },
          });
          if (response.status === 200) {
            RefreshChat(receiverid);
            toast.success('Message sent successfully');
            resetForm();
          } else {
            toast.error('Failed to send message');
          }
        } catch (error) {
          console.error(error);
          toast.error('Failed to send message');
        }

      }
            }
      validationSchema={Yup.object({message: Yup.string().required('Required')})}>
        <Form>
        <div className='flex  gap-3 items-center p-4 justify-center '>
          <div className='w-[90%] '>
            <Field type="text" name="message" placeholder='Type your message' className='w-[90%] border h-10 border-[#dbdbdb] p-2 rounded-lg' />
            
          </div>
            <button type="submit"><img src="/svg/Send message burtton.svg"  height={30} width={30} alt="" /></button>
        </div>
        </Form>
        </Formik>
    </div>
  }

    </div>

</div>



   
</div>

    
</div>
</>
  )
}

export default Inbox