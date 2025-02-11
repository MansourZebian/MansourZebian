import React, { useEffect, useRef, useState } from "react";
import Bottomnav from "../../components/Bottomnav";
import Navbar1 from "../../components/Navbar1";
import Sidebar2 from "../../components/Sidebar2";
import SignatureCanvas from "react-signature-canvas";
import axios from "axios";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import previewConsent from '../../assets/doc/preview-consent.docx'

import { Link } from "react-router-dom";

function Consentform() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const signatureRef = useRef();
  const [user, setUser] = useState({});
  const [isDisabled, setIsDisabled] = useState(false);
  const [fullLegalName, setFullLegalName] = useState('');


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

  const handleChange = (e) => {
    setFullLegalName(e.target.value);
  }

  // Function to handle form submission
  const handleSubmit = () => {

    if (!fullLegalName) {
      toast.error("Please enter your full legal name");
      return
    }

    
    setIsDisabled(true);
    // Get the signature data from the SignatureCanvas component
    const signatureData = signatureRef.current.toDataURL();
    console.log("Signature Data:", signatureData);
    axios
      .post(
        `${process.env.REACT_APP_BACKEND_URL}consentform/create`,
        {
          uid: user.id,
          status: "pending",
          signature: signatureData,
          fullLegalName: fullLegalName
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

  // console.log('see process.env', process.env.REACT_APP_HOST_URL)
  const previewConsent = process.env.REACT_APP_HOST_URL + "preview-consent.pdf"; // Replace with your actual link


  return (
    <>
      <Navbar1 />
  
      {/* Sidebar for Desktop only */}
      <div className="hidden md:block">
        <Sidebar2 />
      </div>
  
      <div className="px-5 md:px-20 lg:px-40 xl:px-80 min-[696px]:ml-40 pb-10 md:pb-20 overflow-hidden">
        <p className="text-black font-bold text-md mb-3 text-left">
          Patient Signature Record
        </p>
  
        <div className="flex justify-start my-2">
          <button
            className="
              outline outline-gray-500 
              text-gray-500 font-bold py-1 px-4 
              rounded-full 
              hover:bg-[#7a92fb] 
              hover:text-white 
              hover:outline-none
            "
            onClick={() => window.open(previewConsent, '_blank', 'noopener,noreferrer')}
          >
            Read our Consent Form
          </button>
        </div>
  
        <p className="text-gray-500 font-bold text-sm mb-5 text-left">
          I have read and agree to the terms of RIVER - Research-Consent Form. I
          acknowledge that I am the client or the legal representative of the
          client, and I agree that my drawn signature...
        </p>
  
        <div className="h-40 justify-center border border-[#7a92fb] items-center p-4 mb-3 rounded-3xl">
          <SignatureCanvas
            penColor="black"
            ref={signatureRef}
            canvasProps={{ width: 800, height: 150, className: "sigCanvas" }}
          />
        </div>
  
        <div className="flex flex-col space-y-4 w-full md:w-3/4 lg:w-1/2 xl:w-1/3 mx-auto">
          {/* Full Legal Name Input */}
          <div className="flex flex-col md:flex-row items-center gap-2">
            <label className="text-gray-700 font-medium w-full md:w-1/3 text-left">Full Legal Name</label>
            <input
              type="text"
              name="fullname"
              className="h-12 w-full md:w-2/3 border border-[#7a92fb] rounded-3xl px-4 focus:ring-2 focus:ring-[#7a92fb] outline-none"
              placeholder="Enter your full legal name"
              value={fullLegalName}
              onChange={handleChange}
            />
          </div>
  
          {/* Date & Time Display */}
          <div className="flex flex-col md:flex-row items-center gap-2">
            <label className="text-gray-700 font-medium w-full md:w-1/3 text-left">Date & Time</label>
            <input
              type="text"
              value={new Date().toLocaleDateString()}
              disabled
              className="h-12 w-full md:w-2/3 border border-[#7a92fb] rounded-3xl px-4 bg-gray-100 text-gray-600 cursor-not-allowed"
            />
          </div>
        </div>
          {/* Button Container */}
          <div className="flex justify-center items-center mb-10 mt-6 md:mt-10">
  <button
    disabled={isDisabled}
    type="button"
    onClick={handleSubmit}
    className="bg-[#7b89f8] hover:bg-[#CBC3E3] text-white py-2 px-12 rounded-full shadow-md shadow-[#7b89f8] mt-5"
  >
    Submit
  </button>
</div>

      </div>
  
    
  
      {/* Bottom Navigation for Mobile only */}
      <div className="md:hidden">
        <Bottomnav />
      </div>
    </>
  );
  
  // return (
  //   <>
  //     <Navbar1 />
  //     <div className="max-[696px]:invisible">
  //       <Sidebar2 />
  //     </div>

  //     <div className="px-5 min-[696px]:px-40 max-[696px]:pb-40 lg:px-60 min-[696px]:ml-40  xl:px-80">
  //       <p className="text-black font-bold text-md mb-5 text-left">
  //         Patient Signature record.
  //       </p>

  //       <div className="flex justify-start my-2">
  //         <button
  //           className="
  //     outline outline-gray-500 
  //     text-gray-500 font-bold py-1 px-4 
  //     rounded-full 
  //     hover:bg-[#7a92fb] 
  //     hover:text-white 
  //     hover:outline-none
  //   "
  //           onClick={() => window.open(previewConsent, '_blank', 'noopener,noreferrer')}

  //         >
  //           Read our Consent Form
  //         </button>
  //       </div>



  //       <p className="text-gray-500 font-bold text-sm mb-5 text-left">
  //         I have read and agree to the terms of RIVER - Research-Consent Form. I
  //         acknowledge that I am the client or the legal representative of the
  //         client and I agree that my drawn signature
  //       </p>

  //       <div className=" h-40 justify-center border border-[#7a92fb] items-center p-4 mb-3 rounded-3xl ">
  //         <SignatureCanvas
  //           penColor="black"
  //           ref={signatureRef}
  //           canvasProps={{ width: 800, height: 150, className: "sigCanvas" }}
  //         />
  //       </div>

  //       <div className="flex flex-col space-y-4 w-full md:w-1/2 lg:w-1/3 mx-auto">

  //         {/* Full Legal Name Input */}

  //       </div>

  //       <div className="flex flex-col w-full md:w-3/4 lg:w-1/2 mx-auto space-y-4">
  //         {/* Full Legal Name Input */}
  //         <div className="flex flex-col md:flex-row items-center gap-2">
  //           <label className="text-gray-700 font-medium w-full md:w-1/3 text-left">Full Legal Name</label>
  //           <input
  //             type="text"
  //             name="fullname"
  //             className="h-12 w-full md:w-2/3 border border-[#7a92fb] rounded-3xl px-4 focus:ring-2 focus:ring-[#7a92fb] outline-none"
  //             placeholder="Enter your full legal name"
  //             value={fullLegalName}
  //             onChange={handleChange}
  //           />
  //         </div>

  //         {/* Date & Time Display */}
  //         <div className="flex flex-col md:flex-row items-center gap-2">
  //           <label className="text-gray-700 font-medium w-full md:w-1/3 text-left">Date & Time</label>
  //           <input
  //             type="text"
  //             value={new Date().toLocaleDateString()}
  //             disabled
  //             className="h-12 w-full md:w-2/3 border border-[#7a92fb] rounded-3xl px-4 bg-gray-100 text-gray-600 cursor-not-allowed"
  //           />
  //         </div>
  //       </div>



  //     </div>

  //     <center>
  //       <button
  //         disabled={isDisabled}
  //         type="button"
  //         onClick={handleSubmit}
  //         className="flex items-center mt-60  mb-4 bg-[#7b89f8] hover:bg-[#CBC3E3] text-white py-2 px-20 rounded-full shadow-md shadow-[#7b89f8] mt-10"
  //       >
  //         Submit
  //       </button>
  //     </center>

  //     <div className="min-[696px]:invisible">
  //       <Bottomnav />
  //     </div>
  //   </>
  // );
}

export default Consentform;
