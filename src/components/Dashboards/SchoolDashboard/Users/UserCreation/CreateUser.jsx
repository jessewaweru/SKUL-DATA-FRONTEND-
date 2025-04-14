import "../../Users/UserCreation/usercreation.css";
import { useState } from "react";
import {
  FiUser,
  FiMail,
  FiLock,
  FiArrowLeft,
  FiSave,
  FiBook,
  FiUsers,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const CreateUser = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "Teacher", // Default to Teacher
    sendInvite: false,
    // Teacher-specific fields
    assignedClass: "",
    subjects: "",
    // Parent-specific fields
    children: [],
    relationship: "Parent",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableStudents, setAvailableStudents] = useState([
    { id: 1, name: "Emma Johnson", grade: "Grade 3A" },
    { id: 2, name: "Liam Smith", grade: "Grade 4B" },
    { id: 3, name: "Olivia Brown", grade: "Grade 5C" },
  ]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleStudentSelection = (studentId, isSelected) => {
    setFormData((prev) => {
      const newChildren = isSelected
        ? [...prev.children, studentId]
        : prev.children.filter((id) => id !== studentId);
      return { ...prev, children: newChildren };
    });
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

    // Role-specific validations
    if (formData.role === "Teacher" && !formData.assignedClass) {
      newErrors.assignedClass = "Class assignment is required for teachers";
    }
    if (formData.role === "Parent" && formData.children.length === 0) {
      newErrors.children = "At least one child must be selected";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Prepare data for API based on role
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        role: formData.role,
        phoneNumber: formData.phoneNumber || undefined,
        sendInvite: formData.sendInvite,
      };

      // Add role-specific fields
      if (formData.role === "Teacher") {
        userData.assignedClass = formData.assignedClass;
        userData.subjects = formData.subjects;
      } else if (formData.role === "Parent") {
        userData.children = formData.children;
        userData.relationship = formData.relationship;
      }

      console.log("Submitting user:", userData);
      // API call would go here
      // await fetch('/api/users', { method: 'POST', body: JSON.stringify(userData) });

      navigate("/dashboard/users", {
        state: { success: "User created successfully!" },
      });
    } catch (error) {
      console.error("Error creating user:", error);
    } finally {
      setIsSubmitting(false);
    }
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
          <FiUser /> Create New User
        </h2>
      </div>
      <form onSubmit={handleSubmit} className="user-form">
        {/* Basic Info Section */}
        <div className="form-section">
          <h3>
            <FiUser /> Basic Information
          </h3>
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
            />
            {errors.email && (
              <span className="error-message">{errors.email}</span>
            )}
          </div>
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
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="phoneNumber">Phone Number (Optional)</label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Enter phone number"
            />
          </div>
        </div>
        {/* Role-Specific Sections */}
        {formData.role === "Teacher" && (
          <div className="form-section">
            <h3>
              <FiBook /> Teacher Information
            </h3>
            <div
              className={`form-group ${errors.assignedClass ? "error" : ""}`}
            >
              <label htmlFor="assignedClass">Assigned Class</label>
              <input
                type="text"
                id="assignedClass"
                name="assignedClass"
                value={formData.assignedClass}
                onChange={handleChange}
                placeholder="Enter class name or code"
              />
              {errors.assignedClass && (
                <span className="error-message">{errors.assignedClass}</span>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="subjects">Subjects (Optional)</label>
              <input
                type="text"
                id="subjects"
                name="subjects"
                value={formData.subjects}
                onChange={handleChange}
                placeholder="e.g. Math, Science"
              />
            </div>
          </div>
        )}
        {formData.role === "Parent" && (
          <div className="form-section">
            <h3>
              <FiUsers /> Parent Information
            </h3>
            <div className={`form-group ${errors.children ? "error" : ""}`}>
              <label>Children</label>
              <div className="students-list">
                {availableStudents.map((student) => (
                  <div key={student.id} className="student-checkbox">
                    <input
                      type="checkbox"
                      id={`student-${student.id}`}
                      checked={formData.children.includes(student.id)}
                      onChange={(e) =>
                        handleStudentSelection(student.id, e.target.checked)
                      }
                    />
                    <label htmlFor={`student-${student.id}`}>
                      {student.name} ({student.grade})
                    </label>
                  </div>
                ))}
              </div>
              {errors.children && (
                <span className="error-message">{errors.children}</span>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="relationship">Relationship</label>
              <select
                id="relationship"
                name="relationship"
                value={formData.relationship}
                onChange={handleChange}
              >
                <option value="Parent">Parent</option>
                <option value="Guardian">Guardian</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        )}
        {/* Invitation Section */}
        <div className="form-section">
          <h3>
            <FiMail /> Account Setup
          </h3>
          <div className="form-group checkbox-group">
            <input
              type="checkbox"
              id="sendInvite"
              name="sendInvite"
              checked={formData.sendInvite}
              onChange={handleChange}
            />
            <label htmlFor="sendInvite">Send account activation email</label>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="primary-button"
            disabled={isSubmitting}
          >
            <FiSave /> {isSubmitting ? "Creating..." : "Create User"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateUser;
