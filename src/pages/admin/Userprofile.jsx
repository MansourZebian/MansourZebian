import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { IoIosArrowDown } from "react-icons/io";
import { Modal, Button, Label, Radio } from "flowbite-react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { TiTick } from "react-icons/ti";
import * as Yup from "yup";
import { jwtDecode } from "jwt-decode";
import WhatsAppSVG from "../../assets/svgs/301.svg";
import MailSVG from "../../assets/svgs/3.svg";
import SMSSVG from "../../assets/svgs/2.svg";
import SearchSVG from "../../assets/svgs/search.svg";
import { v4 as uuidv4 } from "uuid";

function Userprofile() {
  const [status, setStatus] = useState('Loading..');
  const [openModal, setOpenModal] = useState(false);
  const [imagesDocs, setImagesDocs] = useState(false);

  const [notes, setNotes] = useState("");
  const { id } = useParams();

  const [data, setData] = useState([]);
  const [information, setInformation] = useState([]);
  const [emergencycontact, setEmergencycontact] = useState([]);
  const [newScriptData, setNewScriptData] = useState([]);
  const [consent, setConsent] = useState([]);
  const [documentverification, setDocumentverification] = useState([]);
  const [screening, setScreening] = useState([]);
  const [scores, setScores] = useState([{
    id: null,
    uid: null,
    score: null,
    key: null,
    createdAt: null,
    updatedAt: null
  }
  ]);
  const [refill, setRefill] = useState([]);
  const [refillGroup, setRefillGroup] = useState([]);
  const [scoreModal, setScoreModal] = useState(false);
  const [clinicalFormModal, setClinicalFormModal] = useState(false);
  const [clinicalFormModalType, setClinicalFormModalType] = useState("");

  const [administrativeModal, setAdministrativeModal] = useState(false);
  const [administrativeModalType, setAdministrativeModalType] = useState("");
  const [tackingLink, setTackingLink] = useState({
    value: "",
    item: {},
  });

  const [scriptLoading,setScriptLoading]=useState(false)


  const [scriptData, setScriptData] = useState({
    currentDate: "",
    drug: "",
    dispense: "",
    dosage: "",
    note: "",
    uid: id,
    tracking_id: "",
  });

  const [allUser, setAllUser] = useState([]);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // console.log("refillGroup", refillGroup);
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

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const formattedDate = `${padZero(now.getMonth() + 1)}/${padZero(
        now.getDate()
      )}/${padZero(now.getFullYear() % 100)}`;
      setScriptData((prevState) => ({
        ...prevState,
        currentDate: formattedDate,
      }));
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, []);

  const padZero = (num) => {
    return num < 10 ? "0" + num : num;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setScriptData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const submitScriptData = async () => {

    if(!scriptData?.dispense || !scriptData?.drug || !scriptData?.dosage){
      toast.error("Please fill the entries first")
      return
    }
    try {
      setScriptLoading(true)
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}prescription/create`,
        scriptData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 201) {

        axios.put(`${process.env.REACT_APP_BACKEND_URL}existingforms/updatescript/${id}`,
          {
            script: `${scriptData?.dispense} ${scriptData?.drug} ODT ${scriptData?.dosage}mg `
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        ).then((response) => {
          // console.log('see response', response)
          console.log('updated script')
                setScriptLoading(false)
            toast.success("Script submitted successfully");

          setScriptData({
            currentDate: "",
            drug: "",
            dispense: "",
            dosage: "",
            note: "",
            uid: id,
            tracking_id: "",
          })

        }
        ).catch((error) => {
          setScriptLoading(false)

          toast.error("Error submitting data");
          console.log("error", error)

          return
        })

      }

      else {
        toast.error("Error submitting data");
        setScriptLoading(false)
        return

      }

      // update the script in existingForm.script







      // console.log("getScreeningData", response.data); // Log the data received from the backend
      // setScreening(response.data); // Set the data to state if needed
      const getEMail = localStorage.getItem("Email@@");
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}prescription/sendEmail`,
        { ...scriptData, email: getEMail },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success("Alert Email send to user");

      getNewScript();
    } catch (error) {
      console.log(error); // Log any errors that occur during the request
    }
  };

  const updateScriptData = async (value, item) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}prescription/update/${item?.id}`,
        { ...item, tracking_id: value },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      // console.log("getScreeningData", response.data); // Log the data received from the backend
      // setScreening(response.data); // Set the data to state if needed
      getNewScript();
    } catch (error) {
      console.log(error); // Log any errors that occur during the request
    }
  };

  const updateStatusData = async (value, item) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}prescription/update/${item?.id}`,
        // { status:value },
        { ...item, status: value },

        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      // console.log("getScreeningData", response.data); // Log the data received from the backend
      // setScreening(response.data); // Set the data to state if needed
      getNewScript();
    } catch (error) {
      console.log(error); // Log any errors that occur during the request
    }
  };

  // console.log("-------------------------------", scriptData);
  const isFormValid = () => {
    return; //Object.values(scriptData).every((value) => value?.trim() !== "");
  };

  // useEffect(() => {
  //   getUsers();
  // }, []);

  // const getUsers = async () => {
  //   try {
  //     const response = await axios.get(
  //       `${process.env.REACT_APP_BACKEND_URL}users`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem("token")}`,
  //         },
  //       }
  //     );
  //     console.log("user data is ", response.data);
  //     setAllUser(response.data);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const getScores = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}score/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("score data.............>", response);
      setScores(response.data); // Set the data to state if needed
    } catch (error) {
      console.log(error); // Log any errors that occur during the request
    }
  };

  const processScores = (scores) => {
    if (!Array.isArray(scores)) return [];

    const grouped = scores?.reduce((acc, item) => {
      if (!item?.createdAt) return acc;

      const date = item?.createdAt.split("T")[0]; // Extract date only

      // Initialize if date does not exist
      if (!acc[date]) {
        acc[date] = { date, phq9: [], gad7: [], pcl5: [] };
      }

      // Push scores into arrays based on their key
      acc[date][item?.key]?.push(item?.score);

      return acc;
    }, {});

    // Convert object to sorted array (oldest date first)
    return Object.values(grouped).sort((a, b) => new Date(a.date) - new Date(b.date));
  };





  // clinical forms
  const groupByTypeAndDate = (screening) => {
    // Create a Map to store unique document-date combinations
    const grouped = new Map();

    screening.forEach((form) => {
      const type = form?.Screeningform?.type?.trim();  // Make sure to trim any spaces
      const createdAt = new Date(form.createdAt).toLocaleDateString();

      // Exclude 'entry questionnaire' rows
      if (type !== "entry questionnaire") {
        const key = `${type}-${createdAt}`;

        if (!grouped.has(key)) {
          grouped.set(key, {
            type,
            createdAt,
            sentDate: formatDate(form.createdAt),  // Adjust the field to match your needs
            receivedDate: formatDate(form.createdAt),  // Same here
            status: "Sent"  // Adjust based on your logic
          });
        }
      }
    });

    return Array.from(grouped.values());
  };



  function clinicalGroupByRefill(screeningForms) {
    if (!Array.isArray(screeningForms)) return [];
  
    const grouped = screeningForms.reduce((acc, form) => {
      const refillId = form.refillId ?? 0; // Treat null as 0 (original form)
      if (!acc[refillId]) acc[refillId] = [];
      acc[refillId].push(form);
      return acc;
    }, {});
  
    return Object.entries(grouped); // Convert object to array for iteration
  }
  


  const getRefill = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}refill/answers/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setRefill(response.data); // Set the data to state if needed
      // Group records by day
      const groupedRefill = response.data.reduce((acc, item) => {
        const key = item.key; // Assuming day is the key to group by
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(item);
        return acc;
      }, {});
      setRefillGroup(groupedRefill);
      // console.log("refill", groupedRefill);

      // console.log("refil is", response?.data);
    } catch (error) {
      console.log(error); // Log any errors that occur during the request
    }
  };

  const getScreeningData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}screeningformanswer/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("getScreeningData", response.data); // Log the data received from the backend
      setScreening(response.data); // Set the data to state if needed
    } catch (error) {
      console.log(error); // Log any errors that occur during the request
    }
  };

  const getDocumentverification = () => {
    axios
      .get(
        `${process.env.REACT_APP_BACKEND_URL}documentverification/getDocumentverificationByUser/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        setDocumentverification(response.data);
        // console.log("documentverification........", response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getConsent = () => {
    //consent
    axios
      .get(
        `${process.env.REACT_APP_BACKEND_URL}consentform/getConsentformsByUser/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        setConsent(response.data);
        // console.log("getConsent........", response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getEmergencycontact = () => {
    //emergencycontact
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}emergencycontact/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setEmergencycontact(response.data);
        // console.log("getEmergencycontact", response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getInformation = async () => {
    //informationform
    await axios
      .get(`${process.env.REACT_APP_BACKEND_URL}informationform/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setInformation(response?.data);
        setNotes(response?.data?.notes);
        // console.log("response?.data.........", response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getUserRecord = () => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}users/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setData(response.data);
        // console.log("record data", response.data);
        setStatus(response.data.status);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getNewScript = () => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}prescription/get/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setNewScriptData(response.data);
        // console.log("newScript", response.data);
        // setStatus(response.data.status);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const deletePress = async (item) => {
    await axios
      .delete(`${process.env.REACT_APP_BACKEND_URL}prescription/${item?.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        // setNewScriptData(response.data);
        // console.log("newScript", response.data);
        // setStatus(response.data.status);
        toast.success("Deleted successfully");
        getNewScript();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getUserRecord();
    getInformation();
    getEmergencycontact();
    getConsent();
    getDocumentverification();
    getScreeningData();
    getScores();
    getRefill();
    getNewScript();
    getDocumentverificationImages();
  }, []);

  const changeStatus = (status) => {
    setStatus(status);
    axios
      .put(
        `${process.env.REACT_APP_BACKEND_URL}users/changeStatus`,
        {
          id: data.id,
          status: status,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        // console.log(response.data);
        setOpenModal(false);
        getUserRecord();

        toast.success("Status updated successfully");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Update notes after typing stops
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     // Update notes
  //     axios
  //       .put(
  //         `${process.env.REACT_APP_BACKEND_URL}informationform/changenotes`,
  //         {
  //           id: information?.id,
  //           notes: notes,
  //         },
  //         {
  //           headers: {
  //             Authorization: `Bearer ${localStorage.getItem("token")}`,
  //           },
  //         }
  //       )
  //       .then((response) => {
  //         console.log(response.data);
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //       });
  //   }, 3000);

  //   // Clear the timer if notes change before the timeout
  //   return () => clearTimeout(timer);
  // }, [information?.id]);

  const changesNotText = async () => {
    if (!information?.id)
      return alert(
        "Before adding a note, this user must complete out the details."
      );
    await axios
      .put(
        `${process.env.REACT_APP_BACKEND_URL}informationform/changenotes`,
        {
          id: information?.id,
          notes: notes,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        toast.success("Not updated successfully");
        getInformation();
        // console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Handle textarea change
  const handleNotesChange = (e) => {
    setNotes(e.target.value);
  };

  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear() % 100; // Get the last two digits of the year

    return `${day}/${month}/${year}`;
  }

  function formatDateWithTime(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear() % 100; // Last two digits of year

    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0"); // Ensure two-digit minutes
    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12 || 12; // Convert to 12-hour format

    return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
  }


  function isTypeExists(screeningForms, targetType) {
    return screeningForms?.some(
      (form) => form?.Screeningform?.type === targetType
    );
  }

  const [chatMsg, setChatMsg] = useState(false);
  // console.log("emergencycontact?.signature", emergencycontact);

  const getDocumentverificationImages = async () => {
    await axios
      .get(`${process.env.REACT_APP_BACKEND_URL}media`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setImagesDocs(response.data);
        // console.log("Document verification Images", response?.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };


  const processScoresRefill = (scores) => {
    const groupedScores = {};
  
    scores.forEach(({ refillId, key, score, createdAt }) => {
      const refill = refillId === null ? 0 : refillId; // Treat null as 0
  
      if (!groupedScores[refill]) {
        groupedScores[refill] = {
          date: new Date(createdAt).toLocaleDateString(),
          refillId: refill,
          phq9: "N/A",
          gad7: "N/A",
          pcl5: "N/A",
        };
      }
  
      groupedScores[refill][key] = score;
    });
  
    return Object.values(groupedScores).sort((a, b) => a.refillId - b.refillId);
  };





  return (
    <>
      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>Status</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Radio
                value="approved"
                checked={status === "approved"}
                onChange={() => changeStatus("approved")}
              />
              <Label>Approved</Label>
            </div>

            <div className="flex items-center gap-2">
              <Radio
                value="pending"
                checked={status === "pending"}
                onChange={() => changeStatus("pending")}
              />
              <Label>Pending</Label>
            </div>

            <div className="flex items-center gap-2">
              <Radio
                value="rejected"
                checked={status === "rejected"}
                onChange={() => changeStatus("rejected")}
              />
              <Label>Rejected</Label>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button color="gray" onClick={() => setOpenModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={chatMsg} onClose={() => setChatMsg(false)}>
        <Modal.Header>Chat</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <Formik
              initialValues={{ message: "" }}
              onSubmit={async (values, { resetForm }) => {
                const formData = new FormData();
                formData.append("message", values.message);
                formData.append("senderid", user.id);
                formData.append("uid", id);

                try {
                  const response = await axios.post(
                    `${process.env.REACT_APP_BACKEND_URL}chat/send`,
                    formData,
                    {
                      headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${localStorage.getItem(
                          "token"
                        )}`,
                      },
                    }
                  );
                  if (response.status === 200) {
                    toast.success("Message sent successfully");
                    resetForm();
                  } else {
                    toast.error("Failed to send message");
                  }
                } catch (error) {
                  console.error(error);
                  toast.error("Failed to send message");
                }
              }}
              validationSchema={Yup.object({
                message: Yup.string().required("Required"),
              })}
            >
              <Form>
                <Field
                  type="text"
                  name="message"
                  placeholder="Enter your message"
                  className="w-full mb-2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button type="submit">Send</Button>
              </Form>
            </Formik>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button color="gray" onClick={() => setChatMsg(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* clinical modal */}


      {/* <Modal show={clinicalFormModal} onClose={() => setClinicalFormModal(false)}>
  <Modal.Header>{clinicalFormModalType}</Modal.Header>
  <Modal.Body>
    <div className="space-y-6">
      {screening?.length &&
        screening
          ?.filter(
            (form) =>
              form?.Screeningform?.type?.toUpperCase() ===
                clinicalFormModalType?.toUpperCase() && // Filter by form type
              new Date(form?.createdAt).toLocaleDateString() ===
                new Date(form?.createdAt).toLocaleDateString() // Ensure the form matches the selected date
          )
          ?.map((form, index) => (
            <div className="flex items-center gap-2" key={index}>
              <div>
                <h5 style={{ fontSize: 18, fontWeight: "bold" }}>
                  {form?.Screeningform?.question}
                </h5>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <p style={{ fontSize: 13, color: "#000" }}>Answer:</p>
                  <p
                    style={{
                      fontSize: 13,
                      color: "#000",
                      color: "green",
                      fontWeight: "bolder",
                    }}
                  >
                    {form?.optionanswer || " - "}
                  </p>
                </div>
              </div>
            </div>
          ))}
    </div>
  </Modal.Body>
  <Modal.Footer>
    <div
      style={{
        position: "absolute",
        right: 25,
        fontSize: 20,
        fontWeight: "bold",
      }}
    >
      Total Score:{" "}
      {scores
        .filter(
          (item) =>
            item?.key?.replace(/[0-9]/g, "")?.toUpperCase() ===
              clinicalFormModalType?.split("-")[0] &&
            item?.uid === id
        )
        .map((item) => item?.score)}
    </div>
    <Button color="gray" onClick={() => setClinicalFormModal(false)}>
      Close
    </Button>
  </Modal.Footer>
</Modal> */}


      {/* original clinical modal */}
      <Modal
        show={clinicalFormModal}
        onClose={() => setClinicalFormModal(false)}
      >
        <Modal.Header>{clinicalFormModalType}</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            {screening?.length &&
              screening?.map(
                (form, index) =>
                  form?.Screeningform?.type
                    ?.replace(/[0-9]/g, "")
                    ?.toUpperCase() ===
                  clinicalFormModalType?.split("-")[0] && (
                    <div className="flex items-center gap-2" key={index}>


                      <div>
                        <h5 style={{ fontSize: 18, fontWeight: "bold" }}>
                          {form?.Screeningform?.question}
                        </h5>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                          }}
                        >


                          <div
                            style={{
                              fontSize: 13,
                              color: "#000",
                              color: "green",
                              fontWeight: "bolder",
                              display: 'flex',
                              justifyContent: 'flex-start',
                              flexDirection: 'row',
                              // width:'100%'
                            }}
                          >

                            <Label className="text-blue-500 mr-5">
                              {formatDateWithTime(form.createdAt)}
                            </Label>

                            <p
                              style={{
                                fontSize: 13,
                                color: "#000",
                              }}
                            >
                              Answer:

                            </p>

                            <p className="mx-3">{form?.optionanswer || " N/A "}</p>


                          </div>
                        </div>
                      </div>
                    </div>
                  )
              )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div
            style={{
              position: "absolute",
              right: 25,
              fontSize: 20,
              fontWeight: "bold",
            }}
          >
            totalScores  ={" "}
            {scores.map(
              (item, index) =>
                item?.key?.replace(/[0-9]/g, "")?.toUpperCase() ===
                clinicalFormModalType?.split("-")[0] &&
                item?.uid == id &&
                item?.score + " "
            )}
          </div>
          <Button color="gray" onClick={() => setClinicalFormModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* {information Admini Modal} */}
      <Modal
        show={administrativeModal}
        onClose={() => setAdministrativeModal(false)}
      >
        <Modal.Header>{administrativeModalType}</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            {administrativeModalType == "Address" ? (
              <div className="information-container">
                {" "}
                {/* Add a class for styling */}
                <div className="info-item">
                  <label>ID:</label>
                  <span>{information?.id}</span>
                </div>
                <div className="info-item">
                  <label>Legal Name:</label>
                  <span>{information?.legalname}</span>
                </div>
                <div className="info-item">
                  <label>Preferred Name:</label>
                  <span>{information?.preferredname}</span>
                </div>
                <div className="info-item">
                  <label>Date of Birth:</label>
                  <span>{new Date(information?.dob).toLocaleDateString()}</span>
                </div>
                <div className="info-item">
                  <label>Marital Status:</label>
                  <span>{information?.maritalstatus}</span>
                </div>
                <div className="info-item">
                  <label>Administrative Sex:</label>
                  <span>{information?.administrativesex}</span>
                </div>
                <div className="info-item">
                  <label>Address One:</label>
                  <span>{information?.addressone}</span>
                </div>
                <div className="info-item">
                  <label>Address Two:</label>
                  <span>{information?.addresstwo}</span>
                </div>
                <div className="info-item">
                  <label>ZIP Code:</label>
                  <span>{information?.zip}</span>
                </div>
                <div className="info-item">
                  <label>City/State:</label>
                  <span>{information?.citystate}</span>
                </div>
                <div className="info-item">
                  <label>Mobile:</label>
                  <span>{information?.mobile}</span>
                </div>
                <div className="info-item">
                  <label>Home Phone:</label>
                  <span>{information?.homephone}</span>
                </div>
                <div className="info-item">
                  <label>UID:</label>
                  <span>{information?.uid}</span>
                </div>
                <div className="info-item">
                  <label>Status:</label>
                  <span>{information?.status}</span>
                </div>
                <div className="info-item">
                  <label>Created At:</label>
                  <span>
                    {new Date(information?.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="info-item">
                  <label>Updated At:</label>
                  <span>
                    {new Date(information?.updatedAt).toLocaleString()}
                  </span>
                </div>
                <div className="info-item">
                  <label>Notes:</label>
                  <span>{information?.notes}</span>
                </div>
              </div>
            ) : administrativeModalType == "Emergency Contact" ? (
              <div className="contact-container">
                {/* Add a class for styling */}

                <div className="contact-item">
                  <label>ID:</label>
                  <span>{emergencycontact?.id}</span>
                </div>
                <div className="contact-item">
                  <label>Contact Name:</label>
                  <span>{emergencycontact?.contactname}</span>
                </div>
                <div className="contact-item">
                  <label>Company:</label>
                  <span>{emergencycontact?.company}</span>
                </div>
                <div className="contact-item">
                  <label>Contact Type:</label>
                  <span>{emergencycontact?.contacttype}</span>
                </div>
                <div className="contact-item">
                  <label>Relationship:</label>
                  <span>{emergencycontact?.relationship}</span>
                </div>
                <div className="contact-item">
                  <label>Date of Birth:</label>
                  <span>
                    {new Date(emergencycontact?.dob).toLocaleDateString()}
                  </span>
                </div>
                <div className="contact-item">
                  <label>Address One:</label>
                  <span>{emergencycontact?.addressone}</span>
                </div>
                <div className="contact-item">
                  <label>Address Two:</label>
                  <span>{emergencycontact?.addresstwo}</span>
                </div>
                <div className="contact-item">
                  <label>ZIP Code:</label>
                  <span>{emergencycontact?.zip}</span>
                </div>
                <div className="contact-item">
                  <label>City/State:</label>
                  <span>{emergencycontact?.citystate}</span>
                </div>
                <div className="contact-item">
                  <label>Mobile:</label>
                  <span>{emergencycontact?.mobile}</span>
                </div>
                <div className="contact-item">
                  <label>Home Phone:</label>
                  <span>{emergencycontact?.homephone}</span>
                </div>
                <div className="contact-item">
                  <label>Email:</label>
                  <span>{emergencycontact?.email}</span>
                </div>
                <div className="contact-item">
                  <label>UID:</label>
                  <span>{emergencycontact?.uid}</span>
                </div>
                <div className="contact-item">
                  <label>Status:</label>
                  <span>{emergencycontact?.status}</span>
                </div>
                <div className="contact-item">
                  <label>Created At:</label>
                  <span>
                    {new Date(emergencycontact?.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="contact-item">
                  <label>Updated At:</label>
                  <span>
                    {new Date(emergencycontact?.updatedAt).toLocaleString()}
                  </span>
                </div>
              </div>
            ) : administrativeModalType == "Verification Document" ? (
              <div className="contact-container">
                {/* Add a class for styling */}

                <div className="contact-item">
                  <label>ID:</label>
                  <span>{documentverification?.id}</span>
                </div>

                <div className="contact-item">
                  <label>Status:</label>
                  <span>{documentverification?.status}</span>
                </div>
                <div className="contact-item">
                  <label>Document Verification Image:</label>
                  <img
                    src={documentverification?.signature}
                    style={{
                      backgroundColor: "lightgray",
                      width: 400,
                      height: 200,
                      borderRadius: 10,
                    }}
                    alt="Base64 Image"
                  />
                </div>
                <div className="contact-item">
                  <label>User Id:</label>
                  <span>{emergencycontact?.uid}</span>
                </div>

                <div className="contact-item">
                  <label>Updated At:</label>
                  <span>
                    {new Date(emergencycontact?.updatedAt).toLocaleString()}
                  </span>
                </div>
              </div>
            ) : administrativeModalType == "Consent form" ? (
              <div className="contact-container">
                {/* Add a class for styling */}

                <div className="contact-item">
                  <label>ID:</label>
                  <span>{consent?.id}</span>
                </div>
                <div className="contact-item">
                  <label>Signature:</label>
                  <img
                    src={consent?.signature}
                    style={{
                      backgroundColor: "lightgray",
                      width: 400,
                      height: 200,
                      borderRadius: 10,
                    }}
                    alt="Base64 Image"
                  />
                </div>
                <div className="contact-item">
                  <label>Status:</label>
                  <span>{consent?.status}</span>
                </div>
                <div className="contact-item">
                  <label>User Id:</label>
                  <span>{consent?.uid}</span>
                </div>
                <div className="contact-item">
                  <label>Relationship:</label>
                  <span>{consent?.relationship}</span>
                </div>
                <div className="contact-item">
                  <label>Updated At:</label>
                  <span>{new Date(consent?.updatedAt).toLocaleString()}</span>
                </div>
              </div>
            ) : null}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button color="gray" onClick={() => setAdministrativeModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Sidebar />

      {/* <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 10,
        }}
      >
        <input
          style={{
            width: "25%",
            height: 65,
            borderRadius: 10,
            backgroundColor: "transparent",
            border: "1px solid gray",
            color: "#000",
            textAlign: "center",
          }}
          placeholder="Search user or email address"
        />
        <button
          style={{
            backgroundColor: "#F0F1FA",
            width: 70,
            height: 70,
            borderRadius: 10,
            marginLeft: 10,
          }}
        >
          <img
            src={SearchSVG}
            width={40}
            height={40}
            style={{ marginLeft: 15 }}
          />
        </button>
      </div> */}
      <div className="p-10 sm:ml-64 bg-[#f7f7f7]">
        <div className="flex flex-col sm:flex-row justify-between">
          <div className="flex items-center gap-5">
            <img
              src="https://www.w3schools.com/w3css/img_avatar3.png"
              className="w-[100px] h-[100px] rounded-full"
              alt=""
            />
            <div className="text-left">
              <h1 className="text-xs text-[#6984FB]">Account #{id}</h1>
              <h1 className="text-sm font-bold">
                {information?.preferredname || data?.username?.split("@")[0]}
              </h1>
              <h1 className="text-sm ">
                {formatDate(information ? information?.dob : "")}
              </h1>
              <h1 className="text-sm ">{information?.citystate}</h1>
            </div>
          </div>

          {/* <div className="text-left">
            <h2 className="mb-2 text-md font-semibold text-gray-900 ">
              Contact user:{" "}
            </h2>
            <ul className="max-w-md  list-disc list-inside ">
              <li>
                <a href={`tel:${information?.mobile}`}>Call</a>
              </li>
              <li>
                <a href={`mailto:${data.email}`}>Send email</a>
              </li>
              <li>
                <a href={`sms:${information?.mobile}`}>Send message</a>
              </li>
            </ul>
          </div> */}

          <div className=" items-center gap-5">
            <h1
              className="text-2xl text-[#32C76E] font-bold"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {status?.charAt(0)?.toUpperCase() + status?.slice(1)}
              <IoIosArrowDown
                size={30}
                onClick={() => setOpenModal(true)}
                className="mt-2 text-[#32C76E]"
              />
            </h1>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <a href={`mailto:${data?.email}`}>
                <img src={MailSVG} width={40} height={40} />
              </a>
              <a href={`sms:${information?.mobile}`}>
                <img
                  src={SMSSVG}
                  width={45}
                  height={45}
                  style={{ marginTop: 12 }}
                />
              </a>
              <a href={`tel:${information?.mobile}`}>
                <img
                  src={WhatsAppSVG}
                  width={40}
                  height={40}
                  style={{ marginTop: 12 }}
                />
              </a>
            </div>
          </div>
        </div>

        <div className=" mt-10">
          {/* Notes */}
          <div className="mb-10">
            <h1 className="text-2xl font-bold text-left">Notes</h1>
            <textarea
              rows={5}
              onChange={handleNotesChange}
              defaultValue={notes}
              placeholder="Type something here"
              className="w-full text-black border border-[#e1e1e1] border-4 items-center p-4 mb-3 rounded-lg bg-white"
            />
            <button
              style={{ marginTop: 10, display: "flex" }}
              className=" bg-[#7b89f8] hover:bg-[#CBC3E3] text-white  py-2 px-20 rounded-full shadow-md shadow-[#7b89f8]"
              onClick={changesNotText}
            >
              Submit Notes
            </button>
          </div>

          {/* Scores */}
          <div className="mb-10">
            <h1 className="text-2xl font-bold text-left">Scores</h1>
            {/* <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-left">Scores</h1>
              <p
                onClick={() => setScoreModal(true)}
                className="text-blue-500 cursor-pointer font-bold text-md text-left"
              >
                Give Score
              </p>
            </div> */}

            {/* {console.log('scores',scores)} */}

            <div className="mt-10 relative overflow-x-auto">
              <div className="rounded-t-xl rounded-b-xl overflow-x-auto">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">

                  
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
  <thead className="h-20 text-lg text-[#6984FB] bg-white border-b">
    <tr>
      <th scope="col" className="px-6 py-4">Date</th>
      <th scope="col" className="px-6 py-4">PHQ-9</th>
      <th scope="col" className="px-6 py-4">GAD-7</th>
      <th scope="col" className="px-6 py-4">PCL-5</th>
      <th scope="col" className="px-6 py-4">Refill Count</th>
    </tr>
  </thead>
  <tbody>
    {Array.isArray(scores) && scores.length > 0 ? (
      processScoresRefill(scores).map((entry, index) => (
        <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
          <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
            {entry.date}
          </td>
          <td className="px-6 py-4">{entry.phq9}</td>
          <td className="px-6 py-4">{entry.gad7}</td>
          <td className="px-6 py-4">{entry.pcl5}</td>
          <td className="px-6 py-4 font-semibold">{entry.refillId}</td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan="5" className="text-center py-4">No data available</td>
      </tr>
    )}
  </tbody>
</table>



                  {/* <thead className="h-20 text-lg text-[#6984FB] bg-white border-b">
                    <tr>
                      <th scope="col" className="px-6 py-4">Date</th>
                      <th scope="col" className="px-6 py-4">PHQ-9</th>
                      <th scope="col" className="px-6 py-4">GAD-7</th>
                      <th scope="col" className="px-6 py-4">PCL-5</th>
                      <th scope="col" className="px-6 py-4">Refill Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(scores) && scores.length > 0 && processScores(scores).length > 0 ? (
                      processScores(scores).map((entry, index) => (
                        <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                          <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            {entry.date}
                          </td>
                          <td className="px-6 py-4">{entry.phq9.length ? entry.phq9.join(", ") : "-"}</td>
                          <td className="px-6 py-4">{entry.gad7.length ? entry.gad7.join(", ") : "-"}</td>
                          <td className="px-6 py-4">{entry.pcl5.length ? entry.pcl5.join(", ") : "-"}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center py-4">No data available</td>
                      </tr>
                    )}
                  </tbody> */}

                </table>
              </div>
            </div>

            {/* <div className="mt-10 relative overflow-x-auto">
              <div className="rounded-t-xl rounded-b-xl overflow-x-auto">

                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  <thead className="h-20 text-lg text-[#6984FB] bg-white border-b">
                    <tr>
                      <th scope="col" className="px-6 py-4">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-4">
                        PHQ-9
                      </th>
                      <th scope="col" className="px-6 py-4">
                        GAD-7
                      </th>
                      <th scope="col" className="px-6 py-4">
                        PCL-5
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >

                        {scores[0] && formatDate(scores[0]?.createdAt)}
                      </th>
                      {scores?.map(
                        (item, index) =>
                          item?.uid == id && (
                            <td key={index} className="px-6 py-4">{item.score}</td>
                          )
                      )}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div> */}
          </div>


          {/* Questionnaires */}
          <div className="mb-10">
            <h1 className="text-2xl font-bold text-left">Questionnaires</h1>
            <div className="mt-10 relative overflow-x-auto">
              <div className="rounded-t-xl rounded-b-xl ">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="h-20 text-lg text-black bg-[#f0f1fa] ">
                      <tr>
                        <th scope="col" className="px-6 py-3">
                          Document
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Sent
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Received
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <th
                          scope="row"
                          className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                          Entry Questionnaire
                        </th>

                        <td className="px-6 py-4">
                          {isTypeExists(screening, "entry questionaire")
                            ? formatDate(
                              screening.filter(
                                (form) =>
                                  form?.Screeningform?.type ===
                                  "entry questionaire"
                              )[0]?.createdAt
                            )
                            : "No Submission"}
                        </td>
                        <td className="px-6 py-4">
                          {isTypeExists(screening, "entry questionaire")
                            ? formatDate(
                              screening.filter(
                                (form) =>
                                  form?.Screeningform?.type ===
                                  "entry questionaire"
                              )[0]?.createdAt
                            )
                            : "No Submission"}
                        </td>
                        <td className="px-6 py-4">
                          {isTypeExists(screening, "entry questionaire")
                            ? "Processed"
                            : "Pending"}
                        </td>
                      </tr>
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <th
                          scope="row"
                          className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                          Refill Request
                        </th>
                        {Object.values(refillGroup)?.length ? (
                          Object.values(refillGroup)?.map((item, index) => (
                            <React.Fragment key={index}>
                              <td className="px-6 py-4">
                                {formatDate(item[0]?.createdAt)}
                              </td>
                              <td className="px-6 py-4">
                                {formatDate(item[0]?.updatedAt)}
                              </td>
                              <td className="px-6 py-4">
                                {Object.values(refillGroup)?.length < 3
                                  ? "Available for Request"
                                  : "3 Completed"}
                              </td>
                            </React.Fragment>
                          ))
                        ) : (
                          <>
                            <td className="px-6 py-4">No Submission</td>
                            <td className="px-6 py-4">No Submission</td>
                            <td className="px-6 py-4">Pending</td>
                          </>
                        )}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* New Script */}
          <div className="mb-10">
            <h1 className="text-2xl font-bold text-left">New Script</h1>
            <div className="mt-10 relative overflow-x-auto">
              <div className="rounded-t-xl rounded-b-xl ">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="h-20 text-lg text-black bg-[#f0f1fa] ">
                      <tr>
                        <th scope="col" className="px-6 py-3">
                          Date
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Drug
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Dispense #
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Dosage
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Notes
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th
                          scope="row"
                          className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                          {scriptData.currentDate || "00/00/00"}
                        </th>
                        <td className="px-6 py-4">
                          <input
                            style={{ width: "100%" }}
                            className="border-none"
                            type="text"
                            name="drug"
                            value={scriptData.drug}
                            onChange={handleChange}
                            placeholder="write drugs.."
                          />
                        </td>
                        <td className="px-6 py-4">
                          <input
                            className="border-none w-20"
                            type="number"
                            name="dispense"
                            value={scriptData.dispense}
                            onChange={handleChange}
                            placeholder="0"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <input
                            className="border-none w-20"
                            type="number"
                            name="dosage"
                            value={scriptData.dosage}
                            onChange={handleChange}
                            placeholder="0mg"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <input
                            className="border-none"
                            type="text"
                            name="note"
                            value={scriptData.note}
                            onChange={handleChange}
                            placeholder="NA"
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <button
                  className="mt-10 bg-[#6984fb] px-10 py-4 text-white font-bold rounded-2xl transition duration-150 ease-in-out hover:bg-[#627dfa]  active:bg-[#5a6de9] active:scale-100"
                  disabled={scriptLoading}
                  onClick={() => {
                    submitScriptData();
                  }}
                >
                  {scriptLoading ? "Loading..." : "Submit"}
                </button>
                {/* <button className="mt-10  bg-[#6984fb] px-10 py-4 text-white font-bold rounded-2xl">
                  Submit
                </button> */}
              </div>
            </div>
          </div>

          {/* Refill History */}
          <div className="mb-10">
            <h1 className="text-2xl font-bold text-left">Refill History</h1>
            <div className="mt-10 relative overflow-x-auto">
              <div className="rounded-t-xl rounded-b-xl overflow-x-auto">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  <thead className="h-20 text-lg text-black bg-[#f0f1fa] ">
                    <tr>
                      <th scope="col" className="px-6 py-3">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Drug
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Dispense #
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Dosage
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Tracking link
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Notes
                      </th>
                      <th scope="col" className="px-6 py-3 text-[#FF0F0F]">
                        Delete
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {newScriptData?.map((item, index) => {
                      // console.log('see new scriptdata', newScriptData)
                      if (item?.uid != id) return;
                      return (
                        // console.log()
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={index}>
                          <th
                            scope="row"
                            className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                          >
                            {formatDate(item.createdAt)}
                          </th>

                          <td className="px-6 py-4">{item?.drug}</td>
                          <td className="px-6 py-4">{item?.dispense}</td>
                          <td className="px-6 py-4">{item?.dosage}</td>
                          <td className="px-6 py-4">
                            <input
                              style={{
                                width: "100%",
                                border: "1px solid lightgray",
                              }}
                              className="border-none"
                              type="text"
                              defaultValue={item?.tracking_id || ""}
                              name="tackingLink"
                              // value={tackingLink?.value}
                              onChange={async (e) => {
                                const value = e.target.value;
                                if (value.length > 8) {
                                  await updateScriptData(value, item);
                                }
                              }}


                              // onChange={(e) =>
                              //   e.target.value?.length > 8
                              //     ? updateScriptData(e.target.value, item)

                              //     : null
                              // }
                              placeholder="write tracking link here.."
                            />
                          </td>
                          <td className="px-6 py-4" style={{}}>
                            {item?.note}
                          </td>
                          <td
                            className="px-6 py-4"
                            style={{
                              cursor: "pointer",
                              color: "red",
                              fontWeight: "bolder",
                            }}
                            onClick={() => {
                              deletePress(item);
                            }}
                          >
                            Delete
                          </td>
                          <td
                            className="px-6 py-4"
                            style={{
                              cursor: "pointer",
                              color: "red",
                              fontWeight: "bolder",
                            }}>


                            <input
                              type="checkbox"
                              disabled={item?.tracking_id?.length < 8}
                              className={item?.tracking_id?.length < 8 ? "cursor-not-allowed" : ""}
                              defaultChecked={item?.status || false}
                              onChange={async (e) => {


                                console.log(e.target.checked, "see item.tracking_id:", item?.tracking_id);
                                if (!item?.tracking_id || item?.tracking_id.length <= 8) {
                                  toast.error("Please provide a valid tracking link");
                                  return;
                                }



                                await updateScriptData(item?.tracking_id, item)
                                await updateStatusData(e.target.checked, item)

                                if (e.target.checked) {
                                  try {
                                    // Update existingForm type to "Completed"


                                    // console.log('See userId from params',id)
                                    await axios.put(
                                      `${process.env.REACT_APP_BACKEND_URL}existingforms/updatetype/${id}`,
                                      { type: "Completed" },
                                      {
                                        headers: {
                                          Authorization: `Bearer ${localStorage.getItem("token")}`,
                                        },
                                      }
                                    );

                                    console.log('Existingform type updated to Completed')
                                    // toast.success("Submitted successfully!");
                                  } catch (error) {
                                    toast.error("Error updating form");
                                    console.log("error", error);
                                  }
                                }

                                // else{
                                //   try {
                                //     // Update existingForm type to "Completed"


                                //     console.log('See userId from params',id)
                                //     await axios.put(
                                //       `${process.env.REACT_APP_BACKEND_URL}existingforms/updatetype/${id}`,
                                //       { type: "New Participant" },
                                //       {
                                //         headers: {
                                //           Authorization: `Bearer ${localStorage.getItem("token")}`,
                                //         },
                                //       }
                                //     );

                                //     console.log('Existingform type updated to Completed')
                                //     // toast.success("Submitted successfully!");
                                //   } catch (error) {
                                //     toast.error("Error updating form");
                                //     console.log("error", error);
                                //   }
                                // }
                              }}
                            />

                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* new clinical forms */}
          {/* added */}
          {/* <div className="mb-10">
    <h1 className="text-2xl font-bold text-left">Clinical Forms</h1>
    <div className="mt-10 relative overflow-x-auto">
      <div className="rounded-t-xl rounded-b-xl overflow-x-auto">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="h-20 text-lg text-black bg-[#f0f1fa]">
            <tr>
              <th scope="col" className="px-6 py-3">
                Document
              </th>
              <th scope="col" className="px-6 py-3">
                Sent
              </th>
              <th scope="col" className="px-6 py-3">
                Received
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {screening
            
              .filter((form) => form?.Screeningform?.type?.trim() !== "entry questionaire") // Filter out Entry Questionnaire
              .reduce((acc, form) => {
                const type = form?.Screeningform?.type;
                const createdAt = new Date(form.createdAt).toLocaleDateString();

                // Find if the entry already exists for this type and date
                const existingIndex = acc.findIndex(
                  (entry) => entry.type === type && entry.createdAt === createdAt
                );

                // If entry exists, we don't add a new one, just return the accumulated list
                if (existingIndex === -1) {
                  acc.push({
                    type,
                    createdAt,
                    sentDate: formatDate(form.createdAt),
                    receivedDate: formatDate(form.createdAt),
                    status: "Sent", // Modify this according to your status logic
                  });
                }

                return acc;
              }, [])
              .map((form, index) => (
                <tr key={`${form.type}-${form.createdAt}`} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <td
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setClinicalFormModal(true);
                      setClinicalFormModalType(form.type);
                    }}
                  >
                    {form.type}
                  </td>
                  <td className="px-6 py-4">{form.sentDate}</td>
                  <td className="px-6 py-4">{form.receivedDate}</td>
                  <td className="px-6 py-4">{form.status}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  </div> */}



          {/* original Clinical Forms */}
          <div className="mb-10">
            <h1 className="text-2xl font-bold text-left">Clinical Forms</h1>
            <div className="mt-10 relative overflow-x-auto">
              <div className="rounded-t-xl rounded-b-xl overflow-x-auto">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  <thead className="h-20 text-lg text-black bg-[#f0f1fa] ">
                    <tr>
                      <th scope="col" className="px-6 py-3">
                        Document
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Sent
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Received
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Status
                      </th>
                      {/* <th scope="col" className="px-6 py-3">
                        Refill Count
                      </th> */}
                    </tr>
                  </thead>
                 
                 
                 
                  <tbody>
                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          if (!screening?.length) return;
                          setClinicalFormModal(true);
                          setClinicalFormModalType("PCL-5");
                        }}
                      >
                        PCL-5
                      </th>

                      <td className="px-6 py-4">
                        {isTypeExists(screening, "pcl5")
                          ? formatDate(
                            screening.filter(
                              (form) => form?.Screeningform?.type === "pcl5"
                            )[0].createdAt
                          )
                          : "No Submission"}
                      </td>
                      <td className="px-6 py-4">
                        {isTypeExists(screening, "pcl5")
                          ? formatDate(
                            screening.filter(
                              (form) => form?.Screeningform?.type === "pcl5"
                            )[0].createdAt
                          )
                          : "No Submission"}
                      </td>
                      <td className="px-6 py-4">
                        {isTypeExists(screening, "pcl5") ? "Sent" : "Pending"}
                      </td>
                    </tr>

                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          setClinicalFormModal(true);
                          setClinicalFormModalType("GAD-7");
                        }}
                      >
                        GAD-7
                      </th>

                      <td className="px-6 py-4">
                        {isTypeExists(screening, "gad7")
                          ? formatDate(
                            screening.filter(
                              (form) => form?.Screeningform?.type === "gad7"
                            )[0].createdAt
                          )
                          : "No Submission"}
                      </td>
                      <td className="px-6 py-4">
                        {isTypeExists(screening, "gad7")
                          ? formatDate(
                            screening.filter(
                              (form) => form?.Screeningform?.type === "gad7"
                            )[0].createdAt
                          )
                          : "No Submission"}
                      </td>
                      <td className="px-6 py-4">
                        {isTypeExists(screening, "gad7") ? "Sent" : "Pending"}
                      </td>
                    </tr>
                    <tr
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setClinicalFormModal(true);
                        setClinicalFormModalType("PHQ-9");
                      }}
                    >
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        PHQ-9
                      </th>

                      <td className="px-6 py-4">
                        {isTypeExists(screening, "phq9")
                          ? formatDate(
                            screening.filter(
                              (form) => form?.Screeningform?.type === "phq9"
                            )[0].createdAt
                          )
                          : "No Submission"}
                      </td>
                      <td className="px-6 py-4">
                        {isTypeExists(screening, "phq9")
                          ? formatDate(
                            screening.filter(
                              (form) => form?.Screeningform?.type === "phq9"
                            )[0].createdAt
                          )
                          : "No Submission"}
                      </td>
                      <td className="px-6 py-4">
                        {isTypeExists(screening, "phq9") ? "Sent" : "Pending"}
                      </td>
                    </tr>
                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">

                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>


          {/* <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          setClinicalFormModal(true);
                          setClinicalFormModalType("Verification Document");
                        }}
                      >
                        Verification Document
                      </th> */}

          {/* <td className="px-6 py-4">
                        {isTypeExists(screening, "entry questionaire")
                          ? formatDate(
                              screening.filter(
                                (form) =>
                                  form.Screeningform.type ===
                                  "entry questionaire"
                              )[0].createdAt
                            )
                          : "No Submission"}
                      </td> */}
          {/* <td className="px-6 py-4">
                        {isTypeExists(screening, "entry questionaire")
                          ? formatDate(
                              screening.filter(
                                (form) =>
                                  form.Screeningform.type ===
                                  "entry questionaire"
                              )[0].createdAt
                            )
                          : "No Submission"}
                      </td> */}
          {/* <td className="px-6 py-4">
                        {isTypeExists(screening, "entry questionaire")
                          ? "Sent"
                          : "Pending"}
                      </td> */}


          {/* Administrative Forms */}
          <div className="mb-10">
            <h1 className="text-2xl font-bold text-left">
              Administrative Forms
            </h1>
            <div className="mt-10 relative overflow-x-auto">
              <div className="rounded-t-xl rounded-b-xl overflow-x-auto">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  <thead className="h-20 text-lg text-black bg-[#f0f1fa] ">
                    <tr>
                      <th scope="col" className="px-6 py-3">
                        Document
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Sent
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Received
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          if (
                            !information?.id ||
                            !emergencycontact?.id ||
                            !documentverification?.id
                          )
                            return;
                          setAdministrativeModal(true);
                          setAdministrativeModalType("Consent form");
                        }}
                      >
                        Consent form
                      </th>

                      <td className="px-6 py-4">
                        {consent
                          ? formatDate(consent.createdAt)
                          : "No Submission"}
                      </td>
                      <td className="px-6 py-4">
                        {consent
                          ? formatDate(consent.createdAt)
                          : "No Submission"}
                      </td>
                      <td className="px-6 py-4">
                        {consent
                          ? consent.status == "pending" && "Completed"
                          : "Pending"}
                      </td>
                    </tr>

                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          if (
                            !information?.id ||
                            !emergencycontact?.id ||
                            !documentverification?.id
                          )
                            return;
                          setAdministrativeModal(true);
                          setAdministrativeModalType("Emergency Contact");
                        }}
                      >
                        Emergency Contact
                      </th>

                      <td className="px-6 py-4">
                        {emergencycontact
                          ? formatDate(emergencycontact?.createdAt)
                          : "No Submission"}
                      </td>
                      <td className="px-6 py-4">
                        {emergencycontact
                          ? formatDate(emergencycontact?.createdAt)
                          : "No Submission"}
                      </td>
                      <td className="px-6 py-4">
                        {emergencycontact
                          ? emergencycontact?.status == "pending" && "Completed"
                          : "Pending"}
                      </td>
                    </tr>
                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          if (
                            !information?.id ||
                            !emergencycontact?.id ||
                            !documentverification?.id
                          )
                            return;
                          setAdministrativeModal(true);
                          setAdministrativeModalType("Address");
                        }}
                      >
                        address
                      </th>

                      <td className="px-6 py-4">
                        {information
                          ? formatDate(information?.createdAt)
                          : "No Submission"}
                      </td>
                      <td className="px-6 py-4">
                        {information
                          ? formatDate(information?.createdAt)
                          : "No Submission"}
                      </td>
                      <td className="px-6 py-4">
                        {information
                          ? information?.status == "pending" && "Completed"
                          : "Pending"}
                      </td>
                    </tr>
                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          if (
                            !information?.id ||
                            !emergencycontact?.id ||
                            !documentverification?.id
                          )
                            return;
                          setAdministrativeModal(true);
                          setAdministrativeModalType("Verification Document");
                        }}
                      >
                        Verification Document
                      </th>

                      <td className="px-6 py-4">
                        {documentverification
                          ? formatDate(documentverification?.createdAt)
                          : "No Submission"}
                      </td>
                      <td className="px-6 py-4">
                        {documentverification
                          ? formatDate(documentverification?.createdAt)
                          : "No Submission"}
                      </td>
                      <td className="px-6 py-4">
                        {documentverification
                          ? documentverification?.status == "pending" &&
                          "Completed"
                          : "Pending"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* <Button onClick={() => setChatMsg(true)}>Start Chat</Button> */}
          <Button
            onClick={() => {
              window.open('https://discord.com', "_blank");
            }}
          >
            Chat on Discord
          </Button>
        </div>
      </div>
    </>
  );
}

export default Userprofile;
