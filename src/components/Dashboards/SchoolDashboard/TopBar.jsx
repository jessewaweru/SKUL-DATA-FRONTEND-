import { FiCalendar } from "react-icons/fi";

const TopBar = () => {
  return (
    <div className="topbar">
      <div className="topbar-content">
        <div className="greeting-container">
          <span className="greeting-text">🚀 Good morning</span>
          <span className="date-text">Tuesday, Aug 8th 2023</span>
        </div>

        <button className="calendar-button">
          <FiCalendar />
          <span>Prev 6 Months</span>
        </button>
      </div>
    </div>
  );
};
export default TopBar;
