import React, { useState, useEffect } from "react";
import axios from "axios";


// Import the string from the .env with URL of the API/server - http://localhost:5005
const API_URL = import.meta.env.VITE_API_URL;


const AuthContext = React.createContext();

function AuthProviderWrapper(props) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [authError, setAuthError] = useState(null);

  const storeToken = (token) => {
    localStorage.setItem("authToken", token);
  };

  const authenticateUser = () => {
    const storedToken = localStorage.getItem("authToken");
    const csrfToken = localStorage.getItem("csrfToken");
  
    console.log("Stored Auth Token:", storedToken);
    console.log("Stored CSRF Token:", csrfToken);
  
    if (storedToken) {
      axios
        .get(`${API_URL}/auth/verify`, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
            "CSRF-Token": csrfToken,
          },
        })
        .then((response) => {
          const user = response.data;
          setIsLoggedIn(true);
          setIsLoading(false);
          setUser(user);
        })
        .catch((error) => {
          console.error("Error verifying user:", error);
          setIsLoggedIn(false);
          setIsLoading(false);
          setUser(null);
        });
    } else {
      setIsLoggedIn(false);
      setIsLoading(false);
      setUser(null);
    }
  };
  
  const removeToken = () => {
    // Upon logout, remove the token from the localStorage
    localStorage.removeItem("authToken");
    localStorage.removeItem("csrfToken");
  };

  const logOutUser = () => {
    removeToken();
    authenticateUser();
  };

  useEffect(() => {
    axios
      .get(`${API_URL}/form`)
      .then((response) => {
        const csrfToken = response.data.csrfToken;
        console.log("CSRF Token fetched:", csrfToken);
        localStorage.setItem("csrfToken", csrfToken);
      })
      .then(() => {
        authenticateUser();
      })
      .catch((error) => {
        console.error("Error fetching CSRF token:", error);
        setIsLoading(false); // Ensure loading state is set to false in case of error
      });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        isLoading,
        user,
        storeToken,
        authenticateUser,
        logOutUser,
        authError,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

export { AuthProviderWrapper, AuthContext };
