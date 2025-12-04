// components/SchoolDashboard/Students/CreateStudent.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../../../../hooks/useApi";
import { FiUser, FiSave, FiX } from "react-icons/fi";
import "./students.css";

const CreateStudent = () => {
  const api = useApi();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    date_of_birth: "",
    gender: "",
    student_class: null,
    parent: null,
    guardians: [],
    medical_notes: "",
    special_needs: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await api.post("/students/", formData);
      navigate(`/dashboard/students/profile/${response.data.id}`);
    } catch (err) {
      setError(err.response?.data || "Failed to create student");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-student">
      <div className="form-header">
        <h2>
          <FiUser /> Add New Student
        </h2>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h3>Personal Information</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>First Name *</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Middle Name</label>
              <input
                type="text"
                name="middle_name"
                value={formData.middle_name}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Last Name *</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Date of Birth *</label>
              <input
                type="date"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Gender *</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="">Select Gender</option>
                <option value="M">Male</option>
                <option value="F">Female</option>
                <option value="O">Other</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>School Information</h3>
          <div className="form-group">
            <label>Class *</label>
            {/* Replace with actual class selector */}
            <select
              name="student_class"
              value={formData.student_class}
              onChange={(e) =>
                setFormData({ ...formData, student_class: e.target.value })
              }
              required
            >
              <option value="">Select Class</option>
              {/* Populate with classes */}
            </select>
          </div>
        </div>

        <div className="form-section">
          <h3>Parent/Guardian Information</h3>
          <div className="form-group">
            <label>Primary Parent *</label>
            {/* Replace with actual parent selector */}
            <select
              name="parent"
              value={formData.parent}
              onChange={(e) =>
                setFormData({ ...formData, parent: e.target.value })
              }
              required
            >
              <option value="">Select Parent</option>
              {/* Populate with parents */}
            </select>
          </div>
          <div className="form-group">
            <label>Additional Guardians</label>
            {/* Replace with multi-select for guardians */}
            <select
              name="guardians"
              multiple
              value={formData.guardians}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  guardians: Array.from(
                    e.target.selectedOptions,
                    (option) => option.value
                  ),
                })
              }
            >
              {/* Populate with parents */}
            </select>
          </div>
        </div>

        <div className="form-section">
          <h3>Additional Information</h3>
          <div className="form-group">
            <label>Medical Notes</label>
            <textarea
              name="medical_notes"
              value={formData.medical_notes}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Special Needs</label>
            <textarea
              name="special_needs"
              value={formData.special_needs}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate("/dashboard/students")}
            className="cancel-btn"
          >
            <FiX /> Cancel
          </button>
          <button type="submit" disabled={loading} className="save-btn">
            {loading ? (
              "Saving..."
            ) : (
              <>
                <FiSave /> Save Student
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateStudent;
