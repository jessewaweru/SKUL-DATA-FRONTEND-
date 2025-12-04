import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../../../../hooks/useApi";
import { FiEdit2, FiUser, FiTrash2, FiRefreshCw } from "react-icons/fi";
import StudentFilters from "./StudentFilters";
import "../Students/students.css";

const StudentDirectory = () => {
  const api = useApi();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showInactive, setShowInactive] = useState(false);
  const [error, setError] = useState(null);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        show_inactive: showInactive,
      };

      // FIX: Correct endpoint
      const response = await api.get("/api/students/students/", { params });

      let data = response.data?.results || response.data;

      if (Array.isArray(data)) {
        setStudents(data);
      } else {
        console.error("Unexpected data format:", response.data);
        setError("Unexpected data format from server");
        setStudents([]);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
      setError("Failed to load students. Please try again.");
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [showInactive]);

  const handleDeactivate = async (studentId) => {
    if (!window.confirm("Are you sure you want to deactivate this student?"))
      return;

    try {
      await api.post(`/api/students/students/${studentId}/deactivate/`, {
        reason: "Deactivated by admin",
      });
      fetchStudents();
    } catch (error) {
      console.error("Error deactivating student:", error);
      alert("Failed to deactivate student");
    }
  };

  const handleRestore = async (studentId) => {
    try {
      await api.post(`/api/students/students/${studentId}/restore/`);
      fetchStudents();
    } catch (error) {
      console.error("Error restoring student:", error);
      alert("Failed to restore student");
    }
  };

  const renderStatus = (status) => {
    const statusMap = {
      ACTIVE: { class: "active", label: "Active" },
      GRADUATED: { class: "graduated", label: "Graduated" },
      LEFT: { class: "left", label: "Left" },
      SUSPENDED: { class: "suspended", label: "Suspended" },
    };

    const statusInfo = statusMap[status] || { class: "unknown", label: status };
    return (
      <span className={`status-badge ${statusInfo.class}`}>
        {statusInfo.label}
      </span>
    );
  };

  return (
    <div className="student-directory">
      <div className="directory-header">
        <h2>Student Directory</h2>
        <div className="directory-actions">
          <label>
            <input
              type="checkbox"
              checked={showInactive}
              onChange={() => setShowInactive(!showInactive)}
            />
            Show Inactive Students
          </label>
          <button onClick={fetchStudents} disabled={loading}>
            <FiRefreshCw /> Refresh
          </button>
        </div>
      </div>

      <StudentFilters onFilter={fetchStudents} />

      {error && (
        <div className="error-message">
          {error}
          <button onClick={fetchStudents}>Retry</button>
        </div>
      )}

      {loading ? (
        <div className="loading">Loading students...</div>
      ) : students.length === 0 ? (
        <div className="no-results">No students found</div>
      ) : (
        <div className="students-table-container">
          <table className="students-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Age</th>
                <th>Class</th>
                <th>Parent</th>
                <th>Teacher</th>
                <th>Admission Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr
                  key={student.id}
                  className={!student.is_active ? "inactive" : ""}
                >
                  <td>
                    {/* FIX: Use button with onClick instead of anchor */}
                    <button
                      onClick={() =>
                        navigate(`/dashboard/students/profile/${student.id}`)
                      }
                      className="student-name-link"
                    >
                      {student.full_name}
                    </button>
                  </td>
                  <td>{student.age}</td>
                  <td>{student.student_class?.name || "N/A"}</td>
                  <td>
                    {student.parent?.user?.first_name}{" "}
                    {student.parent?.user?.last_name || "N/A"}
                  </td>
                  <td>{student.teacher_name || "N/A"}</td>
                  <td>
                    {new Date(student.admission_date).toLocaleDateString()}
                  </td>
                  <td>{renderStatus(student.status)}</td>
                  <td className="actions">
                    <button
                      onClick={() =>
                        navigate(`/dashboard/students/edit/${student.id}`)
                      }
                      className="edit-btn"
                      title="Edit Student"
                    >
                      <FiEdit2 />
                    </button>
                    {student.is_active ? (
                      <button
                        onClick={() => handleDeactivate(student.id)}
                        className="delete-btn"
                        title="Deactivate Student"
                      >
                        <FiTrash2 />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleRestore(student.id)}
                        className="restore-btn"
                        title="Restore Student"
                      >
                        <FiUser />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StudentDirectory;
