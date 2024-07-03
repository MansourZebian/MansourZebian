import React, { useEffect, useRef, useState } from "react";
import Bottomnav from "../../components/Bottomnav";
import Navbar1 from "../../components/Navbar1";
import Sidebar2 from "../../components/Sidebar2";
import SignatureCanvas from "react-signature-canvas";
import axios from "axios";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { Document, Page } from 'react-pdf'
import { pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';

function Consentform() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const signatureRef = useRef();
  const [user, setUser] = useState({});
  const [isDisabled, setIsDisabled] = useState(false);
  pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.mjs`;
  const [numPages, setNumPages] = useState();
  const [pageNumber, setPageNumber] = useState(1);
  const [loaded, setLoaded] = useState(false);
  
  function onDocumentLoadSuccess( numPages ){
    setNumPages(numPages);
    console.log("Numpages ",numPages._pdfInfo.numPages);
    setLoaded(true)
  }
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

  // Function to handle form submission
  const handleSubmit = () => {
    setIsDisabled(true);
    // Get the signature data from the SignatureCanvas component
    const signatureData = signatureRef.current.toDataURL();
    console.log("Signature Data:", signatureData);
    axios
      .post(
        `https://backend.riverketaminestudy.com/api/consentform/create`,
        {
          signature: signatureData,
          uid: user.id,
          status: "pending",
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        toast.success("Submitted successfully!");
        setTimeout(() => {
          window.location = "/administrative";
        }, 2000);
      })
      .catch((error) => {
        setIsDisabled(false);
        console.log(error);
        toast.error("Error submitting data: " + error);
      });
  };

  return (
    <>
      <Navbar1 />
      <div className="max-[696px]:invisible">
        <Sidebar2 />
      </div>

      <div className="px-5 min-[696px]:px-40 max-[696px]:pb-40 lg:px-60 min-[696px]:ml-40  xl:px-80">
        <p className="text-black font-bold text-md mb-5 text-left">
          Patient Signature record.
        </p>

        <div className="mb-4" style={{maxHeight: '500px', overflowY:'scroll', width:'100%'}}>

          <Document file="https://riverdocumentverificationpics.s3.us-east-2.amazonaws.com/RIVER-Research-Consent-Form-%28C%29.pdf" onLoadSuccess={onDocumentLoadSuccess}>
          { loaded &&  Array.from({ length: numPages._pdfInfo.numPages }, (_, i) => (
        
          <Page pageNumber={i+1} />
          ))}
          {/* <Page pageNumber={2} />
          <Page pageNumber={3} /> */}
          {/* <div class="page-controls"><button type="button">‹</button><span>4 of 4</span><button type="button" disabled="">›</button></div> */}
          
        </Document>
        </div>

        <p className="text-gray-500 font-bold text-sm mb-5 text-left">
          I have read and agree to the terms of RIVER - Research-Consent Form. I
          acknowledge that I am the client or the legal representative of the
          client and I agree that my drawn signature
        </p>

        <div className="w-full h-40 border border-[#7a92fb] items-center p-4 mb-3 rounded-3xl ">
          <SignatureCanvas
            penColor="black"
            ref={signatureRef}
            canvasProps={{ width: 500, height: 200, className: "sigCanvas" }}
          />
        </div>
      </div>

      <center>
        <button
          disabled={isDisabled}
          type="button"
          onClick={handleSubmit}
          className="flex items-center mt-60  mb-4 bg-[#7b89f8] hover:bg-[#CBC3E3] text-white py-2 px-20 rounded-full shadow-md shadow-[#7b89f8] mt-10"
        >
          Submit
        </button>
      </center>

      <div className="min-[696px]:invisible">
        <Bottomnav />
      </div>
    </>
  );
}

export default Consentform;
