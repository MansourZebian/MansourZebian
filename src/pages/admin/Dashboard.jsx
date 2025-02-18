import React, { useEffect, useState } from "react";
import { IoIosArrowDown, IoIosRefresh, IoIosRemove } from "react-icons/io";
import Sidebar from "../../components/Sidebar";
import { Modal, Button, Label, Radio } from "flowbite-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { toast } from "react-toastify";
import './Dashboard.css'
import SearchSVG from "../../assets/svgs/search.svg";
import { CSVLink, CSVDownload } from "react-csv";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  SearchOutlined,
  UserOutlined,

} from "@ant-design/icons";
import { RiUserFill, RiUser3Fill } from "react-icons/ri";

function Dashboard() {
  const navigate = useNavigate();

  const param = useParams();
  const [searchTerm, setSearchTerm] = useState(null);

  const [formtype, setFormtype] = useState(param.type || "Existing");
  const [openModal, setOpenModal] = useState(false);
  const [nameClickBool, setNameClickBool] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [regClickBool, setRegClickBool] = useState(false);
  const [statusClickBool, setStatusClickBool] = useState(false);


  const [newUserFilteredData, setNewUserFilteredData] = useState([])

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [user, setUser] = useState({});

  const [data, setData] = useState([]);


  const [isLoading, setIsLoading] = useState(false);
  const [loadingIndexes, setLoadingIndexes] = useState(false);
  const [isFetchingLoading, setIsFetchingLoading] = useState(false)

  const [currentNewUserRecords, setCurrentNewUserRecords] = useState([])
  // pagination handling
  const [currentNewUserPage, setCurrentNewUserPage] = useState(1);
  const [allUsersHasFormsFilled, setAllUsersHasFormsFilled] = useState([])

  const [totalNewUserDataPages, setTotalNewUserDataPages] = useState(0);


  const [newUser, setNewUser] = useState([])
  const [oldUser, setOldUser] = useState([]) // will save same value when useEffect fetches to compare later
  const [Progress, setProgress] = useState(null)

  //filter to do

  const [sortDirection, setSortDirection] = useState('asc'); // Initial sort direction
  const [sortedColumn, setSortedColumn] = useState(null); // Track the column being sorted

  const [filters, setFilters] = useState({
    first_name: "",
    last_name: "",
    type: "",
    formSent: null,
    formFill: null,
    status: "",
  });
  // State to trigger the useEffect
  const [refresh, setRefresh] = useState(false);



  const getAllUsersHasFormsFilled = async () => {

    // users/getAllUserHasFormFilledStatus

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}users/getAllUserHasFormFilledStatus`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      // console.log(response.data);
      setAllUsersHasFormsFilled(response.data);
    } catch (error) {
      console.log(error);
    }
  }


  //for handling mulitple options purpose field in exisitingform




  // useEffect(() => {

  //   const authToken = localStorage.getItem("token");
  //   if (!authToken) {
  //     return
  //   }
  //   const decodedUser = jwtDecode(authToken);

  //   if (decodedUser.role === "User") {
  //     // window.location.href = "/admin";
  //     navigate("/");

  //   }

  // }, [])


  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };


  useEffect(() => {
    applyFilters();
  }, [filters, newUser]);

  // useEffect(() => {
  //   applyFilters(); // Reapply filters when page changes
  // }, [currentNewUserPage, newUser]);

  useEffect(() => {
    if (currentNewUserPage > totalNewUserDataPages) {
      setCurrentNewUserPage(1); // Reset page to 1 if the current page is invalid
    }
  }, [totalNewUserDataPages]);

  const applyFilters = () => {
    const filtered = newUser.filter((item) => {
      return (
        (filters.first_name
          ? (item.first_name.toLowerCase().includes(filters.first_name.toLowerCase()) ||
            item.last_name.toLowerCase().includes(filters.first_name.toLowerCase()))
          : true) &&

        (filters.type ? item.type === filters.type : true) &&
        (filters.status ? item.status === filters.status : true)
      );
    });


    if (filtered.length === 0) {
      // Set empty array and total pages to 0 if no matches
      setTotalNewUserDataPages(0);
      setCurrentNewUserRecords([]);
      return;
    }


    // Update the filtered data state
    setNewUserFilteredData(filtered);

    // Update total pages dynamically based on filtered data
    const totalPages = Math.ceil(filtered.length / newUserItemsPerPage);
    setTotalNewUserDataPages(totalPages);

    // Handle pagination for filtered data
    const startIndex = (currentNewUserPage - 1) * newUserItemsPerPage;
    const endIndex = startIndex + newUserItemsPerPage;
    setCurrentNewUserRecords(filtered.slice(startIndex, endIndex));
  };

  // const applyFilters = () => {
  //   const filtered = newUser.filter((item) => {
  //     return (
  //       (filters.first_name ? item.first_name.toLowerCase().includes(filters.first_name.toLowerCase()) : true) &&
  //       (filters.type ? item.type === filters.type : true) &&
  //       (filters.status ? item.status === filters.status : true)
  //     );
  //   });

  //   // alert('see filtered',JSON.stringify(filtered))

  //   // Update the filtered data state
  //   setNewUserFilteredData(filtered);

  //   // Handle case when there are no filtered results
  //   if (filtered.length === 0) {
  //     // Set empty array and total pages to 0 if no matches
  //     setTotalNewUserDataPages(0);
  //     setCurrentNewUserRecords([]);
  //     return;
  //   }
  //   else{


  //   // Update total pages dynamically based on filtered data
  //   const totalPages = Math.ceil(filtered.length / newUserItemsPerPage);
  //   setTotalNewUserDataPages(totalPages);

  //   // Handle pagination for filtered data
  //   const startIndex = (currentNewUserPage - 1) * newUserItemsPerPage;
  //   const endIndex = startIndex + newUserItemsPerPage;
  //   setCurrentNewUserRecords(filtered.slice(startIndex, endIndex));
  //   }
  // };






  const getPrevSceeningData = async () => {
    try {
      // Fetch users who filled the form
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}screeningformanswer/`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      setData(
        response.data.filter(
          (item, index, self) =>
            // Check if the current item's key is the first occurrence in the array
            self.findIndex((t) => t.key === item.key) === index
        )
      ); // Set the data to state if needed
    }
    catch (error) {
      console.log('error while getting data')
    }
  }

  // const getScreeningData = async () => {
  //   try {
  //     // Fetch users who filled the form
  //     const usersListWhoFilledForm = await axios.get(
  //       `${process.env.REACT_APP_BACKEND_URL}screeningformanswer/userfilledforms`,
  //       {
  //         headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  //       }
  //     );

  //     // Extract valid data from usersListWhoFilledForm
  //     const usersListWhoFilledList = Array.isArray(usersListWhoFilledForm.data?.data)
  //       ? usersListWhoFilledForm.data.data.filter(
  //         (user) => user && user.userId && user.first_name && user.last_name && user.email
  //       )
  //       : [];
  //     // console.log("Filtered usersListWhoFilledList:", usersListWhoFilledList);

  //     // Fetch existing form data
  //     const existingFormData = await axios.get(
  //       `${process.env.REACT_APP_BACKEND_URL}existingforms/get/`,
  //       {
  //         headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  //       }
  //     );

  //     // Extract valid data from existingFormData
  //     const existingFormDataList = Array.isArray(existingFormData.data?.data)
  //       ? existingFormData.data.data
  //       : [];
  //     // console.log("Existing form data:", existingFormDataList);

  //     // Find users who are not already in existingFormDataList
  //     const existingUserIds = existingFormDataList.map((form) => form.userId);
  //     const usersToAdd = usersListWhoFilledList.filter(
  //       (user) => !existingUserIds.includes(user.userId)
  //     );
  //     // console.log("Users to add to existing form data:", usersToAdd);

  //     // Function to create new entries in existing forms
  //     const createExistingFormEntry = async (user) => {
  //       const payload = {
  //         userId: user.userId,
  //         first_name: user.first_name || "",
  //         last_name: user.last_name || "",
  //         email: user.email || null,
  //         status: user.status,
  //         active: true
  //       };
  //       const response = await axios.post(
  //         `${process.env.REACT_APP_BACKEND_URL}existingforms/create`,
  //         payload,
  //         {
  //           headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  //         }
  //       );
  //       if (response.status === 201) {
  //         console.log("Successfully created entry for user:", user.userId);
  //       } else {
  //         console.error("Failed to create entry for user:", user.userId);
  //       }
  //     };

  //     // If there are users to add, create them and refetch the updated form data
  //     if (usersToAdd.length > 0) {
  //       for (const user of usersToAdd) {
  //         await createExistingFormEntry(user);
  //       }
  //       console.log("Finished creating new entries. Refetching updated data...");

  //       // Refetch updated existing form data
  //       const updatedFormData = await axios.get(
  //         `${process.env.REACT_APP_BACKEND_URL}existingforms/get/`,
  //         {
  //           headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  //         }
  //       );

  //       let filteredForStatus = Array.isArray(updatedFormData.data.data)
  //         ? updatedFormData.data.data.filter(
  //           (item) => item?.active === "1"
  //         )
  //         : [];
  //       // setNewUser(updatedFormData.data.data);
  //       // console.log('see filteredforstatus',filteredForStatus)
  //       setNewUser(filteredForStatus)

  //     } else {


  //       let filteredForStatus = Array.isArray(existingFormData.data.data)
  //         ? existingFormData.data.data.filter(
  //           (item) => item?.active === "1"
  //         )
  //         : [];


  //       // console.log(
  //       //   "Statuses in data:",
  //       //   existingFormData?.data?.data.map((item) => item?.active==="1")
  //       // );

  //       // setNewUser(existingFormData.data.data);

  //       // console.log('exsiing:',existingFormData.data.data)
  //       // console.log(filteredForStatus,'ddddd')
  //       setNewUser(filteredForStatus)


  //     }

  //     // console.log("Finished processing.");
  //   } catch (error) {
  //     console.error("Error in getScreeningData:", error);
  //   }
  // };

  const getScreeningData = async () => {
    try {
      // Fetch all existing forms and user data from the backend
      const existingFormsResponse = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}existingforms/get/`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      // Log the raw response for debugging
      // console.log("Raw API Response:", existingFormsResponse.data);

      // Extract valid data
      const existingFormDataList = Array.isArray(existingFormsResponse.data?.data)
        ? existingFormsResponse.data.data
        : [];

      // Filter based on the "active" status (handling multiple formats)
      const filteredForStatus = existingFormDataList.filter(
        (item) => (item?.active === true ||
          item?.active === "1" ||
          item?.active === 1)

      );

      // console.log("Filtered Active Users:", filteredForStatus);

      // Update state with filtered data
      if (filteredForStatus.length === 0) {
        console.warn("No active users found!");
      }
      setNewUser(filteredForStatus);

      // console.log("Finished processing existing forms data.");
    } catch (error) {
      console.error("Error in getScreeningData:", error);

      // Handle specific errors
      if (error.response) {
        console.error("Server responded with error:", error.response.data);
        toast.error(`Error: ${error.response.data.message || "Unknown error"}`);
      } else if (error.request) {
        console.error("No response received from server:", error.request);
        toast.error("No response from server. Please try again later.");
      } else {
        console.error("Error setting up the request:", error.message);
        toast.error("Error occurred. Please check your input or try again.");
      }

      // Handle session expiration
      if (error?.response?.status === 401) {
        toast.error("Session expired");
        localStorage.clear();
        navigate("/login");
      }
    }
  };



  // const getScreeningData = async () => {
  //   try {
  //     // Fetch users who filled the form
  //     const usersListWhoFilledForm = await axios.get(
  //       `${process.env.REACT_APP_BACKEND_URL}screeningformanswer/userfilledforms`,
  //       {
  //         headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  //       }
  //     );

  //     // Extract valid data from usersListWhoFilledForm
  //     const usersListWhoFilledList = Array.isArray(usersListWhoFilledForm.data?.data)
  //       ? usersListWhoFilledForm.data.data.filter(
  //         (user) => user && user.userId && user.first_name && user.last_name && user.email
  //       )
  //       : [];

  //     // Fetch existing form data
  //     const existingFormData = await axios.get(
  //       `${process.env.REACT_APP_BACKEND_URL}existingforms/get/`,
  //       {
  //         headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  //       }
  //     );

  //     // Extract valid data from existingFormData
  //     const existingFormDataList = Array.isArray(existingFormData.data?.data)
  //       ? existingFormData.data.data
  //       : [];

  //     // Find users who are not already in existingFormDataList
  //     const existingUserIds = existingFormDataList.map((form) => form.userId);
  //     const usersToAdd = usersListWhoFilledList.filter(
  //       (user) => !existingUserIds.includes(user.userId)
  //     );

  //     // Function to create new entries in existing forms
  //     const createExistingFormEntry = async (user) => {
  //       const payload = {
  //         userId: user.userId,
  //         first_name: user.first_name || "",
  //         last_name: user.last_name || "",
  //         email: user.email || null,
  //         status: user.status,
  //         active: true,
  //       };
  //       const response = await axios.post(
  //         `${process.env.REACT_APP_BACKEND_URL}existingforms/create`,
  //         payload,
  //         {
  //           headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  //         }
  //       );
  //       if (response.status === 201) {
  //         console.log("Successfully created entry for user:", user.userId);
  //       } else {
  //         console.error("Failed to create entry for user:", user.userId);
  //       }
  //     };

  //     // Function to handle creating users concurrently
  //     const createUsersConcurrently = async (usersToAdd) => {
  //       const promises = usersToAdd.map((user) => createExistingFormEntry(user));
  //       await Promise.all(promises);
  //     };

  //     // If there are users to add, create them and refetch the updated form data
  //     if (usersToAdd.length > 0) {
  //       await createUsersConcurrently(usersToAdd);
  //       console.log("Finished creating new entries. Refetching updated data...");

  //       // Refetch updated existing form data
  //       const updatedFormData = await axios.get(
  //         `${process.env.REACT_APP_BACKEND_URL}existingforms/get/`,
  //         {
  //           headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  //         }
  //       );

  //       // Filter based on the "active" status
  //       let filteredForStatus = Array.isArray(updatedFormData.data.data)
  //         ? updatedFormData.data.data.filter((item) => item?.active === "1")
  //         : [];
  //       setNewUser(filteredForStatus);
  //     } else {
  //       // If no new users to add, just filter and update the state
  //       let filteredForStatus = Array.isArray(existingFormData.data.data)
  //         ? existingFormData.data.data.filter((item) => item?.active === "1")
  //         : [];
  //       setNewUser(filteredForStatus);
  //     }

  //     console.log("Finished processing.");
  //   } catch (error) {
  //     console.error("Error in getScreeningData:", error);

  //     // Handle specific errors such as 401 Unauthorized
  //     if (error?.response?.status === 401) {
  //       toast.error("Session expired");
  //       localStorage.clear();
  //       navigate("/login");
  //     } else {
  //       toast.error("An error occurred while processing the data");
  //     }
  //   }
  // };





  useEffect(() => {
    getPrevSceeningData()
    getAllUsersHasFormsFilled();

    getScreeningData();

    getUsers();
  }, [refresh]);

  // Handle refresh button click
  const handleRefresh = () => {
    console.log("Refreshing..."); // Debugging log
    setRefresh((prev) => !prev); // Toggle refresh state
  };

  const RecordsPerPage = 2;


  const [currentPage, setCurrentPage] = useState(1);



  const totalRecords = data.length;
  // const totalRecords = newUser.length;
  const totalPages = Math.ceil(totalRecords / RecordsPerPage);
  const startIndex = (currentPage - 1) * RecordsPerPage;
  const endIndex = Math.min(startIndex + RecordsPerPage, totalRecords);
  const currentRecords = data.slice(startIndex, endIndex);




  useEffect(() => {
    const fetchExistingFormEntries = async () => {
      try {
        setIsFetchingLoading(true);
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}existingforms/get/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.status === 200) {
          const data = response?.data?.data;
          // setNewUser(data); // Original data

          setIsFetchingLoading(false);
        } else {
          toast.error("No data");
          setIsFetchingLoading(false);
        }
      } catch (error) {
        if (error?.response?.status === 401) {
          toast.error("Session expired");
          localStorage.clear();
          navigate("/login");
          setIsFetchingLoading(false);
          return;
        } else {
          toast.error("Error while fetching existing form data");
          setIsFetchingLoading(false);
        }
      } finally {
        setIsFetchingLoading(false);
      }
    };

    fetchExistingFormEntries();
  }, []);



  //added this


  const handlePageChange = (page) => {
    setCurrentPage(page);
  };



  const formatDateTime = (isoString) => {
    if (!isoString) return ""; // Handle empty or undefined values
    const date = new Date(isoString);
    if (isNaN(date)) return ""; // If the date is invalid, return an empty string
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };


  const handleSaveButton = async () => {
    if (currentNewUserRecords.some((item) => !item.first_name || !item.last_name || !item.userId)) {
      toast.error("Please enter first name, last name, and type");
      return;
    }


    const successUpdates = [];
    const failedUpdates = [];
    const successfullyProcessedUsers = [];
    let completed = 0;

    try {
      setIsLoading(true);
      let date = new Date();


      const currentDate = new Date().toISOString();

      // Helper function: Check if a record has changed
      const hasChanged = (newData, oldData) => {
        const oldUserData = oldData.find((item) => item.id === newData.id);
        if (!oldUserData) return true; // New data is considered changed
        return JSON.stringify(newData) !== JSON.stringify(oldUserData);
      };

      for (const user of currentNewUserRecords) {
        if (user.id) {
          user["updatedAt"] = currentDate;
          // Update existing user
          if (!hasChanged(user, oldUser)) continue;

          // applyLoop on user to convert purpose to JSON.parse(user.purpose);
          console.log("See in saving purpose:", user.purpose)
          // user.purpose = [...user?.purpose || ""];


          try {
            const response = await axios.post(
              `${process.env.REACT_APP_BACKEND_URL}existingforms/update/${user.id}`,
              user,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );

            if (response.status === 200) {
              successUpdates.push(user.fname);
              successfullyProcessedUsers.push(user);

              // Update the filtered data (newUserFilteredData) after the update
              setNewUserFilteredData((prevUsers) =>
                prevUsers.map((item) =>
                  item.id === user.id ? { ...item, ...user } : item
                )
              );

              // Update the full data (newUser) as well after the update
              setNewUser((prevUsers) =>
                prevUsers.map((item) =>
                  item.id === user.id ? { ...item, ...user } : item
                )
              );

              // Update the current page records
              const startIndex = (currentNewUserPage - 1) * newUserItemsPerPage;
              const endIndex = startIndex + newUserItemsPerPage;
              setCurrentNewUserRecords(newUser.slice(startIndex, endIndex));  // Update current page records
              setOldUser(newUser.slice(startIndex, endIndex)); // Update the old records for comparison

            } else {
              failedUpdates.push(user.fname);
            }
          } catch (error) {
            failedUpdates.push(user.fname);
            if (error?.response?.status === 401) {
              toast.error("Session expired");
              localStorage.clear();
              navigate("/login");
              return;
            }
          }
        } else {
          // Create new user
          try {
            const response = await axios.post(
              `${process.env.REACT_APP_BACKEND_URL}existingforms/create`,
              user,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );

            if (response.status === 201) {
              successUpdates.push(user.fname);
              successfullyProcessedUsers.push({
                ...user,
                id: response.data.form.id,
              });

              // Update local state with the new ID
              setNewUser((prevUsers) =>
                prevUsers.map((item) =>
                  item === user ? { ...item, id: response.data.form.id } : item
                )
              );

              // Update the filtered data (newUserFilteredData) with the new user
              setNewUserFilteredData((prevUsers) =>
                prevUsers.map((item) =>
                  item === user ? { ...item, id: response.data.form.id } : item
                )
              );

              // Update current records to ensure UI reflects changes
              const startIndex = (currentNewUserPage - 1) * newUserItemsPerPage;
              const endIndex = startIndex + newUserItemsPerPage;
              setCurrentNewUserRecords(newUser.slice(startIndex, endIndex));  // Update current page records
              setOldUser(newUser.slice(startIndex, endIndex)); // Update the old records for comparison

            } else {
              failedUpdates.push(user.fname);
            }
          } catch (error) {
            failedUpdates.push(user.fname);
            if (error?.response?.status === 401) {
              toast.error("Session expired");
              localStorage.clear();
              navigate("/login");
              return;
            }
          }
        }

        completed++;
        setProgress(`Processing ${completed}/${currentNewUserRecords.length}`);
      }

      if (successUpdates.length > 0) {
        toast.success(`Saved successfully: ${successUpdates.join(", ")}`);
      }
      if (failedUpdates.length > 0) {
        toast.error(`Failed to save: ${failedUpdates.join(", ")}`);
      }

      // After successful updates or creations, reapply the filter to the updated data
      applyFilters();

      // Update old user state for comparison
      setOldUser((prevOldUsers) => {
        const updatedUsers = prevOldUsers.map((oldUser) => {
          const updatedUser = successfullyProcessedUsers.find(
            (newUser) => newUser.id === oldUser.id
          );
          return updatedUser || oldUser;
        });

        const newUsers = successfullyProcessedUsers.filter(
          (newUser) => !prevOldUsers.find((oldUser) => oldUser.id === newUser.id)
        );

        return [...updatedUsers, ...newUsers];
      });
    } catch (error) {
      console.error("Unexpected error during save:", error);
      toast.error("An unexpected error occurred during save. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };




  const handleDeleteUser = async (index) => {
    const userRecord = currentNewUserRecords[index];
    const { id, userId, first_name } = userRecord;

    if (!userRecord) {
      toast.error("Invalid user record.");
      return;
    }

    setLoadingIndexes(index);

    try {
      setIsLoading(true);

      // Handle unsaved users (no `id`) - Remove locally
      if (!id) {
        setNewUser((prevUsers) => {
          const updatedUsers = prevUsers.filter((_, i) => i !== index);
          setNewUserFilteredData(updatedUsers); // Update filtered data
          reapplyFilters(updatedUsers); // Reapply filters to refresh the list
          return updatedUsers;
        });

        setLoadingIndexes(false);
        return;
      }

      // Proceed to delete user from the backend
      const deleteResponse = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}existingforms/delete/${userId}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (deleteResponse.status === 200) {
        toast.success(`User ${first_name} deleted successfully.`);

        // Attempt to delete associated screening form answers
        // handled from controller of existingform to delete screning answers
        // try {
        //   await axios.put(
        //     `${process.env.REACT_APP_BACKEND_URL}screeningformanswer/deletebyuserid/${userId}`,null,{
        //       headers: {
        //         Authorization: `Bearer ${localStorage.getItem("token")}`,
        //       },
        //     }

        //   );






        // } catch (screeningError) {
        //   console.warn(
        //     `Error deleting screening form answers for user ${first_name}:`,
        //     screeningError
        //   );
        // }

        // Update state after successful deletion
        setNewUser((prevUsers) => {
          const updatedUsers = prevUsers.filter((user) => user.id !== id);
          setNewUserFilteredData(updatedUsers); // Update filtered data
          reapplyFilters(updatedUsers); // Reapply filters to refresh the list
          return updatedUsers;
        });
      } else {
        toast.error(`Failed to delete user ${first_name}.`);
      }
    } catch (error) {
      console.error("Error deleting user:", error);

      if (error?.response?.status === 401) {
        toast.error("Session expired.");
        localStorage.clear();
        navigate("/login");
      } else {
        toast.error(`An error occurred while deleting user ${first_name}.`);
      }
    } finally {
      setIsLoading(false);
      setLoadingIndexes(false);
    }
  };

  // Helper function to reapply filters and update paginated records
  const reapplyFilters = (updatedUsers) => {
    // Apply the current filter logic to updatedUsers
    const filteredUsers = applyFiltersToUsers(updatedUsers);

    // Update the paginated records for the current page
    const startIndex = (currentNewUserPage - 1) * newUserItemsPerPage;
    const endIndex = startIndex + newUserItemsPerPage;
    setCurrentNewUserRecords(filteredUsers.slice(startIndex, endIndex));
  };

  const applyFiltersToUsers = (users) => {
    // Example filter logic
    return users.filter((user) => user.active === true);
  };




  // Update specific field in newUser
  const handleUpdateUserField = (index, field, value) => {
    setCurrentNewUserRecords((prevUsers) => {
      const updatedUsers = [...prevUsers];

      // Ensure 'purpose' is always stored as an array in state
      if (field === "purpose") {
        value = Array.isArray(value) ? value : JSON.parse(value || "[]");
      }

      updatedUsers[index] = { ...updatedUsers[index], [field]: value };
      return updatedUsers;
    });
  };


  //original
  // const handleUpdateUserField = (index, field, value) => {
  //   setCurrentNewUserRecords((prevUsers) => {
  //     const updatedUsers = [...prevUsers];
  //     updatedUsers[index] = { ...updatedUsers[index], [field]: value };
  //     return updatedUsers;
  //   });
  // };

  const newUserItemsPerPage = 7; // Number of rows per page
  // let totalNewUserDataPages = Math.ceil(newUser.length / newUserItemsPerPage);
  // setTotalNewUserDataPages(Math.ceil(newUser.length / newUserItemsPerPage))

  useEffect(() => {
    setTotalNewUserDataPages(Math.ceil(newUser.length / newUserItemsPerPage));
  }, [newUser, newUserItemsPerPage]);

  const startNewUserIndex = (currentNewUserPage - 1) * newUserItemsPerPage;
  const endNewUserIndex = startNewUserIndex + newUserItemsPerPage;


  // const currentNewUserRecords = newUser.slice(startNewUserIndex, endNewUserIndex);
  // setCurrentNewUserRecords(newUser.slice(startNewUserIndex, endNewUserIndex))


  const handleNewUserPageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalNewUserDataPages) {
      setCurrentNewUserPage(pageNumber);
    }
  };
  useEffect(() => {
    // Always apply filters to determine the correct data slice
    if (newUserFilteredData.length > 0) {
      const startIndex = (currentNewUserPage - 1) * newUserItemsPerPage;
      const endIndex = startIndex + newUserItemsPerPage;

      // Slice filtered data for current page
      setCurrentNewUserRecords(newUserFilteredData.slice(startIndex, endIndex));
      setOldUser(newUserFilteredData.slice(startIndex, endIndex)); // Optional: track previous records
    } else {
      const startIndex = (currentNewUserPage - 1) * newUserItemsPerPage;
      const endIndex = startIndex + newUserItemsPerPage;

      // Fallback: handle unfiltered `newUser` if no filters are active
      setCurrentNewUserRecords(newUser.slice(startIndex, endIndex));
      setOldUser(newUser.slice(startIndex, endIndex));
    }
  }, [newUserFilteredData, currentNewUserPage, newUserItemsPerPage, newUser]);








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







  const handleUserProfileClick = async (id) => {
    // console.log(id);
    const documentVerification = await getDocumentverification(id);
    const consent = await getConsent(id);
    const emergencyContact = await getEmergencycontact(id);
    const information = await getInformation(id);

    // if (documentVerification && consent && emergencyContact && information) {
    // window.location.href = `/admin/userprofile/${id}`;
    navigate(`/admin/userprofile/${id}`);
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
      // console.log(response.data.length);
      return response.data != null;
    } catch (error) {
      // console.log(error);
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
      // console.log(response.data.length);
      return response.data != null;
    } catch (error) {
      // console.log(error);
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
      // console.log(response.data.length);
      return response.data != null;
    } catch (error) {
      // console.log(error);
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

    // console.log("sortOrder", sortOrder);
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
            // console.log("Invalid date format:", a.createdAt, b.createdAt);
            if (isNaN(dateA) || isNaN(dateB)) {
              // console.log("Invalid date format:", a.createdAt, b.createdAt);
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
            // console.log("Invalid date format:", a.createdAt, b.createdAt);
            if (isNaN(dateA) || isNaN(dateB)) {
              // console.log("Invalid date format:", a.createdAt, b.createdAt);
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
      // console.log(response.data);
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
    // console.log(e.target.value)
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
      <div className="p-10 sm:ml-64 bg-[#f7f7f7]" >

        <div style={{ backgroundColor: "#FFFFFF", padding: 20, borderRadius: 10 }}>

          <div className="flex items-center gap-5 " >
            <h1 className="text-4xl font-bold ">{formtype}</h1>
            <IoIosArrowDown
              size={30}
              onClick={() => setOpenModal(true)}
              className="mt-2"
            />
            <IoIosRefresh
              size={20}
              onClick={() => window.location.reload()}
              className="cursor-pointer hover:text-green-500" // Apply hover effect using Tailwind
            />


            {formtype === "Existing" && (

              <div className="filters ms-auto flex flex-wrap justify-end gap-4">
                <input
                  type="text"
                  placeholder="Filter by Name"
                  value={filters.first_name}
                  className="w-full sm:w-48 md:w-56 h-12 rounded-lg bg-transparent border border-gray-400 text-black pl-3"
                  onChange={(e) => handleFilterChange("first_name", e.target.value)}
                />

                <select
                  value={filters.type}
                  className="w-full sm:w-32 md:w-40 h-12 rounded-lg bg-transparent border border-gray-400 text-black pl-3"
                  onChange={(e) => handleFilterChange("type", e.target.value)}
                >
                  <option value="">Type</option>
                  <option value="New Participant">New Participant</option>
                  <option value="Refill">Refill</option>
                  <option value="Renewal">Renewal</option>
                  <option value="Rejected">Rejected</option>
                </select>

                <select
                  value={filters.status}
                  className="w-full sm:w-32 md:w-40 h-12 rounded-lg bg-transparent border border-gray-400 text-black pl-3"
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                >
                  <option value="">Status</option>
                  <option value="inProgress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="payment Pending">Payment Pending</option>
                  <option value="tracking late">Tracking late</option>
                </select>
              </div>

              // <div className="filters ms-auto">
              //   <input
              //     type="text"
              //     placeholder="Filter by Name"
              //     value={filters.first_name}
              //     style={{
              //       width: 200,
              //       height: 50,
              //       borderRadius: 10,
              //       backgroundColor: "transparent",
              //       border: "1px solid gray",
              //       color: "#000",
              //       // textAlign: "center",
              //       paddingLeft: 10,
              //     }}
              //     onChange={(e) => handleFilterChange("first_name", e.target.value)}
              //   />

              //   <select
              //     value={filters.type}
              //     style={{
              //       width: 100,
              //       height: 50,
              //       borderRadius: 10,
              //       backgroundColor: "transparent",
              //       border: "1px solid gray",
              //       color: "#000",
              //       // textAlign: "center",
              //       paddingLeft: 10,
              //     }}
              //     onChange={(e) => handleFilterChange("type", e.target.value)}
              //   >
              //     <option value="">Type</option>
              //     <option value="New Participant">New Participant</option>
              //     <option value="Refill">Refill</option>
              //     <option value="Renewal">Renewal</option>
              //     <option value="Rejected">Rejected</option>
              //   </select>
              //   <select
              //     value={filters.status}
              //     style={{
              //       width: 100,
              //       height: 50,
              //       borderRadius: 10,
              //       backgroundColor: "transparent",
              //       border: "1px solid gray",
              //       color: "#000",
              //       // textAlign: "center",
              //       paddingLeft: 10,
              //     }}
              //     onChange={(e) => handleFilterChange("status", e.target.value)}
              //   >
              //     <option value="">Status</option>
              //     <option value="inProgress">In Progress</option>
              //     <option value="completed">Completed</option>
              //     <option value="cancelled">Cancelled</option>
              //     <option value="payment Pending">Payment Pending</option>
              //     <option value="tracking late">Tracking late</option>
              //   </select>


              // </div>
            )}
          </div>



          <div className="mt-10 relative overflow-x-auto">
            <div className="rounded-t-xl rounded-b-xl overflow-hidden">
              {formtype === "Screening" && (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                      <thead className="h-20 text-lg text-black bg-[#f0f1fa]">
                        <tr>
                          <th scope="col" className="px-6 py-3">
                            Name
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Sent
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Received
                          </th>
                          {/* <th scope="col" className="px-6 py-3">
                    Processed
                </th> */}
                          <th scope="col" className="px-6 py-3">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentRecords?.map((item, index) => (
                          <tr
                            key={startIndex + index}
                            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                          >
                            <th
                              scope="row"
                              className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                            >
                              <Link
                                to={`/userprofile/${item?.User?.id}`}
                                // href="#"
                                onClick={() =>
                                  handleUserProfileClick(item?.User?.id)
                                }
                              >
                                {" "}
                                {item?.User?.username}{" "}
                              </Link>
                            </th>
                            <td className="px-6 py-4">
                              {parseDateTimeString(item?.createdAt)?.date},{" "}
                              {parseDateTimeString(item?.createdAt)?.time}
                            </td>
                            <td className="px-6 py-4">
                              {parseDateTimeString(item?.createdAt)?.date},{" "}
                              {parseDateTimeString(item?.createdAt)?.time}
                            </td>

                            <td className="px-6 py-4">{item?.status}</td>
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
                          className={`flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${currentPage === 1 && "opacity-50 cursor-not-allowed"
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
                            className={`flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${currentPage === index + 1 &&
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
                          className={`flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${currentPage === totalPages &&
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



                  <div className="relative overflow-x-auto">

                    <table className=" w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">

                      <thead className="h-20 text-lg text-black bg-[#f0f1fa]">
                        <tr>
                         

                          {[
                           
                           "Last Name","First Name",
                           
                           "Type", "Forms filled",

                            // "Invoice Sent",

                            "Invoice", "Invoice Paid",

                            "Telehealth link",
                            // "Accepted",

                            // "Link to schedule",
                            // "Send Telehealth link",
                            "Send Telehealth Call",


                            "Call Scheduled", "Date", "Added to MDtoolbox",

                            "Script",
                            "Scrip",
                            "Scrip Email"

                            , "Status", "Notes", "Doctor",

                            "Category",
                            "Purpose"
                          ].map((header, index) => (
                            <th key={index} scope="col" className="px-6 py-3">
                              {header}
                              <a style={{ marginLeft: "90%", marginTop: -25 }}


                              // onClick={() => {
                              //   if (index === currentIndex) {
                              //     setCurrentIndex(-1);
                              //     setNameClickBool(null);
                              //   } else {
                              //     setCurrentIndex(index);
                              //     // setNameClickBool();
                              //   }
                              // }}
                              >


                                {/* {index === currentIndex ? (
                                    <ArrowUpOutlined />
                                  ) : (
                                    <ArrowDownOutlined />
                                  )} */}
                              </a>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      {/* Loading Spinner */}
                      {isFetchingLoading && currentNewUserRecords.length === 0 && (
                        <tbody>
                          <tr>
                            <td colSpan={9} className="text-center py-10">
                              <div className="flex items-center justify-center space-x-4 ">
                                <div className="w-10 h-10 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
                                <span className="text-lg font-semibold text-gray-700">Loading...</span>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      )}



                      {/* {alert(JSON.stringify(data))} */}
                      {currentNewUserRecords.length > 0 ? <tbody>
                        {/* {console.log(JSON.stringify(currentRecords), 'see')} */}
                        {/* {currentNewUserRecords?.map((item, index) => ( */}

                        {currentNewUserRecords?.map((item, index) => (

                          // <tr
                          //   key={item?.id}
                          //   className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                          // >
                          <tr key={item?.id} className="bg-white border-b hover:bg-gray-50">
                            {/* Last Name Column */}
                            <th scope="row" className="sticky left-0 z-20 px-3 py-2 font-medium text-gray-900 whitespace-nowrap bg-white shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] border-r border-gray-200">
                              <div className="flex items-center gap-2">
                                <div className="relative group">
                                  <RiUser3Fill
                                    className="text-lg text-gray-600 cursor-pointer"
                                    onClick={() => {
                                      handleUserProfileClick(item?.userId);
                                      localStorage.setItem("Email@@", item.email);
                                    }}
                                  />
                                  <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-30">
                                    View User Profile
                                  </div>
                                </div>
                                <input
                                  readOnly
                                  disabled
                                  type="text"
                                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-24 p-1"
                                  value={item?.last_name || ""}
                                />
                              </div>
                            </th>
                            {/* First Name Column */}
                            <th scope="row" className="sticky left-[140px] z-20 px-3 py-2 font-medium text-gray-900 whitespace-nowrap bg-white shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] border-r border-gray-200">
                              <input
                                readOnly
                                disabled
                                type="text"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-24 p-1"
                                value={item?.first_name || ""}
                              />
                            </th>
                            {/* <th scope="row" className="sticky left-[250px] z-10 px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white bg-white border-r">

                              <RiUser3Fill cursor={'pointer'} style={{ transform: 'scale(1.8)', marginRight: 10 }}
                                onClick={() => {
                                  // console.log('item',item)
                                  handleUserProfileClick(item?.userId);
                                  localStorage.setItem("Email@@", item.email);
                                }}

                              />
                              <input
                                readOnly={true}
                                disabled={true}
                                type="text"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                                value={item?.last_name || ""}
                                onChange={(e) =>
                                  handleUpdateUserField(index, "lname", e.target.value)
                                }
                              />


                                </th> */}

                            {/* <th
                                  scope="row"
                                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                >
                                  <input
                                    readOnly={true}
                                    disabled={true}
                                    type="text"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-2.5"
                                    value={item?.first_name || ""}



                              // onChange={(e) =>
                              //   handleUpdateUserField(index, "fname", e.target.value)
                              // }
                              />


                            </th> */}
                            <td className="px-6 py-4">
                              <select
                                value={item?.type || ""}
                                onChange={(e) =>
                                  handleUpdateUserField(index, "type", e.target.value)
                                }
                              >
                                <option value="">Select Type</option>
                                <option value="New Participant">New Participant</option>
                                <option value="Refill">Refill</option>
                                <option value="Renewal">Renewal</option>
                                <option value="Completed">Completed</option>
                                {/* <option value="Rejected">Rejected</option> */}
                              </select>
                            </td>

                            {/* removed form sent as per client request */}
                            {/* <td className="px-6 py-4">
                              <input
                                type="checkbox"
                                onChange={(e) =>
                                  handleUpdateUserField(index, "formSent", e.target.checked)
                                }
                                checked={item?.formSent === true}
                              />
                            </td> */}
                            <td className="px-6 py-4">
                              <input
                                disabled={true}
                                type="checkbox"
                                onChange={(e) =>
                                  handleUpdateUserField(index, "formsFilled", e.target.checked)
                                }
                                // checked={item?.formsFilled || false}
                                checked={allUsersHasFormsFilled.filter((user) => user.id === item?.userId)[0]?.hasFilledForm || false}
                              />
                            </td>

                            {/* <td className="px-6 py-4">
                              <input
                                type="checkbox"
                                onChange={(e) =>
                                  handleUpdateUserField(index, "invoiceSent", e.target.checked)
                                }
                                checked={item?.invoiceSent || false}
                              />
                            </td> */}

                            <td className="px-6 py-4">
                              <input
                                type="text"
                                onChange={(e) =>
                                  handleUpdateUserField(index, "invoice", e.target.value)
                                }
                                value={item?.invoice || ""}
                              />
                            </td>
                            <td className="px-6 py-4">
                              <input
                                type="checkbox"
                                onChange={(e) =>
                                  handleUpdateUserField(index, "invoicePaid", e.target.checked)
                                }
                                checked={item?.invoicePaid || false}
                              />
                            </td>

                            {/* <td className="px-6 py-4">
                              <input
                                type="checkbox"
                                onChange={(e) =>
                                  handleUpdateUserField(index, "accepted", e.target.checked)
                                }
                                checked={item?.accepted || false}
                              />
                            </td> */}


                            <td className="px-6 py-4">

                              <select
                                value={item?.telehealthLink || ""}
                                onChange={(e) =>
                                  handleUpdateUserField(index, "telehealthLink", e.target.value)
                                }
                              >
                                <option value="">Select</option>
                                <option value="$495">$495</option>
                                <option value="veteran">Veteran</option>
                                <option value="renewal">Renewal</option>
                                <option value="discounted">Discounted</option>
                              </select>
                            </td>

                            <td className="px-6 py-4">
                              <input
                                type="checkbox"
                                onChange={async (e) => {
                                  try {
                                    handleUpdateUserField(index, "sendTelehealthLink", e.target.checked);

                                    if (e.target.checked) {
                                      if (!item?.email || !item?.first_name) {
                                        toast.error("Something went wrong. Please try again later.");
                                        handleUpdateUserField(index, "sendTelehealthLink", false);
                                        return;
                                      }

                                      const response2 = await axios.post(
                                        `${process.env.REACT_APP_BACKEND_URL}scriptemail/sendEmail/2`, // Ensure a `/` in the .env URL
                                        {
                                          email: item.email,
                                          firstName: item.first_name,
                                        },
                                        {
                                          headers: {
                                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                                          },
                                        }
                                      );

                                      if (response2.status === 200) {
                                        console.log("Email sent successfully:", response2.status);
                                        toast.success(
                                          `Schedule a telehealth visit Email has been sent to ${item.first_name}`
                                        );
                                      } else {
                                        toast.error(
                                          "Could not send Schedule a telehealth visit Email. Please try again later."
                                        );
                                      }
                                    }
                                  } catch (error) {
                                    console.error("Error sending email:", error);
                                    toast.error("An error occurred. Please try again later.");
                                    handleUpdateUserField(index, "sendTelehealthLink", false);
                                  }
                                }}



                                checked={item?.sendTelehealthLink || false}
                              />
                            </td>
                            <td className="px-6 py-4">
                              <input
                                type="checkbox"
                                onChange={(e) =>
                                  handleUpdateUserField(index, "callScheduled", e.target.checked)
                                }
                                checked={item?.callScheduled || false}
                              />
                            </td>
                            <td className="px-6 py-4">

                              <input
                                type="datetime-local"
                                disabled={true}
                                value={item?.updatedAt ? formatDateTime(item.updatedAt) : ""} // Format the date and time correctly
                              />
                            </td>
                            <td className="px-6 py-4">
                              <input
                                type="checkbox"
                                onChange={(e) =>
                                  handleUpdateUserField(index, "addedToMdToolBox", e.target.checked)
                                }
                                checked={item?.addedToMdToolBox || false}
                              />
                            </td>

                            {/* //scriptSent or Script */}

                            <td className="px-6 py-4">
                              <input
                                type="checkbox"
                                onChange={(e) =>
                                  handleUpdateUserField(index, "script", e.target.checked)
                                }
                                checked={item?.script || false}
                              />
                            </td>

                            <td className="px-6 py-4">
                              <input
                                type="text"
                                onChange={(e) =>
                                  handleUpdateUserField(index, "scrip", e.target.value)
                                }
                                value={item?.scrip || ""}
                              />
                            </td>

                            {/* //scripEmail and scriptEmail are same */}
                            <td className="px-6 py-4">
                              <input
                                type="checkbox"
                                onChange={async (e) => {
                                  try {
                                    // Update state optimistically
                                    handleUpdateUserField(index, "scriptEmail", e.target.checked);

                                    if (e.target.checked) {
                                      // Check for missing fields
                                      if (!item?.email || !item?.first_name) {
                                        toast.error("Something went wrong. Please try again later.");
                                        handleUpdateUserField(index, "scriptEmail", false); // Reset checkbox
                                        return;
                                      }

                                      if (!item?.scrip) {
                                        toast.error("Please add scrip text");
                                        handleUpdateUserField(index, "scriptEmail", false); // Reset checkbox
                                        return
                                      }
                                      if (!item?.invoice) {
                                        toast.error("Please add invoice text");
                                        handleUpdateUserField(index, "scriptEmail", false); // Reset checkbox
                                        return
                                      }

                                      // Send request
                                      const response = await axios.post(
                                        `${process.env.REACT_APP_BACKEND_URL}scriptemail/sendEmail/3`, // Ensure `/` in .env
                                        {
                                          email: item.email,
                                          firstName: item.first_name,
                                          scriptText: item.scrip,
                                          invoiceText: item.invoice,
                                        },
                                        {
                                          headers: {
                                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                                          },
                                        }
                                      );

                                      // Handle success
                                      if (response.status === 200) {
                                        console.log("Email sent successfully:", response.status);
                                        toast.success(`Script Email has been sent to ${item.first_name}`);
                                      } else {
                                        toast.error("Could not send Script Email. Please try again later.");
                                      }
                                    }
                                  } catch (error) {
                                    console.error("Error sending script email:", error);
                                    toast.error("An error occurred. Please try again later.");
                                    handleUpdateUserField(index, "scriptEmail", false); // Reset checkbox on failure
                                  }
                                }}


                                checked={item?.scriptEmail || false}
                              />
                            </td>
                            <td className="px-6 py-4">

                              <select
                                value={item?.status || ""}
                                onChange={(e) =>
                                  handleUpdateUserField(index, "status", e.target.value)
                                }
                              >
                                <option value="">Select Status</option>
                                <option value="inProgress">In Progress</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                                <option value="payment Pending">Payment Pending</option>
                                <option value="tracking late">Tracking late</option>
                              </select>
                            </td>
                            <td className="px-6 py-4">
                              <input
                                type="text"
                                onChange={(e) =>
                                  handleUpdateUserField(index, "notes", e.target.value)
                                }
                                value={item?.notes || ""}
                              />
                            </td>
                            <td className="px-6 py-4">
                              <input
                                type="text"
                                onChange={(e) =>
                                  handleUpdateUserField(index, "doctor", e.target.value)
                                }
                                value={item?.doctor || ""}
                              />
                            </td>

                            {/* category */}

                            <td>
                              <select
                                value={item?.category || ""}
                                onChange={(e) =>
                                  handleUpdateUserField(index, "category", e.target.value)
                                }
                              >
                                <option value="">Select</option>
                                <option value="veteran">Veteran</option>
                                <option value="nativeAmerican">Native American</option>
                                <option value="other">Other</option>

                              </select>

                            </td>

                            {/* purpose */}

                            <td className="relative group">
                              <select
                                multiple
                                value={Array.isArray(item?.purpose) ? item.purpose : JSON.parse(item?.purpose || "[]")}
                                onChange={(e) => {
                                  const selectedValues = Array.from(e.target.selectedOptions, (option) => option.value);
                                  handleUpdateUserField(index, "purpose", selectedValues);
                                }}
                                className="custom-multiselect"
                              >
                                <option value="depression">Depression</option>
                                <option value="ptsd">PTSD</option>
                                <option value="anxiety">Anxiety</option>
                                <option value="chronicPain">Chronic Pain</option>
                                <option value="other">Other</option>
                              </select>

                              {/* Tooltip with safety check */}
                              <div className="custom-tooltip">
                                {Array.isArray(item?.purpose)
                                  ? item.purpose.length > 0
                                    ? item.purpose.join(", ")
                                    : "No purpose selected"
                                  : (() => {
                                    try {
                                      return JSON.parse(item?.purpose || "[]").join(", ") || "No purpose selected";
                                    } catch {
                                      return "No purpose selected";
                                    }
                                  })()}
                              </div>
                            </td>



                            <th>




                              <button
                                onClick={() => { handleDeleteUser(index) }}

                                className={
                                  `text-white font-bold py-2 px-6 rounded-lg bg-red-500 hover:bg-red-600 ${loadingIndexes === index ? "animate-pulse" : ""
                                  }`
                                }
                              >
                                {loadingIndexes === index ? (
                                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                ) : (
                                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                )}
                              </button>

                            </th>
                          </tr>
                        ))}



                      </tbody> :

                        !isFetchingLoading && <tbody className='text-center'>
                          <tr>
                            <td colSpan="9" className="px-6 py-4 text-center text-gray-500 mt-5">
                              No data found</td>
                          </tr>
                        </tbody>}


                    </table>


                  </div>

                  {/* <a className="mx-6 mt-2 flex justify-start "> */}


                  {/* <button
                        onClick={() => setNewUser(newUser.slice(0, -1))}
                        className="text-white font-bold ms-4 py-4 px-4 rounded-lg bg-red-500 hover:bg-red-600"
                      >
                        -
                      </button> */}
                  {/* <br /> */}
                  {/* adding new row */}
                  {/* <button id="addRow"
                        // onClick={() => setNewUser([...newUser, {}])}
                        // onClick={()=>setCurrentNewUserRecords([...currentNewUserRecords, {}])}
                        onClick={() => {
                          // Add a new record (empty object) to the list
                          const updatedCurrentNewUserRecords = [...currentNewUserRecords, {}];
                          
                        
                          if (currentNewUserPage === totalNewUserDataPages) {
                            const totalItems = updatedCurrentNewUserRecords.length;
                            if (totalItems % 5 === 0) {
                              // If the page is full, move to the next page
                              handleNewUserPageChange(currentNewUserPage + 1);
                              setCurrentNewUserRecords(updatedCurrentNewUserRecords);

                            }
                            else{
                              setCurrentNewUserRecords(updatedCurrentNewUserRecords);
                            }

                          } else {
                            // If not on the last page, move to the last page after adding the new record
                            handleNewUserPageChange(totalNewUserDataPages);
                            setCurrentNewUserRecords(updatedCurrentNewUserRecords);
                            
                          }
                        }}
                        
                        className="text-white font-bold ms-4 py-2 px-2 rounded-lg bg-green-500 hover:bg-green-600"
                      >
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button> */}



                  {/* {!isFetchingLoading && ( */}

                  {/* <button
                          onClick={handleSaveButton}
                          disabled={isLoading}
                          className={`text-white font-bold py-2 px-6 rounded-lg bg-green-500 hover:bg-green-600 ${isLoading ? "animate-pulse" : ""}`}
                        >
                          {isLoading ? (
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          ) : (
                            <span className="flex ">
                              <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              Save
                            </span>
                          )}
                        </button> */}

                  {/* )} */}


                  {/* </a> */}





                  <nav aria-label="Page navigation example" className="mt-5">

                    <div className="flex justify-between">

                      <ul className="flex items-center -space-x-px h-8 text-sm">

                        {/* Previous Button */}
                        <li>
                          <a
                            href="#"
                            className={`flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${currentNewUserPage === 1 && "opacity-50 cursor-not-allowed"}`}
                            onClick={(e) => {
                              e.preventDefault();
                              if (currentNewUserPage > 1) {
                                handleNewUserPageChange(currentNewUserPage - 1);
                              }
                            }}
                            disabled={currentNewUserPage === 1}
                          >
                            <span className="sr-only">Previous</span>
                            <svg className="w-2.5 h-2.5 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 1 1 5l4 4" />
                            </svg>
                          </a>
                        </li>

                        {/* Page Number Buttons */}
                        {Array.from({ length: totalNewUserDataPages }, (_, index) => (
                          <li key={index}>
                            <button
                              className={`px-3 py-2 rounded-lg ${currentNewUserPage === index + 1 ? "bg-green-600 text-white" : "bg-gray-200 hover:bg-blue-400"}`}
                              onClick={() => handleNewUserPageChange(index + 1)}
                            >
                              {index + 1}
                            </button>
                          </li>
                        ))}

                        {/* Next Button */}
                        <li>
                          <a
                            href="#"
                            className={`flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${currentNewUserPage === totalNewUserDataPages && "opacity-50 cursor-not-allowed"}`}
                            onClick={(e) => {
                              e.preventDefault();
                              if (currentNewUserPage < totalNewUserDataPages) {
                                handleNewUserPageChange(currentNewUserPage + 1);
                              }
                            }}
                            disabled={currentNewUserPage === totalNewUserDataPages}
                          >
                            <span className="sr-only">Next</span>
                            <svg className="w-2.5 h-2.5 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                            </svg>
                          </a>
                        </li>
                      </ul>

                      <button
                        onClick={handleSaveButton}
                        disabled={isLoading}
                        className={`text-white font-bold py-2 px-6 rounded-lg bg-green-500 hover:bg-green-600 ${isLoading ? "animate-pulse" : ""}`}
                      >
                        {isLoading ? (
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : (
                          <span className="flex ">
                            <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Save
                          </span>
                        )}
                      </button>
                    </div>

                  </nav>
                </>
              )}


            </div>

          </div>


          {/* removing Users form as per client request */}


          {/* <div
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
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="h-20 text-lg text-black bg-[#f0f1fa]">
                <tr>
                  {["Name", "Email", "Registered At", "Status"].map(
                    (i, ind) => {
                      return (
                        <th
                          key={ind}
                          scope="col"
                          className="px-6 py-3"
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
                          <a style={{ marginLeft: "90%", marginTop: -25 }}>
                            {ind === currentIndex ? (
                              <ArrowUpOutlined />
                            ) : (
                              <ArrowDownOutlined />
                            )}
                          </a>
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
                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                      >
                        <th
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            handleUserProfileClick(item?.id);
                            localStorage.setItem("Email@@", item.email);
                          }}
                          scope="row"
                          className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                          {item.username}
                        </th>
                        <td className="px-6 py-4">{item.email}</td>
                        <td className="px-6 py-4">
                          {parseDateTimeString(item.createdAt).date}
                          {parseDateTimeString(item.createdAt)?.time}
                        </td>

                        <td className="px-6 py-4">
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
          <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 100,
          alignSelf: "flex-start",
          marginTop: 20,
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
      </div> */}

          {/* ending */}
        </div>





      </div >


    </>
  );
}

export default Dashboard;



/**
 * 
 
 */