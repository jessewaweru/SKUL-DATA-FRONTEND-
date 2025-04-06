import { useEffect, useState } from "react";
import {
  FaUser,
  FaLock,
  FaEnvelope,
  FaSchool,
  FaMapMarkerAlt,
  FaChalkboardTeacher,
} from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/loginregister.css";

const LoginRegister = ({ mode = "login" }) => {
  const [action, setAction] = useState(mode === "register" ? "active" : "");

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (mode === "register") {
      setAction("active");
    } else {
      setAction("");
    }
  }, [mode, location.pathname]);

  const registerLink = () => {
    setAction("active");
    navigate("/register", { replace: true });
  };
  const loginLink = () => {
    setAction("");
    navigate("/login", { replace: true });
  };

  return (
    <div className={`wrapper ${action}`}>
      <div className="form-box login">
        <form action="">
          <h1>Login</h1>
          <div className="input-box">
            <input type="text" placeholder="Username" required />
            <FaUser className="icon" />
          </div>
          <div className="input-box">
            <input type="password" placeholder="password" required />
            <FaLock className="icon" />
          </div>
          <div className="remember-forgot">
            <label htmlFor="checkbox">
              <input type="checkbox" name="checkbox" />
              Remember me
            </label>
            <a href="#">Forgot Password?</a>
          </div>
          <button type="submit">Login</button>
          <div className="register-link">
            <p>
              Don't have an account?
              <a href="#" onClick={registerLink}>
                {" "}
                Register
              </a>
            </p>
          </div>
        </form>
      </div>

      <div className="form-box register">
        <form action="">
          <h1>Registration</h1>
          <div className="input-box">
            <input
              type="text"
              name="schoolName"
              placeholder="Official School Name"
              required
            />
            <FaSchool className="icon" />
          </div>
          <div className="input-box">
            <select name="schoolLevel" className="select-input-button" required>
              <option value="" disabled>
                Choose School Level
              </option>
              <option value="primary">Primary School</option>
              <option value="secondary">Secondary School</option>
              <option value="mixed">Primary & Secondary</option>
              <option value="tertiary">College/University</option>
            </select>
            <FaChalkboardTeacher className="icon" />
          </div>
          <div className="input-box">
            <input
              type="text"
              name="physicalAddress"
              placeholder="Physical Address"
              required
            />
            <FaMapMarkerAlt className="icon" />
          </div>

          <div className="input-box">
            <input type="email" placeholder="Email" required />
            <FaEnvelope className="icon" />
          </div>
          <div className="input-box">
            <input type="password" placeholder="password" required />
            <FaLock className="icon" />
          </div>
          <div className="input-box">
            <input type="password" placeholder="confirm-password" required />
            <FaLock className="icon" />
          </div>
          <div className="remember-forgot">
            <label htmlFor="checkbox">
              <input type="checkbox" name="checkbox" />I agree to the terms &
              conditions
            </label>
          </div>
          <button type="submit">Register</button>
          <div className="register-link">
            <p>
              Already have an account?
              <a href="#" onClick={loginLink}>
                {" "}
                Login
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginRegister;
