// components/SchoolDashboard/Students/EditStudent.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApi } from "../../../../hooks/useApi";
import { FiUser, FiSave, FiX } from "react-icons/fi";
import "./students.css";

const EditStudent = () => {
  const { studentId } = useParams();
  const api = useApi();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await api.get(`/students/${studentId}/`);
        setFormData(response.data);
      } catch (err) {
        setError("Failed to load student data");
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [studentId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await api.patch(`/students/${studentId}/`, formData);
      navigate(`/dashboard/students/profile/${studentId}`);
    } catch (err) {
      setError(err.response?.data || "Failed to update student");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading student data...</div>;
  if (!formData)
    return <div className="error-message">{error || "Student not found"}</div>;

  return (
    <div className="edit-student">
      <div className="form-header">
        <h2>
          <FiUser /> Edit Student: {formData.full_name}
        </h2>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        {/* Similar form structure to CreateStudent but with existing values */}
        {/* Omitted for brevity - use same structure as CreateStudent.jsx */}

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate(`/dashboard/students/profile/${studentId}`)}
            className="cancel-btn"
          >
            <FiX /> Cancel
          </button>
          <button type="submit" disabled={loading} className="save-btn">
            {loading ? (
              "Saving..."
            ) : (
              <>
                <FiSave /> Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditStudent;
