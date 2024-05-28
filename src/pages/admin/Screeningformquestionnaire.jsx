import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { GoCheckbox } from "react-icons/go";
import { IoIosArrowDropdown, IoMdAddCircle } from "react-icons/io";
import { Dropdown, Modal } from "flowbite-react";
import { ImParagraphRight } from "react-icons/im";
import { MdDelete, MdLinearScale, MdOutlineContentCopy } from "react-icons/md";
import { RiCheckboxCircleLine } from "react-icons/ri";
import { GrHomeOption } from "react-icons/gr";

function Screeningformquestionnaire() {
  const [qtype, setQtype] = useState(false);

  const [qtypeval, setQtypeval] = useState([
    {
      type: "paragraph",
      index: 0,
    },
  ]);

  const [type, setType] = useState("entry questionaire");

  return (
    <>
      <Sidebar />
      <div class="p-10 sm:ml-64 bg-[#f7f7f7]">
        <div className=" bg-[#FBFBFB] w-full rounded-xl shadow-lg">
          <div className="bg-[#6c77d6] h-5 w-full rounded-lg"></div>
          <div className="px-5 pb-14 pt-5 ">
            <h1 className="text-2xl text-left font-bold">
              Screening Questionnaire
            </h1>
            <select
              className="mt-3 w-full border-2 border-[#6c77d6] bg-[lightblue] text-white p-2 rounded-lg"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value={"entry questionaire"}>Entry Questionaire</option>
              <option value={"phq9"}>phq9</option>
              <option value={"pcl5"}>pcl5</option>
              <option value={"gad7"}>gad7</option>
            </select>
          </div>
        </div>

        <Formik
          initialValues={{
            questions: [
              {
                title: "",
                type: "paragraph",
                answer: "",
                score: 1,
                required: false,
                options: [""], // Initial options for checkboxes
              },
            ],
          }}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              await Promise.all(
                values.questions.map(async (ques) => {
                  const response = await axios.post(
                    `${process.env.REACT_APP_BACKEND_URL}screeningform/create`,
                    {
                      type: type,
                      question: ques.title,
                      ansType: ques.type === "paragraph" ? "text" : ques.type,
                      option:
                        Array.isArray(ques.options) &&
                        ques.options.length === 1 &&
                        ques.options[0] === ""
                          ? null
                          : ques.options,
                      requiredanswer: ques.required,
                    },
                    {
                      headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                          "token"
                        )}`,
                      },
                    }
                  );
                })
              );

              toast.success("Submitted successfully!");
              setTimeout(() => {
                window.location = "/admin/screeningquestiontable";
              }, 2000);
            } catch (error) {
              toast.error("Error submitting data: " + error);
              console.error("Error submitting data:", error); // Log error if submission fails
            }
          }}
        >
          {({ values, index }) => (
            <Form>
              <FieldArray name="questions">
                {({ push, remove }) => (
                  <>
                    {values.questions.map((question, index) => (
                      <>
                        <Modal show={qtype} onClose={() => setQtype(false)}>
                          <Modal.Header>Type</Modal.Header>
                          <Modal.Body>
                            <div className="space-y-6">
                              <ul
                                class="p-3 space-y-1 text-sm text-gray-700 dark:text-gray-200"
                                aria-labelledby="dropdownRadioBgHoverButton"
                              >
                                <li>
                                  <div
                                    onClick={() => {
                                      values.questions[index].type =
                                        "paragraph";
                                      setQtype(false);
                                    }}
                                    class="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600"
                                  >
                                    <ImParagraphRight size={20} />
                                    <label
                                      for="default-radio-4"
                                      class="w-full ms-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300"
                                    >
                                      Paragraph
                                    </label>
                                  </div>
                                </li>
                                <li>
                                  <div
                                    onClick={() => {
                                      values.questions[index].type = "radio";
                                      setQtype(false);
                                    }}
                                    class="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600"
                                  >
                                    <GrHomeOption size={20} />
                                    <label
                                      for="default-radio-4"
                                      class="w-full ms-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300"
                                    >
                                      Radio
                                    </label>
                                  </div>
                                </li>
                                {/* <li>
                            <div onClick={() =>{ values.questions[index].type = "checkbox"; setQtype(false) }} class="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                            <RiCheckboxCircleLine size={20}/>
                                <label for="default-radio-5" class="w-full ms-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300">Checkbox</label>
                            </div>
                        </li> */}
                                {/* <li>
                            <div onClick={() => { values.questions[index].type = "dropdown" ; setQtype(false)}} class="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                            <IoIosArrowDropdown size={20}/>
                               <label for="default-radio-6" class="w-full ms-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300">Dropdown</label>
                            </div>
                        </li>
                        <li>
                            <div onClick={() => { values.questions[index].type = "linear" ; setQtype(false)}} class="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                            <MdLinearScale size={20}/>
                              <label for="default-radio-6" class="w-full ms-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300">Linear Scale</label>
                            </div>
                        </li> */}
                              </ul>
                            </div>
                          </Modal.Body>
                        </Modal>

                        <div
                          key={index}
                          className="flex w-full mt-10  justify-between items-center"
                        >
                          <div className=" p-5 bg-[#FBFBFB] w-[90%] rounded-md border border-4 border-l-[#949ff9]">
                            <div className="flex w-full justify-between gap-3 ">
                              <Field
                                name={`questions.${index}.title`}
                                type="text"
                                placeholder="Untitled Question"
                                className="placeholder:text-black placeholder:text-lg p-4 placeholder:font-semibold w-[48%]   bg-[#f1f1f1] border-0 border-b-4 border-b-[#949ff9]  h-10"
                              />

                              <button
                                id="dropdownRadioBgHoverButton"
                                onClick={() => {
                                  setQtype(!qtype);
                                }}
                                data-dropdown-toggle="dropdownRadioBgHover"
                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm   block p-2.5 px-5 py-2.5 text-center inline-flex items-center gap-2 "
                                type="button"
                              >
                                {" "}
                                {values.questions[index].type == "paragraph" ? (
                                  <>
                                    {" "}
                                    <ImParagraphRight /> Paragraph{" "}
                                  </>
                                ) : values.questions[index].type ==
                                  "checkbox" ? (
                                  <>
                                    {" "}
                                    <RiCheckboxCircleLine /> Checkbox{" "}
                                  </>
                                ) : values.questions[index].type ==
                                  "dropdown" ? (
                                  <>
                                    {" "}
                                    <IoIosArrowDropdown /> Dropdown{" "}
                                  </>
                                ) : values.questions[index].type == "radio" ? (
                                  <>
                                    {" "}
                                    <GrHomeOption /> Radio{" "}
                                  </>
                                ) : values.questions[index].type == "linear" ? (
                                  <>
                                    {" "}
                                    <MdLinearScale /> Linear Scale{" "}
                                  </>
                                ) : (
                                  ""
                                )}{" "}
                                <svg
                                  class="w-2.5 h-2.5 ms-3"
                                  aria-hidden="true"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 10 6"
                                >
                                  <path
                                    stroke="currentColor"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="m1 1 4 4 4-4"
                                  />
                                </svg>
                              </button>
                            </div>
                            <div className="flex w-full justify-between gap-3 mt-5 ">
                              {values.questions[index].type == "paragraph" ? (
                                <>
                                  <Field
                                    name={`questions.${index}.answer`}
                                    type="text"
                                    placeholder="Short answer text"
                                    className="placeholder:text-gray-400 placeholder:text-md p-4 bg-transparent placeholder:font-thin w-[48%]  border-0 border-b-2 border-b-gray-300   h-10"
                                  />
                                </>
                              ) : values.questions[index].type == "checkbox" ||
                                values.questions[index].type == "dropdown" ||
                                values.questions[index].type == "radio" ? (
                                <>
                                  <div className="flex flex-col gap-2">
                                    <FieldArray
                                      name={`questions.${index}.options`}
                                    >
                                      {({ push, remove }) => (
                                        <>
                                          {Array.isArray(
                                            values.questions[index].options
                                          ) &&
                                            values.questions[index].options.map(
                                              (option, optionIndex) => (
                                                <div
                                                  key={optionIndex}
                                                  className="flex items-center"
                                                >
                                                  <Field
                                                    name={`questions.${index}.options.${optionIndex}`}
                                                    type="text"
                                                    placeholder="Option text"
                                                    className="border-b-2 border-gray-300 h-10 peer placeholder:text-gray-400 placeholder:text-md p-2 placeholder:font-thin"
                                                  />
                                                  <MdDelete
                                                    onClick={() =>
                                                      remove(optionIndex)
                                                    }
                                                    className="cursor-pointer ml-2 text-red-500"
                                                    size={20}
                                                  />
                                                </div>
                                              )
                                            )}
                                          <button
                                            type="button"
                                            onClick={() => push("")}
                                            className="text-sm text-blue-500"
                                          >
                                            Add Option
                                          </button>
                                        </>
                                      )}
                                    </FieldArray>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <MdLinearScale color="#c5c9ee" size={40} />
                                </>
                              )}

                              <div
                                class="bg-gray-50 text-gray-900 text-sm   block p-2   text-center inline-flex items-center gap-2 "
                                style={{ width: 220 }}
                                type="button"
                              >
                                Score&nbsp;Scale:
                                <Field
                                  name={`questions.${index}.score`}
                                  type="number"
                                  className="placeholder:text-black  w-full  bg-transparent placeholder:text-lg p-2 placeholder:font-semibold  border-0 border-b-2 border-b-gray-300   "
                                />
                              </div>
                            </div>

                            <hr className="mt-5" />
                            <div className="flex w-full justify-end items-center gap-3 mt-5">
                              <MdOutlineContentCopy
                                color="#c5c9ee"
                                size={20}
                                className="cursor-pointer"
                                onClick={() => {
                                  const questionToCopy =
                                    values.questions[index];
                                  push({ ...questionToCopy });
                                }}
                              />
                              <div className="divider bg-gray-300 h-6 w-px"></div>{" "}
                              {/* Vertical divider */}
                              <p className="text-[#9b9b9b]">Required</p>
                              <label className="inline-flex items-center cursor-pointer">
                                <Field
                                  type="checkbox"
                                  name={`questions.${index}.required`}
                                  checked={values.questions[index].required}
                                  className="sr-only peer"
                                  value={
                                    values.questions[index].required
                                      ? false
                                      : true
                                  }
                                />
                                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                              </label>
                            </div>
                          </div>

                          <div
                            onClick={() =>
                              push({
                                title: "",
                                type: "paragraph",
                                answer: "",
                                score: 1,
                                required: false,
                              })
                            }
                            className="flex cursor-pointer items-center justify-center border border-2 rounded-lg p-3"
                          >
                            <IoMdAddCircle color="#c5c9ee" size={30} />
                          </div>
                        </div>
                      </>
                    ))}
                  </>
                )}
              </FieldArray>

              <div className="flex items-center w-full justify-center">
                <button
                  type="submit"
                  className=" mb-4 bg-[#7b89f8] hover:bg-[#CBC3E3] text-white py-2 px-20 rounded-full shadow-md shadow-[#7b89f8] mt-10"
                >
                  Submit
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
}

export default Screeningformquestionnaire;
