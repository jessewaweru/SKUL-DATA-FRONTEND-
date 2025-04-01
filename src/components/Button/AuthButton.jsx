import { Link } from "react-router-dom";
import "../Button/authbutton.css";

const AuthButton = () => {
  return (
    <div className="auth-buttons">
      <Link to="/login" className="auth-btn signup-btn">
        SignUp
      </Link>
      <Link to="/login" className="auth-btn login-btn">
        Login
      </Link>
    </div>
  );
};

export default AuthButton;
