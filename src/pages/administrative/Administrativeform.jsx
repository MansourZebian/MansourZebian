import React, { useEffect, useState } from "react";
import Bottomnav from "../../components/Bottomnav";
import Navbar1 from "../../components/Navbar1";
import Checkcards from "../../components/Checkcards";
import Sidebar2 from "../../components/Sidebar2";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { Link } from "react-router-dom";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { saveAs } from "file-saver";
import consentDoc from "../../assets/doc/consent.docx";
// import consentDocx from '../../../assets/doc/consent.docx'; // Adjust the path as needed
import previewConsent from '../../assets/doc/preview-consent.docx'

import ImageModule from "docxtemplater-image-module-free"; // Import Image Module
import { Document, Packer, Paragraph, TextRun, ImageRun } from "docx";

import WebViewer from "@pdftron/webviewer";
import { toast } from "react-toastify";



function Administrativeform() {
  const [user, setUser] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [information, setInformation] = useState([]);
  const [emergencycontact, setEmergencycontact] = useState([]);
  const [consent, setConsent] = useState([]);
  const [documentverification, setDocumentverification] = useState([]);

  const [loading, setLoading] = useState(true);  // Add loading state


  useEffect(() => {
    // Check if authentication token exists in localStorage
    const authToken = localStorage.getItem("token");
    if (authToken) {
      setLoading(true)

      const decodedUser = jwtDecode(authToken);
      setUser(decodedUser);
      const id = decodedUser.id;
      getInformation(id);
      getEmergencycontact(id);
      getConsent(id);
      getDocumentverification(id);

      // You can validate the token here if needed
      setIsAuthenticated(true);
      setLoading(false)
    }
  }, []);

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
        // console.log("Document verification ", response.data);
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
        // console.log("Consent ", response.data);
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
        // console.log("Emergency contact ", response.data);
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

        // console.log("Information ", response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };


  const previewAndDownload = async (base64Data, fileName, signedDate, fullLegalName, docxFile) => {
    if (!base64Data || !signedDate || !docxFile || !fullLegalName) {
      // console.error("❌ Missing required parameters.");
      toast.error("Something went wrong. Please try again later.");
      return;
    }

    try {
      // console.log("📂 Fetching the .docx template...");
      const response = await fetch(docxFile);

      if (!response.ok) throw new Error(`Failed to load document: ${response.statusText}`);

      const arrayBuffer = await response.arrayBuffer();
      // console.log("✅ .docx template loaded successfully!");

      // Load the .docx template into PizZip
      const zip = new PizZip(arrayBuffer);

      // **Properly Convert Base64 Image for Word**
      const imageOptions = {
        getImage(tagValue) {
          const base64String = tagValue.split(",")[1]; // Extract Base64 data
          const binaryString = atob(base64String); // Decode Base64
          const len = binaryString.length;
          const uint8Array = new Uint8Array(len);

          for (let i = 0; i < len; i++) {
            uint8Array[i] = binaryString.charCodeAt(i);
          }

          return uint8Array.buffer; // Return as ArrayBuffer
        },
        getSize(img, tagValue, tagName) {
          return [300, 100]; // Set proper image size
        },
      };

      // Initialize `docxtemplater` with the image module
      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
        modules: [new ImageModule(imageOptions)], // Ensure correct image handling
      });

      // **Replace placeholders in `.docx`**
      doc.setData({
        fullLegalName,
        signedDate: new Date(signedDate).toLocaleDateString(),
        signatureImage: base64Data, // The image data
      });

      // **Render and Save the Document**
      doc.render();
      // console.log("✅ Document processed successfully!");

      // Generate the updated `.docx` file
      const updatedDocx = doc.getZip().generate({ type: "blob" });

      // Trigger file download
      saveAs(updatedDocx, fileName);
      // console.log("📥 File downloaded:", fileName);
    } catch (error) {
      // console.error("❌ Error processing document:", error);
      toast.error("Something went wrong. Please try again later.");

      if (error.properties && error.properties.errors) {
        error.properties.errors.forEach((err) => console.error("⚠️ Template Error:", err));
      }
    }
  };



  return (
    <>
      <Navbar1 />

      <div className="max-[696px]:invisible">
        <Sidebar2 />
      </div>

      <div className="px-5 min-[696px]:px-40 max-[696px]:pb-40 lg:px-60 min-[696px]:ml-40  xl:px-80 ">
        {loading ? (
          <p className="text-black font-bold text-lg mb-5 text-center">
            Loading...
          </p>
        ) : (consent === null || information === null || emergencycontact === null || documentverification === null)


          ? (
            <p className="text-black font-bold text-lg mb-5 text-center">
              Please fill out the forms below to move to the next step.
            </p>
          ) : (
            <Link to="/" className="text-black font-bold text-lg mb-5 text-center my-2">
              Thank you for filling out all the forms. We will send you an email soon to schedule your telehealth visit.
            </Link>
          )}



        {/* <a href={consent === null ? "/administrative/consent" : "/"}>
          <Checkcards
            title={"Consent form"}
            checktitle={consent !== null ? "Form Completed" : "Sign form"}
          />
        </a> */}
        <Link
          to={consent === null ? "/administrative/consent" : undefined}
          onClick={async (e) => {
            if (consent) {
              e.preventDefault(); // Prevent navigation
              // previewAndDownload(consent["signature"], "verification.png", consent["createdAt"], consent["fullLegalName"]);
              // previewAndDownload(consent["signature"], "Updated-Consent-Form.docx", consent["createdAt"], consent["fullLegalName"], require('../../assets/doc/consent.docx'));

              // console.log('see consent', consent)

              await previewAndDownload(
                consent["signature"],
                "Signed-Consent.docx",
                consent["createdAt"],
                consent["fullLegalName"],
                consentDoc
                // "../../../public/assets/doc/consent.docx" // Serve from public folder
              );



              // previewAndDownload(
              //   consent["signature"],
              //   "Updated-Consent-Form.docx",
              //   consent["createdAt"],
              //   consent["fullLegalName"],
              //   fetch('http://localhost:8000/consent.docx').then(response => response.blob())
              // );


            }
          }}
        >
          <Checkcards
            title={"Consent form"}
            checktitle={consent !== null ? "Form Completed" : "Sign form"}
          />
        </Link>




        <Link to={information === null ? "/administrative/information" : "/"}>
          <Checkcards
            title={"Information form"}
            checktitle={information !== null ? "Form Completed" : "Pending"}
          />
        </Link>
        <Link
          to={
            emergencycontact === null ? "/administrative/emergencycontact" : "/"
          }
        >
          <Checkcards
            title={"Emergency Contacts"}
            checktitle={
              emergencycontact !== null ? "Form Completed" : "Pending"
            }
          />
        </Link>
        
        <Link
          className={
            (consent === null || information === null || emergencycontact === null )?"cursor-not-allowed":"cursor-pointer"}


          to={
            (!(consent === null || information === null || emergencycontact === null )&& documentverification === null)
              ? "/administrative/documentverification"
              : "/administratived"
          }
        >
          <Checkcards
          disabled={(consent === null || information === null || emergencycontact === null )}
            title={"Verification Document"}
            
            checktitle={
              documentverification !== null
                ? "Form Completed"
                : "Pending"

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

export default Administrativeform;
