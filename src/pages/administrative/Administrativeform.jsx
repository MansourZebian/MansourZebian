import React, { useEffect, useState } from "react";
import Bottomnav from "../../components/Bottomnav";
import Navbar1 from "../../components/Navbar1";
import Checkcards from "../../components/Checkcards";
import Sidebar2 from "../../components/Sidebar2";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

function Administrativeform() {
  const [user, setUser] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [information, setInformation] = useState([]);
  const [emergencycontact, setEmergencycontact] = useState([]);
  const [consent, setConsent] = useState([]);
  const [documentverification, setDocumentverification] = useState([]);

  useEffect(() => {
    // Check if authentication token exists in localStorage
    const authToken = localStorage.getItem("token");
    if (authToken) {
      const decodedUser = jwtDecode(authToken);
      setUser(decodedUser);
      const id = decodedUser.id;
      getInformation(id);
      getEmergencycontact(id);
      getConsent(id);
      getDocumentverification(id);

      // You can validate the token here if needed
      setIsAuthenticated(true);
    }
  }, []);

  const getDocumentverification = (id) => {
    axios
      .get(
        `https://backed.riverketaminestudy.com/api/documentverification/getDocumentverificationByUser/${id}`,
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
        `https://backed.riverketaminestudy.com/api/consentform/getConsentformsByUser/${id}`,
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
      .get(`https://backed.riverketaminestudy.com/api/emergencycontact/${id}`, {
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
      .get(`https://backed.riverketaminestudy.com/api/informationform/${id}`, {
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

  return (
    <>
      <Navbar1 />

      <div className="max-[696px]:invisible">
        <Sidebar2 />
      </div>

      <div className="px-5 min-[696px]:px-40 max-[696px]:pb-40 lg:px-60 min-[696px]:ml-40  xl:px-80">
        <p className="text-black font-bold text-lg mb-5 text-left">
          Please fill out the forms below to move to the next step.
        </p>

        <a href={consent === null ? "/administrative/consent" : "/"}>
          <Checkcards
            title={"Consent form"}
            checktitle={consent !== null ? "Form Completed" : "Sign form"}
          />
        </a>
        <a href={information === null ? "/administrative/information" : "/"}>
          <Checkcards
            title={"Information form"}
            checktitle={information !== null ? "Form Completed" : "Pending"}
          />
        </a>
        <a
          href={
            emergencycontact === null ? "/administrative/emergencycontact" : "/"
          }
        >
          <Checkcards
            title={"Emergency Contacts"}
            checktitle={
              emergencycontact !== null ? "Form Completed" : "Pending"
            }
          />
        </a>
        <a
          href={
            documentverification === null
              ? "/administrative/documentverification"
              : "/"
          }
        >
          <Checkcards
            title={"Verification Document"}
            checktitle={
              documentverification !== null ? "Form Completed" : "Pending"
            }
          />
        </a>
      </div>

      <div className="min-[696px]:invisible">
        <Bottomnav />
      </div>
    </>
  );
}

export default Administrativeform;
