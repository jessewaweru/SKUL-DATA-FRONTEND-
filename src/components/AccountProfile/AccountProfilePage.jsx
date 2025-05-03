// AccountProfilePage.jsx
import { useState, useEffect } from "react";
import AccountSidebar from "./AccountSidebar";
import { Outlet } from "react-router-dom";
import "../AccountProfile/accountprofile.css";

const AccountProfilePage = () => {
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
    <div className="account-profile-page">
      <div className={`sidebar-container ${sidebarOpen ? "open" : ""}`}>
        <AccountSidebar />
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
        <Outlet />
      </div>
    </div>
  );
};

export default AccountProfilePage;
