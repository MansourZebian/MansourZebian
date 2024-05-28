import React, { useEffect, useState } from "react";

import Navbar1 from "../components/Navbar1";
import Card1 from "../components/Card1";
import Whitecard from "../components/Whitecard";
import Bottomnav from "../components/Bottomnav";
import Sidebar from "../components/Sidebar";
import Sidebar2 from "../components/Sidebar2";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

function Home() {
  const [screening, setScreening] = useState([]);

  const [user, setUser] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [is_phq9, setIs_phq9] = useState(false);
  const [is_gad7, setIs_gad7] = useState(false);
  const [is_pcl5, setIs_pcl5] = useState(false);
  const [is_entryquestionaire, setIs_entryquestionaire] = useState(false);

  const [information, setInformation] = useState([]);
  const [emergencycontact, setEmergencycontact] = useState([]);
  const [consent, setConsent] = useState([]);
  const [documentverification, setDocumentverification] = useState([]);
  const [newScriptData, setNewScriptData] = useState([]);
  const [scores, setScores] = useState([]);

  const [allowRefill, setAllowRefill] = useState(false);

  useEffect(() => {
    // Check if authentication token exists in localStorage
    const authToken = localStorage.getItem("token");
    if (authToken) {
      getScores();
      const decodedUser = jwtDecode(authToken);
      // setUser(decodedUser);
      getScreeningData(decodedUser.id);
      // You can validate the token here if needed
      getuser(decodedUser.id);
      const id = decodedUser.id;
      getInformation(id);
      getEmergencycontact(id);
      getConsent(id);
      getDocumentverification(id);
      getNewScript(decodedUser.id);
      getRefill(id);

      setIsAuthenticated(true);
    }
  }, []);

  const getNewScript = (id) => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}prescription/get/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setNewScriptData(response.data);
        console.log("newScript", response.data);
        // setStatus(response.data.status);
      })
      .catch((error) => {
        console.log(error);
      });
  };

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
      console.log("..............???", response); // Log the data received from the backend
      setScreening(response.data); // Set the data to state if needed
      const screening = response.data;
      const is_phq9 =
        screening.length > 0 &&
        screening.filter((item) => item.Screeningform.type === "phq9").length >
          0;
      const is_gad7 =
        screening.length > 0 &&
        screening.filter((item) => item.Screeningform.type === "gad7").length >
          0;
      const is_pcl5 =
        screening.length > 0 &&
        screening.filter((item) => item.Screeningform.type === "pcl5").length >
          0;
      const is_entryquestionaire =
        screening.length > 0 &&
        screening.filter(
          (item) => item.Screeningform.type === "entry questionaire"
        ).length > 0;

      console.log(is_phq9, is_gad7, is_pcl5, is_entryquestionaire);

      setIs_phq9(is_phq9);
      setIs_gad7(is_gad7);
      setIs_pcl5(is_pcl5);
      setIs_entryquestionaire(is_entryquestionaire);
    } catch (error) {
      console.log(error); // Log any errors that occur during the request
    }
  };

  const getScores = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}score/${user?.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("score data.............>", response);
      setScores(response.data); // Set the data to state if needed
    } catch (error) {
      console.log(error); // Log any errors that occur during the request
    }
  };

  const getDocumentverification = (id) => {
    axios
      .get(
        `${process.env.REACT_APP_BACKEND_URL}documentverification/getDocumentverificationByUser/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        setDocumentverification(response.data);
        console.log("Document verification ", response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getConsent = (id) => {
    //consent
    axios
      .get(
        `${process.env.REACT_APP_BACKEND_URL}consentform/getConsentformsByUser/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        setConsent(response.data);
        console.log("Consent ", response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getEmergencycontact = (id) => {
    //emergencycontact
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}emergencycontact/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setEmergencycontact(response.data);
        console.log("Emergency contact ", response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getInformation = (id) => {
    //informationform
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}informationform/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setInformation(response.data);

        console.log("Information ", response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const [refill_length, setRefill_length] = useState(0);

  const getuser = async (id) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}users/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setUser(response.data);
    } catch (error) {
      console.error(error);
    }
  };

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

      console.log("refill", groupedRefill);

      // Check if any group has less than 3 records
      const lessThanThree = Object.values(groupedRefill).length < 3;
      setRefill_length(Object.values(groupedRefill).length);
      console.log(lessThanThree);
      setAllowRefill(lessThanThree);
    } catch (error) {
      console.log(error); // Log any errors that occur during the request
      return false;
    }
  };

  let phl9Sc = scores?.filter(
    (i) => i?.uid == user?.id && i?.key == "phq9" && i.score
  );
  let pcl9Sc = scores?.filter(
    (i) => i?.uid === user?.id && i?.key === "pcl5" && i.score
  );

  console.log(phl9Sc, pcl9Sc);

  return (
    <>
      <Navbar1 />
      <div className="max-[696px]:invisible">
        <Sidebar2 />
      </div>
      <div></div>
      <div className="px-5 min-[696px]:px-40 max-[696px]:pb-40 lg:px-60 min-[696px]:ml-40 xl:px-80">
        <Whitecard
          isL
          title={"Latest Script:"}
          msg={
            newScriptData?.length
              ? `The doctor has prescribed ${
                  newScriptData[newScriptData?.length - 1]?.dispense
                } Tablets ${
                  newScriptData[newScriptData?.length - 1]?.drug
                } ODT ${newScriptData[newScriptData?.length - 1]?.dosage}mg.`
              : "The doctor has not prescribed yet."
          }
          status={""}
          onClickMsg={() => {
            // localStorage?.setItem("userIdd", user?.id);
            // window.location.href = `/TrackingLink/${
            //   newScriptData[newScriptData?.length - 1]?.tracking_id
            // }`;
          }}
        />
        <Whitecard
          title={"Status:"}
          msg={
            is_phq9 &&
            is_gad7 &&
            is_pcl5 &&
            is_entryquestionaire &&
            information !== null &&
            consent !== null &&
            emergencycontact !== null &&
            documentverification !== null &&
            allowRefill &&
            user.status === "approved"
              ? `Done, Please schedule a tele-health visit here: https://telehealthvisit.timetap.com` //`Refills are Available for ${refill_length}/3 times`
              : user.status !== "approved"
              ? phl9Sc[0]?.score > 9 && pcl9Sc[0]?.score > 30
                ? "Based on your answers, you might be a good candidate for the RIVER Ketamine Study. Please fill out the administrative forms."
                : phl9Sc[0]?.score < 9 && pcl9Sc[0]?.score < 30
                ? "Please schedule a consultation call before moving to the next step"
                : "Please fill out the forms below to move to the next step"
              : information !== null &&
                consent !== null &&
                emergencycontact !== null &&
                documentverification !== null
              ? "Click here for the tracking link."
              : "Please fill out the forms below to move to the next step"
          }
          trackingLink={newScriptData[newScriptData?.length - 1]?.tracking_id}
          status={
            information !== null &&
            consent !== null &&
            emergencycontact !== null &&
            documentverification !== null
              ? "Complete"
              : "Incomplete"
          }
        />

        <a
          href={
            is_phq9 && is_gad7 && is_pcl5 && is_entryquestionaire
              ? "/screening"
              : user.status !== "approved"
              ? "/screening"
              : "/screening"
          }
        >
          <Card1
            title={"Screening Forms"}
            img={"writeicon.png"}
            // disabled={
            //   is_phq9 && is_gad7 && is_pcl5 && is_entryquestionaire
            //     ? true
            //     : user.status !== "approved"
            //     ? true
            //     : false
            // }
            status={
              is_phq9 && is_gad7 && is_pcl5 && is_entryquestionaire
                ? "Complete"
                : "Pending"
            }
          />
        </a>

        {/* is_error={is_phq9 && is_gad7 && is_pcl5 && is_entryquestionaire ? false :  true} */}

        <a
          href={
            information !== null &&
            consent !== null &&
            emergencycontact !== null &&
            documentverification !== null
              ? "/"
              : user.status !== "approved"
              ? "/"
              : "/administrative"
          }
        >
          <Card1
            title={"Administrative Forms"}
            img={"writeicon.png"}
            disabled={
              information !== null &&
              consent !== null &&
              emergencycontact !== null &&
              documentverification !== null
                ? true
                : user.status !== "approved"
                ? true
                : false
            }
          />
        </a>
        <a
          href={
            user.status !== "approved"
              ? "/"
              : is_phq9 &&
                is_gad7 &&
                is_pcl5 &&
                is_entryquestionaire &&
                information !== null &&
                consent !== null &&
                emergencycontact !== null &&
                documentverification !== null &&
                allowRefill
              ? "/refill"
              : "/"
          }
        >
          <Card1
            title={"Request Refill "}
            img={"Applyicon.png"}
            subtext={`${refill_length} of 3 refills are available`}
            disabled={
              user.status !== "approved"
                ? true
                : is_phq9 &&
                  is_gad7 &&
                  is_pcl5 &&
                  is_entryquestionaire &&
                  information !== null &&
                  consent !== null &&
                  emergencycontact !== null &&
                  documentverification !== null &&
                  allowRefill
                ? false
                : true
            }
          />
        </a>

        <a
          href={
            is_phq9 &&
            is_gad7 &&
            is_pcl5 &&
            is_entryquestionaire &&
            information !== null &&
            consent !== null &&
            emergencycontact !== null &&
            documentverification !== null
              ? "https://telehealthvisit.timetap.com"
              : "https://ketamine-consultation.timetap.com/"
          }
        >
          <Card1
            title={
              is_phq9 &&
              is_gad7 &&
              is_pcl5 &&
              is_entryquestionaire &&
              information !== null &&
              consent !== null &&
              emergencycontact !== null &&
              documentverification !== null
                ? "Schedule a tele-health visit"
                : "Schedule a free consultation"
            }
            img={"Calendaricon.png"}
            disabled={false}
          />
        </a>
      </div>

      <div className="min-[696px]:invisible">
        <Bottomnav />
      </div>
    </>
  );
}

export default Home;
