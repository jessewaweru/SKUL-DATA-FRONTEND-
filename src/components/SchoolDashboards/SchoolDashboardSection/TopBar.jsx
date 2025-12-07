import { useState, useEffect } from "react";
import { FiCalendar } from "react-icons/fi";
import { useApi } from "../../../hooks/useApi";
import { createDashboardApi } from "../../../services/dashboardApi";

const TopBar = () => {
  const api = useApi();
  const dashboardApi = createDashboardApi(api);

  const [userName, setUserName] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    // Fetch current user
    fetchCurrentUser();

    // Set current date
    updateDate();

    // Set greeting based on time of day
    updateGreeting();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const user = await dashboardApi.getCurrentUser();
      if (user && user.first_name) {
        setUserName(`${user.first_name} ${user.last_name}`);
      } else {
        setUserName("Administrator");
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      // Set a default name instead of showing error
      setUserName("Administrator");
    }
  };

  const updateDate = () => {
    const date = new Date();
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    setCurrentDate(date.toLocaleDateString("en-US", options));
  };

  const updateGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting("🌅 Good morning");
    } else if (hour < 18) {
      setGreeting("☀️ Good afternoon");
    } else {
      setGreeting("🌙 Good evening");
    }
  };

  return (
    <div className="topbar">
      <div className="topbar-content">
        <div className="greeting-container">
          <span className="greeting-text">
            {greeting}, {userName || "Loading..."}
          </span>
          <span className="date-text">{currentDate}</span>
        </div>

        <button className="calendar-button">
          <FiCalendar />
          <span>Current Academic Year</span>
        </button>
      </div>
    </div>
  );
};

export default TopBar;
