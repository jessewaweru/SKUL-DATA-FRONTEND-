// src/components/SchoolDashboard/Reports/ReportsOverview.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import useUser from "../../../../hooks/useUser";
import "../Reports/reports.css";

const ReportsOverview = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  const isAdmin = user?.user_type === "school_superuser";
  const isTeacher = user?.user_type === "teacher";
  const isParent = user?.user_type === "parent";

  const reportCards = [
    {
      title: "Generated Reports",
      description: "View all previously generated reports",
      path: "",
      icon: "📋",
      visible: true,
    },
    {
      title: "Report Templates",
      description: "Manage report templates and designs",
      path: "templates",
      icon: "📐",
      visible: isAdmin,
    },
    {
      title: "Scheduled Reports",
      description: "Setup and manage automated report generation",
      path: "scheduler",
      icon: "⏰",
      visible: isAdmin || isTeacher,
    },
    {
      title: "Report Builder",
      description: "Create custom report templates",
      path: "builder",
      icon: "🛠️",
      visible: isAdmin,
    },
    {
      title: "Report Analytics",
      description: "View usage statistics and metrics",
      path: "analytics",
      icon: "📊",
      visible: isAdmin,
    },
    {
      title: "My Requests",
      description: "View your requested student reports",
      path: "requests",
      icon: "🙋",
      visible: isParent,
    },
  ].filter((card) => card.visible);

  return (
    <div className="reports-overview">
      <h2>Reports Dashboard</h2>
      <p className="subtitle">Manage and generate various school reports</p>

      <div className="report-cards-grid">
        {reportCards.map((card) => (
          <div
            key={card.title}
            className="report-card"
            onClick={() => navigate(`/dashboard/reports/${card.path}`)}
          >
            <div className="card-icon">{card.icon}</div>
            <h3>{card.title}</h3>
            <p>{card.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportsOverview;
