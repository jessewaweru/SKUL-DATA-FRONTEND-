import "../ParentDashboardSection/parentdashboard.css";
import { FiCalendar } from "react-icons/fi";

const ParentTopBar = () => {
  return (
    <div className="parent-topbar">
      <div className="parent-topbar-content">
        <div className="parent-greeting-container">
          <span className="parent-greeting-text">👋 Hello, Parent</span>
          <span className="parent-date-text">Tuesday, Aug 8th 2023</span>
        </div>

        <button className="parent-calendar-button">
          <FiCalendar />
          <span>This Term</span>
        </button>
      </div>
    </div>
  );
};

export default ParentTopBar;
