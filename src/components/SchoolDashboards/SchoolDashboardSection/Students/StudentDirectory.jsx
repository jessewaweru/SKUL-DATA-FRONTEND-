// components/SchoolDashboard/Students/StudentDirectory.jsx
import { useState, useEffect } from "react";
import { useApi } from "../../../../hooks/useApi";
import { FiEdit2, FiUser, FiTrash2, FiRefreshCw } from "react-icons/fi";
import StudentFilters from "./StudentFilters";
import "../Students/students.css";

const StudentDirectory = () => {
  const api = useApi();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showInactive, setShowInactive] = useState(false);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const params = { show_inactive: showInactive };
      const response = await api.get("/students/", { params });
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
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
      await api.post(`/students/${studentId}/deactivate/`, {
        reason: "Deactivated by admin",
      });
      fetchStudents();
    } catch (error) {
      console.error("Error deactivating student:", error);
    }
  };

  const handleRestore = async (studentId) => {
    try {
      await api.post(`/students/${studentId}/restore/`);
      fetchStudents();
    } catch (error) {
      console.error("Error restoring student:", error);
    }
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
          <button onClick={fetchStudents}>
            <FiRefreshCw /> Refresh
          </button>
        </div>
      </div>

      <StudentFilters onFilter={fetchStudents} />

      {loading ? (
        <div className="loading">Loading students...</div>
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
                    <a href={`#/dashboard/students/profile/${student.id}`}>
                      {student.full_name}
                    </a>
                  </td>
                  <td>{student.age}</td>
                  <td>{student.student_class?.name || "N/A"}</td>
                  <td>{student.parent?.user?.full_name || "N/A"}</td>
                  <td>{student.teacher?.user?.full_name || "N/A"}</td>
                  <td>
                    {new Date(student.admission_date).toLocaleDateString()}
                  </td>
                  <td>
                    <span
                      className={`status-badge ${student.status.toLowerCase()}`}
                    >
                      {student.status}
                    </span>
                  </td>
                  <td className="actions">
                    <a
                      href={`#/dashboard/students/edit/${student.id}`}
                      className="edit-btn"
                    >
                      <FiEdit2 />
                    </a>
                    {student.is_active ? (
                      <button
                        onClick={() => handleDeactivate(student.id)}
                        className="delete-btn"
                      >
                        <FiTrash2 />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleRestore(student.id)}
                        className="restore-btn"
                      >
                        <FiUser /> Restore
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
