import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FiUser,
  FiLock,
  FiCreditCard,
  FiMail,
  FiBell,
  FiSettings,
} from "react-icons/fi";
import "../AccountProfile/accountprofile.css";

const AccountSidebar = () => {
  const [activeItem, setActiveItem] = useState("Profile");
  const navigate = useNavigate();
  const location = useLocation();

  const handleItemClick = (title) => {
    setActiveItem(title);
    navigate(`/account/${title.toLowerCase()}`);
  };

  return (
    <div className="nav-list">
      <Route
        Icon={FiUser}
        selected={activeItem === "Profile"}
        title="Profile"
        onClick={() => handleItemClick("Profile")}
      />
      <Route
        Icon={FiLock}
        selected={activeItem === "Security"}
        title="Security"
        onClick={() => handleItemClick("Security")}
      />
      <Route
        Icon={FiCreditCard}
        selected={activeItem === "Subscription"}
        title="Subscription"
        onClick={() => handleItemClick("Subscription")}
      />
      <Route
        Icon={FiMail}
        selected={activeItem === "Messages"}
        title="Messages"
        onClick={() => handleItemClick("Messages")}
      />
      <Route
        Icon={FiBell}
        selected={activeItem === "Notifications"}
        title="Notifications"
        onClick={() => handleItemClick("Notifications")}
      />
      <Route
        Icon={FiSettings}
        selected={activeItem === "Settings"}
        title="Settings"
        onClick={() => handleItemClick("Settings")}
      />
    </div>
  );
};

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

export default AccountSidebar;
