// // Callback.js
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import Chat from "./Chat";

// const Callback = () => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     // Extract the access token from the URL hash
//     const fragment = new URLSearchParams(window.location.hash.substring(1));
//     const accessToken = fragment.get("access_token");

//     if (accessToken) {
//       // Fetch user data from Discord API
//       axios
//         .get("https://discord.com/api/v10/users/@me", {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//           },
//         })
//         .then((response) => {
//           setUser(response.data);
//           setLoading(false);
//         })
//         .catch((error) => {
//           console.error("Error fetching user data:", error);
//           setLoading(false);
//         });
//     } else {
//       // If no access token is found, redirect to home
//       navigate("/");
//     }
//   }, [navigate]); // Add navigate as a dependency

//   return (
//     <div>

//         <h1>Callback</h1>
        
//       {loading ? (
//         <p>Loading...</p>
//       ) : user ? (
//         <div>
//           <p>Welcome, {user.username}!</p>
//           {user && user.id && user.avatar ? (
//   <img
//     src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`}
//     alt="Avatar"
//     width="100"
//   />
// ) : (
//   <img
//     src="https://cdn.discordapp.com/embed/avatars/1.png"
//     alt="Default Avatar"
//     width="100"
//   />
// )}
//         </div>
//       ) : (
//         <p>Error fetching user data</p>
//       )}
//       <Chat userId={user ? user.id : ""} />
//     </div>
//   );
// };

// export default Callback;
