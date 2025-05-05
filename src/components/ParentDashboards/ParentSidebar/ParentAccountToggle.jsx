import "../ParentSidebar/parentsidebar.css";
import { FiChevronDown } from "react-icons/fi";

const ParentAccountToggle = () => {
  return (
    <div className="parent-account-section">
      <button className="parent-account-button">
        <img
          src="https://api.dicebear.com/9.x/personas/svg"
          alt="avatar"
          className="parent-avatar"
        />
        <div className="parent-user-info">
          <span className="parent-username">Jane Doe</span>
          <span className="parent-email">parent@example.com</span>
        </div>
        <FiChevronDown className="parent-chevron-down" />
      </button>
    </div>
  );
};

export default ParentAccountToggle;
