import Sidebar from "../components/Dashboards/SchoolSidebar/Sidebar";
import "../components/Dashboards/SchoolDashboard/dashboard.css";
import "../components/Dashboards/SchoolSidebar/sidebar.css";
import Dashboard from "../components/Dashboards/SchoolDashboard/Dashboard";
import { useEffect, useState } from "react";

const DashboardPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      // Automatically close sidebar on small screens
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="dashboard-page">
      <div className={`sidebar-container ${sidebarOpen ? "open" : ""}`}>
        <Sidebar />
      </div>
      <div
        className="main-content"
        style={{
          marginLeft: sidebarOpen ? "240px" : "0",
        }}
      >
        {windowWidth < 768 && (
          <button
            onClick={toggleSidebar}
            className="sidebar-toggle"
            aria-label="Toggle Sidebar"
          >
            {sidebarOpen ? "×" : "☰"}
          </button>
        )}
        <Dashboard />
      </div>
    </div>
  );
};

export default DashboardPage;
