// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const Chat = ({ userId }) => {
//   const [message, setMessage] = useState('');
//   const [messages, setMessages] = useState([]);

//   const sendMessage = async () => {
//     if (message.trim()) {
//       // Add the new message to the chat window
//       const newMessages = [...messages, { text: message, id: Date.now() }];
//       setMessages(newMessages);
      
//       // Clear input field
//       setMessage('');

//       try {

//         await axios.post(
//             `${process.env.REACT_APP_BACKEND_URL}discord/send-message`,{
//       userId: userId, // Pass the Discord user ID
//       message: message,
//     },
//     {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem(
//             "token"
//           )}`,
//         },
//       }
//     );	

//         // Send the message to the backend to forward it to Discord
//         // await axios.post('http://localhost:8000/send-message', {
//         //   userId: userId, // Pass the Discord user ID
//         //   message: message,
//         // });
//       } catch (error) {
//         console.error('Error sending message:', error);
//       }
//     }
//   };

//   return (
//     <div style={{ width: '300px', margin: 'auto', padding: '10px' }}>
//       <h3>Discord Chat</h3>
//       <div
//         style={{
//           border: '1px solid #ccc',
//           padding: '10px',
//           height: '300px',
//           overflowY: 'scroll',
//           marginBottom: '10px',
//         }}
//       >
//         {messages.length === 0 ? (
//           <p>No messages yet.</p>
//         ) : (
//           messages.map((msg) => (
//             <div key={msg.id} style={{ padding: '5px', borderBottom: '1px solid #ddd' }}>
//               <p>{msg.text}</p>
//             </div>
//           ))
//         )}
//       </div>

//       <input
//         type="text"
//         value={message}
//         onChange={(e) => setMessage(e.target.value)}
//         placeholder="Type your message..."
//         style={{ width: '100%', padding: '10px' }}
//       />
//       <button
//         onClick={sendMessage}
//         style={{
//           width: '100%',
//           padding: '10px',
//           backgroundColor: '#4CAF50',
//           color: 'white',
//           border: 'none',
//           marginTop: '10px',
//         }}
//       >
//         Send
//       </button>
//     </div>
//   );
// };

// export default Chat;
