import { useState, useEffect } from "react";
import "../../components/ParentDashboards/ParentDashboardSection/parentdashboard.css";
import "../../components/ParentDashboards/ParentSidebar/parentsidebar.css";
import "./parentdashboardpage.css";
import ParentSidebar from "../../components/ParentDashboards/ParentSidebar/ParentSidebar";
import ParentDashboard from "../../components/ParentDashboards/ParentDashboardSection/ParentDashboard";

const ParentDashboardPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
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
    <div className="parent-dashboard-page">
      <div className={`parent-sidebar-container ${sidebarOpen ? "open" : ""}`}>
        <ParentSidebar />
      </div>
      <div
        className="parent-main-content"
        style={{
          marginLeft: sidebarOpen ? "240px" : "0",
        }}
      >
        {windowWidth < 768 && (
          <button
            onClick={toggleSidebar}
            className="parent-sidebar-toggle"
            aria-label="Toggle Sidebar"
          >
            {sidebarOpen ? "×" : "☰"}
          </button>
        )}
        <ParentDashboard />
      </div>
    </div>
  );
};

export default ParentDashboardPage;
