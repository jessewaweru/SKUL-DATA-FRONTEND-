import { useEffect, useState } from "react";
import "../Navbar/navbar.css";
import { Link } from "react-router-dom";
import logo from "../../assets/logo1.svg";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [seeDropdown, setSeeDropdown] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Set scrolled state for style changes - activate immediately on any scroll
      if (window.scrollY > 5) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Close dropdown when clicking anywhere outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (seeDropdown) {
        setSeeDropdown(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [seeDropdown]);

  const handleDropdownClick = (e) => {
    e.stopPropagation(); // Prevent the outside click handler from closing immediately
    setSeeDropdown(!seeDropdown);
  };

  return (
    <div className={`nav-container ${scrolled ? "scrolled" : ""}`}>
      <div className="nav">
        <div className="nav-left">
          <div className="nav-logo-img">
            <Link
              to="/"
              onClick={() => {
                if (window.location.pathname === "/") {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
            >
              <img src={logo} alt="Skul-Data Logo" />
            </Link>
          </div>
          <ul className="nav-menu">
            <li>Explore</li>
            <li
              className={`dropdown-parent ${seeDropdown ? "active" : ""}`}
              onClick={handleDropdownClick}
            >
              Solutions
              <span
                className="dropdown-arrow"
                onClick={() => {
                  setSeeDropdown(!seeDropdown);
                }}
              >
                ▼
              </span>
              {seeDropdown && (
                <ul className="dropdown-menu">
                  <li>Data Infalstructure</li>
                  <li>Data Integration</li>
                  <li>Peer to Peer Report Generation</li>
                </ul>
              )}
            </li>
            <li>Pricing</li>
            <Link to="/contact">
              <li className="nav-contact-button">Contact Us</li>
            </Link>
          </ul>
        </div>
        <div className="nav-right">
          <div className="auth-buttons">
            <Link to="/register" className="auth-btn signup-btn">
              SignUp
            </Link>
            <Link to="/login" className="auth-btn login-btn">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
