// src/components/SchoolDashboard/Reports/ReportsPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import {
  FiFileText,
  FiPieChart,
  FiUsers,
  FiCalendar,
  FiSettings,
  FiDownload,
} from "react-icons/fi";
import useUser from "../../../../hooks/useUser";
import ReportTemplates from "./ReportTemplates";
import GeneratedReports from "./GeneratedReports";
import ReportScheduler from "./ReportScheduler";
import ReportBuilder from "./ReportBuilder";
import ReportAnalytics from "./ReportAnalytics";
import "../Reports/reports.css";

// const ReportsPage = () => {
//   const { user } = useUser();
//   const navigate = useNavigate();
//   const [activeTab, setActiveTab] = useState("templates");
//   const [sidebarOpen, setSidebarOpen] = useState(true);

//   const isAdmin = user?.user_type === "school_superuser";
//   const isTeacher = user?.user_type === "teacher";
//   const isParent = user?.user_type === "parent";

//   const tabs = [
//     {
//       id: "templates",
//       name: "Templates",
//       icon: <FiFileText />,
//       visible: isAdmin,
//     },
//     { id: "generated", name: "Reports", icon: <FiPieChart />, visible: true },
//     {
//       id: "scheduler",
//       name: "Scheduler",
//       icon: <FiCalendar />,
//       visible: isAdmin || isTeacher,
//     },
//     {
//       id: "builder",
//       name: "Report Builder",
//       icon: <FiSettings />,
//       visible: isAdmin,
//     },
//     { id: "analytics", name: "Analytics", icon: <FiUsers />, visible: isAdmin },
//   ].filter((tab) => tab.visible);

//   useEffect(() => {
//     // Set initial tab based on user role
//     if (isParent) {
//       setActiveTab("generated");
//       navigate("generated");
//     } else {
//       navigate(activeTab);
//     }
//   }, [user, activeTab, isParent, navigate]);

//   const renderTabContent = () => {
//     switch (activeTab) {
//       case "templates":
//         return <ReportTemplates />;
//       case "generated":
//         return <GeneratedReports />;
//       case "scheduler":
//         return <ReportScheduler />;
//       case "builder":
//         return <ReportBuilder />;
//       case "analytics":
//         return <ReportAnalytics />;
//       default:
//         return <GeneratedReports />;
//     }
//   };

//   return (
//     <div className="reports-container">
//       {!isParent && (
//         <div className={`reports-sidebar ${sidebarOpen ? "open" : "closed"}`}>
//           <div className="sidebar-header">
//             <h3>Reports</h3>
//             <button
//               className="toggle-sidebar"
//               onClick={() => setSidebarOpen(!sidebarOpen)}
//             >
//               {sidebarOpen ? "◄" : "►"}
//             </button>
//           </div>
//           <div className="sidebar-tabs">
//             {tabs.map((tab) => (
//               <button
//                 key={tab.id}
//                 className={`sidebar-tab ${
//                   activeTab === tab.id ? "active" : ""
//                 }`}
//                 onClick={() => {
//                   setActiveTab(tab.id);
//                   navigate(tab.id);
//                 }}
//               >
//                 <span className="tab-icon">{tab.icon}</span>
//                 {sidebarOpen && <span className="tab-name">{tab.name}</span>}
//               </button>
//             ))}
//           </div>
//         </div>
//       )}

//       <div className="reports-content">
//         <Outlet />
//         {renderTabContent()}
//       </div>
//     </div>
//   );
// };

// export default ReportsPage;

const ReportsPage = () => {
  return (
    <div className="reports-page-container">
      <Outlet />
    </div>
  );
};

export default ReportsPage;
