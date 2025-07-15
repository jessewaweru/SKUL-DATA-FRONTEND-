import { useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "./UserContext";
import { useApi } from "../hooks/useApi"; // Import the custom hook

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const api = useApi();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("/users/me/");
        setUser(response.data);
      } catch (error) {
        console.error("Failed to fetch user", error);
        setUser(null);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      } finally {
        setLoading(false);
      }
    };

    const token = localStorage.getItem("accessToken");
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const handleAuth = async (formData) => {
    try {
      const response = await api.post("/api/token/", {
        username: formData.username,
        password: formData.password,
      });

      if (response.data.access) {
        localStorage.setItem("accessToken", response.data.access);
        localStorage.setItem("refreshToken", response.data.refresh);

        // Fetch user profile with expanded relationships
        const userResponse = await api.get("/api/users/me/", {
          params: { expand: "school_admin_profile" },
        });

        setUser(userResponse.data);

        // Debug log
        console.log("User profile loaded:", userResponse.data);

        return true;
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    return "/login";
  };

  return (
    <UserContext.Provider value={{ user, handleAuth, handleLogout, loading }}>
      {children}
    </UserContext.Provider>
  );
};

// import api from "../services/api";

// export const UserProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // New: Track auth state separately
//   const [isAuthenticated, setIsAuthenticated] = useState(
//     !!localStorage.getItem("accessToken")
//   );

//   const fetchUser = async () => {
//     try {
//       const response = await api.get("/api/users/me/");
//       setUser(response.data);
//       setIsAuthenticated(true);
//     } catch (error) {
//       console.error("Failed to fetch user", error);
//       logout();
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (isAuthenticated) {
//       fetchUser();
//     } else {
//       setLoading(false);
//     }
//   }, [isAuthenticated]);

//   const login = async (credentials) => {
//     try {
//       const response = await api.post("/api/token/", credentials);
//       localStorage.setItem("accessToken", response.data.access);
//       localStorage.setItem("refreshToken", response.data.refresh);
//       setIsAuthenticated(true);
//       return true;
//     } catch (error) {
//       console.error("Login failed:", error);
//       logout();
//       return false;
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem("accessToken");
//     localStorage.removeItem("refreshToken");
//     setUser(null);
//     setIsAuthenticated(false);
//   };

//   return (
//     <UserContext.Provider
//       value={{ user, loading, login, logout, isAuthenticated }}
//     >
//       {children}
//     </UserContext.Provider>
//   );
// };
