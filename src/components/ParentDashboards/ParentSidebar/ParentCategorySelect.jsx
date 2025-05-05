import "../ParentSidebar/parentsidebar.css";
import { useState } from "react";
import {
  FiFileText,
  FiBell,
  FiMail,
  FiFolder,
  FiUser,
  FiSettings,
  FiHome,
  FiUsers,
  FiTrendingUp,
  FiCalendar,
  FiChevronDown,
  FiChevronRight,
} from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";

const ParentCategorySelect = () => {
  const [activeItem, setActiveItem] = useState("Dashboard");
  const [childrenExpanded, setChildrenExpanded] = useState(false);
  const [reportsExpanded, setReportsExpanded] = useState(false);
  const [performanceExpanded, setPerformanceExpanded] = useState(false);
  const [calendarExpanded, setCalendarExpanded] = useState(false);
  const [messagesExpanded, setMessagesExpanded] = useState(false);
  const [notificationsExpanded, setNotificationsExpanded] = useState(false);
  const [documentsExpanded, setDocumentsExpanded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleItemClick = (title) => {
    setActiveItem(title);

    if (title === "Dashboard") {
      closeAll();
      return navigate("/parent/dashboard");
    }

    if (title === "My Children") {
      setChildrenExpanded(!childrenExpanded);
      if (!childrenExpanded) navigate("/parent/children");
      return;
    }

    if (title === "Reports") {
      setReportsExpanded(!reportsExpanded);
      if (!reportsExpanded) navigate("/parent/reports");
      return;
    }

    if (title === "Performance") {
      setPerformanceExpanded(!performanceExpanded);
      if (!performanceExpanded) navigate("/parent/performance");
      return;
    }

    if (title === "Calendar") {
      setCalendarExpanded(!calendarExpanded);
      if (!calendarExpanded) navigate("/parent/calendar");
      return;
    }

    if (title === "Messages") {
      setMessagesExpanded(!messagesExpanded);
      if (!messagesExpanded) navigate("/parent/messages");
      return;
    }

    if (title === "Notifications") {
      setNotificationsExpanded(!notificationsExpanded);
      if (!notificationsExpanded) navigate("/parent/notifications");
      return;
    }

    if (title === "Documents") {
      setDocumentsExpanded(!documentsExpanded);
      if (!documentsExpanded) navigate("/parent/documents");
      return;
    }

    if (title === "Profile") {
      closeAll();
      navigate("/parent/profile");
      return;
    }

    if (title === "Settings") {
      closeAll();
      navigate("/parent/settings");
      return;
    }
  };

  const closeAll = () => {
    setChildrenExpanded(false);
    setReportsExpanded(false);
    setPerformanceExpanded(false);
    setCalendarExpanded(false);
    setMessagesExpanded(false);
    setNotificationsExpanded(false);
    setDocumentsExpanded(false);
  };

  return (
    <div className="parent-nav-list">
      <ParentRoute
        Icon={FiHome}
        selected={activeItem === "Dashboard"}
        title="Dashboard"
        onClick={() => handleItemClick("Dashboard")}
      />

      <div
        className={`parent-nav-item-container ${
          activeItem === "My Children" ? "active" : ""
        }`}
      >
        <button
          className={`parent-nav-item ${
            activeItem === "My Children"
              ? "parent-nav-item-selected"
              : "parent-nav-item-default"
          }`}
          onClick={() => handleItemClick("My Children")}
        >
          <FiUsers
            className={
              activeItem === "My Children" ? "parent-icon-selected" : ""
            }
          />
          <span>My Children</span>
          {childrenExpanded ? (
            <FiChevronDown className="parent-chevron-icon" />
          ) : (
            <FiChevronRight className="parent-chevron-icon" />
          )}
        </button>
        {childrenExpanded && (
          <div className="parent-sub-nav-list">
            <ParentSubRoute
              title="All Children"
              onClick={() => navigate("/parent/children")}
              isActive={location.pathname === "/parent/children"}
            />
            <ParentSubRoute
              title="John Doe (Grade 5)"
              onClick={() => navigate("/parent/children/john")}
              isActive={location.pathname.includes("/children/john")}
            />
            <ParentSubRoute
              title="Jane Doe (Grade 3)"
              onClick={() => navigate("/parent/children/jane")}
              isActive={location.pathname.includes("/children/jane")}
            />
          </div>
        )}
      </div>

      <ParentRoute
        Icon={FiFileText}
        selected={activeItem === "Reports"}
        title="Reports"
        onClick={() => handleItemClick("Reports")}
      />

      <ParentRoute
        Icon={FiTrendingUp}
        selected={activeItem === "Performance"}
        title="Performance"
        onClick={() => handleItemClick("Performance")}
      />

      <div
        className={`parent-nav-item-container ${
          activeItem === "Calendar" ? "active" : ""
        }`}
      >
        <button
          className={`parent-nav-item ${
            activeItem === "Calendar"
              ? "parent-nav-item-selected"
              : "parent-nav-item-default"
          }`}
          onClick={() => handleItemClick("Calendar")}
        >
          <FiCalendar
            className={activeItem === "Calendar" ? "parent-icon-selected" : ""}
          />
          <span>Calendar</span>
          {calendarExpanded ? (
            <FiChevronDown className="parent-chevron-icon" />
          ) : (
            <FiChevronRight className="parent-chevron-icon" />
          )}
        </button>
        {calendarExpanded && (
          <div className="parent-sub-nav-list">
            <ParentSubRoute
              title="School Events"
              onClick={() => navigate("/parent/calendar/events")}
              isActive={location.pathname.includes("/calendar/events")}
            />
            <ParentSubRoute
              title="PTA Meetings"
              onClick={() => navigate("/parent/calendar/meetings")}
              isActive={location.pathname.includes("/calendar/meetings")}
            />
            <ParentSubRoute
              title="Holidays"
              onClick={() => navigate("/parent/calendar/holidays")}
              isActive={location.pathname.includes("/calendar/holidays")}
            />
          </div>
        )}
      </div>

      <ParentRoute
        Icon={FiMail}
        selected={activeItem === "Messages"}
        title="Messages"
        onClick={() => handleItemClick("Messages")}
      />

      <ParentRoute
        Icon={FiBell}
        selected={activeItem === "Notifications"}
        title="Notifications"
        onClick={() => handleItemClick("Notifications")}
      />

      <ParentRoute
        Icon={FiFolder}
        selected={activeItem === "Documents"}
        title="Documents"
        onClick={() => handleItemClick("Documents")}
      />

      <ParentRoute
        Icon={FiUser}
        selected={activeItem === "Profile"}
        title="Profile"
        onClick={() => handleItemClick("Profile")}
      />

      <ParentRoute
        Icon={FiSettings}
        selected={activeItem === "Settings"}
        title="Settings"
        onClick={() => handleItemClick("Settings")}
      />
    </div>
  );
};

const ParentRoute = ({ Icon, selected, title, onClick }) => (
  <button
    className={`parent-nav-item ${
      selected ? "parent-nav-item-selected" : "parent-nav-item-default"
    }`}
    onClick={onClick}
  >
    {Icon && <Icon className={selected ? "parent-icon-selected" : ""} />}
    <span>{title}</span>
  </button>
);

const ParentSubRoute = ({ title, onClick, isActive }) => (
  <button
    className={`parent-sub-nav-item ${
      isActive ? "parent-sub-nav-item-selected" : "parent-sub-nav-item-default"
    }`}
    onClick={onClick}
  >
    <span>{title}</span>
  </button>
);

export default ParentCategorySelect;
