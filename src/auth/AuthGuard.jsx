import axios from "axios";
import { jwtDecode } from "jwt-decode";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthGuard = ({ children }) => {
  const navigate = useNavigate();
  const [auth, setAuth] = useState(false);
  const [isTokenValidated, setIsTokenValidated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    const authToken = localStorage.getItem("token");

    const fetchData = async () => {
      try {
        if (authToken) {
          const response = await axios.post(
            `https://backed.riverketaminestudy.com/api/auth/protected`,
            null, // No data to send in the request body
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          if (response.status === 200) {
            const decodedToken = jwtDecode(authToken);
            // Check if user is admin
            setIsAdmin(decodedToken.role === "Admin");

            setAuth(true);
          } else {
            setAuth(false);
            navigate("/login");
          }
        } else {
          setIsTokenValidated(true);
        }
      } catch (error) {
        console.error("Error validating token:", error);
        setAuth(false);
        navigate("/login");
      } finally {
        setIsTokenValidated(true);
      }
    };

    fetchData();

    // Clean up function to prevent navigation after unmounting
    return () => {};
  }, [navigate]);
  // Render children if token is validated, otherwise return null
  return isTokenValidated &&
    auth &&
    (isAdmin || !window.location.pathname.includes("admin")) ? (
    <>{children}</>
  ) : (
    navigate("/login")
  );
};

export default AuthGuard;
