// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const CLIENT_ID = process.env.REACT_APP_DISCORD_CLIENT_ID;
// const REDIRECT_URI = process.env.REACT_APP_DISCORD_REDIRECT_URI;
// const OAUTH_URL = process.env.REACT_APP_DISCORD_OAUTH_URL;
// const BOT_INVITE = process.env.REACT_APP_DISCORD_BOT_INVITE;

// const DiscordLogin = () => {
//   const [user, setUser] = useState(null);

//   const loginWithDiscord = () => {
//     window.location.href = `${OAUTH_URL}?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
//       REDIRECT_URI
//     )}&response_type=token&scope=identify+guilds+bot`;
//   };

//   useEffect(() => {
//     const fragment = new URLSearchParams(window.location.hash.substring(1));
//     const accessToken = fragment.get("access_token");

//     if (accessToken) {
//       axios
//         .get("https://discord.com/api/users/@me", {
//           headers: { Authorization: `Bearer ${accessToken}` },
//         })
//         .then((response) => setUser(response.data))
//         .catch((error) => console.error("Error fetching user data:", error));
//     }
//   }, []);

//   return (
//     <div>
//       <h2>Discord Login</h2>
//       {user ? (
//         <div>
//           <p>Welcome, {user.username}!</p>
//           <img
//             src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`}
//             alt="Avatar"
//             width="100"
//           />
//         </div>
//       ) : (
//         <button onClick={loginWithDiscord}>Login with Discord</button>
//       )}
//       <p>
//         <a href={BOT_INVITE} target="_blank" rel="noopener noreferrer">
//           Invite Bot to Server
//         </a>
//       </p>
//     </div>
//   );
// };

// export default DiscordLogin;
