import React, { useEffect, useState } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";

function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [otpText, setOtpText] = useState(null);
  const [otpIs, setOtp] = useState(null);
  const [values, setValues] = useState({
    email: "",
    username: "",
    password: "",
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmitFunc = async () => {
    console.log("otpText", otpText, otpIs);
    if (otpIs !== otpText) return alert("OTP not match! Please try again");
    await axios
      .post(`${process.env.REACT_APP_BACKEND_URL}auth/register`, {
        email: values.email,
        username: values.email, // Assuming username is a separate field
        password: values.password,
      })
      .then((res) => {
        toast.success(res.data.msg);

        window.location.href = "/login";
      })
      .catch((error) => {
        if (error.response) {
          toast.error(error.response.data.msg || "An error occurred.");
        } else {
          toast.error("Something went wrong. Please try again later.");
        }
      });
  };

  // useEffect(() => {
  //   if (values?.email) {
  //     sendOtp();
  //   }
  // }, [values?.email]);

  const sendOtp = async (values) => {
    await axios
      .post(`${process.env.REACT_APP_BACKEND_URL}auth/otp`, {
        email: values.email,
      })
      .then((res) => {
        toast.success("OTP has sent you an email; please review it.");
        // console.log(res.data?.data);
        setOtp(res?.data?.data?.otp);
      })
      .catch((error) => {
        if (error.response) {
          toast.error(error.response.data.msg || "An error occurred.");
        } else {
          toast.error("Something went wrong. Please try again later.");
        }
      });
  };

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

      <div className="flex justify-center gap-10 mt-8">
        <a className="text-[#6c77d6] " href="/login">
          Login
        </a>
        <a
          className="text-[#6c77d6] border-b-2 border-[#6c77d6] "
          href="/register"
        >
          Register
        </a>
      </div>
      <center>
        {otpIs ? (
          <div style={{ width: 400, margin: 20 }}>
            <input
              onChange={(e) => setOtpText(e.target.value)}
              placeholder="Enter OTP here"
              className="h-16 block w-full p-4 ps-5 text-sm text-gray-900 border rounded-full bg-[#f2f2f2] focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
            <button
              style={{ marginTop: 20 }}
              className="mb-4 bg-[#7b89f8] hover:bg-[#CBC3E3] text-white  py-2 px-20 rounded-full shadow-md shadow-[#7b89f8]"
              onClick={onSubmitFunc}
            >
              Submit
            </button>
          </div>
        ) : (
          <Formik
            initialValues={{ email: "", password: "", confirmPassword: "" }}
            validationSchema={Yup.object({
              email: Yup.string().email().required(),
              password: Yup.string().required(),
              confirmPassword: Yup.string()
                .required("Confirm Password is required")
                .oneOf([Yup.ref("password"), null], "Passwords must match"),
            })}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
              setSubmitting(true);

              // await onSubmitFunc(values, resetForm);
              setValues({
                email: values.email,
                username: values.email,
                password: values.password,
              });
              sendOtp(values);

              setSubmitting(false);
            }}
          >
            <Form className="pt-8">
              <div className="relative  mb-4 w-[350px]">
                <Field
                  type="email"
                  name="email"
                  className="h-16 block w-full p-4 ps-5 text-sm text-gray-900 border rounded-full bg-[#f2f2f2] focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Email"
                />
                <div className="text-white absolute end-2.5 bottom-2.5  focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                  <img src="profileicon.png" alt="" />
                </div>
              </div>

              <ErrorMessage
                name="email"
                component="div"
                className="text-red-500"
              />
              <div className="relative mb-4  w-[350px]">
                <Field
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="h-16 block w-full p-4 ps-5 text-sm text-gray-900 border  rounded-full bg-[#f2f2f2] focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Password"
                />
                <div className="text-white absolute end-2.5 bottom-2.5  focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                  {showPassword ? (
                    <FaRegEye
                      className="text-[#c5c5c5]"
                      size={30}
                      onClick={togglePasswordVisibility}
                    />
                  ) : (
                    <FaRegEyeSlash
                      className="text-[#c5c5c5]"
                      size={30}
                      onClick={togglePasswordVisibility}
                    />
                  )}
                </div>
              </div>
              <ErrorMessage
                name="password"
                component="div"
                className="text-red-500"
              />

              <div class="relative  w-[350px]">
                <Field
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  class="h-16 block w-full p-4 ps-5 text-sm text-gray-900 border  rounded-full bg-[#f2f2f2] focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Confirm Password"
                />
                <div class="text-white absolute end-2.5 bottom-2.5  focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                  {showPassword ? (
                    <FaRegEye
                      className="text-[#c5c5c5]"
                      size={30}
                      onClick={togglePasswordVisibility}
                    />
                  ) : (
                    <FaRegEyeSlash
                      className="text-[#c5c5c5]"
                      size={30}
                      onClick={togglePasswordVisibility}
                    />
                  )}
                </div>
              </div>
              <ErrorMessage
                name="confirmPassword"
                component="div"
                className="text-red-500"
              />

              <br />

              <div className="flex justify-start">
                <img src="frame2.png" className="absolute  float-end" alt="" />
              </div>

              <button
                type="submit"
                className="mb-4 bg-[#7b89f8] hover:bg-[#CBC3E3] text-white  py-2 px-20 rounded-full shadow-md shadow-[#7b89f8]"
              >
                Sign Up
              </button>
              <br />
            </Form>
          </Formik>
        )}
      </center>
    </>
  );
}

export default Signup;
