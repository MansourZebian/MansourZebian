import React, { useEffect, useState } from "react";
import Bottomnav from "../components/Bottomnav";
import Navbar1 from "../components/Navbar1";
import Checkcards from "../components/Checkcards";
import Sidebar2 from "../components/Sidebar2";
import { jwtDecode } from "jwt-decode";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import { stringify } from "uuid";
import { Modal } from "flowbite-react";

function Payment() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [user, setUser] = useState({});
  const [isDisabled, setIsDisabled] = useState(false);

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

  const [survyModal, setSurvyModal] = useState(false);

  return (
    <>
      <Modal
        show={survyModal}
        onClose={() => {
          window.location = "/";
        }}
      >
        <Modal.Header></Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <center>
              <img src="surveyimg.png" />
            </center>
            <h3 className="mb-2 font-bold text-lg  text-[#6C77D6]">
              Share your experience
            </h3>
            <p className="mb-2 text-sm text-[#6984FB]">
              How is ketamine working for you?
            </p>
            <button
              type="button"
              onClick={() => (window.location = "/survey")}
              className=" mb-4 bg-[#7b89f8] hover:bg-[#CBC3E3] text-white py-2 px-20 rounded-full shadow-md shadow-[#7b89f8] mt-10"
            >
              Take Survey
            </button>
          </div>
        </Modal.Body>
      </Modal>

      <Navbar1 />
      <div className="max-[696px]:invisible">
        <Sidebar2 />
      </div>

      <div className="px-5 min-[696px]:px-40 max-[696px]:pb-40 lg:px-60 min-[696px]:ml-40  xl:px-80">
        <Formik
          initialValues={{
            dosage: { previous: "300", request: "300" },
            session: "6",
            cost: "",
          }}
          onSubmit={async (values, { resetForm }) => {
            values.cost = parseInt(values.session) * 15;
            try {
              const response = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}payment/create`,
                {
                  uid: user.id,
                  dosagerequest: `${values.dosage.request},${values.dosage.previous}`,
                  sessionrequest: values.session,
                  costest: values.cost,
                  status: "pending",
                },
                {
                  headers: {
                    "Content-Type": "application/json", // Adjust content type if not JSON
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                }
              );

              resetForm();
              toast.success("Payment created successfully");
              setTimeout(() => {
                setSurvyModal(true);
              }, 2000);
            } catch (error) {
              console.log(error);
            }
          }}
        >
          {({ values }) => (
            <Form>
              <p className="text-[#A0A0A0]  text-sm mb-5 text-left">
                Date filled: {new Date().toLocaleDateString()}
              </p>

              <div>
                <p className="text-black font-bold text-md mb-5 text-left">
                  What dosage you would like to request?
                </p>
                <div className="flex w-full gap-3 ">
                  <div className="flex flex-col w-full">
                    <Field
                      type="text"
                      placeholder="example:300mg"
                      name="dosage.previous"
                      className="w-[48%] border h-10 border-[#dbdbdb] items-center p-4 mb-3 rounded-lg "
                    />
                    <p className="text-black font-bold text-xs mb-5 text-left">
                      Previous Dosage
                    </p>
                  </div>
                  <div className="flex flex-col w-full">
                    <Field
                      type="text"
                      placeholder="example:300mg"
                      name="dosage.request"
                      className="w-[48%] border h-10 border-[#dbdbdb] items-center p-4 mb-3 rounded-lg "
                    />
                    <p className="text-black font-bold text-xs mb-5 text-left">
                      Requested Dosage
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-5">
                <p className="text-black font-bold text-md mb-5 text-left">
                  How many sessions would you like to request?
                </p>
                <div className="flex flex-col items-start w-full">
                  <label className="text-black mr-3 font-bold">
                    <Field type="radio" selected name="session" value={"6"} />
                    &nbsp;6
                  </label>
                  <label className="text-black mr-3 font-bold">
                    <Field type="radio" name="session" value={"8"} />
                    &nbsp;8
                  </label>
                  <label className="text-black mr-3 font-bold">
                    <Field type="radio" name="session" value={"10"} />
                    &nbsp;10
                  </label>
                </div>
              </div>

              <div className="mb-5">
                <p className="text-black font-bold text-md mb-5 text-left">
                  Cost estimation:
                </p>
                <div className="flex items-center justify-center w-full gap-3">
                  <div className="flex flex-col items-center w-full">
                    <Field
                      disabled
                      type="text"
                      value={"$15"}
                      className="w-[60%] border h-10 border-[#dbdbdb] p-4 rounded-lg"
                    />
                    <p className="text-black font-bold text-xs mb-5">
                      300mg/Session
                    </p>
                  </div>
                  <p className="text-black font-bold text-sm mb-5">x</p>
                  <div className="flex flex-col items-center w-full">
                    <Field
                      type="text"
                      disabled
                      value={values.session}
                      className="w-[60%] border h-10 border-[#dbdbdb] p-4 rounded-lg"
                    />
                    <p className="text-black font-bold text-xs mb-5">
                      # Sessions
                    </p>
                  </div>
                  <p className="text-black font-bold text-sm mb-5">=</p>
                  <div className="flex flex-col items-center w-full">
                    <Field
                      type="text"
                      value={parseInt(values.session) * 15}
                      disabled
                      className="w-[60%] border h-10 border-[#dbdbdb] p-4 rounded-lg"
                    />
                    <p className="text-black font-bold text-xs mb-5">
                      Estimated price
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-black  text-md mb-5 text-left">
                We will send your request to the doctor. If the doctor
                prescribed fewer sessions or dosage, you will receive a
                compensation refund.
              </p>

              <Checkcards
                title={"PHQ9"}
                checktitle="Complete form"
                transparent={true}
              />

              <Checkcards
                title={"PCL5"}
                checktitle="Complete form"
                transparent={true}
              />

              <Checkcards
                title={"GAD7"}
                checktitle="Complete form"
                transparent={true}
              />

              <Checkcards
                title={"Entry Questionnaire"}
                checktitle="Complete form"
                transparent={true}
              />

              <div className="flex items-center w-full justify-center">
                <button
                  type="submit"
                  className=" mb-4 bg-[#7b89f8] hover:bg-[#CBC3E3] text-white py-2 px-20 rounded-full shadow-md shadow-[#7b89f8] mt-10"
                >
                  Pay
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>

      <div className="min-[696px]:invisible">
        <Bottomnav />
      </div>
    </>
  );
}

export default Payment;
