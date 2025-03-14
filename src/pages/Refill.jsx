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
  const [isLoading, setIsLoading] = useState(false)

  const [user, setUser] = useState({});
  const [isDisabled, setIsDisabled] = useState(false);
  const [screening, setScreening] = useState([]);
  const [refillInfo, setRefillInfo] = useState([])
  const [userRefillInfo, setUserRefillInfo] = useState({ refillsAllowed: null, refillDuration: null })

  const [refill_length, setRefill_length] = useState(0);
  const [allowRefill, setAllowRefill] = useState(false);
  const [isRefillAllowed, setIsRefillAllowed] = useState(false);
  const [refillTime, setRefillTime] = useState(null);



  const [lastRefillId, setLastRefillId] = useState(null);




  const navigate = useNavigate()

  useEffect(() => {
    // Check if authentication token exists in localStorage
    const authToken = localStorage.getItem("token");
    if (authToken) {
      const decodedUser = jwtDecode(authToken);
      getRefilledScore(decodedUser.id); //also being running in interval
      getRefillStatus(decodedUser)

      setUser(decodedUser);
      // You can validate the token here if needed
      getScreeningData(decodedUser.id);
      setIsAuthenticated(true);

      // getLastRefillIdFilled(decodedUser.id);

      getRefill(decodedUser.id);

    }

  }, []);

  const getRefill = async (id) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}refill/answers/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const refill = response.data;

      // Group records by day
      const groupedRefill = refill.reduce((acc, item) => {
        const key = item.key; // Assuming day is the key to group by
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(item);
        return acc;
      }, {});

      // console.log("refill", groupedRefill);

      // Check if any group has less than 3 records
      const lessThanThree = Object.values(groupedRefill).length < Number(userRefillInfo?.refillsAllowed);
      // console.log("lessThanThree", lessThanThree);
      setRefill_length(Object.values(groupedRefill).length);
      // console.log(lessThanThree);
      setAllowRefill(lessThanThree);
    } catch (error) {
      console.log(error); // Log any errors that occur during the request
      return false;
    }
  };


  const getRefillStatus = async (decodedUser) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}score/${decodedUser?.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // setScores(response.data); // Store the scores in state

      // Find the latest createdAt timestamp
      const latestScore = response.data.reduce((latest, score) => {
        const createdAt = new Date(score.createdAt);
        return createdAt > latest ? createdAt : latest;
      }, new Date(0));

      let token = localStorage.getItem("token");
      let user = jwtDecode(token);
      let userId = user?.id;

      axios.get(`${process.env.REACT_APP_BACKEND_URL}users/getUserRefillInfo/${userId}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }).then((response) => {
          console.log("response", response.data)

          // setUserRefillInfo(response.data)

          //  
          let days = Number(response.data?.refillDuration) || 0;

          let refillTime = new Date(latestScore);

          // console.log('days', days)
          // refillTime.setDate(refillTime.getDate() + 20); // This properly handles month transitions

          refillTime.setDate(refillTime.getDate() + days); // This properly handles month transitions
          console.log('see refilltime', refillTime)
          setRefillTime(refillTime); // Store the refill time in state

          // Check if the current date has passed the refill time
          const currentTime = new Date();
          setIsRefillAllowed(currentTime >= refillTime);




        })
        .catch((error) => {

          console.log(error);
        });

      // Correctly calculate the refill date by adding 20 days

    } catch (error) {
      console.log(error); // Log any errors that occur during the request
    }
  };


  useEffect(() => {
    const interval = setInterval(() => {
      if (user?.id) {
        getRefilledScore(user.id);
      }
    }, 5000); // 5000 milliseconds = 5 seconds

    return () => clearInterval(interval); // Cleanup on component unmount
  }, [user]);

  // to get current length of refill

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
      // console.log("score data.............>", response?.data);


      let token = localStorage.getItem("token");
      let user = jwtDecode(token);
      let userId = user?.id;
      let refillDuration = null;

      axios.get(`${process.env.REACT_APP_BACKEND_URL}users/getUserRefillInfo/${userId}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }).then((resp) => {
          // console.log("response", response.data)

          setUserRefillInfo(resp.data)
          refillDuration = Number(resp.data?.refillDuration)


          let filteredResponse = response?.data?.filter(item => {
            const createdAt = new Date(item?.createdAt);
            const twentyDaysAgo = new Date();
            // twentyDaysAgo.setDate(twentyDaysAgo.getDate() - 20);

            twentyDaysAgo.setDate(twentyDaysAgo.getDate() - refillDuration);
            // console.log('createdAt', createdAt)
            // console.log('twentyDaysAgo', twentyDaysAgo)
            // console.log("Number(userRefillInfo?.refillDuration)", days)

            return createdAt > twentyDaysAgo;
          });

          // console.log('see filteredResponse', filteredResponse)

          // console.log('see filteredResponse', filteredResponse)
          setRefillInfo(filteredResponse)


          // console.log("refillDuration", refillDuration)
        }).catch((error) => {
          console.log("error", error)
        })










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
        // console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    //  getData();
    getQuestions();
  }, []);

  // { console.log('user', user) }

  const submit = async () => {

    if (!user?.id || !user?.first_name || !user?.last_name || !user?.email) {

      toast.error("Some error occured, Please refresh the page");
      return
    }






    setIsDisabled(true);
    setIsLoading(true)

    //getting if refill is allowed by getting refill count last filled
    try {

      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}refill/answers/${user?.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const refill = response.data;

      // Group records by day
      const groupedRefill = refill.reduce((acc, item) => {
        const key = item.key; // Assuming day is the key to group by
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(item);
        return acc;
      }, {});



      // console.log("refill", groupedRefill);

      // Check if any group has less than 3 records
      const allowedLimit = Object.values(groupedRefill).length < Number(userRefillInfo?.refillsAllowed);

      // console.log(lessThanThree);

      // console.log("is Refill allowed", lessThanThree);
      if (!allowedLimit) {
        toast.error(`You have already filled the Refill form ${userRefillInfo?.refillsAllowed} times`);
        setIsLoading(false)
        return
      }




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
          active: true
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
        navigate('/') // go back to previous page

      }).catch((error) => {
        setIsLoading(false)
        console.log('error ', error)
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
            (!(refill_length < userRefillInfo?.refillsAllowed) || refillInfo?.some((item) => item.key === "phq9")) ? "#" : "/refill/phq9"
          }
          onClick={(e) => {
            if (!(refill_length < userRefillInfo?.refillsAllowed) || refillInfo?.some((item) => item.key === "phq9")) {
              e.preventDefault(); // Prevent navigation
              alert("You cannot navigate at this time."); // Optional: Show a message
            }
          }}
          // href={
          //   "/refill/phq9"
          // }
          target="_blank"
          rel="noopener noreferrer"

        >
          <Checkcards
            title={"PHQ9"}
            checktitle={
              (!(refill_length < userRefillInfo?.refillsAllowed) || refillInfo?.some((item) => item.key === "phq9")) ? "Refilled PHQ9" : "Refill PHQ9"
            }
            disabled={!(refill_length < userRefillInfo?.refillsAllowed) || refillInfo?.some((item) => item.key === "phq9") ? true : false}

          />
        </a>
        <a

          className={refillInfo?.some((item) => item?.key === "pcl5") ? "cursor-not-allowed pointer-events-none opacity-100" : ""}


          // className={refillInfo?.some((item) => item.key === "pcl5") ? "cursor-not-allowed pointer-events-none opacity-100" : ""}

          href={
            (!(refill_length < userRefillInfo?.refillsAllowed) || refillInfo?.some((item) => item.key === "pcl5")) ? "" : "/refill/pcl5"
          }
          onClick={(e) => {
            if (!(refill_length < userRefillInfo?.refillsAllowed) || refillInfo?.some((item) => item.key === "pcl5")) {
              e.preventDefault(); // Prevent navigation
              alert("You cannot navigate at this time."); // Optional: Show a message
            }
          }}

          target="_blank"
        >
          <Checkcards
            title={"PCL5"}
            checktitle={
              (!(refill_length < userRefillInfo?.refillsAllowed) || refillInfo?.some((item) => item.key === "pcl5")) ? "Refilled PCL5" : "Refill PCL5"
            }
            disabled={!(refill_length < userRefillInfo?.refillsAllowed) || refillInfo?.some((item) => item.key === "pcl5") ? true : false}

          />
        </a>

        {/* {console.log('>>', refillInfo.some((item) => item?.key === 'gad7'))} */}

        <a

          className={refillInfo?.some((item) => item?.key === "gad7") ? "cursor-not-allowed pointer-events-none opacity-100" : ""}

          href={
            (!(refill_length < userRefillInfo?.refillsAllowed) || refillInfo?.some((item) => item.key === "gad7")) ? "" : "/refill/gad7"
          }

          onClick={(e) => {
            if (!(refill_length < userRefillInfo?.refillsAllowed) || refillInfo?.some((item) => item.key === "gad7")) {
              e.preventDefault(); // Prevent navigation
              alert("You cannot navigate at this time."); // Optional: Show a message
            }
          }}
          // href={
          //   "/refill/gad7"
          // }
          target="_blank"
        >
          <Checkcards
            title={"GAD7"}
            checktitle={
              (!(refill_length < userRefillInfo?.refillsAllowed) || refillInfo?.some((item) => item.key === "gad7")) ? "Refilled GAD7" : "Refill GAD7"
            }
            disabled={!(refill_length < userRefillInfo?.refillsAllowed) || refillInfo?.some((item) => item.key === "gad7") ? true : false}

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
            disabled={ isLoading}
            type="button"
            onClick={submit}
            className={`mb-4  bg-[#7b89f8]  hover:bg-[#CBC3E3] text-white py-2 px-20 rounded-full shadow-md ${isLoading ? "shadow-[#FFC107]" : "shadow-[#7b89f8]"} mt-10`}
          >
            {isLoading ? "Loading.." : "Submit"}
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
