import { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

function LoginRegister() {
  const [isRegistering, setIsRegistering] = useState(true);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    username: "",
    role: "parent",
    email: "",
    phonenumber: "",
    password: "",
  });

  const { handleAuth } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const route = await handleAuth(formData, isRegistering);
    if (route) {
      navigate(route);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  return (
    <div className="login-container">
      <div className="form-data">
        <h1>{isRegistering ? "Register" : "Login"}</h1>
        <form onSubmit={handleSubmit}>
          {isRegistering && (
            <>
              <input
                type="text"
                name="username"
                placeholder="username"
                value={formData.username}
                onChange={handleChange}
              />
              <input
                type="text"
                name="firstname"
                placeholder="firstname"
                value={formData.firstname}
                onChange={handleChange}
              />
              <input
                type="text"
                name="lastname"
                placeholder="lastname"
                value={formData.lastname}
                onChange={handleChange}
              />
              <input
                type="text"
                name="phonenumber"
                placeholder="Phone number"
                value={formData.phonenumber}
                onChange={handleChange}
              />
              <select
                className="role-selector"
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="superuser">Superuser</option>
                <option value="teacher">Teacher</option>
                <option value="parent">Parent</option>
              </select>
            </>
          )}
          <input
            type="email"
            name="email"
            placeholder="johndoe@gmail.com"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="password"
            value={formData.password}
            onChange={handleChange}
          />
          <button className="login-register-button" type="submit">
            {isRegistering ? "Sign Up" : "Login"}
          </button>
        </form>
        <p
          onClick={() => {
            setIsRegistering(!isRegistering);
          }}
        >
          {isRegistering
            ? "Already have an account? Login!"
            : "Don't have an account? Register"}
        </p>
      </div>
    </div>
  );
}

export default LoginRegister;
