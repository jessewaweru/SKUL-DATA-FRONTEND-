import { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import "../styles/ProfileDropdown.css";
import { FaUser } from "react-icons/fa";

const ProfileDropdown = () => {
  const [open, setOpen] = useState(false);
  const { user, handleLogout } = useContext(UserContext);
  const navigate = useNavigate();

  const onLogout = () => {
    const route = handleLogout();
    navigate(route);
  };

  return (
    <div className="profile-dropdown-profile">
      <div className="profile-icon-" onClick={() => setOpen(!open)}>
        <FaUser size={24} />
      </div>

      {open && (
        <div className="dropdown-menu">
          {user ? (
            <>
              <p className="user-name">
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
            </>
          ) : (
            <>
              <button onClick={() => navigate("/login")}>Login</button>
              <button onClick={() => navigate("/login")}>Register</button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
