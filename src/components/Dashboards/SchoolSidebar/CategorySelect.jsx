import {
  FiHome,
  FiUsers,
  FiFileText,
  FiPieChart,
  FiBookOpen,
  FiUser,
  FiUserPlus,
  FiGrid,
  FiBarChart2,
  FiCalendar,
  FiChevronRight,
  FiChevronDown,
} from "react-icons/fi";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// const CategorySelect = () => {
//   const [activeItem, setActiveItem] = useState("Dashboard");
//   const navigate = useNavigate();

//   const handleItemClick = (title) => {
//     setActiveItem(title);
//   };
//   return (
//     <div className="nav-list">
//       <Route
//         Icon={FiHome}
//         selected={true}
//         title="Dashboard"
//         onClick={() => handleItemClick("Dashboard")}
//       />
//       <Route
//         Icon={FiUsers}
//         selected={false}
//         title="Users"
//         onClick={() => handleItemClick("Users")}
//       />
//       <Route
//         Icon={FiFileText}
//         selected={false}
//         title="Documents"
//         onClick={() => handleItemClick("Documents")}
//       />
//       <Route
//         Icon={FiPieChart}
//         selected={false}
//         title="Reports"
//         onClick={() => handleItemClick("Reports")}
//       />
//       <Route
//         Icon={FiBookOpen}
//         selected={false}
//         title="Teachers"
//         onClick={() => handleItemClick("Teachers")}
//       />
//       <Route
//         Icon={FiUser}
//         selected={false}
//         title="Parents"
//         onClick={() => handleItemClick("Parents")}
//       />
//       <Route
//         Icon={FiUserPlus}
//         selected={false}
//         title="Students"
//         onClick={() => handleItemClick("Students")}
//       />
//       <Route
//         Icon={FiGrid}
//         selected={false}
//         title="Classes"
//         onClick={() => handleItemClick("Classes")}
//       />
//       <Route
//         Icon={FiBarChart2}
//         selected={false}
//         title="Analytics"
//         onClick={() => handleItemClick("Analytics")}
//       />
//       <Route
//         Icon={FiCalendar}
//         selected={false}
//         title="Calender"
//         onClick={() => handleItemClick("Calender")}
//       />
//     </div>
//   );
// };

// export default CategorySelect;

// const Route = ({ Icon, selected, title }) => {
//   return (
//     <button
//       className={`nav-item ${
//         selected ? "nav-item-selected" : "nav-item-default"
//       }`}
//     >
//       {Icon && <Icon className={selected ? "icon-selected" : ""} />}
//       <span>{title}</span>
//     </button>
//   );
// };

const CategorySelect = () => {
  const [activeItem, setActiveItem] = useState("Dashboard");
  const [usersExpanded, setUsersExpanded] = useState(false);
  const navigate = useNavigate();

  const handleItemClick = (title) => {
    if (title === "Users") {
      setUsersExpanded(!usersExpanded);
      if (!usersExpanded) {
        navigate("/dashboard/users");
      }
      return;
    }

    setActiveItem(title);
    setUsersExpanded(false);
    navigate(`/dashboard/${title.toLowerCase()}`);
  };

  const handleSubItemClick = (subItem) => {
    setActiveItem("Users");
    navigate(`/dashboard/users/${subItem}`);
  };

  return (
    <div className="nav-list">
      <Route
        Icon={FiHome}
        selected={activeItem === "Dashboard"}
        title="Dashboard"
        onClick={() => handleItemClick("Dashboard")}
      />

      {/* Users section with expandable sub-items */}
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
              onClick={() => handleSubItemClick("accounts")}
              isActive={location.pathname.includes("/accounts")}
            />
            <SubRoute
              title="Roles & Permissions"
              onClick={() => handleSubItemClick("roles")}
              isActive={location.pathname.includes("/roles")}
            />
            <SubRoute
              title="Active Sessions"
              onClick={() => handleSubItemClick("sessions")}
              isActive={location.pathname.includes("/sessions")}
            />
          </div>
        )}
      </div>

      {/* Other main menu items */}
      <Route
        Icon={FiFileText}
        selected={activeItem === "Documents"}
        title="Documents"
        onClick={() => handleItemClick("Documents")}
      />
      <Route
        Icon={FiPieChart}
        selected={false}
        title="Reports"
        onClick={() => handleItemClick("Reports")}
      />
      <Route
        Icon={FiBookOpen}
        selected={false}
        title="Teachers"
        onClick={() => handleItemClick("Teachers")}
      />
      <Route
        Icon={FiUser}
        selected={false}
        title="Parents"
        onClick={() => handleItemClick("Parents")}
      />
      <Route
        Icon={FiUserPlus}
        selected={false}
        title="Students"
        onClick={() => handleItemClick("Students")}
      />
      <Route
        Icon={FiGrid}
        selected={false}
        title="Classes"
        onClick={() => handleItemClick("Classes")}
      />
      <Route
        Icon={FiBarChart2}
        selected={false}
        title="Analytics"
        onClick={() => handleItemClick("Analytics")}
      />
      <Route
        Icon={FiCalendar}
        selected={false}
        title="Calender"
        onClick={() => handleItemClick("Calender")}
      />
    </div>
  );
};

const Route = ({ Icon, selected, title, onClick }) => {
  return (
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
};

const SubRoute = ({ title, onClick, isActive }) => {
  return (
    <button
      className={`sub-nav-item ${
        isActive ? "sub-nav-item-selected" : "sub-nav-item-default"
      }`}
      onClick={onClick}
    >
      <span>{title}</span>
    </button>
  );
};

export default CategorySelect;
