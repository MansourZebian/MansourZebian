import React, { useEffect, useState } from "react";
import Navbar1 from "../../components/Navbar1";
import { IoIosArrowForward } from "react-icons/io";
import Bottomnav from "../../components/Bottomnav";
import Sidebar2 from "../../components/Sidebar2";
import { useParams } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";

function Form() {
  const params = useParams();
  const [data, setData] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if authentication token exists in localStorage
    const authToken = localStorage.getItem("token");
    if (authToken) {
      const decodedUser = jwtDecode(authToken);
      setUser(decodedUser);
      // You can validate the token here if needed
      setIsAuthenticated(true);
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

  const getQuestions = async () => {
    await axios
      .get(
        `https://backend.riverketaminestudy.com/api/screeningform/${params.type}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
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
  }, []);

  const submit = async () => {
    console.log(".............data", data);
    setIsDisabled(true);

    const filterArry = data?.map((i) =>
      i.answer == "Several days"
        ? 1
        : i.answer == "More than half the days"
        ? 2
        : i.answer == "Nearly every day"
        ? 3
        : i.answer == "Not at all"
        ? 0
        : i.answer == "A little bit"
        ? 1
        : i.answer == "Moderately"
        ? 2
        : i.answer == "Quite a bit"
        ? 3
        : i.answer == "Extremely"
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

    await axios
      .post(
        `https://backend.riverketaminestudy.com/api/score/create`,
        {
          key: data[0]?.type,
          score: parseInt(sumAsString),
          uid: user?.id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        toast.success("Score added successfully");
        // getScores();
        // scoreModal(false);
      })
      .catch((error) => {
        console.log(error);
      });

    try {
      const key = uuidv4();
      await Promise.all(
        data.map(async (ques) => {
          // Push the answer value to the array

          const response = await axios.post(
            `https://backend.riverketaminestudy.com/api/screeningform/useranswer`,
            {
              userId: user.id,
              screeningformId: ques.id,
              status: "active",
              answer: "", // You might need to adjust this part according to your data
              key: key, // You might need to adjust this part according to your data
              optionanswer: ques.answer, // You might need to adjust this part according to your data
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

      // window.location = '/screening';

      switch (params.type) {
        case "phq9":
          window.location = "/screening/pcl5";
          break;
        case "pcl5":
          window.location = "/screening/gad7";
          break;
        case "gad7":
          window.location = "/screening/questionnaire";
          break;

        default:
          window.location = "/screening";
      }
    } catch (error) {
      setIsDisabled(false);
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

      <div
        className="px-5 min-[696px]:px-40 lg:px-60 max-[696px]:pb-40 min-[696px]:ml-5  xl:px-80"
        // style={{ marginRight: 2000 }}
      >
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
              <p className="text-[#6984FB] font-bold">{item.question}</p>

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
        </div>

        <center>
          <button
            disabled={isDisabled}
            type="button"
            onClick={submit}
            className="flex items-center mb-4 bg-[#7b89f8] hover:bg-[#CBC3E3] text-white py-2 px-20 rounded-full shadow-md shadow-[#7b89f8] mt-10"
          >
            Continue
            <IoIosArrowForward className="ml-2" />
          </button>
        </center>
      </div>

      <div className="min-[696px]:invisible">
        <Bottomnav />
      </div>
    </>
  );
}

export default Form;
