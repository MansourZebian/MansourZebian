import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

function Setting() {
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
  return (
    <>
      <Sidebar />
      <div class="p-10 sm:ml-64 bg-[#f7f7f7]">
        <div className="flex items-center gap-5">
          <img src="/teamicon.svg" alt="" />
          <h1 className="text-4xl font-bold">Add user</h1>
        </div>

        <div className="float-left mt-10">
          <Formik
            validationSchema={Yup.object({
              email: Yup.string()
                .email("Invalid email address")
                .required("Required"),
              username: Yup.string().required("Required"),
              role_name: Yup.string().required("Required"),
            })}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
              setSubmitting(true);

              const formData = new FormData();
              formData.append("email", values.email);
              formData.append("username", values.username);
              formData.append("password", values.password);
              formData.append("role_name", values.role_name);

              await axios
                .post(
                  `https://backed.riverketaminestudy.com/api/users/create`,
                  formData,
                  {
                    headers: {
                      "Content-Type": "multipart/form-data",
                      Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                  }
                )
                .then((res) => {
                  toast.success(res.data.msg);
                  resetForm();
                })
                .catch((error) => {
                  console.log(error);
                  if (error.response) {
                    toast.error(
                      error.response.data.msg || "An error occurred."
                    );
                  } else {
                    toast.error(
                      "Something went wrong. Please try again later."
                    );
                  }
                });

              setSubmitting(false);
            }}
            initialValues={{
              username: "",
              email: "",
              password: "Abc@123",
              role_name: "",
            }}
          >
            <Form>
              <div className="mb-10 flex flex-col ">
                <p className="text-2xl text-left font-bold mb-3">User name</p>

                <Field
                  name="username"
                  type="text"
                  className="w-[48%] border h-10 border-[#e1e1e1] border-4 items-center p-4 mb-3 rounded-full bg-transparent"
                />
                <ErrorMessage
                  name="username"
                  component="div"
                  className="text-red-500"
                />
              </div>

              <div className="mb-10  flex flex-col ">
                <p className="text-2xl text-left font-bold mb-3">
                  Email Address
                </p>

                <Field
                  name="email"
                  type="text"
                  className="w-[48%] border h-10 border-[#e1e1e1] border-4 items-center p-4 mb-3 rounded-full bg-transparent"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500"
                />
              </div>

              <div className="">
                <p className="text-2xl text-left font-bold mb-3">Permission</p>

                <label
                  htmlFor="admin"
                  className="ml-2 flex items-center text-left gap-2"
                >
                  <Field
                    id="admin"
                    name="role_name"
                    type="radio"
                    value="Admin"
                    className=""
                  />{" "}
                  Admin (full control)
                </label>

                <label
                  htmlFor="physician"
                  className="ml-2 flex items-center text-left gap-2"
                >
                  <Field
                    id="physician"
                    type="radio"
                    name="role_name"
                    value="Physician"
                    className=""
                  />{" "}
                  Physician (full access to Participant information)
                </label>

                <label
                  htmlFor="billing"
                  className="ml-2 flex items-center text-left gap-2"
                >
                  <Field
                    id="billing"
                    type="radio"
                    name="role_name"
                    className=""
                    value="Billing"
                  />{" "}
                  Billing (Can't view private information/access to contact
                  details)
                </label>

                <label
                  htmlFor="data"
                  className="ml-2 flex items-center text-left gap-2"
                >
                  <Field
                    id="data"
                    type="radio"
                    name="role_name"
                    value="Data"
                    className=""
                  />{" "}
                  Data (Can view/can't change data, only Acc#, no personal info)
                </label>

                <ErrorMessage
                  name="role_name"
                  component="div"
                  className="text-red-500"
                />
              </div>

              <button
                type="submit"
                className="mt-20 float-left bg-[#6984fb] px-10 py-4 text-white font-bold rounded-2xl"
              >
                Send Invitation
              </button>
            </Form>
          </Formik>
        </div>
      </div>
    </>
  );
}

export default Setting;
