import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApi } from "../../../../hooks/useApi";
import {
  FiArrowLeft,
  FiEdit,
  FiMail,
  FiUserPlus,
  FiUser,
} from "react-icons/fi";
import StudentTabs from "./StudentTabs";
import "../Students/students.css";

const StudentProfile = () => {
  const { studentId } = useParams();
  const api = useApi();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("basic");

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        setLoading(true);
        setError(null);

        // FIX: Correct API endpoint with /students/students/
        const response = await api.get(`/api/students/students/${studentId}/`);
        setStudent(response.data);
      } catch (error) {
        console.error("Error fetching student:", error);
        setError(error.message || "Failed to load student data");
      } finally {
        setLoading(false);
      }
    };

    if (studentId) {
      fetchStudent();
    }
  }, [studentId]);

  const handleDeactivate = async () => {
    if (!window.confirm("Are you sure you want to deactivate this student?"))
      return;
    try {
      await api.post(`/api/students/students/${studentId}/deactivate/`, {
        reason: "Deactivated by admin",
      });
      // Refresh student data
      const response = await api.get(`/api/students/students/${studentId}/`);
      setStudent(response.data);
    } catch (error) {
      console.error("Error deactivating student:", error);
      alert("Failed to deactivate student");
    }
  };

  const handleRestore = async () => {
    try {
      await api.post(`/api/students/students/${studentId}/restore/`);
      // Refresh student data
      const response = await api.get(`/api/students/students/${studentId}/`);
      setStudent(response.data);
    } catch (error) {
      console.error("Error restoring student:", error);
      alert("Failed to restore student");
    }
  };

  if (loading) {
    return (
      <div className="student-profile">
        <div className="loading">Loading student data...</div>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="student-profile">
        <div className="error-message">
          <h2>Error Loading Student</h2>
          <p>{error || "Student not found"}</p>
          <button onClick={() => navigate("/dashboard/students/directory")}>
            <FiArrowLeft /> Back to Directory
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="student-profile">
      <div className="profile-header">
        <button
          onClick={() => navigate("/dashboard/students/directory")}
          className="back-btn"
        >
          <FiArrowLeft /> Back to Directory
        </button>

        <div className="header-actions">
          <button
            onClick={() => navigate(`/dashboard/students/edit/${studentId}`)}
            className="edit-btn"
          >
            <FiEdit /> Edit
          </button>

          {student.is_active ? (
            <button onClick={handleDeactivate} className="deactivate-btn">
              <FiUserPlus /> Deactivate
            </button>
          ) : (
            <button onClick={handleRestore} className="restore-btn">
              <FiUserPlus /> Restore
            </button>
          )}

          {student.parent && (
            <button
              onClick={() => {
                navigate("/dashboard/messages", {
                  state: { recipientId: student.parent.id },
                });
              }}
              className="message-btn"
            >
              <FiMail /> Message Parent
            </button>
          )}
        </div>
      </div>

      <div className="profile-content">
        <div className="student-basic-info">
          <div className="student-photo">
            {student.photo ? (
              <img src={student.photo} alt={student.full_name} />
            ) : (
              <div className="photo-placeholder">
                <FiUser size={48} />
              </div>
            )}
          </div>

          <div className="student-details">
            <h2>{student.full_name}</h2>
            <p>Admission #: {student.admission_number}</p>
            <p>Class: {student.student_class?.name || "N/A"}</p>
            <p>
              Status:{" "}
              <span className={`status-badge ${student.status.toLowerCase()}`}>
                {student.status}
              </span>
            </p>
          </div>
        </div>

        <StudentTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          student={student}
        />

        <div className="tab-content">
          {activeTab === "basic" && <BasicInfoTab student={student} />}
          {activeTab === "academics" && <AcademicInfoTab student={student} />}
          {activeTab === "attendance" && <AttendanceTab student={student} />}
          {activeTab === "documents" && <DocumentsTab student={student} />}
        </div>
      </div>
    </div>
  );
};

// Basic Info Tab Component
const BasicInfoTab = ({ student }) => {
  return (
    <div className="basic-info-tab">
      <div className="info-section">
        <h3>Personal Information</h3>
        <div className="info-grid">
          <div className="info-item">
            <label>First Name:</label>
            <span>{student.first_name}</span>
          </div>
          <div className="info-item">
            <label>Last Name:</label>
            <span>{student.last_name}</span>
          </div>
          <div className="info-item">
            <label>Date of Birth:</label>
            <span>{new Date(student.date_of_birth).toLocaleDateString()}</span>
          </div>
          <div className="info-item">
            <label>Age:</label>
            <span>{student.age} years</span>
          </div>
          <div className="info-item">
            <label>Gender:</label>
            <span>
              {student.gender === "M"
                ? "Male"
                : student.gender === "F"
                ? "Female"
                : "Not Specified"}
            </span>
          </div>
          <div className="info-item">
            <label>Admission Date:</label>
            <span>{new Date(student.admission_date).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <div className="info-section">
        <h3>Contact Information</h3>
        <div className="info-grid">
          <div className="info-item">
            <label>Email:</label>
            <span>{student.email || "N/A"}</span>
          </div>
          <div className="info-item">
            <label>Phone:</label>
            <span>{student.phone_number || "N/A"}</span>
          </div>
          <div className="info-item">
            <label>Address:</label>
            <span>{student.address || "N/A"}</span>
          </div>
        </div>
      </div>

      {student.parent && (
        <div className="info-section">
          <h3>Parent/Guardian Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>Parent Name:</label>
              <span>
                {student.parent.user?.first_name}{" "}
                {student.parent.user?.last_name}
              </span>
            </div>
            <div className="info-item">
              <label>Parent Email:</label>
              <span>{student.parent.user?.email}</span>
            </div>
            <div className="info-item">
              <label>Parent Phone:</label>
              <span>{student.parent.phone_number || "N/A"}</span>
            </div>
          </div>
        </div>
      )}

      {(student.medical_notes || student.special_needs) && (
        <div className="info-section">
          <h3>Additional Information</h3>
          <div className="info-grid">
            {student.medical_notes && (
              <div className="info-item full-width">
                <label>Medical Notes:</label>
                <span>{student.medical_notes}</span>
              </div>
            )}
            {student.special_needs && (
              <div className="info-item full-width">
                <label>Special Needs:</label>
                <span>{student.special_needs}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Academic Info Tab Component
const AcademicInfoTab = ({ student }) => {
  return (
    <div className="academic-info-tab">
      <div className="info-section">
        <h3>Academic Details</h3>
        <div className="info-grid">
          <div className="info-item">
            <label>Class:</label>
            <span>{student.student_class?.name || "N/A"}</span>
          </div>
          <div className="info-item">
            <label>Grade Level:</label>
            <span>{student.student_class?.grade_level || "N/A"}</span>
          </div>
          <div className="info-item">
            <label>Stream:</label>
            <span>{student.student_class?.stream?.name || "N/A"}</span>
          </div>
          <div className="info-item">
            <label>Class Teacher:</label>
            <span>{student.teacher_name || "N/A"}</span>
          </div>
          {student.performance_tier && (
            <div className="info-item">
              <label>Performance Tier:</label>
              <span
                className={`tier-badge tier-${student.performance_tier.toLowerCase()}`}
              >
                {student.performance_tier}
              </span>
            </div>
          )}
          {student.kcpe_marks && (
            <div className="info-item">
              <label>KCPE Marks:</label>
              <span>{student.kcpe_marks}/500</span>
            </div>
          )}
        </div>
      </div>

      <div className="info-section">
        <h3>Recent Performance</h3>
        <p className="placeholder-text">
          Academic records will be displayed here
        </p>
      </div>
    </div>
  );
};

// Attendance Tab Component
const AttendanceTab = ({ student }) => {
  const api = useApi();
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        setLoading(true);
        // FIX: Correct endpoint
        const response = await api.get(
          `/api/students/student-attendance/?student=${student.id}`
        );
        setAttendanceRecords(response.data.results || response.data || []);
      } catch (error) {
        console.error("Error fetching attendance:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [student.id]);

  if (loading) {
    return <div className="loading">Loading attendance records...</div>;
  }

  return (
    <div className="attendance-tab">
      <div className="info-section">
        <h3>Attendance Records</h3>
        {attendanceRecords.length === 0 ? (
          <p className="placeholder-text">No attendance records found</p>
        ) : (
          <table className="attendance-records-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Status</th>
                <th>Class</th>
                <th>Reason</th>
                <th>Recorded By</th>
              </tr>
            </thead>
            <tbody>
              {attendanceRecords.map((record) => (
                <tr key={record.id}>
                  <td>{new Date(record.date).toLocaleDateString()}</td>
                  <td>
                    <span
                      className={`status-badge ${record.status.toLowerCase()}`}
                    >
                      {record.status}
                    </span>
                  </td>
                  <td>{record.class_name || "N/A"}</td>
                  <td>{record.reason || "-"}</td>
                  <td>{record.recorded_by_name || "System"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

// Documents Tab Component
const DocumentsTab = ({ student }) => {
  return (
    <div className="documents-tab">
      <div className="info-section">
        <h3>Student Documents</h3>
        {student.documents && student.documents.length > 0 ? (
          <div className="documents-list">
            {student.documents.map((doc) => (
              <div key={doc.id} className="document-item">
                <span>{doc.title}</span>
                <a href={doc.file} download>
                  Download
                </a>
              </div>
            ))}
          </div>
        ) : (
          <p className="placeholder-text">No documents found</p>
        )}
      </div>
    </div>
  );
};

export default StudentProfile;
