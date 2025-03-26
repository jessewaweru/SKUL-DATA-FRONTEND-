import { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import "../styles/ProfileDropdown.css";

const ProfileDropdown = () => {
  const [open, setOpen] = useState(false);
  const { user, handleLogout } = useContext(UserContext);
  const navigate = useNavigate();

  const onLogout = () => {
    const route = handleLogout();
    navigate(route);
  };

  return (
    <div className="profile-dropdown">
      <div className="profile-icon-" onClick={() => setOpen(!open)}>
        <img src="/public/images/profile-icon.png" alt="profile-icon" />
      </div>

      {open ? (
        <div className="dropdown-menu">
          <p>
            {user.firstname}
            {user.lastname}
          </p>
          <p className="user-role">{user.role}</p>
          <hr />

          <button onClick={() => navigate("/profile")}>My Account</button>
          <button onClick={() => navigate("/billing")}>
            Billing and Payments
          </button>
          <button className="logout" onClick={onLogout}>
            Log Out
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default ProfileDropdown;
