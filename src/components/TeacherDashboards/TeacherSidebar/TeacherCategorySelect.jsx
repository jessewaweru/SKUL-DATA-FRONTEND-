import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FiHome,
  FiUsers,
  FiFileText,
  FiBookOpen,
  FiMessageSquare,
  FiBell,
  FiCalendar,
  FiUser,
  FiSettings,
} from "react-icons/fi";
import "../TeacherSidebar/teachersidebar.css";

const TeacherCategorySelect = () => {
  const [activeItem, setActiveItem] = useState("Dashboard");
  const navigate = useNavigate();
  const location = useLocation();

  const handleItemClick = (title) => {
    setActiveItem(title);
    navigate(`/teacher-dashboard/${title.toLowerCase().replace(" ", "-")}`);
  };

  return (
    <div className="teacher-nav-list">
      <TeacherRoute
        Icon={FiHome}
        selected={activeItem === "Dashboard"}
        title="Dashboard"
        onClick={() => handleItemClick("Dashboard")}
      />
      <TeacherRoute
        Icon={FiUsers}
        selected={activeItem === "My Students"}
        title="My Students"
        onClick={() => handleItemClick("My Students")}
      />
      <TeacherRoute
        Icon={FiFileText}
        selected={activeItem === "My Reports"}
        title="My Reports"
        onClick={() => handleItemClick("My Reports")}
      />
      <TeacherRoute
        Icon={FiBookOpen}
        selected={activeItem === "Class Documents"}
        title="Class Documents"
        onClick={() => handleItemClick("Class Documents")}
      />
      <TeacherRoute
        Icon={FiMessageSquare}
        selected={activeItem === "Messages"}
        title="Messages"
        onClick={() => handleItemClick("Messages")}
      />
      <TeacherRoute
        Icon={FiBell}
        selected={activeItem === "Notifications"}
        title="Notifications"
        onClick={() => handleItemClick("Notifications")}
      />
      <TeacherRoute
        Icon={FiCalendar}
        selected={activeItem === "Calendar"}
        title="Calendar"
        onClick={() => handleItemClick("Calendar")}
      />
      <TeacherRoute
        Icon={FiUser}
        selected={activeItem === "Profile"}
        title="Profile"
        onClick={() => handleItemClick("Profile")}
      />
      <TeacherRoute
        Icon={FiSettings}
        selected={activeItem === "Settings"}
        title="Settings"
        onClick={() => handleItemClick("Settings")}
      />
    </div>
  );
};

const TeacherRoute = ({ Icon, selected, title, onClick }) => (
  <button
    className={`teacher-nav-item ${
      selected ? "teacher-nav-item-selected" : "teacher-nav-item-default"
    }`}
    onClick={onClick}
  >
    {Icon && <Icon className={selected ? "teacher-icon-selected" : ""} />}
    <span>{title}</span>
  </button>
);

export default TeacherCategorySelect;
