import Sidebar from "../components/SchoolDashboards/SchoolSidebar/Sidebar";
import "../components/SchoolDashboards/SchoolDashboardSection/dashboard.css";
import "../components/SchoolDashboards/SchoolSidebar/sidebar.css";
import Dashboard from "../components/SchoolDashboards/SchoolDashboardSection/Dashboard";
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
