import React, { useEffect, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import Sidebar from "../../components/Sidebar";
import { Modal, Button, Label, Radio } from "flowbite-react";
import { useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { toast } from "react-toastify";
import SearchSVG from "../../assets/svgs/search.svg";
import { CSVLink, CSVDownload } from "react-csv";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  SearchOutlined,
} from "@ant-design/icons";

function Dashboard() {
  const param = useParams();
  const [searchTerm, setSearchTerm] = useState(null);

  const [formtype, setFormtype] = useState(param.type || "Screening");
  const [openModal, setOpenModal] = useState(false);
  const [nameClickBool, setNameClickBool] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [regClickBool, setRegClickBool] = useState(false);
  const [statusClickBool, setStatusClickBool] = useState(false);

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
        `${process.env.REACT_APP_BACKEND_URL}screeningformanswer/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("screeningform...?????????>>", response);
      setData(
        response.data.filter(
          (item, index, self) =>
            // Check if the current item's key is the first occurrence in the array
            self.findIndex((t) => t.key === item.key) === index
        )
      ); // Set the data to state if needed
    } catch (error) {
      console.log(error); // Log any errors that occur during the request
    }
  };

  useEffect(() => {
    getScreeningData();
    getUsers();
  }, []);

  const RecordsPerPage = 3;

  const [currentPage, setCurrentPage] = useState(1);

  const totalRecords = data.length;
  const totalPages = Math.ceil(totalRecords / RecordsPerPage);
  const startIndex = (currentPage - 1) * RecordsPerPage;
  const endIndex = Math.min(startIndex + RecordsPerPage, totalRecords);
  const currentRecords = data.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleUserProfileClick = async (id) => {
    console.log(id);
    const documentVerification = await getDocumentverification(id);
    const consent = await getConsent(id);
    const emergencyContact = await getEmergencycontact(id);
    const information = await getInformation(id);

    // if (documentVerification && consent && emergencyContact && information) {
    window.location.href = `/admin/userprofile/${id}`;
    // } else {
    //   alert("Administration is not submitted");
    // }
  };

  const getDocumentverification = async (id) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}documentverification/getDocumentverificationByUser/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      return response.data != null;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const getConsent = async (id) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}consentform/getConsentformsByUser/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(response.data.length);
      return response.data != null;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const getEmergencycontact = async (id) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}emergencycontact/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(response.data.length);
      return response.data != null;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const getInformation = async (id) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}informationform/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(response.data.length);
      return response.data != null;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const [allUser, setAllUser] = useState([]);
  const [startIndexPagi, setStartIndexPagi] = useState(0);
  const [sortOrder, setSortOrder] = useState("dasc");
  const itemsPerPage = 10;

  // Filter data based on search term
  const filteredData = allUser?.filter(
    (item) =>
      item?.username?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      item?.email?.toLowerCase().includes(searchTerm?.toLowerCase())
  );

  useEffect(() => {
    if (nameClickBool === "Name" || nameClickBool === "Email") {
      setSortOrder("asc");
    } else if (nameClickBool === "Registered At") {
      setSortOrder("date");
    } else if (nameClickBool === "Status") {
      setSortOrder("status");
    } else {
      setSortOrder("dasc");
      setNameClickBool(null);
    }

    console.log("sortOrder", sortOrder);
  }, [nameClickBool]);

  let currentData = filteredData?.length
    ? filteredData
        ?.slice(startIndexPagi, startIndexPagi + itemsPerPage)
        .sort((a, b) => {
          switch (sortOrder) {
            case "asc":
              return a?.email?.localeCompare(b.email);
            case "date":
              const dateA = new Date(a?.createdAt);
              const dateB = new Date(b?.createdAt);
              console.log("Invalid date format:", a.createdAt, b.createdAt);
              if (isNaN(dateA) || isNaN(dateB)) {
                console.log("Invalid date format:", a.createdAt, b.createdAt);
                return 0;
              }

              return dateA - dateB;
            case "status":
              return a?.status?.localeCompare(b?.status); // Assuming you want to sort by status alphabetically
            case "desc":
            default:
              return b.email?.localeCompare(a?.email);
          }
        })
    : allUser
        ?.slice(startIndexPagi, startIndexPagi + itemsPerPage)
        .sort((a, b) => {
          switch (sortOrder) {
            case "asc":
              return a?.email?.localeCompare(b.email);
            case "date":
              const dateA = new Date(a?.createdAt);
              const dateB = new Date(b?.createdAt);
              console.log("Invalid date format:", a.createdAt, b.createdAt);
              if (isNaN(dateA) || isNaN(dateB)) {
                console.log("Invalid date format:", a.createdAt, b.createdAt);
                return 0;
              }

              return dateA - dateB;
            case "status":
              return a?.status?.localeCompare(b?.status); // Assuming you want to sort by status alphabetically
            case "desc":
            default:
              return b.email?.localeCompare(a?.email);
          }
        });

  const handleNextClick = () => {
    if (startIndexPagi + itemsPerPage < allUser?.length) {
      setStartIndexPagi(startIndexPagi + itemsPerPage);
    }
  };

  const handlePrevClick = () => {
    if (startIndexPagi - itemsPerPage >= 0) {
      setStartIndexPagi(startIndexPagi - itemsPerPage);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setStartIndexPagi(0); // Reset to the first page when a new search is performed
  };

  const getUsers = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}users`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(response.data);
      setAllUser(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const parseDateTimeString = (dateString) => {
    const dateObj = new Date(dateString);

    // Get date in format YYYY-MM-DD
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;

    // Get time in format HH:MM:SS
    const hours = String(dateObj.getHours()).padStart(2, "0");
    const minutes = String(dateObj.getMinutes()).padStart(2, "0");
    const seconds = String(dateObj.getSeconds()).padStart(2, "0");
    const formattedTime = `${hours}:${minutes}:${seconds}`;

    return { date: formattedDate, time: formattedTime };
  };

  const changeStatus = (e, id) => {
    const status = e.target.value; // Get the selected status from the event

    axios
      .put(
        `${process.env.REACT_APP_BACKEND_URL}users/changeStatus`,
        {
          id: id,
          status: status,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        // Assuming getUsers is a function to fetch users data, update it as needed
        getUsers();
        toast.success("Status updated successfully");
      })
      .catch((error) => {
        console.log(error);
        // Handle error if needed
      });
  };

  let totalPagesShow = Math.ceil(allUser?.length / itemsPerPage);
  let currentPageShow = Math.floor(startIndexPagi / itemsPerPage) + 1;

  return (
    <>
      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>Form Type</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Radio
                value="Screening"
                checked={formtype === "Screening"}
                onChange={() => setFormtype("Screening")}
              />
              <Label htmlFor="united-state">Screening</Label>
            </div>
            <div className="flex items-center gap-2">
              <Radio
                value="Existing"
                checked={formtype === "Existing"}
                onChange={() => setFormtype("Existing")}
              />
              <Label htmlFor="united-state">Existing</Label>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button color="gray" onClick={() => setOpenModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Sidebar />
      <div class="p-10 sm:ml-64 bg-[#f7f7f7]">
        <div className="flex items-center  gap-5">
          <h1 className="text-4xl font-bold">{formtype}</h1>
          <IoIosArrowDown
            size={30}
            onClick={() => setOpenModal(true)}
            className="mt-2"
          />
        </div>

        <div className="mt-10 relative overflow-x-auto">
          <div class="rounded-t-xl rounded-b-xl overflow-hidden">
            {formtype === "Screening" && (
              <>
                <div className="overflow-x-auto">
                  <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead class="h-20 text-lg text-black bg-[#f0f1fa]">
                      <tr>
                        <th scope="col" class="px-6 py-3">
                          Name
                        </th>
                        <th scope="col" class="px-6 py-3">
                          Sent
                        </th>
                        <th scope="col" class="px-6 py-3">
                          Received
                        </th>
                        {/* <th scope="col" class="px-6 py-3">
                    Processed
                </th> */}
                        <th scope="col" class="px-6 py-3">
                          Status
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
                            <a
                              href="#"
                              onClick={() =>
                                handleUserProfileClick(item.User.id)
                              }
                            >
                              {" "}
                              {item.User.username}{" "}
                            </a>
                          </th>
                          <td class="px-6 py-4">
                            {parseDateTimeString(item.createdAt).date},{" "}
                            {parseDateTimeString(item.createdAt)?.time}
                          </td>
                          <td class="px-6 py-4">
                            {parseDateTimeString(item.createdAt).date},{" "}
                            {parseDateTimeString(item.createdAt)?.time}
                          </td>

                          <td class="px-6 py-4">{item.status}</td>
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
                          currentPage === totalPages &&
                          "opacity-50 cursor-not-allowed"
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
              </>
            )}

            {formtype === "Existing" && (
              <>
                <div class="overflow-x-auto">
                  <table class=" w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead class="h-20 text-lg text-black bg-[#f0f1fa]">
                      <tr>
                        <th scope="col" class="px-6 py-3">
                          Name
                        </th>
                        <th scope="col" class="px-6 py-3">
                          Forms Filled
                        </th>
                        <th scope="col" class="px-6 py-3">
                          Invoice Paid
                        </th>
                        <th scope="col" class="px-6 py-3">
                          Invoice
                        </th>
                        <th scope="col" class="px-6 py-3">
                          Call Scheduled
                        </th>
                        <th scope="col" class="px-6 py-3">
                          Added to MDtoolbox
                        </th>
                        <th scope="col" class="px-6 py-3">
                          Script
                        </th>
                        <th scope="col" class="px-6 py-3">
                          Script Sent
                        </th>
                        <th scope="col" class="px-6 py-3">
                          Tracking Available
                        </th>
                        <th scope="col" class="px-6 py-3">
                          Type
                        </th>
                        <th scope="col" class="px-6 py-3">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentRecords.map((record, index) => (
                        <tr
                          key={startIndex + index}
                          className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                        >
                          <th
                            scope="row"
                            className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                          >
                            {record.name}
                          </th>
                          <td className="px-6 py-4">
                            <input
                              type="checkbox"
                              disabled
                              checked={record.formsFilled}
                            />
                          </td>
                          <td className="px-6 py-4">
                            <input
                              type="checkbox"
                              disabled
                              checked={record.invoicePaid}
                            />
                          </td>
                          <td className="px-6 py-4">
                            <select disabled value={record.invoice}>
                              <option value="Option 1">Option 1</option>
                              <option value="Option 2">Option 2</option>
                              <option value="Option 3">Option 3</option>
                            </select>
                          </td>
                          <td className="px-6 py-4">
                            <input
                              type="checkbox"
                              disabled
                              checked={record.callScheduled}
                            />
                          </td>
                          <td className="px-6 py-4">
                            <input
                              type="checkbox"
                              disabled
                              checked={record.addedToMDtoolbox}
                            />
                          </td>
                          <td className="px-6 py-4">
                            <input
                              type="checkbox"
                              disabled
                              checked={record.script}
                            />
                          </td>
                          <td className="px-6 py-4">
                            <select disabled value={record.scriptSent}>
                              <option value="Option 1">Option 1</option>
                              <option value="Option 2">Option 2</option>
                              <option value="Option 3">Option 3</option>
                            </select>
                          </td>
                          <td className="px-6 py-4">
                            <input
                              type="checkbox"
                              disabled
                              checked={record.trackingAvailable}
                            />
                          </td>
                          <td className="px-6 py-4">
                            <input type="text" disabled value={record.type} />
                          </td>
                          <td className="px-6 py-4">
                            <input type="text" disabled value={record.status} />
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
                          currentPage === totalPages &&
                          "opacity-50 cursor-not-allowed"
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
              </>
            )}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <h1 className="text-4xl font-bold flex mt-10">Users</h1>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 20,
              width: 350,
              height: 50,
            }}
          >
            <input
              style={{
                width: 350,
                height: 50,
                borderRadius: 10,
                backgroundColor: "transparent",
                border: "1px solid gray",
                color: "#000",
                // textAlign: "center",
                paddingLeft: 10,
              }}
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search user or email address"
            />
          </div>

          <div
            style={{
              cursor: "pointer",
            }}
          >
            <CSVLink data={currentData}>
              <img
                src="https://www.nicepng.com/png/detail/208-2087007_excel-icon-png-upload-csv-icon.png"
                style={{ width: 75, height: 50 }}
              />
              Download
            </CSVLink>
          </div>
        </div>

        <div className="mt-10 relative overflow-x-auto">
          <div className="overflow-x-auto">
            <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead class="h-20 text-lg text-black bg-[#f0f1fa]">
                <tr>
                  {["Name", "Email", "Registered At", "Status"].map(
                    (i, ind) => {
                      return (
                        <th
                          scope="col"
                          class="px-6 py-3"
                          style={{
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            if (ind === currentIndex) {
                              setCurrentIndex(-1);
                              setNameClickBool(null);
                            } else {
                              setCurrentIndex(ind);
                              setNameClickBool(i);
                            }
                          }}
                        >
                          <p>{i}</p>
                          <div style={{ marginLeft: "90%", marginTop: -25 }}>
                            {ind === currentIndex ? (
                              <ArrowUpOutlined />
                            ) : (
                              <ArrowDownOutlined />
                            )}
                          </div>
                        </th>
                      );
                    }
                  )}
                </tr>
              </thead>
              <tbody>
                {currentData
                  ?.filter((item) => item.email !== "admin@gmail.com")
                  .map((item, index) => {
                    return (
                      <tr
                        key={startIndex + index}
                        class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                      >
                        <th
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            handleUserProfileClick(item?.id);
                            localStorage.setItem("Email@@", item.email);
                          }}
                          scope="row"
                          class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                          {item.username}
                        </th>
                        <td class="px-6 py-4">{item.email}</td>
                        <td class="px-6 py-4">
                          {parseDateTimeString(item.createdAt).date}
                          {parseDateTimeString(item.createdAt)?.time}
                        </td>

                        <td class="px-6 py-4">
                          <select
                            name="status"
                            value={item.status}
                            onChange={(e) => changeStatus(e, item.id)}
                            className="w-28 border-2 border-[#7a92fb]"
                          >
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 100,
          alignSelf: "flex-start",
          marginTop: -20,
        }}
      >
        <div
          style={{ padding: 20, cursor: "pointer" }}
          onClick={() => {
            handlePrevClick();
          }}
        >
          Prev
        </div>
        <div
          style={{
            padding: 10,
            width: 40,
            borderRadius: 10,
            border: "1px solid lightgray",
          }}
        >
          {" "}
          {currentPageShow + "/" + totalPagesShow}
        </div>
        <div
          style={{ padding: 20, cursor: "pointer" }}
          onClick={() => {
            handleNextClick();
          }}
        >
          Next
        </div>
      </div>
    </>
  );
}

export default Dashboard;
