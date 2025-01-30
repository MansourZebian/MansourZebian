import React, { useRef, useCallback, useState, useEffect } from "react";
import Navbar1 from "../../components/Navbar1";
import Bottomnav from "../../components/Bottomnav";
import Sidebar2 from "../../components/Sidebar2";
import Webcam from "react-webcam";
import axios from "axios";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { jwtDecode } from "jwt-decode";

function Documentverification() {
  const [openCam, setOpenCam] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [base64String, setBase64String] = useState("");
  const webcamRef = useRef(null);

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [user, setUser] = useState({});

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

  const openFileInput = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.capture = "environment"; // Capture from device camera
    input.addEventListener("change", handleFileInputChange);
    input.click();
  };

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    console.log(file);
    if (file) {
      setImageSrc(file);
    }
  };

  const captureImage = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImageSrc(imageSrc);
    setOpenCam(false); // Close the webcam after capturing the image
  }, [webcamRef, setOpenCam]);

  const handleCam = () => {
    setOpenCam(!openCam);
  };

  const handleFileChange = async () => {
    const file = imageSrc;
    // if (file) {
    //   const reader = new FileReader();
    //   reader.onloadend = () => {
    //     setBase64String(reader.result);
    //   };
    //   reader.readAsDataURL(file);
    // }

    if (file) {
      try {
        const compressedBase64 = await compressImage(file);
        setBase64String(compressedBase64);
      } catch (error) {
        console.error("Error compressing image:", error);
      }
    }
  };

  useEffect(() => {
    if (imageSrc?.name) {
      handleFileChange();
    }
  }, [imageSrc?.name]);

  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const MAX_WIDTH = 800; // Maximum width for the compressed image
          const MAX_HEIGHT = 600; // Maximum height for the compressed image
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob(
            (blob) => {
              const reader = new FileReader();
              reader.readAsDataURL(blob);
              reader.onloadend = () => {
                const compressedBase64 = reader.result;
                resolve(compressedBase64);
              };
            },
            "image/jpeg",
            0.7 // JPEG compression quality: 0.7 (adjust as needed)
          );
        };
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsDataURL(file);
    });
  };

  const formik = useFormik({
    initialValues: {
      modelName: "document verification",
      modelId: 1,
      file: null,
    },

    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      // const formData = new FormData();
      // formData.append("modelName", values.modelName);
      // formData.append("modelId", values.modelId);
      // formData.append("uid", user.id);
      // formData.append("status", "pending");
      // console.log("imageSrc", imageSrc);
      // if (imageSrc?.name) {
      //   // If imageSrc is a File object (uploaded file), append it directly
      //   formData.append("file", imageSrc);
      // } else if (typeof imageSrc === "string") {
      //   // If imageSrc is a data URL, convert it back to a Blob and append it
      //   const base64Response = await fetch(imageSrc);
      //   const blob = await base64Response.blob();
      //   formData.append("file", blob, "image.jpg");
      //   console.log("//////////////.././.", base64Response, blob);
      // }
      let payload = {
        status: "pending",
        uid: user.id,
        signature: base64String,
      };

      // console.log("//////////////.././.", formData);
      // return;
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}documentverification/create`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setLoading(false);
        toast.success("File uploaded successfully.");
        console.log("response", response?.data);
        window.location = "/administrative";

        console.log("File uploaded successfully:");
      } catch (error) {
        console.error("Error uploading file:", error.message);
        setLoading(false);
      }
    },
  });

  return (
    <>
      <Navbar1 />

      <div className="max-[696px]:invisible">
        <Sidebar2 />
      </div>

      <div className="px-5 min-[696px]:px-40 max-[696px]:pb-40 lg:px-60 min-[696px]:ml-40  xl:px-80">
        <form onSubmit={formik.handleSubmit} encType="multipart/form-data">
          <p className="text-black font-bold text-md mb-5 text-left">
            We kindly request that you upload a photo of an official document
            that includes the following information:
          </p>
          <p className="text-gray-500 font-bold text-sm mb-5 text-left">
            1) Your Full Name <br /> 2) Your Photograph <br /> 3) Any additional
            identifying information, such as date of birth or address
          </p>

          {imageSrc ? (
            <div className="cursor-pointer w-full flex flex-col justify-center h-40 border border-[#7a92fb] items-center p-4 mb-3 rounded-3xl">
              <img
                className="cursor-pointer"
                onClick={openFileInput}
                style={{ width: 230, height: 140, borderRadius: 10 }}
                src={
                  typeof imageSrc === "string"
                    ? imageSrc
                    : URL?.createObjectURL(imageSrc)
                }
                alt=""
              />
            </div>
          ) : (
            <div className="cursor-pointer w-full flex flex-col justify-center h-40 border border-[#7a92fb] items-center p-4 mb-3 rounded-3xl">
              <img
                className="cursor-pointer"
                onClick={openFileInput}
                src="/svg/upload.svg"
                alt=""
              />
              <p className="text-gray-500 font-bold text-sm mb-5">
                Select File
              </p>
            </div>
          )}

          <div className="w-full flex items-center justify-center">
            <hr className="flex-grow border-gray-300" />
            <p className="text-gray-500 font-bold text-sm mx-3">or</p>
            <hr className="flex-grow border-gray-300" />
          </div>

          <center>
            {openCam && (
              <>
                <Webcam
                  audio={false}
                  height={400}
                  width={400}
                  screenshotQuality={1}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                />
                <button
                  className="mt-5 bg-[#7b89f8] hover:bg-[#CBC3E3] text-white py-2 px-20 rounded-full shadow-md shadow-[#7b89f8]"
                  type="button"
                  onClick={captureImage}
                >
                  Capture photo
                </button>
                <button
                  className="mt-5 bg-[#7b89f8] hover:bg-[#CBC3E3] text-white py-2 px-20 rounded-full shadow-md shadow-[#7b89f8]"
                  type="button"
                  onClick={handleCam}
                >
                  Close
                </button>
              </>
            )}
          </center>

          <div className="mt-5 flex w-full bg-[#ced6f9] rounded-full justify-center items-center p-4 mb-3">
            <img onClick={handleCam} src="/svg/camera.svg" alt="" />
            <p className="text-black  text-xs ml-3">
              Open your camera and take a photo
            </p>
          </div>

          {imageSrc && (
            <center>
              <button
                type="submit"
                className="flex items-center mt-10 mb-10 bg-[#7b89f8] hover:bg-[#CBC3E3] text-white py-2 px-20 rounded-full shadow-md shadow-[#7b89f8] mt-10"
              >
                Submit
              </button>
            </center>
          )}
        </form>

        <div>
          {isLoading ? "Please wait image uploading in progress..." : null}
        </div>
      </div>

      <div className="min-[696px]:invisible">
        <Bottomnav />
      </div>
    </>
  );
}

export default Documentverification;
