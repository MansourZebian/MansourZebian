import React, { useEffect, useState } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";

function Forgot() {
  const [showPassword, setShowPassword] = useState(false);
  const [otpText, setOtpText] = useState(null);
  const [newPassword, setNetPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null)
  const [email, setEmail] = useState(null);

  const [otpSent, setOtpSent] = useState(null);

  const [loading, setLoading] = useState(false);



  const onSubmitEmail = async () => {
    if (!email) {
      toast.error("Please enter email");
      return;
    };

    setLoading(true);
    await axios.post(`${process.env.REACT_APP_BACKEND_URL}auth/recoveryOtp`, {
      email: email,

    }).then((res) => {
      console.log(res.data?.data);
      setOtpSent(true);
      setLoading(false);
      toast.success("OTP sent successfully");
    }).catch((err) => {
      console.log("error", err);
      setLoading(false);
      toast.error(err?.response?.data?.message || err?.message);
    });
    setLoading(false);

  };

  const onSubmitOtp = async (e) => {
    if (!otpText || !newPassword || !confirmPassword) {
      return toast.error("Please fill all fields")
    }

    if (!email) {
      return toast.error("Something went wrong please try again")
    }
    e.preventDefault()

    setLoading(true);

    // console.log("otpText", otpText, otpSent);
    await axios.post(`${process.env.REACT_APP_BACKEND_URL}auth/verifyOtp`, {
      email,
      otp: otpText,
      newPassword

    }).then((res) => {
      setLoading(false);
      toast.success("Password updated successfully");
      window.location.href = "/login"
    }).catch((err) => {
      setLoading(false);
      toast.error(err?.response?.data?.message || err?.message);
    })

    // if (otpIs !== otpText) return alert("OTP not match! Please try again");

  };

  // useEffect(() => {
  //   if (values?.email) {
  //     sendOtp();
  //   }
  // }, [values?.email]);


  return (
    <>
      <div className="flex justify-end">
        <img src="frame1.png" className="absolute top-0 float-end" alt="" />
      </div>
      <center>
        <img src="logo.png" className="mt-32" alt="" />
      </center>

      <h1 className="text-center text-[#6054a8] font-bold text-4xl ">
        Welcome to RIVER
      </h1>

      {/* <div className="flex justify-center gap-10 mt-8">
        <a className="text-[#6c77d6] " href="/login">
          Login
        </a>
        <a
          className="text-[#6c77d6] border-b-2 border-[#6c77d6] "
          href="/register"
        >
          Register
        </a>
      </div> */}

      <div className="flex justify-center gap-10 mt-8 ">
        <a className="text-[#6c77d6] " href="/login">
          Login
        </a>
        <a
          className="text-[#6c77d6]  border-[#6c77d6] "
          href="/register"
        >
          Register
        </a>
      </div>
      <center>

        {!otpSent && (
          <div style={{ width: 400, margin: 20 }}>
            <input
              disabled={loading}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="h-16 block w-full p-4 ps-5 text-sm text-gray-900 border rounded-full bg-[#f2f2f2] focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
            <button
              style={{ marginTop: 20 }}
              className={`mb-4 bg-[#7b89f8] ${loading && "cursor-not-allowed bg-[#CBC3E3]"} hover:bg-[#CBC3E3] text-white  py-2 px-20 rounded-full shadow-md shadow-[#7b89f8]`}
              onClick={onSubmitEmail}
            >
              {loading ? "Loading" : "Sent Otp"}
            </button>
          </div>
        )

        }
        {otpSent && (
          <div style={{ width: 400, margin: 20 }}>

            <form onSubmit={(e)=>onSubmitOtp(e)}>
              <input

                disabled={loading}
                onChange={(e) => setOtpText(e.target.value)}
                placeholder="Enter OTP here"
                className="h-16 block w-full p-4 ps-5 text-sm text-gray-900 border rounded-full bg-[#f2f2f2] focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
              <input
                required
                disabled={loading}
                onChange={(e) => setNetPassword(e.target.value)}

                placeholder="Enter New Password"
                className="h-16 block w-full p-4 ps-5 mt-2 text-sm text-gray-900 border rounded-full bg-[#f2f2f2] focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />

              <input
                required
                onChange={(e) => setConfirmPassword(e.target.value)}

                placeholder="Confirm New Password"
                className="h-16 block w-full p-4 ps-5 mt-2 text-sm text-gray-900 border rounded-full bg-[#f2f2f2] focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />

              {newPassword !== confirmPassword && (
                <p className="text-red-500 text-sm mt-2">
                  Passwords do not match
                </p>
              )}

              <button
                disabled={((loading) || (newPassword !== confirmPassword))}

                type="submit"
                style={{ marginTop: 20 }}
                className={`mb-4 bg-[#7b89f8] ${((loading) || (newPassword !== confirmPassword)) && "cursor-not-allowed bg-[#CBC3E3]"} hover:bg-[#CBC3E3] text-white  py-2 px-20 rounded-full shadow-md shadow-[#7b89f8]`}
              // onClick={onSubmitOtp}
              >
                {loading ? "Loading" : "Submit"}
              </button>
            </form>
          </div>
        )

        }
      </center>
    </>
  );
}

export default Forgot;
