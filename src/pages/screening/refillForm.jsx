import React, { useEffect, useState } from "react";
import Navbar1 from "../../components/Navbar1";
import { IoIosArrowForward } from "react-icons/io";
import Bottomnav from "../../components/Bottomnav";
import Sidebar2 from "../../components/Sidebar2";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";

function RefillForm() {
  const params = useParams();
  const [data, setData] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate()
  const [userRefillInfo, setUserRefillInfo] = useState({refillsAllowed: null, refillDuration: null})

  useEffect(() => {
    // Check if authentication token exists in localStorage
    const authToken = localStorage.getItem("token");
    if (authToken) {
      const decodedUser = jwtDecode(authToken);
      setUser(decodedUser);
      // You can validate the token here if needed
      setIsAuthenticated(true);

      // let token = localStorage.getItem("token");
      // let user = jwtDecode(token);
      let userId = decodedUser?.id;

      axios.get(`${process.env.REACT_APP_BACKEND_URL}users/getUserRefillInfo/${userId}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }).then((response) => {
          // console.log("response", response.data)

          setUserRefillInfo(response.data)
        }).catch((error) => {
          console.log("error", error)
        })

    }
  }, []);

  // const getData = () => {
  //   setData([
  //     {
  //       question: "Little interest or pleasure in doing things ",
  //       option: [
  //         "Not at all",
  //         "Slightly",
  //         "Moderately"
  //       ],
  //       answer: ""
  //     },
  //     {
  //       question: "Feeling down, depressed, or hopeless",
  //       option: [
  //         "Not at all",
  //         "Slightly",
  //         "Moderately"
  //       ],
  //       answer: ""
  //     },
  //     {
  //       question: "Trouble falling or staying asleep, or sleeping too much",
  //       option: [
  //         "Not at all",
  //         "Slightly",
  //         "Moderately"
  //       ],
  //       answer: ""
  //     }
  //   ]);
  // };

  const [user, setUser] = useState({});
  const [isDisabled, setIsDisabled] = useState(false);


  const [refill_length, setRefill_length] = useState(0);
  const [allowRefill, setAllowRefill] = useState(false);

  const getQuestions = async () => {
    await axios
      .get(`${process.env.REACT_APP_BACKEND_URL}screeningform/${params.type}`, {
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
    // getData();
    getQuestions();
    // getRefill(user?.id);
  }, [params.type]);

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
      // const lessThanThree = Object.values(groupedRefill).length < 3;
      const lessThanThree = Object.values(groupedRefill).length < Number(userRefillInfo?.refillsAllowed);
      setRefill_length(Object.values(groupedRefill).length);
      // console.log(lessThanThree);
      setAllowRefill(lessThanThree);
    } catch (error) {
      console.log(error); // Log any errors that occur during the request
      return false;
    }
  };

  const submit = async () => {
    console.log(".............data", data);
    if (!user?.id) {
      toast.error("Some error occured, Please refresh the page");
      return
    }

    setIsDisabled(true);

    const filterArry = data?.map((i) =>
      i.answer == "Several days"
        ? 1
        : i.answer === "More than half the days"
          ? 2
          : i.answer === "Nearly every day"
            ? 3
            : i.answer === "Not at all"
              ? 0
              : i.answer === "A little bit"
                ? 1
                : i.answer === "Moderately"
                  ? 2
                  : i.answer === "Quite a bit"
                    ? 3
                    : i.answer === "Extremely"
                      ? 4
                      : 0
    );
    const sum = filterArry?.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0
    );

    // Convert the sum to a string
    const sumAsString = sum?.toString();
    console.log(".............filterArry", filterArry, sumAsString, user);


    //getting refill id no of times filled previously

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
      // const lessThanThree = Object.values(groupedRefill).length < 3;
      //lessThanThree can be less than refillsAllowedLimit
      const lessThanThree = Object.values(groupedRefill).length < Number(userRefillInfo?.refillsAllowed);

      setAllowRefill(lessThanThree);

      setRefill_length(Object.values(groupedRefill).length);

      let refillId = await Object.values(groupedRefill).length+1

      // console.log(lessThanThree);

      // console.log('see refillId:',refillId)
      // console.log("is Refill allowed", lessThanThree);
      if(!lessThanThree){
        toast.error(`You have already filled the Refill form ${Number(userRefillInfo?.refillsAllowed)} times`);
        return
      }

       //calling api to updated refillId in score

       await axios
       .post(
         `${process.env.REACT_APP_BACKEND_URL}score/create`,
         {
           key: data[0]?.type,
           score: parseInt(sumAsString),
           uid: user?.id,
           refillId: refillId
         },
         {
           headers: {
             Authorization: `Bearer ${localStorage.getItem("token")}`,
           },
         }
       )
       .then(async (response) => {
         
         
         // getScores();
         // scoreModal(false);
         toast.success("Score added successfully");

         ///calling api to updated refillId in 

         try {
           const key = uuidv4();
           await Promise.all(
             data.map(async (ques) => {
               // Push the answer value to the array
     
               const response = await axios.post(
                 `${process.env.REACT_APP_BACKEND_URL}screeningform/useranswer`,
                 {
                   userId: user.id,
                   screeningformId: ques.id,
                   status: "active",
                   answer: "", // You might need to adjust this part according to your data
                   key: key, // You might need to adjust this part according to your data
                   optionanswer: ques.answer, // You might need to adjust this part according to your data
                   refillId: refillId
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
     
           toast.success("Submitted successfully!");

           
                   window.close();

           // if (window.opener === null || window.opener === undefined) {
           //   window.close();
           // } else {
           //   window.opener.location.reload();
           //   window.close();
           // }
           // window.location = '/screening';
     
           //   switch (params.type) {
           //     case "phq9":
           //       window.location = "/refill/pcl5";
           //       break;
           //     case "pcl5":
           //       window.location = "/refill/gad7";  
           //       break;
           //     case "gad7":
           //       window.location = "/refill/questionnaire";
           //       break;
     
           //     default:
           //       window.location = "/refill";
           //   }
         } catch (error) {
           setIsDisabled(false);
           toast.error("Error submitting data: " + error);
           console.error("Error submitting data:", error); // Log error if submission fails
         }
         
         



       })
       .catch((error) => {
         console.log(error);
         toast.error("Error adding score");
       });
















    } catch (error) {
      console.log(error); // Log any errors that occur during the request
      return false;
    }



    // getting latestRefillId 
    // const response = await axios.get(
    //   `${process.env.REACT_APP_BACKEND_URL}score/getLastRefillId/${user?.id}`,
    //   {
    //     headers: {
    //       Authorization: `Bearer ${localStorage.getItem("token")}`,
    //     },
    //   }
    //   //getting refillId
    // ).then(async (response) => {
    //   console.log(response.data);
    //   const refillId =await response.data?.refillId;
    //   console.log('see refillId', refillId)

    // }).catch((error) => {
    //   console.log(error);
    // })







  };

  return (
    <>
      <Navbar1 />
      <div className="max-[696px]:invisible">
        <Sidebar2 />
      </div>

      <form
        className="px-5 min-[696px]:px-40 lg:px-60 max-[696px]:pb-40 min-[696px]:ml-5  xl:px-80"
        // style={{ marginRight: 2000 }}
        onSubmit={(e) => {
          e.preventDefault(); // Prevent default submission
          submit();
        }}
      >

      {/* <div
        className="px-5 min-[696px]:px-40 lg:px-60 max-[696px]:pb-40 min-[696px]:ml-5  xl:px-80"
      // style={{ marginRight: 2000 }}
      > */}
        <div className="px-5 flex flex-col items-start">
          {params.type === "phq9" && (
            <p className="text-black font-semibold mb-4">
              Form: Patient Health Questionnaire-9
            </p>
          )}

          {params.type === "pcl5" && (
            <>
              <p className="text-black font-semibold mb-4">
                Form: PTSD Checklist for DSM-5
              </p>
              <br />
              <p className="text-black font-semibold mb-4">
                In the past month, how much were you bothered by:
              </p>
            </>
          )}

          {params.type === "gad7" && (
            <p className="text-black font-semibold mb-4">
              Form: Generalized Anxiety Disorder-7
            </p>
          )}

          {data.map((item, index) => (
            <div key={index} className="mb-4">
              <p className="text-[#6984FB] font-bold text-left">{item.question}</p>

              {item.option !== null &&
                JSON.parse(item.option).map((option, index_) => (
                  <div key={index_} className="flex flex-col items-start">
                    <label className="text-black mr-3">
                      <input
                        type="radio"
                        name={`question_${index}`} // Grouping radios together
                        value={option}
                        required={item.requiredanswer} // Will work now

                        // value={option}
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

              {/* {item.requiredanswer && (
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
              )} */}
            </div>
          ))}
        </div>

        <center>
          <button
            disabled={isDisabled}
            // type="button"
            type="submit"
            // onClick={submit}
            className="flex items-center mb-4 bg-[#7b89f8] hover:bg-[#CBC3E3] text-white py-2 px-20 rounded-full shadow-md shadow-[#7b89f8] mt-10"
          >
            Continue
            <IoIosArrowForward className="ml-2" />
          </button>
        </center>
      {/* </div> */}

      </form>

      <div className="min-[696px]:invisible">
        <Bottomnav />
      </div>
    </>
  );
}

export default RefillForm;
