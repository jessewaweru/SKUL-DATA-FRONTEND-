// components/SchoolDashboard/Students/StudentProfile.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApi } from "../../../../hooks/useApi";
import { FiArrowLeft, FiEdit, FiMail, FiUserPlus } from "react-icons/fi";
import StudentTabs from "./StudentTabs";
import "../Students/students.css";

const StudentProfile = () => {
  const { studentId } = useParams();
  const api = useApi();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("basic");

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/students/${studentId}/`);
        setStudent(response.data);
      } catch (error) {
        console.error("Error fetching student:", error);
        navigate("/dashboard/students");
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [studentId]);

  const handlePromote = async () => {
    // Implement promotion logic
  };

  const handleDeactivate = async () => {
    if (!window.confirm("Are you sure you want to deactivate this student?"))
      return;
    try {
      await api.post(`/students/${studentId}/deactivate/`, {
        reason: "Deactivated by admin",
      });
      // Refresh student data
      const response = await api.get(`/students/${studentId}/`);
      setStudent(response.data);
    } catch (error) {
      console.error("Error deactivating student:", error);
    }
  };

  if (loading) return <div className="loading">Loading student data...</div>;
  if (!student) return <div>Student not found</div>;

  return (
    <div className="student-profile">
      <div className="profile-header">
        <button onClick={() => navigate(-1)} className="back-btn">
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
            <button
              onClick={() => handleRestore(studentId)}
              className="restore-btn"
            >
              <FiUserPlus /> Restore
            </button>
          )}

          <button
            onClick={() => {
              /* Implement send message */
            }}
            className="message-btn"
          >
            <FiMail /> Message Parent
          </button>
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
              Status:
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

export default StudentProfile;
