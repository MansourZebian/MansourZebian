import React, { useEffect, useState } from 'react'
import Bottomnav from '../components/Bottomnav';
import Checkcards from '../components/Checkcards';
import Navbar1 from '../components/Navbar1';
import Sidebar2 from '../components/Sidebar2';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';

function Survey() {

    const [data, setData] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const [user, setUser] = useState({});
    const [isDisabled, setIsDisabled] = useState(false);



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


    const  getQuestions = async () => {
        await axios.get(`${process.env.REACT_APP_BACKEND_URL}survey`, {
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
    };

    useEffect(() => {
      //  getData();
      getQuestions()
    }, []);


    const submit = async () => {
      setIsDisabled(true);
      try {
        const key = uuidv4();
        await Promise.all(data.map(async (ques) => {
          const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}survey/usersurvey`, {
            uid: user.id,
            s_id: ques.id,
            status: "active",
            answer: ques.inputanswer || "", // You might need to adjust this part according to your data
            key: key, // You might need to adjust this part according to your data
            optionanswer: ques.answer // You might need to adjust this part according to your data
          }, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          });
          console.log(response.data); // Logging the response if needed
        }));
        
        toast.success("Submitted successfully!");
        setTimeout(() => {
          window.location = '/';
        }, 2000);
      } catch (error) {
        setIsDisabled(false);
        toast.error("Error submitting data: " + error);
        console.error("Error submitting data:", error); // Log error if submission fails
      }
    };

  return (
    <>
    <Navbar1 />
    <div className='max-[696px]:invisible'>
    <Sidebar2/>
    </div>

    <div className='px-5 min-[696px]:px-40 max-[696px]:pb-40 lg:px-60 min-[696px]:ml-40  xl:px-80'>
    {/* <div className='px-5 flex flex-col w-full items-start mb-40'> */}

        <p className='text-[#A0A0A0]  text-sm mb-5 text-left'>Date filled: {new Date().toLocaleDateString()}</p>
      
{data.map((item, index) => (
                    <div key={index} className='mb-4'>
                        <p className='text-black font-bold text-left'>{item.question}</p>

                        {item.option !== null && (
                          JSON.parse(item.option).map((option, index_) => (
                            <div className='flex flex-col items-start'>
                             
                                <label className='text-black mr-3'>
                                    <input type="radio" value={option} checked={item.answer === option} onChange={(e) => {
                                        setData(prevData => {
                                            const updatedData = [...prevData];
                                            updatedData[index].answer = e.target.value;
                                            return updatedData;
                                        });
                                    }} /> {option}
                                </label>
                               
                            </div>
                            ))
                        )}

                        {item.requiredanswer  && (
                         <> 
                            <input
                                type="search"
                                id="search"
                                className="mt-2 h-10 block w-full p-4 ps-5 text-sm text-gray-900 border rounded-lg bg-[#f2f2f2] focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 placeholder-black dark:placeholder-black dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="Type your answer here"
                                required
                                value={item.inputanswer}
                                onChange={(e) => {
                                    setData(prevData => {
                                        const updatedData = [...prevData];
                                        updatedData[index].inputanswer = e.target.value;
                                        return updatedData;
                                    });
                                }}
                            /> </>
                        )} 
                    </div>
                ))}


        
    <Checkcards title={"PHQ9"} checktitle="Complete form" transparent={true}/>

<Checkcards title={"PCL5"} checktitle="Complete form" transparent={true}/>

<Checkcards title={"GAD7"} checktitle="Complete form" transparent={true}/>

<Checkcards title={"Entry Questionnaire"} checktitle="Complete form" transparent={true}/>

<div className='flex items-center w-full justify-center'>
    <button disabled={isDisabled} type='button'onClick={submit} className=" mb-4 bg-[#7b89f8] hover:bg-[#CBC3E3] text-white py-2 px-20 rounded-full shadow-md shadow-[#7b89f8] mt-10">
          Submit
        </button>
        </div>
    </div>



    
    <div className='min-[696px]:invisible'>
    <Bottomnav/>
    </div>
</>
  )
}

export default Survey