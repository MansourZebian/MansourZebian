import React, { useState } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
        <a className="text-[#6c77d6] border-b-2 border-[#6c77d6]" href="/login">
          Login
        </a>
        <a className="text-[#6c77d6]  " href="/register">
          Register
        </a>
      </div>

      <center>
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={Yup.object({
            email: Yup.string().email().required(),
            password: Yup.string().required(),
          })}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            setSubmitting(true);

            await axios
              .post(
                `https://backend.riverketaminestudy.com/api/auth/login`,
                {
                  email: values.email,
                  password: values.password,
                },
                {
                  headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                  },
                }
              )
              .then((res) => {
                toast.success(res.data.msg);
                resetForm();
                setTimeout(() => {
                  localStorage.setItem("token", res.data.token);
                  const authToken = localStorage.getItem("token");
                  const decodedUser = jwtDecode(authToken);

                  if (decodedUser.role === "Admin") {
                    window.location.href = "/admin";
                  } else {
                    window.location.href = "/";
                  }
                }, 2000);
              })
              .catch((error) => {
                if (error.response) {
                  toast.error(error.response.data.msg || "An error occurred.");
                } else {
                  toast.error("Something went wrong. Please try again later.");
                }
              });

            setSubmitting(false);
          }}
        >
          <Form className="pt-8">
            <div class="relative  mb-4 w-[350px]">
              <Field
                type="email"
                name="email"
                class=" h-16 block w-full p-4 ps-5 text-sm text-gray-900 border rounded-full bg-[#f2f2f2] focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Email"
              />
              <div class="text-white absolute end-2.5 bottom-2.5  focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                <img src="profileicon.png" alt="" />
              </div>
            </div>
            <ErrorMessage
              name="email"
              component="div"
              className="text-red-500"
            />
            <div class="relative mb-4  w-[350px]">
              <Field
                type={showPassword ? "text" : "password"}
                name="password"
                class="h-16 block w-full p-4 ps-5 text-sm text-gray-900 border  rounded-full bg-[#f2f2f2] focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Password"
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
              name="password"
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
              Sign In
            </button>
            <br />

            <a className="text-[#6c77d6]" href="/register">
              Forgot Password?
            </a>
          </Form>
        </Formik>
      </center>
    </>
  );
}

export default Login;
