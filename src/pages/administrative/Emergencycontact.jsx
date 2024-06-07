import React, { useEffect, useState } from "react";
import Navbar1 from "../../components/Navbar1";
import Bottomnav from "../../components/Bottomnav";
import Sidebar2 from "../../components/Sidebar2";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { jwtDecode } from "jwt-decode";

import axios from "axios";
import * as Yup from "yup";
import { toast } from "react-toastify";
function Emergencycontact() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState({});
  const [city, setCity] = useState([]);

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

  const getCity = () => {
    axios
      .get(`https://countriesnow.space/api/v0.1/countries/population/cities`)
      .then((res) => {
        setCity(res.data.data);
        console.log(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getCity();
  }, []);

  return (
    <>
      <Navbar1 />

      <div className="max-[696px]:invisible">
        <Sidebar2 />
      </div>

      <div className="px-5 min-[696px]:px-40 lg:px-60 max-[696px]:pb-40 min-[696px]:ml-40  xl:px-80">
        {/* <div className='px-5 mb-40'> */}

        <Formik
          initialValues={{
            firstName: "",
            middleName: "",
            lastName: "",
            company: "",
            contactType: "", // Assuming this will hold the selected value from radio buttons
            relationship: "",
            dob: "",
            address1: "",
            address2: "",
            zip: "",
            city: "", // Assuming this will hold the selected city value
            mobile: "",
            homePhone: "",
            email: "",
          }}
          validationSchema={Yup.object({
            firstName: Yup.string().required("First name is required"),
            lastName: Yup.string().required("Last name is required"),
            company: Yup.string(),
            contactType: Yup.string().required("Contact type is required"),
            relationship: Yup.string(),
            dob: Yup.date().required("Date of birth is required"),
            address1: Yup.string().required("Address 1 is required"),
            zip: Yup.string().required("Zip code is required"),
            city: Yup.string().required("City is required"),
            mobile: Yup.string().required("Mobile number is required"),
            email: Yup.string()
              .email("Invalid email address")
              .required("Email address is required"),
          })}
          onSubmit={(values, { setSubmitting }) => {
            setSubmitting(true);
            axios
              .post(
                `https://backed.riverketaminestudy.com/api/emergencycontact/create`,
                {
                  contactname:
                    values.firstName +
                    " " +
                    values.middleName +
                    " " +
                    values.lastName,
                  company: values.company,
                  contacttype: values.contactType,
                  relationship: values.relationship,
                  dob: values.dob,
                  addressone: values.address1,
                  addresstwo: values.address2,
                  zip: values.zip,
                  country: "",
                  citystate: values.city,
                  mobile: values.mobile,
                  homephone: values.homePhone,
                  email: values.email,
                  uid: user.id,
                },
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                }
              )
              .then((response) => {
                console.log(response.data);
                toast.success("Submitted successfully");
                setTimeout(() => {
                  window.location = "/administrative";
                }, 2000);
              })
              .catch((error) => {
                console.log(error);
                toast.error("Error submitting data: " + error);
              });
          }}
        >
          <Form>
            <p className="text-[#A0A0A0] font-bold text-sm mb-5 text-left">
              Contact Information
            </p>

            <hr />

            <div>
              <p className="text-black font-bold text-md mb-5 text-left">
                Contact Name
              </p>

              <div className="flex justify-between w-full gap-3 ">
                <Field
                  name="firstName"
                  type="text"
                  placeholder="First"
                  className="w-[48%] border h-10 border-[#dbdbdb] items-center p-4 mb-3 rounded-lg "
                />
                <Field
                  name="middleName"
                  type="text"
                  placeholder="Middle"
                  className="w-[48%] border h-10 border-[#dbdbdb] items-center p-4 mb-3 rounded-lg "
                />
                <Field
                  name="lastName"
                  type="text"
                  placeholder="Last"
                  className="w-[48%] border h-10 border-[#dbdbdb] items-center p-4 mb-3 rounded-lg "
                />
              </div>
              <ErrorMessage
                name="firstName"
                component="div"
                className="text-red-500 text-sm"
              />
              <ErrorMessage
                name="middleName"
                component="div"
                className="text-red-500 text-sm"
              />
              <ErrorMessage
                name="lastName"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div>
              <p className="text-black font-bold text-md mb-5 text-left">
                Company
              </p>
              <Field
                name="company"
                type="text"
                placeholder="for business contacts"
                className="w-[48%] flex border h-10 border-[#dbdbdb] items-center p-4 mb-3 rounded-lg "
              />
              <ErrorMessage
                name="company"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div className="mb-3">
              <p className="text-black font-bold text-md mb-5 text-left">
                Contact Type
              </p>
              <div className="flex flex-col items-start w-full">
                <label className="text-black mr-3">
                  <Field
                    type="radio"
                    name="contactType"
                    value="emergency contact"
                  />
                  &nbsp;Emergency contact
                </label>
                <label className="text-black mr-3">
                  <Field type="radio" name="contactType" value="guardian" />
                  &nbsp;Guardian
                </label>
                <label className="text-black mr-3">
                  <Field
                    type="radio"
                    name="contactType"
                    value="primary care physician"
                  />
                  &nbsp;Primary Care Physician
                </label>
              </div>

              <ErrorMessage
                name="contactType"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div>
              <p className="text-black font-bold text-md mb-5 text-left">
                Relationship
              </p>
              <Field
                name="relationship"
                type="text"
                placeholder="select marital stautus"
                className="w-[48%] flex border h-10 border-[#dbdbdb] items-center p-4 mb-3 rounded-lg "
              />
              <ErrorMessage
                name="relationship"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div>
              <p className="text-black font-bold text-md mb-5 text-left">
                Date of Birth
              </p>
              <Field
                name="dob"
                type="date"
                placeholder="m/d/yyyy"
                className="w-[48%] flex border h-10 border-[#dbdbdb] items-center p-4 mb-3 rounded-lg "
              />
              <ErrorMessage
                name="dob"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <p className="text-[#A0A0A0] font-bold text-sm mb-5 mt-5 text-left">
              Contact Information
            </p>

            <hr />

            <div>
              <p className="text-black font-bold text-md mb-5 text-left">
                Address 1
              </p>
              <Field
                name="address1"
                type="text"
                className="w-[48%] flex border h-10 border-[#dbdbdb] items-center p-4 mb-3 rounded-lg "
                placeholder={"Address 1"}
              />
              <ErrorMessage
                name="address1"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div>
              <p className="text-black font-bold text-md mb-5 text-left">
                Address 2
              </p>
              <Field
                name="address2"
                type="text"
                className="w-[48%] flex border h-10 border-[#dbdbdb] items-center p-4 mb-3 rounded-lg "
                placeholder={"Address 2"}
              />
              <ErrorMessage
                name="address2"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div>
              <p className="text-black font-bold text-md mb-5 text-left">Zip</p>
              <Field
                name="zip"
                type="text"
                placeholder="zip code"
                className="w-[48%] flex border h-10 border-[#dbdbdb] items-center p-4 mb-3 rounded-lg "
              />
              <ErrorMessage
                name="zip"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div>
              <p className="text-black font-bold text-md mb-5 text-left">
                City
              </p>
              <Field
                as="select"
                name="city"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[48%]  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option selected>select city</option>
                {[
                  { city: "New York", state: "New York" },
                  { city: "Los Angeles", state: "California" },
                  { city: "Chicago", state: "Illinois" },
                  { city: "Houston", state: "Texas" },
                  { city: "Phoenix", state: "Arizona" },
                  { city: "Philadelphia", state: "Pennsylvania" },
                  { city: "San Antonio", state: "Texas" },
                  { city: "San Diego", state: "California" },
                  { city: "Dallas", state: "Texas" },
                  { city: "San Jose", state: "California" },
                ].map((item) => {
                  return <option value={item.city}>{item.city}</option>;
                })}
              </Field>
              <ErrorMessage
                name="city"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div className="mb-3">
              <p className="text-black font-bold text-md mb-5 text-left">
                State
              </p>
              <Field
                as="select"
                name="state"
                placeholder={"State"}
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[48%]  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option selected>select State</option>
                {[
                  { city: "New York", state: "New York" },
                  { city: "Los Angeles", state: "California" },
                  { city: "Chicago", state: "Illinois" },
                  { city: "Houston", state: "Texas" },
                  { city: "Phoenix", state: "Arizona" },
                  { city: "Philadelphia", state: "Pennsylvania" },
                  { city: "San Antonio", state: "Texas" },
                  { city: "San Diego", state: "California" },
                  { city: "Dallas", state: "Texas" },
                  { city: "San Jose", state: "California" },
                ].map((item) => {
                  return <option value={item.state}>{item.state}</option>;
                })}
              </Field>
              <ErrorMessage
                name="city"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div>
              <p className="text-black font-bold text-md mb-5 text-left">
                Mobile
              </p>
              <Field
                type="text"
                name="mobile"
                className="w-[48%] flex border h-10 border-[#dbdbdb] items-center p-4 mb-3 rounded-lg "
                placeholder={"Mobile no"}
              />
              <ErrorMessage
                name="mobile"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div>
              <p className="text-black font-bold text-md mb-5 text-left">
                Home Phone
              </p>
              <Field
                type="text"
                name="homePhone"
                className="w-[48%] flex border h-10 border-[#dbdbdb] items-center p-4 mb-3 rounded-lg "
                placeholder={"Home phone no"}
              />
              <ErrorMessage
                name="homePhone"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div>
              <p className="text-black font-bold text-md mb-5 text-left">
                Email Address
              </p>
              <Field
                type="text"
                name="email"
                className="w-[48%] flex border h-10 border-[#dbdbdb] items-center p-4 mb-3 rounded-lg "
                placeholder={"Email"}
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <center>
              <button
                type="submit"
                className="flex items-center mt-10  mb-4 bg-[#7b89f8] hover:bg-[#CBC3E3] text-white py-2 px-20 rounded-full shadow-md shadow-[#7b89f8] mt-10"
              >
                Submit
              </button>
            </center>
          </Form>
        </Formik>
      </div>

      <div className="min-[696px]:invisible">
        <Bottomnav />
      </div>
    </>
  );
}

export default Emergencycontact;
