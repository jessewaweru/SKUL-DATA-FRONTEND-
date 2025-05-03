import { FiCalendar } from "react-icons/fi";
import "../TeacherDashboardSection/teacherdashboard.css";

const TeacherTopBar = () => {
  return (
    <header className="teacher-topbar">
      <div className="teacher-topbar-content">
        <div className="teacher-greeting-container">
          <span className="teacher-greeting-text">
            👋 Good morning, Mr. Teacher
          </span>
          <span className="teacher-date-text">Tuesday, Aug 8th 2023</span>
        </div>

        <button className="teacher-calendar-button">
          <FiCalendar />
          <span>This Term</span>
        </button>
      </div>
    </header>
  );
};

export default TeacherTopBar;
