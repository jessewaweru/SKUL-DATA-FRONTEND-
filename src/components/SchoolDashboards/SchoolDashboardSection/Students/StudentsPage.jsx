// components/SchoolDashboard/Students/StudentsPage.jsx
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { FiUsers, FiBarChart2, FiPlus } from "react-icons/fi";
import "../Students/students.css";

const StudentsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname.includes(path);

  return (
    <div className="students-container">
      <div className="students-sidebar">
        <button
          className={`sidebar-button ${
            isActive("students/directory") ? "active" : ""
          }`}
          onClick={() => navigate("directory")}
        >
          <FiUsers /> Student Directory
        </button>
        <button
          className={`sidebar-button ${
            isActive("students/analytics") ? "active" : ""
          }`}
          onClick={() => navigate("analytics")}
        >
          <FiBarChart2 /> Analytics
        </button>
        <button
          className={`sidebar-button ${
            isActive("students/create") ? "active" : ""
          }`}
          onClick={() => navigate("create")}
        >
          <FiPlus /> Add New Student
        </button>
      </div>
      <div className="students-content">
        <Outlet />
      </div>
    </div>
  );
};

export default StudentsPage;
