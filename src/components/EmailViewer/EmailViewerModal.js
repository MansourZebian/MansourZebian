import axios from "axios";
import React, { useState } from "react";
import Modal from "react-modal";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toast } from "react-toastify";

// Modal Styling
const customStyles = {
  content: {
    width: "50%",
    height: "60vh",
    margin: "auto",
    padding: "10px",
    borderRadius: "10px",
    overflow: "auto",
    zIndex: 99,
  },
};

export const EmailEditorModal = ({ isOpen, onClose, initialSubject = "", initialBody = "", email, firstName, setEmailData }) => {
  const [emailSubject, setEmailSubject] = useState(initialSubject);
  const [emailBody, setEmailBody] = useState(initialBody);

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} style={customStyles} ariaHideApp={false}>
      <div className="flex flex-col space-y-4 " >
        <h2 className="text-xl font-bold">Edit Email</h2>

        <input
          type="text"
          // placeholder=""
          readOnly={true}
          disabled={true}
          value={email}
          // onChange={(e) => setEmailSubject(e.target.value)}
          className="border border-gray-300 px-3 py-2 rounded w-full"
        />

        {/* Subject Input */}

        <input
          type="text"
          placeholder="Email Subject"
          value={emailSubject}
          onChange={(e) => setEmailSubject(e.target.value)}
          className="border border-gray-300 px-3 py-2 rounded w-full"
        />

        {/* Rich Text Editor for Email Body */}
        <ReactQuill theme="snow" value={emailBody} onChange={setEmailBody} style={{ marginBottom: 30, height: '20vh' }} />

        {/* Buttons */}
        <div className="flex justify-end mt-4">
          <button className="bg-gray-400 text-white px-4 py-2 rounded mr-2" onClick={onClose}>
            Cancel
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={async () => {
              console.log("Email Subject:", emailSubject);
              console.log("Email Body:", emailBody);
              //  sending email

              axios.post(
                `${process.env.REACT_APP_BACKEND_URL}scriptemail/sendCustomEmail`, // Ensure a `/` in the .env URL
                {
                  email: email,
                  firstName: firstName,
                  subject: emailSubject,
                  body: emailBody,
                },
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                }
              ).then((res) => {
                console.log("Email Sent:", res.data);
                toast.success("Email Sent Successfully!");
              }).catch((err) => {
                console.error("Email Error:", err);
                toast.error("Error Sending Email!");
              });


              onClose();
              if (setEmailData) {
                setEmailData(
                  { subject: null, body: null, email: null, firstName: null }
                )
              }
            }}
          >
            Send Email
          </button>
        </div>
      </div>
    </Modal>
  );
};

// Example Usage
/*
  const [isModalOpen, setIsModalOpen] = useState(false);

  <div className="p-10">
      <button onClick={() => setIsModalOpen(true)} className="bg-blue-500 text-white px-4 py-2 rounded">
        Open Email Editor
      </button>

      <EmailEditorModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        initialSubject="Hello World!" 
        initialBody="<p>This is an email body.</p>" 
      />
  </div>
*/

