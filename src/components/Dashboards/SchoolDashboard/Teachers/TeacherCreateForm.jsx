// components/SchoolDashboard/Teachers/TeacherCreateForm.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiSave, FiCheck } from "react-icons/fi";
import { createTeacher } from "../../../../services/teacherService";
import { fetchUsers } from "../../../../services/teacherService";
import AsyncSelect from "react-select/async";
import { useQueryClient } from "@tanstack/react-query";

const TeacherCreateForm = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    user_id: null,
    status: "ACTIVE",
    hire_date: new Date().toISOString().split("T")[0],
    qualification: "",
    specialization: "",
    years_of_experience: 0,
    is_class_teacher: false,
    is_department_head: false,
    payroll_number: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadUserOptions = async (inputValue) => {
    try {
      const users = await fetchUsers({
        search: inputValue,
        user_type: "TEACHER",
      });
      return users.map((user) => ({
        value: user.id,
        label: `${user.first_name} ${user.last_name} (${user.email})`,
      }));
    } catch (error) {
      console.error("Error loading users:", error);
      return [];
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleUserSelect = (selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      user_id: selectedOption ? selectedOption.value : null,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      await createTeacher(formData);
      await queryClient.invalidateQueries("teachers");
      navigate("/dashboard/teachers/profiles");
    } catch (error) {
      if (error.response?.data) {
        setErrors(error.response.data);
      } else {
        console.error("Error creating teacher:", error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="teacher-form-container">
      <div className="form-header">
        <button onClick={() => navigate(-1)} className="back-button">
          <FiArrowLeft /> Back to Teachers
        </button>
        <h2>Create New Teacher Profile</h2>
      </div>

      <form onSubmit={handleSubmit} className="teacher-form">
        <div className="form-section">
          <h3>Basic Information</h3>
          <div className="form-group">
            <label htmlFor="user_id">Select User*</label>
            <AsyncSelect
              id="user_id"
              name="user_id"
              cacheOptions
              defaultOptions
              loadOptions={loadUserOptions}
              onChange={handleUserSelect}
              placeholder="Search for user..."
              className="react-select-container"
              classNamePrefix="react-select"
              required
            />
            {errors.user_id && (
              <span className="error-message">{errors.user_id}</span>
            )}
          </div>
        </div>

        <div className="form-section">
          <h3>Employment Details</h3>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="status">Status*</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <option value="ACTIVE">Active</option>
                <option value="ON_LEAVE">On Leave</option>
                <option value="SUSPENDED">Suspended</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="hire_date">Hire Date*</label>
              <input
                type="date"
                id="hire_date"
                name="hire_date"
                value={formData.hire_date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="payroll_number">Payroll Number</label>
              <input
                type="text"
                id="payroll_number"
                name="payroll_number"
                value={formData.payroll_number}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Professional Information</h3>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="qualification">Qualification</label>
              <input
                type="text"
                id="qualification"
                name="qualification"
                value={formData.qualification}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="specialization">Specialization</label>
              <input
                type="text"
                id="specialization"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="years_of_experience">Years of Experience</label>
              <input
                type="number"
                id="years_of_experience"
                name="years_of_experience"
                min="0"
                value={formData.years_of_experience}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Roles</h3>
          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="is_class_teacher"
                checked={formData.is_class_teacher}
                onChange={handleChange}
              />
              <span className="checkbox-custom">
                <FiCheck />
              </span>
              Is Class Teacher
            </label>

            <label className="checkbox-label">
              <input
                type="checkbox"
                name="is_department_head"
                checked={formData.is_department_head}
                onChange={handleChange}
              />
              <span className="checkbox-custom">
                <FiCheck />
              </span>
              Is Department Head
            </label>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="cancel-button"
          >
            Cancel
          </button>
          <button type="submit" className="save-button" disabled={isSubmitting}>
            <FiSave /> {isSubmitting ? "Saving..." : "Save Teacher"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TeacherCreateForm;
