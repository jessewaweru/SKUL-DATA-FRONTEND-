import "../../Users/UserCreation/usercreation.css";

// components/SchoolDashboard/Users/EditUser.jsx
import { useState, useEffect } from "react";
import {
  FiUser,
  FiMail,
  FiLock,
  FiArrowLeft,
  FiSave,
  FiTrash2,
} from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";

const EditUser = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "Teacher",
    status: "Active",
    assignedClass: "",
    phoneNumber: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Replace with actual API call
        // const response = await fetch(`/api/users/${userId}`);
        // const data = await response.json();

        // Mock data for demonstration
        const mockUser = {
          id: userId,
          firstName: "John",
          lastName: "Doe",
          email: "john@peponi.school",
          role: "Teacher",
          status: "Active",
          assignedClass: "Grade 5A",
          phoneNumber: "+254712345678",
        };

        setFormData(mockUser);
      } catch (error) {
        console.error("Error fetching user:", error);
        navigate("/dashboard/users");
      }
    };

    fetchUser();
  }, [userId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Replace with actual API call
      // const response = await fetch(`/api/users/${userId}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });

      console.log("User updated:", formData);
      navigate("/dashboard/users", {
        state: { success: "User updated successfully!" },
      });
    } catch (error) {
      console.error("Error updating user:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      // Replace with actual API call
      // await fetch(`/api/users/${userId}`, { method: 'DELETE' });

      console.log("User deleted:", userId);
      navigate("/dashboard/users", {
        state: { success: "User deleted successfully!" },
      });
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleResetPassword = () => {
    // Implement password reset logic
    console.log("Password reset requested for:", userId);
  };

  return (
    <div className="user-form-container">
      <div className="form-header">
        <button
          onClick={() => navigate("/dashboard/users")}
          className="back-button"
        >
          <FiArrowLeft /> Back to Users
        </button>
        <h2>
          <FiUser /> Edit User
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="user-form">
        <div className="form-row">
          <div className={`form-group ${errors.firstName ? "error" : ""}`}>
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Enter first name"
            />
            {errors.firstName && (
              <span className="error-message">{errors.firstName}</span>
            )}
          </div>

          <div className={`form-group ${errors.lastName ? "error" : ""}`}>
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Enter last name"
            />
            {errors.lastName && (
              <span className="error-message">{errors.lastName}</span>
            )}
          </div>
        </div>

        <div className={`form-group ${errors.email ? "error" : ""}`}>
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email address"
            disabled // Email typically shouldn't be changed
          />
          {errors.email && (
            <span className="error-message">{errors.email}</span>
          )}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="role">User Role</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="Teacher">Teacher</option>
              <option value="Parent">Parent</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="status">Account Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        {formData.role === "Teacher" && (
          <div className="form-group">
            <label htmlFor="assignedClass">Assigned Class</label>
            <input
              type="text"
              id="assignedClass"
              name="assignedClass"
              value={formData.assignedClass}
              onChange={handleChange}
              placeholder="Class name or code"
            />
          </div>
        )}

        <div className="form-group">
          <label htmlFor="phoneNumber">Phone Number</label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="Enter phone number"
          />
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={handleResetPassword}
          >
            <FiLock /> Reset Password
          </button>

          <div className="action-group">
            <button
              type="button"
              className="danger-button"
              onClick={() => setShowDeleteModal(true)}
            >
              <FiTrash2 /> Delete User
            </button>

            <button
              type="submit"
              className="primary-button"
              disabled={isSubmitting}
            >
              <FiSave /> {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </form>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirm Deletion</h3>
            <p>
              Are you sure you want to delete {formData.firstName}{" "}
              {formData.lastName}? This action cannot be undone.
            </p>

            <div className="modal-footer">
              <button
                className="secondary-button"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button className="danger-button" onClick={handleDelete}>
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditUser;
