import { useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "./UserContext";

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleAuth = async (formData) => {
    try {
      const response = await axios.post("api/login-register", formData, {
        headers: { "Content-Type": "application/json" },
      });

      const userData = response.data;
      if (userData) {
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);

        switch (userData.role) {
          case "superuser":
            return "/superuser-dashboard";
          case "teacher":
            return "/teacher-dashboard";
          case "parent":
            return "/parent-dashboard";
          default:
            return "/";
        }
      }
    } catch (error) {
      console.error(
        "Error logging user:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    return "/login";
  };

  return (
    <UserContext.Provider value={{ user, handleAuth, handleLogout }}>
      {children}
    </UserContext.Provider>
  );
};
