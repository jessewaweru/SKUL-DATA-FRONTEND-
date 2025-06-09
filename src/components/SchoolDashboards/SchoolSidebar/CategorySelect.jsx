import {
  FiHome,
  FiUsers,
  FiFileText,
  FiPieChart,
  FiBookOpen,
  FiUserPlus,
  FiGrid,
  FiBarChart2,
  FiCalendar,
  FiChevronRight,
  FiChevronDown,
  FiFolder,
  FiUpload,
  FiShare2,
  FiLayers,
  FiActivity,
} from "react-icons/fi";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const CategorySelect = () => {
  const [activeItem, setActiveItem] = useState("Dashboard");
  const [usersExpanded, setUsersExpanded] = useState(false);
  const [reportsExpanded, setReportsExpanded] = useState(false);
  const [documentsExpanded, setDocumentsExpanded] = useState(false);
  const [classesExpanded, setClassesExpanded] = useState(false);
  const [studentsExpanded, setStudentsExpanded] = useState(false);
  const [teachersExpanded, setTeachersExpanded] = useState(false);
  const [parentsExpanded, setParentsExpanded] = useState(false);
  const [analyticsExpanded, setAnalyticsExpanded] = useState(false);
  const [schedulerExpanded, setSchedulerExpanded] = useState(false);
  const [actionLogsExpanded, setActionLogsExpanded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleItemClick = (title) => {
    setActiveItem(title);

    if (title === "Dashboard") {
      closeAll();
      return navigate("/dashboard");
    }

    if (title === "Users") {
      setUsersExpanded(!usersExpanded);
      if (!usersExpanded) navigate("/dashboard/users");
      setReportsExpanded(false);
      setDocumentsExpanded(false);
      setClassesExpanded(false);
      setStudentsExpanded(false);
      setTeachersExpanded(false);
      setParentsExpanded(false);
      setAnalyticsExpanded(false);
      setSchedulerExpanded(false);
      setActionLogsExpanded(false);
      return;
    }

    if (title === "Reports") {
      setReportsExpanded(!reportsExpanded);
      if (!reportsExpanded) navigate("/dashboard/reports");
      setUsersExpanded(false);
      setDocumentsExpanded(false);
      setClassesExpanded(false);
      setStudentsExpanded(false);
      setTeachersExpanded(false);
      setParentsExpanded(false);
      setAnalyticsExpanded(false);
      setSchedulerExpanded(false);
      setActionLogsExpanded(false);
      return;
    }

    if (title === "Documents") {
      setDocumentsExpanded(!documentsExpanded);
      if (!documentsExpanded) navigate("/dashboard/documents");
      setUsersExpanded(false);
      setReportsExpanded(false);
      setClassesExpanded(false);
      setStudentsExpanded(false);
      setTeachersExpanded(false);
      setParentsExpanded(false);
      setAnalyticsExpanded(false);
      setSchedulerExpanded(false);
      setActionLogsExpanded(false);
      return;
    }

    if (title === "Classes") {
      setClassesExpanded(!classesExpanded);
      if (!classesExpanded) navigate("/dashboard/classes");
      setUsersExpanded(false);
      setReportsExpanded(false);
      setDocumentsExpanded(false);
      setStudentsExpanded(false);
      setTeachersExpanded(false);
      setParentsExpanded(false);
      setAnalyticsExpanded(false);
      setSchedulerExpanded(false);
      setActionLogsExpanded(false);
      return;
    }

    if (title === "Students") {
      setStudentsExpanded(!studentsExpanded);
      if (!studentsExpanded) navigate("/dashboard/students");
      setUsersExpanded(false);
      setReportsExpanded(false);
      setDocumentsExpanded(false);
      setClassesExpanded(false);
      setTeachersExpanded(false);
      setParentsExpanded(false);
      setAnalyticsExpanded(false);
      setSchedulerExpanded(false);
      setActionLogsExpanded(false);
      return;
    }

    if (title === "Teachers") {
      setTeachersExpanded(!teachersExpanded);
      if (!teachersExpanded) navigate("/dashboard/teachers");
      setUsersExpanded(false);
      setReportsExpanded(false);
      setDocumentsExpanded(false);
      setClassesExpanded(false);
      setStudentsExpanded(false);
      setParentsExpanded(false);
      setAnalyticsExpanded(false);
      setSchedulerExpanded(false);
      setActionLogsExpanded(false);
      return;
    }

    if (title === "Parents") {
      setParentsExpanded(!parentsExpanded);
      if (!parentsExpanded) navigate("/dashboard/parents");
      setUsersExpanded(false);
      setReportsExpanded(false);
      setDocumentsExpanded(false);
      setClassesExpanded(false);
      setStudentsExpanded(false);
      setTeachersExpanded(false);
      setAnalyticsExpanded(false);
      setSchedulerExpanded(false);
      setActionLogsExpanded(false);
      return;
    }

    if (title === "Analytics") {
      setAnalyticsExpanded(!analyticsExpanded);
      if (!analyticsExpanded) navigate("/dashboard/analytics");
      setUsersExpanded(false);
      setReportsExpanded(false);
      setDocumentsExpanded(false);
      setClassesExpanded(false);
      setStudentsExpanded(false);
      setTeachersExpanded(false);
      setParentsExpanded(false);
      setSchedulerExpanded(false);
      setActionLogsExpanded(false);
      return;
    }

    if (title === "Scheduler") {
      setSchedulerExpanded(!schedulerExpanded);
      if (!schedulerExpanded) navigate("/dashboard/scheduler");
      setUsersExpanded(false);
      setReportsExpanded(false);
      setDocumentsExpanded(false);
      setClassesExpanded(false);
      setStudentsExpanded(false);
      setTeachersExpanded(false);
      setParentsExpanded(false);
      setAnalyticsExpanded(false);
      setActionLogsExpanded(false);
      return;
    }

    if (title === "Action Logs") {
      setActionLogsExpanded(!actionLogsExpanded);
      if (!actionLogsExpanded) navigate("/dashboard/action-logs");
      setUsersExpanded(false);
      setReportsExpanded(false);
      setDocumentsExpanded(false);
      setClassesExpanded(false);
      setStudentsExpanded(false);
      setTeachersExpanded(false);
      setParentsExpanded(false);
      setAnalyticsExpanded(false);
      setSchedulerExpanded(false);
      return;
    }

    closeAll();
    navigate(`/dashboard/${title.toLowerCase()}`);
  };

  const closeAll = () => {
    setUsersExpanded(false);
    setReportsExpanded(false);
    setDocumentsExpanded(false);
    setClassesExpanded(false);
    setStudentsExpanded(false);
    setTeachersExpanded(false);
    setParentsExpanded(false);
    setAnalyticsExpanded(false);
    setSchedulerExpanded(false);
    setActionLogsExpanded(false);
  };

  const handleUserSubItemClick = (subItem) => {
    setActiveItem("Users");
    navigate(`/dashboard/users/${subItem}`);
  };

  const handleReportSubItemClick = (subItem) => {
    setActiveItem("Reports");
    navigate(`/dashboard/reports/${subItem}`);
  };

  const handleDocumentSubItemClick = (subItem) => {
    setActiveItem("Documents");
    navigate(`/dashboard/documents/${subItem}`);
  };

  const handleClassSubItemClick = (subItem) => {
    setActiveItem("Classes");
    navigate(`/dashboard/classes/${subItem}`);
  };

  const handleStudentSubItemClick = (subItem) => {
    setActiveItem("Students");
    navigate(`/dashboard/students/${subItem}`);
  };

  const handleTeacherSubItemClick = (subItem) => {
    setActiveItem("Teachers");
    navigate(`/dashboard/teachers/${subItem}`);
  };

  const handleParentSubItemClick = (subItem) => {
    setActiveItem("Parents");
    navigate(`/dashboard/parents/${subItem}`);
  };

  const handleAnalyticsSubItemClick = (subItem) => {
    setActiveItem("Analytics");
    navigate(`/dashboard/analytics/${subItem}`);
  };

  const handleSchedulerSubItemClick = (subItem) => {
    setActiveItem("Scheduler");
    navigate(`/dashboard/scheduler/${subItem}`);
  };
  const handleActionLogsSubItemClick = (subItem) => {
    setActiveItem("Action Logs");
    navigate(`/dashboard/action-logs/${subItem}`);
  };

  return (
    <div className="nav-list">
      <Route
        Icon={FiHome}
        selected={activeItem === "Dashboard"}
        title="Dashboard"
        onClick={() => handleItemClick("Dashboard")}
      />

      {/* Users Section */}
      <div
        className={`nav-item-container ${
          activeItem === "Users" ? "active" : ""
        }`}
      >
        <button
          className={`nav-item ${
            activeItem === "Users" ? "nav-item-selected" : "nav-item-default"
          }`}
          onClick={() => handleItemClick("Users")}
        >
          <FiUsers className={activeItem === "Users" ? "icon-selected" : ""} />
          <span>Users</span>
          {usersExpanded ? (
            <FiChevronDown className="chevron-icon" />
          ) : (
            <FiChevronRight className="chevron-icon" />
          )}
        </button>
        {usersExpanded && (
          <div className="sub-nav-list">
            <SubRoute
              title="Accounts"
              onClick={() => handleUserSubItemClick("accounts")}
              isActive={location.pathname.includes("/users/accounts")}
            />
            <SubRoute
              title="Roles & Permissions"
              onClick={() => handleUserSubItemClick("roles")}
              isActive={location.pathname.includes("/users/roles")}
            />
            <SubRoute
              title="Active Sessions"
              onClick={() => handleUserSubItemClick("sessions")}
              isActive={location.pathname.includes("/users/sessions")}
            />
          </div>
        )}
      </div>

      {/* Documents Section */}
      <div
        className={`nav-item-container ${
          activeItem === "Documents" ? "active" : ""
        }`}
      >
        <button
          className={`nav-item ${
            activeItem === "Documents"
              ? "nav-item-selected"
              : "nav-item-default"
          }`}
          onClick={() => handleItemClick("Documents")}
        >
          <FiFileText
            className={activeItem === "Documents" ? "icon-selected" : ""}
          />
          <span>Documents</span>
          {documentsExpanded ? (
            <FiChevronDown className="chevron-icon" />
          ) : (
            <FiChevronRight className="chevron-icon" />
          )}
        </button>
        {documentsExpanded && (
          <div className="sub-nav-list">
            <SubRoute
              Icon={FiFolder}
              title="All Documents"
              onClick={() => handleDocumentSubItemClick("")}
              isActive={location.pathname === "/dashboard/documents"}
            />
            <SubRoute
              Icon={FiUpload}
              title="Uploads"
              onClick={() => handleDocumentSubItemClick("uploads")}
              isActive={location.pathname.includes("/documents/uploads")}
            />
            <SubRoute
              Icon={FiShare2}
              title="Shared"
              onClick={() => handleDocumentSubItemClick("shared")}
              isActive={location.pathname.includes("/documents/shared")}
            />
            <SubRoute
              Icon={FiLayers}
              title="Categories"
              onClick={() => handleDocumentSubItemClick("categories")}
              isActive={location.pathname.includes("/documents/categories")}
            />
            <SubRoute
              Icon={FiFileText}
              title="Templates"
              onClick={() => handleDocumentSubItemClick("templates")}
              isActive={location.pathname.includes("/documents/templates")}
            />
          </div>
        )}
      </div>

      {/* Reports Section */}
      <div
        className={`nav-item-container ${
          activeItem === "Reports" ? "active" : ""
        }`}
      >
        <button
          className={`nav-item ${
            activeItem === "Reports" ? "nav-item-selected" : "nav-item-default"
          }`}
          onClick={() => handleItemClick("Reports")}
        >
          <FiPieChart
            className={activeItem === "Reports" ? "icon-selected" : ""}
          />
          <span>Reports</span>
          {reportsExpanded ? (
            <FiChevronDown className="chevron-icon" />
          ) : (
            <FiChevronRight className="chevron-icon" />
          )}
        </button>
        {reportsExpanded && (
          <div className="sub-nav-list">
            <SubRoute
              title="Overview"
              onClick={() => handleReportSubItemClick("")}
              isActive={location.pathname === "/dashboard/reports"}
            />
            <SubRoute
              title="Templates"
              onClick={() => handleReportSubItemClick("templates")}
              isActive={location.pathname.includes("/reports/templates")}
            />
            <SubRoute
              title="Scheduler"
              onClick={() => handleReportSubItemClick("scheduler")}
              isActive={location.pathname.includes("/reports/scheduler")}
            />
            <SubRoute
              title="Report Builder"
              onClick={() => handleReportSubItemClick("builder")}
              isActive={location.pathname.includes("/reports/builder")}
            />
            <SubRoute
              title="Analytics"
              onClick={() => handleReportSubItemClick("analytics")}
              isActive={location.pathname.includes("/reports/analytics")}
            />
            <SubRoute
              title="My Requests"
              onClick={() => handleReportSubItemClick("requests")}
              isActive={location.pathname.includes("/reports/requests")}
            />
          </div>
        )}
      </div>

      {/* Classes Section */}
      <div
        className={`nav-item-container ${
          activeItem === "Classes" ? "active" : ""
        }`}
      >
        <button
          className={`nav-item ${
            activeItem === "Classes" ? "nav-item-selected" : "nav-item-default"
          }`}
          onClick={() => handleItemClick("Classes")}
        >
          <FiGrid className={activeItem === "Classes" ? "icon-selected" : ""} />
          <span>Classes</span>
          {classesExpanded ? (
            <FiChevronDown className="chevron-icon" />
          ) : (
            <FiChevronRight className="chevron-icon" />
          )}
        </button>
        {classesExpanded && (
          <div className="sub-nav-list">
            <SubRoute
              title="Overview"
              onClick={() => handleClassSubItemClick("")}
              isActive={location.pathname === "/dashboard/classes"}
            />
            <SubRoute
              title="Manage Classes"
              onClick={() => handleClassSubItemClick("manage")}
              isActive={location.pathname.includes("/classes/manage")}
            />
            <SubRoute
              title="Streams"
              onClick={() => handleClassSubItemClick("streams")}
              isActive={location.pathname.includes("/classes/streams")}
            />
            <SubRoute
              title="Attendance"
              onClick={() => handleClassSubItemClick("attendance")}
              isActive={location.pathname.includes("/classes/attendance")}
            />
            <SubRoute
              title="Documents"
              onClick={() => handleClassSubItemClick("documents")}
              isActive={location.pathname.includes("/classes/documents")}
            />
            <SubRoute
              title="Timetables"
              onClick={() => handleClassSubItemClick("timetables")}
              isActive={location.pathname.includes("/classes/timetables")}
            />
            <SubRoute
              title="Analytics"
              onClick={() => handleClassSubItemClick("analytics")}
              isActive={location.pathname.includes("/classes/analytics")}
            />
          </div>
        )}
      </div>

      {/* Students Section */}
      <div
        className={`nav-item-container ${
          activeItem === "Students" ? "active" : ""
        }`}
      >
        <button
          className={`nav-item ${
            activeItem === "Students" ? "nav-item-selected" : "nav-item-default"
          }`}
          onClick={() => handleItemClick("Students")}
        >
          <FiUserPlus
            className={activeItem === "Students" ? "icon-selected" : ""}
          />
          <span>Students</span>
          {studentsExpanded ? (
            <FiChevronDown className="chevron-icon" />
          ) : (
            <FiChevronRight className="chevron-icon" />
          )}
        </button>
        {studentsExpanded && (
          <div className="sub-nav-list">
            <SubRoute
              title="Directory"
              onClick={() => handleStudentSubItemClick("directory")}
              isActive={location.pathname.includes("/students/directory")}
            />
            <SubRoute
              title="Create New"
              onClick={() => handleStudentSubItemClick("create")}
              isActive={location.pathname.includes("/students/create")}
            />
            <SubRoute
              title="Analytics"
              onClick={() => handleStudentSubItemClick("analytics")}
              isActive={location.pathname.includes("/students/analytics")}
            />
          </div>
        )}
      </div>

      {/* Teachers Section */}
      <div
        className={`nav-item-container ${
          activeItem === "Teachers" ? "active" : ""
        }`}
      >
        <button
          className={`nav-item ${
            activeItem === "Teachers" ? "nav-item-selected" : "nav-item-default"
          }`}
          onClick={() => handleItemClick("Teachers")}
        >
          <FiBookOpen
            className={activeItem === "Teachers" ? "icon-selected" : ""}
          />
          <span>Teachers</span>
          {teachersExpanded ? (
            <FiChevronDown className="chevron-icon" />
          ) : (
            <FiChevronRight className="chevron-icon" />
          )}
        </button>
        {teachersExpanded && (
          <div className="sub-nav-list">
            <SubRoute
              title="Overview"
              onClick={() => handleTeacherSubItemClick("")}
              isActive={location.pathname === "/dashboard/teachers"}
            />
            <SubRoute
              title="Profiles"
              onClick={() => handleTeacherSubItemClick("profiles")}
              isActive={location.pathname.includes("/teachers/profiles")}
            />
            <SubRoute
              title="Reports"
              onClick={() => handleTeacherSubItemClick("reports")}
              isActive={location.pathname.includes("/teachers/reports")}
            />
            <SubRoute
              title="Documents"
              onClick={() => handleTeacherSubItemClick("documents")}
              isActive={location.pathname.includes("/teachers/documents")}
            />
            <SubRoute
              title="Activity Logs"
              onClick={() => handleTeacherSubItemClick("activity-logs")}
              isActive={location.pathname.includes("/teachers/activity-logs")}
            />
          </div>
        )}
      </div>

      {/* Parents Section */}
      <div
        className={`nav-item-container ${
          activeItem === "Parents" ? "active" : ""
        }`}
      >
        <button
          className={`nav-item ${
            activeItem === "Parents" ? "nav-item-selected" : "nav-item-default"
          }`}
          onClick={() => handleItemClick("Parents")}
        >
          <FiUsers
            className={activeItem === "Parents" ? "icon-selected" : ""}
          />
          <span>Parents</span>
          {parentsExpanded ? (
            <FiChevronDown className="chevron-icon" />
          ) : (
            <FiChevronRight className="chevron-icon" />
          )}
        </button>
        {parentsExpanded && (
          <div className="sub-nav-list">
            <SubRoute
              title="All Parents"
              onClick={() => handleParentSubItemClick("")}
              isActive={location.pathname === "/dashboard/parents"}
            />
            <SubRoute
              title="Create New"
              onClick={() => handleParentSubItemClick("create")}
              isActive={location.pathname.includes("/parents/create")}
            />
            <SubRoute
              title="Bulk Import"
              onClick={() => handleParentSubItemClick("bulk-import")}
              isActive={location.pathname.includes("/parents/bulk-import")}
            />
            <SubRoute
              title="Reports Access"
              onClick={() => handleParentSubItemClick("reports-access")}
              isActive={location.pathname.includes("/parents/reports-access")}
            />
            <SubRoute
              title="Messages"
              onClick={() => handleParentSubItemClick("messages")}
              isActive={location.pathname.includes("/parents/messages")}
            />
          </div>
        )}
      </div>

      {/* Analytics Section */}
      <div
        className={`nav-item-container ${
          activeItem === "Analytics" ? "active" : ""
        }`}
      >
        <button
          className={`nav-item ${
            activeItem === "Analytics"
              ? "nav-item-selected"
              : "nav-item-default"
          }`}
          onClick={() => handleItemClick("Analytics")}
        >
          <FiBarChart2
            className={activeItem === "Analytics" ? "icon-selected" : ""}
          />
          <span>Analytics</span>
          {analyticsExpanded ? (
            <FiChevronDown className="chevron-icon" />
          ) : (
            <FiChevronRight className="chevron-icon" />
          )}
        </button>
        {analyticsExpanded && (
          <div className="sub-nav-list">
            <SubRoute
              title="Overview"
              onClick={() => handleAnalyticsSubItemClick("")}
              isActive={location.pathname === "/dashboard/analytics"}
            />
            <SubRoute
              title="Teachers"
              onClick={() => handleAnalyticsSubItemClick("teachers")}
              isActive={location.pathname.includes("/analytics/teachers")}
            />
            <SubRoute
              title="Students"
              onClick={() => handleAnalyticsSubItemClick("students")}
              isActive={location.pathname.includes("/analytics/students")}
            />
            <SubRoute
              title="Classes"
              onClick={() => handleAnalyticsSubItemClick("classes")}
              isActive={location.pathname.includes("/analytics/classes")}
            />
            <SubRoute
              title="Documents"
              onClick={() => handleAnalyticsSubItemClick("documents")}
              isActive={location.pathname.includes("/analytics/documents")}
            />
            <SubRoute
              title="Reports"
              onClick={() => handleAnalyticsSubItemClick("reports")}
              isActive={location.pathname.includes("/analytics/reports")}
            />
            <SubRoute
              title="Parents"
              onClick={() => handleAnalyticsSubItemClick("parents")}
              isActive={location.pathname.includes("/analytics/parents")}
            />
            <SubRoute
              title="School Wide"
              onClick={() => handleAnalyticsSubItemClick("school-wide")}
              isActive={location.pathname.includes("/analytics/school-wide")}
            />
            <SubRoute
              title="Custom Builder"
              onClick={() => handleAnalyticsSubItemClick("builder")}
              isActive={location.pathname.includes("/analytics/builder")}
            />
          </div>
        )}
      </div>

      {/* Scheduler Section */}
      <div
        className={`nav-item-container ${
          activeItem === "Scheduler" ? "active" : ""
        }`}
      >
        <button
          className={`nav-item ${
            activeItem === "Scheduler"
              ? "nav-item-selected"
              : "nav-item-default"
          }`}
          onClick={() => handleItemClick("Scheduler")}
        >
          <FiCalendar
            className={activeItem === "Scheduler" ? "icon-selected" : ""}
          />
          <span>Scheduler</span>
          {schedulerExpanded ? (
            <FiChevronDown className="chevron-icon" />
          ) : (
            <FiChevronRight className="chevron-icon" />
          )}
        </button>
        {schedulerExpanded && (
          <div className="sub-nav-list">
            <SubRoute
              title="Calendar"
              onClick={() => handleSchedulerSubItemClick("")}
              isActive={location.pathname === "/dashboard/scheduler"}
            />
            <SubRoute
              title="Events"
              onClick={() => handleSchedulerSubItemClick("events")}
              isActive={location.pathname.includes("/scheduler/events")}
            />
            <SubRoute
              title="Templates"
              onClick={() => handleSchedulerSubItemClick("templates")}
              isActive={location.pathname.includes("/scheduler/templates")}
            />
          </div>
        )}
      </div>

      {/* Action Logs Section - Fixed alignment */}
      <div
        className={`nav-item-container ${
          activeItem === "Action Logs" ? "active" : ""
        }`}
      >
        <button
          className={`nav-item ${
            activeItem === "Action Logs"
              ? "nav-item-selected"
              : "nav-item-default"
          }`}
          onClick={() => handleItemClick("Action Logs")}
        >
          <FiActivity
            className={activeItem === "Action Logs" ? "icon-selected" : ""}
          />
          <span>Action Logs</span>
          {actionLogsExpanded ? (
            <FiChevronDown className="chevron-icon" />
          ) : (
            <FiChevronRight className="chevron-icon" />
          )}
        </button>
        {actionLogsExpanded && (
          <div className="sub-nav-list">
            <SubRoute
              title="All Activities"
              onClick={() => handleActionLogsSubItemClick("")}
              isActive={location.pathname === "/dashboard/action-logs"}
            />
            <SubRoute
              title="User Activities"
              onClick={() => handleActionLogsSubItemClick("users")}
              isActive={location.pathname.includes("/action-logs/users")}
            />
            <SubRoute
              title="Document Changes"
              onClick={() => handleActionLogsSubItemClick("documents")}
              isActive={location.pathname.includes("/action-logs/documents")}
            />
            <SubRoute
              title="System Events"
              onClick={() => handleActionLogsSubItemClick("system")}
              isActive={location.pathname.includes("/action-logs/system")}
            />
          </div>
        )}
      </div>
    </div>
  );
};

// Route for main items
const Route = ({ Icon, selected, title, onClick }) => (
  <button
    className={`nav-item ${
      selected ? "nav-item-selected" : "nav-item-default"
    }`}
    onClick={onClick}
  >
    {Icon && <Icon className={selected ? "icon-selected" : ""} />}
    <span>{title}</span>
  </button>
);

// Enhanced SubRoute with icon support
const SubRoute = ({ Icon, title, onClick, isActive }) => (
  <button
    className={`sub-nav-item ${
      isActive ? "sub-nav-item-selected" : "sub-nav-item-default"
    }`}
    onClick={onClick}
  >
    {Icon && <Icon className="sub-nav-icon" />}
    <span>{title}</span>
  </button>
);

export default CategorySelect;
