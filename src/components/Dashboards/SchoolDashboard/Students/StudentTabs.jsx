// components/SchoolDashboard/Students/StudentTabs.jsx
import { FiUser, FiBook, FiCalendar, FiFileText } from "react-icons/fi";
import "../Students/students.css";

const StudentTabs = ({ activeTab, setActiveTab, student }) => {
  return (
    <div className="student-tabs">
      <button
        className={activeTab === "basic" ? "active" : ""}
        onClick={() => setActiveTab("basic")}
      >
        <FiUser /> Basic Info
      </button>
      <button
        className={activeTab === "academics" ? "active" : ""}
        onClick={() => setActiveTab("academics")}
      >
        <FiBook /> Academics
      </button>
      <button
        className={activeTab === "attendance" ? "active" : ""}
        onClick={() => setActiveTab("attendance")}
      >
        <FiCalendar /> Attendance
      </button>
      <button
        className={activeTab === "documents" ? "active" : ""}
        onClick={() => setActiveTab("documents")}
      >
        <FiFileText /> Documents
      </button>
    </div>
  );
};

export default StudentTabs;
