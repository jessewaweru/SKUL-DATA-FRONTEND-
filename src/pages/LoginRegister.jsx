import { useState } from "react";
import { FaLock, FaEnvelope } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import "../styles/loginRegister.css";
import Axios from "axios";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    rememberMe: false,
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      console.log("Attempting login with:", {
        username: formData.username,
      });

      const response = await Axios.post(
        "http://localhost:8000/api/token/",
        {
          username: formData.username,
          password: formData.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      console.log("Login response:", response.data);

      // Store tokens
      localStorage.setItem("accessToken", response.data.access);
      localStorage.setItem("refreshToken", response.data.refresh);

      // Set default axios header for future requests
      Axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${response.data.access}`;

      // Redirect to dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);

      if (error.response?.status === 500) {
        setError("Server error. Please check your credentials and try again.");
      } else if (error.response?.status === 401) {
        setError("Invalid username or password.");
      } else {
        setError(
          error.response?.data?.detail ||
            error.response?.data?.message ||
            "Login failed. Please check your credentials."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="wrapper">
      <div className="form-box login centered">
        <form onSubmit={handleLoginSubmit}>
          <h1>Skul Data Login</h1>
          <p className="subtitle">School Management System</p>

          {error && <p className="error-message">{error}</p>}

          <div className="input-box">
            <input
              type="text"
              name="username"
              placeholder="Username or Email"
              value={formData.username}
              onChange={handleChange}
              required
              disabled={isLoading}
              autoFocus
            />
            <FaEnvelope className="icon" />
          </div>

          <div className="input-box">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
            <FaLock className="icon" />
          </div>

          <div className="remember-forgot">
            <label htmlFor="rememberMe">
              <input
                type="checkbox"
                name="rememberMe"
                id="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
              />
              Remember me
            </label>
            <Link to="/password-reset">Forgot Password?</Link>
          </div>

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>

          <div className="info-text">
            <p>
              New school? <a href="mailto:sales@skuldata.com">Contact us</a> to
              get started
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
