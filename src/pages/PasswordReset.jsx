import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaEnvelope, FaLock, FaKey } from "react-icons/fa";
import Axios from "axios";
import "./passwordreset.css";

const PasswordReset = () => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [formData, setFormData] = useState({
    email: "",
    otp_code: "",
    new_password: "",
    confirm_password: "",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear errors when user starts typing
    if (error) setError(null);
  };

  // Step 1: Request OTP
  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await Axios.post(
        "http://localhost:8000/api/users/password-reset/request/",
        {
          email: formData.email,
        }
      );

      setSuccess(response.data.message);
      setStep(2);
    } catch (error) {
      setError(
        error.response?.data?.email?.[0] ||
          error.response?.data?.detail ||
          "Failed to send OTP. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await Axios.post(
        "http://localhost:8000/api/users/password-reset/verify/",
        {
          email: formData.email,
          otp_code: formData.otp_code,
        }
      );

      setSuccess(response.data.message);
      setStep(3);
    } catch (error) {
      setError(
        error.response?.data?.otp_code?.[0] ||
          error.response?.data?.detail ||
          "Invalid OTP code. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Set New Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError(null);

    // Validate passwords match
    if (formData.new_password !== formData.confirm_password) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await Axios.post(
        "http://localhost:8000/api/users/password-reset/confirm/",
        {
          email: formData.email,
          otp_code: formData.otp_code,
          new_password: formData.new_password,
          confirm_password: formData.confirm_password,
        }
      );

      setSuccess(response.data.message);

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      if (error.response?.data?.new_password) {
        // Password validation errors
        setError(error.response.data.new_password.join(" "));
      } else {
        setError(
          error.response?.data?.detail ||
            "Failed to reset password. Please try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await Axios.post(
        "http://localhost:8000/api/users/password-reset/request/",
        {
          email: formData.email,
        }
      );

      setSuccess("New OTP sent! Please check your email.");
    } catch (error) {
      setError("Failed to resend OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="password-reset-container">
      <div className="password-reset-box">
        <h1>Reset Password</h1>

        {/* Progress Indicator */}
        <div className="progress-indicator">
          <div className={`step ${step >= 1 ? "active" : ""}`}>
            <div className="step-number">1</div>
            <div className="step-label">Email</div>
          </div>
          <div className={`step ${step >= 2 ? "active" : ""}`}>
            <div className="step-number">2</div>
            <div className="step-label">Verify</div>
          </div>
          <div className={`step ${step >= 3 ? "active" : ""}`}>
            <div className="step-number">3</div>
            <div className="step-label">New Password</div>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="success-message">
            <p>{success}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}

        {/* Step 1: Email Input */}
        {step === 1 && (
          <form onSubmit={handleRequestOTP}>
            <p className="instruction">
              Enter your email address and we'll send you a code to reset your
              password.
            </p>
            <div className="input-box">
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
              <FaEnvelope className="icon" />
            </div>
            <button type="submit" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send OTP"}
            </button>
            <div className="back-to-login">
              <Link to="/login">Back to Login</Link>
            </div>
          </form>
        )}

        {/* Step 2: OTP Verification */}
        {step === 2 && (
          <form onSubmit={handleVerifyOTP}>
            <p className="instruction">
              Enter the 6-digit code sent to <strong>{formData.email}</strong>
            </p>
            <div className="input-box">
              <input
                type="text"
                name="otp_code"
                placeholder="Enter 6-digit OTP"
                value={formData.otp_code}
                onChange={handleChange}
                maxLength="6"
                required
                disabled={isLoading}
                pattern="[0-9]{6}"
              />
              <FaKey className="icon" />
            </div>
            <button type="submit" disabled={isLoading}>
              {isLoading ? "Verifying..." : "Verify OTP"}
            </button>
            <div className="resend-otp">
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={isLoading}
                className="link-button"
              >
                Resend OTP
              </button>
            </div>
            <div className="back-to-login">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="link-button"
              >
                Change Email
              </button>
            </div>
          </form>
        )}

        {/* Step 3: New Password */}
        {step === 3 && (
          <form onSubmit={handleResetPassword}>
            <p className="instruction">Choose a strong new password</p>
            <div className="input-box">
              <input
                type="password"
                name="new_password"
                placeholder="New Password"
                value={formData.new_password}
                onChange={handleChange}
                required
                disabled={isLoading}
                minLength="8"
              />
              <FaLock className="icon" />
            </div>
            <div className="input-box">
              <input
                type="password"
                name="confirm_password"
                placeholder="Confirm Password"
                value={formData.confirm_password}
                onChange={handleChange}
                required
                disabled={isLoading}
                minLength="8"
              />
              <FaLock className="icon" />
            </div>
            <div className="password-requirements">
              <small>
                Password must be at least 8 characters long and include a mix of
                letters, numbers, and symbols.
              </small>
            </div>
            <button type="submit" disabled={isLoading}>
              {isLoading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default PasswordReset;
