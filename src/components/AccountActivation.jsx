import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FaCheckCircle, FaTimesCircle, FaSpinner } from "react-icons/fa";
import Axios from "axios";
import "./accountactivation.css";

const AccountActivation = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying"); // verifying, success, error
  const [message, setMessage] = useState("");
  const [accountDetails, setAccountDetails] = useState(null);

  useEffect(() => {
    verifyToken();
  }, [token]);

  const verifyToken = async () => {
    try {
      const response = await Axios.get(
        `http://localhost:8000/api/users/activate-account/${token}/`
      );

      setStatus("success");
      setMessage(response.data.message || "Account activated successfully!");
      setAccountDetails(response.data.user || null);

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      console.error("Activation error:", error);
      setStatus("error");

      if (error.response?.status === 404) {
        setMessage("Invalid or expired activation link.");
      } else if (error.response?.data?.detail) {
        setMessage(error.response.data.detail);
      } else {
        setMessage(
          "Failed to activate account. Please try again or contact support."
        );
      }
    }
  };

  return (
    <div className="activation-container">
      <div className="activation-box">
        {status === "verifying" && (
          <>
            <FaSpinner className="icon spinning" />
            <h2>Verifying Account...</h2>
            <p>Please wait while we activate your account.</p>
          </>
        )}

        {status === "success" && (
          <>
            <FaCheckCircle className="icon success" />
            <h2>Account Activated!</h2>
            <p>{message}</p>
            {accountDetails && (
              <div className="account-info">
                <p>
                  <strong>Name:</strong> {accountDetails.name}
                </p>
                <p>
                  <strong>Email:</strong> {accountDetails.email}
                </p>
              </div>
            )}
            <p className="redirect-message">
              Redirecting to login page in 3 seconds...
            </p>
            <Link to="/login" className="manual-link">
              Or click here to login now
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <FaTimesCircle className="icon error" />
            <h2>Activation Failed</h2>
            <p>{message}</p>
            <div className="action-buttons">
              <Link to="/login" className="secondary-button">
                Try Login Anyway
              </Link>
              <a href="mailto:support@skuldata.com" className="primary-button">
                Contact Support
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AccountActivation;
