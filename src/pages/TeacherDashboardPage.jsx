import { useState, useEffect } from "react";
import TeacherSidebar from "../components/TeacherDashboards/TeacherSidebar/TeacherSidebar";
import TeacherDashboard from "../components/TeacherDashboards/TeacherDashboardSection/TeacherDashboard";
import "../components/TeacherDashboards/TeacherDashboardSection/teacherdashboard.css";
import "../components/TeacherDashboards/TeacherSidebar/teachersidebar.css";

const TeacherDashboardPage = () => {
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
    <div className="teacher-dashboard-page">
      <div className={`teacher-sidebar-container ${sidebarOpen ? "open" : ""}`}>
        <TeacherSidebar />
      </div>
      <div
        className="teacher-main-content"
        style={{
          marginLeft: sidebarOpen ? "240px" : "0",
        }}
      >
        {windowWidth < 768 && (
          <button
            onClick={toggleSidebar}
            className="teacher-sidebar-toggle"
            aria-label="Toggle Sidebar"
          >
            {sidebarOpen ? "×" : "☰"}
          </button>
        )}
        <TeacherDashboard />
      </div>
    </div>
  );
};

export default TeacherDashboardPage;
