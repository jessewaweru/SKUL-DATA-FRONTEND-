import { FiBookOpen, FiPlus } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import "../Teachers/teachers.css";

const TeachersHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getActiveTab = () => {
    if (location.pathname.includes("/teachers/profiles")) return "Profiles";
    if (location.pathname.includes("/teachers/reports")) return "Reports";
    if (location.pathname.includes("/teachers/documents")) return "Documents";
    if (location.pathname.includes("/teachers/activity-logs"))
      return "Activity Logs";
    return "Overview";
  };

  return (
    <div className="teachers-header">
      <div className="header-left">
        <FiBookOpen className="header-icon" />
        <h2>Teachers - {getActiveTab()}</h2>
      </div>
      <div className="header-right">
        {getActiveTab() === "Profiles" && (
          <button
            className="add-button"
            onClick={() => navigate("/dashboard/teachers/profiles/create")}
          >
            <FiPlus /> Add Teacher
          </button>
        )}
      </div>
    </div>
  );
};

export default TeachersHeader;
