import React, { useEffect, useState } from "react";
import Navbar1 from "../../components/Navbar1";
import Bottomnav from "../../components/Bottomnav";
import Sidebar2 from "../../components/Sidebar2";
import axios from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
function Informationform() {
  const [city, setCity] = useState([]);
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

      <div className="px-5 min-[696px]:px-40 max-[696px]:pb-40 lg:px-60 min-[696px]:ml-40  xl:px-80">
        {/* <div className='px-5 mb-40'> */}

        <Formik
          initialValues={{
            firstName: "",
            middleName: "",
            lastName: "",
            preferredName: "",
            dob: "",
            maritalStatus: "",
            gender: "",
            city: "",
            address1: "",
            address2: "",
            zip: "",
            mobile: "",
            homePhone: "",
          }}
          validationSchema={Yup.object({
            firstName: Yup.string().required("First name is required"),
            middleName: Yup.string(),
            lastName: Yup.string().required("Last name is required"),
            preferredName: Yup.string(),
            dob: Yup.date().required("Date of birth is required").nullable(),
            maritalStatus: Yup.string(),
            gender: Yup.string().required("Gender is required"),

            city: Yup.string(),
            address1: Yup.string(),
            address2: Yup.string(),
            zip: Yup.string(),
            mobile: Yup.string(),
            homePhone: Yup.string(),
          })}
          onSubmit={(values, { setSubmitting }) => {
            setSubmitting(true);
            axios
              .post(
                `${process.env.REACT_APP_BACKEND_URL}informationform/create`,
                {
                  legalname:
                    values.firstName +
                    " " +
                    values.middleName +
                    " " +
                    values.lastName,
                  preferredname: values.preferredName,
                  dob: values.dob,
                  maritalstatus: values.maritalStatus,
                  administrativesex: values.gender,
                  addressone: values.address1,
                  addresstwo: values.address2,
                  zip: values.zip,
                  citystate: values.city,
                  mobile: values.mobile,
                  homephone: values.homePhone,
                  uid: user.id,
                  notes: "",
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
              Personal Information
            </p>

            <hr />

            <div>
              <p className="text-black font-bold text-md mb-5 text-left">
                Legal Name
              </p>

              <div className="flex justify-between w-full gap-3 ">
                <Field
                  type="text"
                  name="firstName"
                  placeholder="First"
                  className="w-[48%] border h-10 border-[#dbdbdb] items-center p-4 mb-3 rounded-lg "
                />

                <Field
                  type="text"
                  name="middleName"
                  placeholder="Middle"
                  className="w-[48%] border h-10 border-[#dbdbdb] items-center p-4 mb-3 rounded-lg "
                />

                <Field
                  type="text"
                  name="lastName"
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
                Preferred Name
              </p>
              <Field
                type="text"
                name="preferredName"
                className="w-[48%] flex border h-10 border-[#dbdbdb] items-center p-4 mb-3 rounded-lg "
                placeholder={"PreferredName"}
              />
              <ErrorMessage
                name="preferredName"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div>
              <p className="text-black font-bold text-md mb-5 text-left">
                Date of Birth
              </p>
              <Field
                type="date"
                name="dob"
                placeholder="m/d/yyyy"
                className="w-[48%] flex border h-10 border-[#dbdbdb] items-center p-4 mb-3 rounded-lg "
              />
              <ErrorMessage
                name="dob"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div>
              <p className="text-black font-bold text-md mb-5 text-left">
                Marital Status
              </p>
              <Field
                type="text"
                name="maritalStatus"
                placeholder="select marital status"
                className="w-[48%] flex border h-10 border-[#dbdbdb] items-center p-4 mb-3 rounded-lg "
              />
              <ErrorMessage
                name="maritalStatus"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div>
              <p className="text-black font-bold text-md mb-5 text-left">
                Administrative Sex
              </p>
              <div className="flex gap-3 w-full">
                <label className="text-black mr-3 font-bold">
                  <Field type="radio" name="gender" value="male" />
                  &nbsp;Male
                </label>
                <label className="text-black mr-3 font-bold">
                  <Field type="radio" name="gender" value="female" />
                  &nbsp;Female
                </label>
              </div>
              <ErrorMessage
                name="gender"
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
                type="text"
                name="address1"
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
                type="text"
                name="address2"
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
                type="text"
                name="zip"
                placeholder="zip code"
                className="w-[48%] flex border h-10 border-[#dbdbdb] items-center p-4 mb-3 rounded-lg "
              />
              <ErrorMessage
                name="zip"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div className="mb-3">
              <p className="text-black font-bold text-md mb-5 text-left">
                City
              </p>
              <Field
                as="select"
                name="city"
                placeholder={"City"}
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

export default Informationform;
