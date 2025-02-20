import React, { useEffect, useState } from "react";
import Navbar1 from "../components/Navbar1";
import Bottomnav from "../components/Bottomnav";
import Checkcards from "../components/Checkcards";
import Sidebar2 from "../components/Sidebar2";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

function Refill() {
  const [data, setData] = useState([]);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading,setIsLoading]=useState(false)

  const [user, setUser] = useState({});
  const [isDisabled, setIsDisabled] = useState(false);
  const [screening, setScreening] = useState([]);
  const [refillInfo, setRefillInfo] = useState([])

  const [lastRefillId, setLastRefillId] = useState(null);




  const navigate = useNavigate()

  useEffect(() => {
    // Check if authentication token exists in localStorage
    const authToken = localStorage.getItem("token");
    if (authToken) {
      const decodedUser = jwtDecode(authToken);
      setUser(decodedUser);
      // You can validate the token here if needed
      getScreeningData(decodedUser.id);
      setIsAuthenticated(true);

      // getLastRefillIdFilled(decodedUser.id);

    }
  }, []);


  useEffect(() => {
    const interval = setInterval(() => {
      if (user?.id) {
        getRefilledScore(user.id);
      }
    }, 5000); // 5000 milliseconds = 5 seconds

    return () => clearInterval(interval); // Cleanup on component unmount
  }, [user]);



  // const getLastRefillIdFilled = async (id) => {

  //   try {
  //     const response = await axios.get(
  //       `${process.env.REACT_APP_BACKEND_URL}score/getLastRefillId/${id}`, //userId
  //       {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem("token")}`,
  //         },
  //       }
  //     );
  //     console.log("score /getLastRefillId data.............>", response.data?.refillId);
  //     setLastRefillId(response.data?.refillId);
  //   } catch (error) {
  //     console.log(error); // Log any errors that occur during the request
  //   }

  // }
  const getRefilledScore = async (id) => {

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}score/${id}`, //userId
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("score data.............>", response?.data);

      let filteredResponse = response?.data?.filter(item => {
        const createdAt = new Date(item?.createdAt);
        const twentyDaysAgo = new Date();
        twentyDaysAgo.setDate(twentyDaysAgo.getDate() - 20);
        return createdAt > twentyDaysAgo;
      });

      console.log('see filteredResponse', filteredResponse)
      setRefillInfo(filteredResponse)



    } catch (error) {
      console.log(error); // Log any errors that occur during the request
    }

  }

  const getScreeningData = async (id) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}screeningformanswer/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      // console.log("getScreeningData", response.data); // Log the data received from the backend
      setScreening(response.data); // Set the data to state if needed
    } catch (error) {
      console.log(error); // Log any errors that occur during the request
    }
  };

  const getQuestions = async () => {
    await axios
      .get(`${process.env.REACT_APP_BACKEND_URL}refill`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setData(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    //  getData();
    getQuestions();
  }, []);

  { console.log('user', user) }

  const submit = async () => {

    if (!user?.id || !user?.first_name || !user?.last_name || !user?.email) {

      toast.error("Some error occured, Please refresh the page");
      return
    }


    setIsDisabled(true);
    setIsLoading(true)
    try {
      const key = uuidv4();
      await Promise.all(
        data?.map(async (ques) => {
          const response = await axios.post(
            `${process.env.REACT_APP_BACKEND_URL}refill/userrefill`,
            {
              uid: user?.id,
              r_id: ques?.id,
              status: "active",
              answer: "", // You might need to adjust this part according to your data
              key: key, // You might need to adjust this part according to your data
              optionanswer: ques?.answer, // You might need to adjust this part according to your data


          


            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          console.log(response.data); // Logging the response if needed
        })
      );





          // for creating new entry in existing form  passing userId,first_name,last_name,email

          await axios.post(
            `${process.env.REACT_APP_BACKEND_URL}existingforms/create`,
            {
              userId: user.id,
              first_name: user.first_name,
              last_name: user.last_name,
              email: user.email,
              type: "Refill",
              active:true
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          ).then((response) => {
            setIsLoading(false)

            console.log('see response', response)
            toast.success("Submitted successfully!");

          }).catch((error) => {
            setIsLoading(false)
            console.log('error ',error)
            toast.error("Some Error occured!");

            return
          })

          

      // update the type
      // try {
        //update existingform.type to "Refill"

      /*
  axios.put(`${process.env.REACT_APP_BACKEND_URL}existingforms/updatetype/${user?.id}`,
          {
            type: "Refill"
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        ).then((response) => {
          console.log('see response', response)
          

        }
        ).catch((error) => {
          toast.error("Error submitting data");
          console.log("error", error)
          return
        })      
      */


          // setTimeout(() => {
          //   window.location = "/payment";
          // }, 2000);
          // setTimeout(() => {
          //   // window.location = "/";
          //   // navigate('/')
          //   navigate(-1)
          // }, 2000);


      // } catch (error) {
      //   toast.error("Error submitting data");
      //   console.log("error", error)
      //   setIsDisabled(false);

      //   return
      // }


    } catch (error) {
      setIsDisabled(false);
      setIsLoading(false)
      toast.error("Error submitting data: " + error);
      console.error("Error submitting data:", error); // Log error if submission fails
    }
  };





  return (
    <>
      <Navbar1 />
      <div className="max-[696px]:invisible">
        <Sidebar2 />
      </div>

      <div className="px-5 min-[696px]:px-40 lg:px-60 min-[696px]:ml-40 max-[696px]:pb-40  xl:px-80">
        {/* <div className='px-5 flex flex-col w-full items-start mb-40'> */}

        <p className="text-[#A0A0A0]  text-sm mb-5 text-left">
          Date filled: {new Date().toLocaleDateString()}
        </p>

        {data.map((item, index) => (
          <div key={index} className="mb-4">
            <p className="text-black font-bold text-left">{item.question}</p>

            {item.option !== null &&
              JSON.parse(item.option).map((option, index_) => (
                <div className="flex flex-col items-start">
                  <label className="text-black mr-3">
                    <input
                      type="radio"
                      value={option}
                      checked={item.answer === option}
                      onChange={(e) => {
                        setData((prevData) => {
                          const updatedData = [...prevData];
                          updatedData[index].answer = e.target.value;
                          return updatedData;
                        });
                      }}
                    />{" "}
                    {option}
                  </label>
                </div>
              ))}

            {item.requiredanswer && (
              <input
                type="search"
                id="search"
                className="mt-2 h-10 block w-full p-4 ps-5 text-sm text-gray-900 border rounded-lg bg-[#f2f2f2] focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 placeholder-black dark:placeholder-black dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Type your answer here"
                required
                value={item.inputanswer}
                onChange={(e) => {
                  setData((prevData) => {
                    const updatedData = [...prevData];
                    updatedData[index].inputanswer = e.target.value;
                    return updatedData;
                  });
                }}
              />
            )}
          </div>
        ))}


        {/* added refill option */}
        <div className="w-full text-red-600 text-lg font-bold my-5">
          <p>Instruction: Please fill out  the forms below and then click Submit to proceed with your refill request</p>
        </div>

        <a
          className={refillInfo?.some((item) => item.key === "phq9") ? "cursor-not-allowed pointer-events-none opacity-100" : ""}

          href={
            refillInfo?.some((item) => item.key === "phq9") ? "" : "/refill/phq9"
          }
          // href={
          //   "/refill/phq9"
          // }
          target="_blank"
          rel="noopener noreferrer"

        >
          <Checkcards
            title={"PHQ9"}
            checktitle={
              refillInfo?.some((item) => item.key === "phq9") ? "Refilled PHQ9" : "Refill PHQ9"
            }
            disabled={refillInfo?.some((item) => item.key === "phq9") ? true : false}

          />
        </a>
        <a

          // className={refillInfo?.some((item) => item.key === "pcl5") ? "cursor-not-allowed pointer-events-none opacity-100" : ""}

          href={
            refillInfo?.some((item) => item.key === "pcl5") ? "" : "/refill/pcl5"
          }
          target="_blank"
        >
          <Checkcards
            title={"PCL5"}
            checktitle={
              refillInfo?.some((item) => item.key === "pcl5") ? "Refilled PCL5" : "Refill PCL5"
            }
            disabled={refillInfo?.some((item) => item.key === "pcl5") ? true : false}

          />
        </a>

        {console.log('>>', refillInfo.some((item) => item?.key === 'gad7'))}

        <a

          className={refillInfo?.some((item) => item?.key === "gad7") ? "cursor-not-allowed pointer-events-none opacity-100" : ""}

          href={
            refillInfo?.some((item) => item?.key === "gad7") ? "" : "/refill/gad7"
          }
          // href={
          //   "/refill/gad7"
          // }
          target="_blank"
        >
          <Checkcards
            title={"GAD7"}
            checktitle={
              refillInfo?.some((item) => item.key === "gad7") ? "Refilled GAD7" : "Refill GAD7"
            }
            disabled={refillInfo?.some((item) => item.key === "gad7") ? true : false}

          />
        </a>

        {/* {alert(JSON.stringify(setScreening))} */}
        {/* <Link to={'/screening/phq'}>

          <Checkcards
            title={"PHQ9"}
            checktitle="Complete form"
            transparent={true}
          />
        </Link>

        <Checkcards
          title={"PCL5"}
          checktitle="Complete form"
          transparent={true}
        />

        <Checkcards
          title={"GAD7"}
          checktitle="Complete form"
          transparent={true}
        />

        <Checkcards
          title={"Entry Questionnaire"}
          checktitle="Complete form"
          transparent={true}
        /> */}

        <div className="flex items-center w-full justify-center">
          <button
            disabled={isLoading}
            type="button"
            onClick={submit}
            className={`mb-4 bg-[#7b89f8]  hover:bg-[#CBC3E3] text-white py-2 px-20 rounded-full shadow-md ${isLoading ? "shadow-[#FFC107]" : "shadow-[#7b89f8]"} mt-10`}
          >
            {isLoading?"Loading..":"Submit"}
          </button>
        </div>
      </div>

      <div className="min-[696px]:invisible">
        <Bottomnav />
      </div>
    </>
  );
}

export default Refill;
