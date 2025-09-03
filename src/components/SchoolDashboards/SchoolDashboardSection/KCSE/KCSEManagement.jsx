import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useApi } from "../../../../hooks/useApi";
import "./kcsemanagement.css";

const KCSEManagement = () => {
  const navigate = useNavigate();
  const api = useApi();
  const [activeTab, setActiveTab] = useState("dashboard");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    navigate(`/dashboard/exams/kcse/${tab}`);
  };

  return (
    <div className="kcse-management-container">
      <div className="kcse-header">
        <h1>KCSE Management System</h1>
        <p>Manage your school's KCSE examination results and analytics</p>
      </div>

      <div className="kcse-tabs">
        <button
          className={`kcse-tab ${activeTab === "dashboard" ? "active" : ""}`}
          onClick={() => handleTabChange("dashboard")}
        >
          Dashboard
        </button>
        <button
          className={`kcse-tab ${
            activeTab === "download-template" ? "active" : ""
          }`}
          onClick={() => handleTabChange("download-template")}
        >
          Download Template
        </button>
        <button
          className={`kcse-tab ${
            activeTab === "upload-results" ? "active" : ""
          }`}
          onClick={() => handleTabChange("upload-results")}
        >
          Upload Results
        </button>
        <button
          className={`kcse-tab ${activeTab === "results" ? "active" : ""}`}
          onClick={() => handleTabChange("results")}
        >
          View Results
        </button>
        <button
          className={`kcse-tab ${
            activeTab === "school-performance" ? "active" : ""
          }`}
          onClick={() => handleTabChange("school-performance")}
        >
          School Performance
        </button>
        <button
          className={`kcse-tab ${
            activeTab === "subject-analysis" ? "active" : ""
          }`}
          onClick={() => handleTabChange("subject-analysis")}
        >
          Subject Analysis
        </button>
        <button
          className={`kcse-tab ${
            activeTab === "comparative-analysis" ? "active" : ""
          }`}
          onClick={() => handleTabChange("comparative-analysis")}
        >
          Comparative Analysis
        </button>
        <button
          className={`kcse-tab ${
            activeTab === "teacher-performance" ? "active" : ""
          }`}
          onClick={() => handleTabChange("teacher-performance")}
        >
          Teacher Performance
        </button>
      </div>

      <div className="kcse-content">
        <Outlet />
      </div>
    </div>
  );
};

export default KCSEManagement;
