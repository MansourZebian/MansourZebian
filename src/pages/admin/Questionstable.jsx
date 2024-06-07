import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { Button, Dropdown, Modal, Table } from "flowbite-react";
import { MdDelete, MdLinearScale, MdOutlineContentCopy } from "react-icons/md";
import { RiCheckboxCircleLine } from "react-icons/ri";
import { GoCheckbox } from "react-icons/go";
import { IoIosArrowDropdown, IoMdAddCircle } from "react-icons/io";
import { ImParagraphRight } from "react-icons/im";
import { GrHomeOption } from "react-icons/gr";

export default function ScreeningQuestionstable() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [user, setUser] = useState({});

  const [data, setData] = useState([]);
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

  const getScreeningData = async () => {
    try {
      const response = await axios.get(
        `https://backed.riverketaminestudy.com/api/screeningform/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(response.data); // Log the data received from the backend
      setData(response.data); // Set the data to state if needed
    } catch (error) {
      console.log(error); // Log any errors that occur during the request
    }
  };

  useEffect(() => {
    getScreeningData();
  }, []);

  const RecordsPerPage = 5;

  const [currentPage, setCurrentPage] = useState(1);

  const totalRecords = data.length;
  const totalPages = Math.ceil(totalRecords / RecordsPerPage);
  const startIndex = (currentPage - 1) * RecordsPerPage;
  const endIndex = Math.min(startIndex + RecordsPerPage, totalRecords);
  const currentRecords = data.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `https://backed.riverketaminestudy.com/api/screeningform/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Deleted successfully");
      getScreeningData();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const [editModal, setEditModal] = useState(false);
  const [src, setSrc] = useState({});
  const [type, settype] = useState("");
  const [qtype, setQtype] = useState(false);

  return (
    <>
      <Modal size={"7xl"} show={editModal} onClose={() => setEditModal(false)}>
        <Modal.Header></Modal.Header>
        <Modal.Body>
          <div className="text-center">
            {/* Edit Question  */}
            <Formik
              initialValues={{
                questions: {
                  title: src.question,
                  type: src.ansType === "text" ? "paragraph" : src.ansType,
                  answer: "",
                  score: 1,
                  required: src.requiredanswer,
                  options: src.option ? JSON.parse(src.option) : [""],
                },
              }}
              onSubmit={async (values, { setSubmitting }) => {
                try {
                  console.log(values);

                  const response = await axios.put(
                    `https://backed.riverketaminestudy.com/api/screeningform/update/${src.id}`,
                    {
                      type: type,
                      question: values.questions.title,
                      ansType:
                        values.questions.type === "paragraph"
                          ? "text"
                          : values.questions.type,
                      option:
                        Array.isArray(values.questions.options) &&
                        values.questions.options.length === 1 &&
                        values.questions.options[0] === ""
                          ? null
                          : values.questions.options,
                      requiredanswer: values.questions.required,
                    },
                    {
                      headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                          "token"
                        )}`,
                      },
                    }
                  );

                  toast.success("Updated successfully!");
                  setEditModal(false);
                  getScreeningData();
                } catch (error) {
                  toast.error("Error submitting data: " + error);
                  console.error("Error submitting data:", error); // Log error if submission fails
                }
              }}
            >
              {({ values, index }) => (
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
                                values.questions.type = "paragraph";
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
                                values.questions.type = "radio";
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
                            <div onClick={() =>{ values.questions.type = "checkbox"; setQtype(false) }} class="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
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

                  <Form>
                    <div key={index} className=" w-full">
                      <div className=" p-5 bg-[#FBFBFB]  rounded-md border border-4 border-l-[#949ff9]">
                        <div className="flex w-full justify-between gap-3 ">
                          <Field
                            name={`questions.title`}
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
                            {values.questions.type == "paragraph" ? (
                              <>
                                {" "}
                                <ImParagraphRight /> Paragraph{" "}
                              </>
                            ) : values.questions.type == "checkbox" ? (
                              <>
                                {" "}
                                <RiCheckboxCircleLine /> Checkbox{" "}
                              </>
                            ) : values.questions.type == "dropdown" ? (
                              <>
                                {" "}
                                <IoIosArrowDropdown /> Dropdown{" "}
                              </>
                            ) : values.questions.type == "radio" ? (
                              <>
                                {" "}
                                <GrHomeOption /> Radio{" "}
                              </>
                            ) : values.questions.type == "linear" ? (
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
                          {values.questions.type == "paragraph" ? (
                            <>
                              <Field
                                name={`questions.answer`}
                                type="text"
                                placeholder="Short answer text"
                                className="placeholder:text-gray-400 placeholder:text-md p-4 bg-transparent placeholder:font-thin w-[48%]  border-0 border-b-2 border-b-gray-300   h-10"
                              />
                            </>
                          ) : values.questions.type == "checkbox" ||
                            values.questions.type == "dropdown" ||
                            values.questions.type == "radio" ? (
                            <>
                              <div className="flex flex-col gap-2">
                                <FieldArray name={`questions.options`}>
                                  {({ push, remove }) => (
                                    <>
                                      {Array.isArray(
                                        values.questions.options
                                      ) &&
                                        values.questions.options.map(
                                          (option, optionIndex) => (
                                            <div
                                              key={optionIndex}
                                              className="flex items-center"
                                            >
                                              <Field
                                                name={`questions.options.${optionIndex}`}
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
                            class="bg-gray-50 border w-[16%] border-gray-300 text-gray-900 text-sm   block p-2   text-center inline-flex items-center gap-2 "
                            type="button"
                          >
                            Score&nbsp;Scale:{" "}
                            <Field
                              name={`questions.score`}
                              type="number"
                              className="placeholder:text-black  w-full  bg-transparent placeholder:text-lg p-2 placeholder:font-semibold  border-0 border-b-2 border-b-gray-300   "
                            />
                          </div>
                        </div>

                        <hr className="mt-5" />
                        <div className="flex w-full justify-end items-center gap-3 mt-5">
                          <div className="divider bg-gray-300 h-6 w-px"></div>{" "}
                          {/* Vertical divider */}
                          <p className="text-[#9b9b9b]">Required</p>
                          <label className="inline-flex items-center cursor-pointer">
                            <Field
                              type="checkbox"
                              name={`questions.required`}
                              checked={values.questions.required}
                              className="sr-only peer"
                              value={values.questions.required ? false : true}
                            />
                            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center w-full justify-center">
                      <button
                        type="submit"
                        className=" mb-4 bg-[#7b89f8] hover:bg-[#CBC3E3] text-white py-2 px-20 rounded-full shadow-md shadow-[#7b89f8] mt-10"
                      >
                        Submit
                      </button>
                    </div>
                  </Form>
                </>
              )}
            </Formik>
            {/* End Edit Question */}
          </div>
        </Modal.Body>
      </Modal>

      <Sidebar />
      <div class="p-10 sm:ml-64 bg-[#f7f7f7]">
        <div className="px-5 pb-14 pt-5 ">
          <h1 className="text-2xl text-left font-bold">Screening Questions</h1>
        </div>

        <a href="/admin/screeningformquestionaire" className="flex mb-5">
          <Button>Create</Button>
        </a>
        <div className="overflow-x-auto">
          <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead class="h-20 text-lg text-black bg-[#f0f1fa]">
              <tr>
                <th scope="col" class="px-6 py-3">
                  Question
                </th>
                <th scope="col" class="px-6 py-3">
                  Type
                </th>
                <th scope="col" class="px-6 py-3">
                  option
                </th>
                <th scope="col" class="px-6 py-3">
                  Answer Type
                </th>
                <th scope="col" class="px-6 py-3">
                  Required Answer
                </th>
                <th scope="col" class="px-6 py-3">
                  Created At
                </th>
                <th scope="col" class="px-6 py-3">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.map((item, index) => (
                <tr
                  key={startIndex + index}
                  class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                >
                  <th
                    scope="row"
                    class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {item.question}
                  </th>
                  <td class="px-6 py-4">{item.type}</td>
                  <td class="px-6 py-4">{item.option}</td>
                  <td class="px-6 py-4">{item.ansType}</td>
                  <td class="px-6 py-4">
                    {item.requiredanswer === true ? "Yes" : "No"}
                  </td>
                  <td class="px-6 py-4">{item.createdAt}</td>
                  <td class="px-6 py-4 flex gap-2">
                    <Button
                      className="bg-blue-500"
                      onClick={() => {
                        setSrc(item);
                        settype(item.type);
                        setEditModal(true);
                      }}
                    >
                      Edit
                    </Button>

                    <Button
                      className="bg-red-500"
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <nav aria-label="Page navigation example" className="mt-5">
          <ul className="flex items-center -space-x-px h-8 text-sm">
            <li>
              <a
                href="#"
                className={`flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${
                  currentPage === 1 && "opacity-50 cursor-not-allowed"
                }`}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                <span className="sr-only">Previous</span>
                <svg
                  className="w-2.5 h-2.5 rtl:rotate-180"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 6 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 1 1 5l4 4"
                  />
                </svg>
              </a>
            </li>
            {Array.from({ length: totalPages }, (_, index) => (
              <li key={index}>
                <a
                  href="#"
                  className={`flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${
                    currentPage === index + 1 &&
                    "text-blue-600 border-blue-300 bg-blue-50"
                  }`}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </a>
              </li>
            ))}
            <li>
              <a
                href="#"
                className={`flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${
                  currentPage === totalPages && "opacity-50 cursor-not-allowed"
                }`}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                <span className="sr-only">Next</span>
                <svg
                  className="w-2.5 h-2.5 rtl:rotate-180"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 6 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 9 4-4-4-4"
                  />
                </svg>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}
