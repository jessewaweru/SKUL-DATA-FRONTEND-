// components/SchoolDashboard/Teachers/TeacherEditForm.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiSave, FiCheck } from "react-icons/fi";
import {
  fetchTeacherById,
  updateTeacher,
} from "../../../../services/teacherService";
import { useQueryClient } from "@tanstack/react-query";

const TeacherEditForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [teacher, setTeacher] = useState(null);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    status: "ACTIVE",
    hire_date: "",
    qualification: "",
    specialization: "",
    years_of_experience: 0,
    bio: "",
    office_location: "",
    office_hours: "",
    is_class_teacher: false,
    is_department_head: false,
    payroll_number: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadTeacher = async () => {
      try {
        const data = await fetchTeacherById(id);
        setTeacher(data);
        setFormData({
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          phone_number: data.phone_number,
          status: data.status,
          hire_date: data.hire_date,
          qualification: data.qualification,
          specialization: data.specialization,
          years_of_experience: data.years_of_experience,
          bio: data.bio || "",
          office_location: data.office_location || "",
          office_hours: data.office_hours || "",
          is_class_teacher: data.is_class_teacher,
          is_department_head: data.is_department_head,
          payroll_number: data.payroll_number || "",
        });
      } catch (error) {
        console.error("Error loading teacher:", error);
        navigate("/dashboard/teachers/profiles", { replace: true });
      }
    };

    loadTeacher();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      await updateTeacher(id, formData);
      await queryClient.invalidateQueries(["teacher", id]);
      await queryClient.invalidateQueries("teachers");
      navigate(`/dashboard/teachers/profiles/${id}`);
    } catch (error) {
      if (error.response?.data) {
        setErrors(error.response.data);
      } else {
        console.error("Error updating teacher:", error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!teacher) {
    return <div className="loading-spinner">Loading teacher data...</div>;
  }

  return (
    <div className="teacher-form-container">
      <div className="form-header">
        <button onClick={() => navigate(-1)} className="back-button">
          <FiArrowLeft /> Back to Profile
        </button>
        <h2>Edit Teacher Profile</h2>
      </div>

      <form onSubmit={handleSubmit} className="teacher-form">
        <div className="form-section">
          <h3>Basic Information</h3>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="first_name">First Name*</label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
              />
              {errors.first_name && (
                <span className="error-message">{errors.first_name}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="last_name">Last Name*</label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
              />
              {errors.last_name && (
                <span className="error-message">{errors.last_name}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email*</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              {errors.email && (
                <span className="error-message">{errors.email}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="phone_number">Phone Number</label>
              <input
                type="tel"
                id="phone_number"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
              />
              {errors.phone_number && (
                <span className="error-message">{errors.phone_number}</span>
              )}
            </div>
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
                <option value="TERMINATED">Terminated</option>
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
              {errors.hire_date && (
                <span className="error-message">{errors.hire_date}</span>
              )}
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
          <h3>Office Information</h3>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="office_location">Office Location</label>
              <input
                type="text"
                id="office_location"
                name="office_location"
                value={formData.office_location}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="office_hours">Office Hours</label>
              <input
                type="text"
                id="office_hours"
                name="office_hours"
                value={formData.office_hours}
                onChange={handleChange}
                placeholder="e.g., Mon-Fri 9am-5pm"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Bio</h3>
          <div className="form-group">
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows="4"
              placeholder="Enter a brief bio about the teacher..."
            />
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
            <FiSave /> {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TeacherEditForm;
