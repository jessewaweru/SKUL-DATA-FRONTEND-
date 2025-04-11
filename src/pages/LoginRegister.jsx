import { useEffect, useState } from "react";
import {
  FaPhone,
  FaLock,
  FaEnvelope,
  FaSchool,
  FaMapMarkerAlt,
  FaChalkboardTeacher,
} from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/loginregister.css";
import Axios from "axios";

const LoginRegister = ({ mode = "login" }) => {
  const [action, setAction] = useState(mode === "register" ? "active" : "");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    schoolName: "",
    schoolLevel: "",
    physicalAddress: "",
    phone_number: "",
    confirmPassword: "",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (mode === "register") {
      setAction("active");
    } else {
      setAction("");
    }
  }, [mode, location.pathname]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    Axios.post("http://localhost:8000/users/login/", {
      email: formData.email,
      password: formData.password,
    })
      .then((response) => {
        localStorage.setItem("access_token", response.data.token);
        navigate("/dashboard");
      })
      .catch(() => {
        setError("Invalid credentials. Please try again.");
      });
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    Axios.post("http://localhost:8000/users/register/", {
      email: formData.email,
      password: formData.password,
      schoolName: formData.schoolName,
      schoolLevel: formData.schoolLevel,
      physicalAddress: formData.physicalAddress,
      phone_number: formData.phone_number,
      confirmPassword: formData.confirmPassword,
    })
      .then((response) => {
        localStorage.setItem("access_token", response.data.token);
        navigate("/dashboard");
      })
      .catch(() => {
        setError("Registration failed. Please try again.");
      });
  };

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
        <form onSubmit={handleLoginSubmit}>
          <h1>Login</h1>
          {error && <p className="error-message">{error}</p>}
          <div className="input-box">
            <input
              type="email"
              name="email"
              placeholder="School email"
              onChange={handleChange}
              required
            />
            <FaEnvelope className="icon" />
          </div>
          <div className="input-box">
            <input
              type="password"
              name="password"
              placeholder="password"
              onChange={handleChange}
              required
            />
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
        <form onSubmit={handleRegisterSubmit}>
          <h1>Registration</h1>
          {error && <p className="error-message">{error}</p>}
          <div className="input-box">
            <input
              type="text"
              name="schoolName"
              placeholder="Official School Name"
              value={formData.schoolName}
              onChange={handleChange}
              required
            />
            <FaSchool className="icon" />
          </div>
          <div className="input-box">
            <select
              name="schoolLevel"
              className="select-input-button"
              value={formData.schoolLevel}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Choose School Level
              </option>
              <option value="kindergarten">Kindergarten</option>
              <option value="primary">Primary School</option>
              <option value="secondary">Secondary School</option>
              <option value="mixed">Primary & Secondary</option>
            </select>
            <FaChalkboardTeacher className="icon" />
          </div>
          <div className="input-box">
            <input
              type="text"
              name="physicalAddress"
              placeholder="Physical Address"
              value={formData.physicalAddress}
              onChange={handleChange}
              required
            />
            <FaMapMarkerAlt className="icon" />
          </div>

          <div className="input-box">
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <FaEnvelope className="icon" />
          </div>
          <div className="input-box">
            <input
              type="text"
              name="phone_number"
              placeholder="School Phone Number"
              value={formData.phone_number}
              onChange={handleChange}
              required
            />
            <FaPhone className="icon" />
          </div>
          <div className="input-box">
            <input
              type="password"
              placeholder="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <FaLock className="icon" />
          </div>
          <div className="input-box">
            <input
              type="password"
              placeholder="confirm-password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
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
