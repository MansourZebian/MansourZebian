import React, { useEffect, useState } from "react";
import Navbar1 from "../../components/Navbar1";
import Checkcards from "../../components/Checkcards";
import Bottomnav from "../../components/Bottomnav";
import Sidebar2 from "../../components/Sidebar2";

import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";

function Screeningform() {
  const [screening, setScreening] = useState([]);

  const [user, setUser] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if authentication token exists in localStorage
    const authToken = localStorage.getItem("token");
    if (authToken) {
      const decodedUser = jwtDecode(authToken);
      setUser(decodedUser);
      getScreeningData(decodedUser.id);
      // You can validate the token here if needed
      setIsAuthenticated(true);
    }
  }, []);

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
      console.log(response.data); // Log the data received from the backend
      setScreening(response.data); // Set the data to state if needed
    } catch (error) {
      console.log(error); // Log any errors that occur during the request
    }
  };

  return (
    <>
      <Navbar1 />

      <div className="max-[696px]:invisible">
        <Sidebar2 />
      </div>

      {screening.filter((item) =>
       item.Screeningform.type === "phq9").length > 0 &&
       screening.filter((item) =>
       item.Screeningform.type === "pcl5").length > 0 &&
       screening.filter((item) =>
       item.Screeningform.type === "gad7").length > 0 &&
       screening.filter((item) =>
       item.Screeningform.type === "entry questionaire").length > 0 &&

        <div className="flex pb-10 flex-col items-center justify-center text-center px-5 min-[696px]:px-40 lg:px-60 xl:px-80 min-[696px]:ml-40 max-[696px]:pb-10 text-sm sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold">
          <p>
            Please fill out the
            <span style={{ marginRight: '8px', marginLeft: '8px' }}>
              <Link to="/" className="text-[#7A92FA] underline">
                administrative forms
              </Link>
            </span>
            to continue.
          </p>
        </div>


      }

      <div className="px-5 min-[696px]:px-40 max-[696px]:pb-40 lg:px-60 min-[696px]:ml-40  xl:px-80">
        <Link
          to={
            screening.length > 0 &&
              screening.filter((item) => item.Screeningform.type === "phq9")
                .length < 0
              ? "/screening/phq9"
              : "/"
          }
        >
          <Checkcards
            title={"PHQ9"}
            checktitle={
              screening.filter((item) => item.Screeningform.type === "phq9").length < 0
                ? "Pending"
                : "Form Completed"
            }
          />
        </Link>
        <Link
          to={
            screening.length > 0 &&
              screening.filter((item) => item.Screeningform.type === "pcl5")
                .length < 0
              ? "/screening/pcl5"
              : "/"
          }
        >
          <Checkcards
            title={"PCL5"}
            checktitle={
              screening.length > 0 &&
                screening.filter((item) => item.Screeningform.type === "pcl5")
                  .length < 0
                ? "Pending"
                : "Form Completed"
            }
          />
        </Link>
        <Link
          to={
            screening.length > 0 &&
              screening.filter((item) => item.Screeningform.type === "gad7")
                .length < 0
              ? "/screening/gad7"
              : "/"
          }
        >
          <Checkcards
            title={"GAD7"}
            checktitle={
              screening.length > 0 &&
                screening.filter((item) => item.Screeningform.type === "gad7")
                  .length < 0
                ? "Pending"
                : "Form Completed"
            }
          />
        </Link>

        <Link
          to={
            screening.length > 0 &&
              screening.filter(
                (item) => item.Screeningform.type === "entry questionaire"
              ).length < 0
              ? "/screening/questionnaire"
              : "/"
          }
        >
          <Checkcards
            title={"Entry Questionnaire"}
            checktitle={
              screening.length > 0 &&
                screening.filter(
                  (item) => item.Screeningform.type === "entry questionaire"
                ).length < 0
                ? "Pending"
                : "Form Completed"
            }
          />
        </Link>
      </div>

      <div className="min-[696px]:invisible">
        <Bottomnav />
      </div>
    </>
  );
}

export default Screeningform;
