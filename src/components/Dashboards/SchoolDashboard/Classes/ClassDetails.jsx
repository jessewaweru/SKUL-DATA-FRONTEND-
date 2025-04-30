import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApi } from "../../../../hooks/useApi";
import {
  FiUsers,
  FiUser,
  FiFileText,
  FiBarChart2,
  FiCalendar,
  FiArrowLeft,
} from "react-icons/fi";
import PromoteClassModal from "./PromoteClassModal";
import AssignTeacherModal from "./AssignTeacherModal";
import StudentPerformanceTable from "./StudentPerformanceTable";
import ClassAttendanceSummary from "./ClassAttendance";
import "../Classes/classes.css";

const ClassDetails = ({ onUpdate }) => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const api = useApi();
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("students");
  const [showPromoteModal, setShowPromoteModal] = useState(false);
  const [showTeacherModal, setShowTeacherModal] = useState(false);

  useEffect(() => {
    const fetchClassDetails = async () => {
      try {
        const response = await api.get(`/classes/${classId}/`);
        setClassData(response.data);
      } catch (error) {
        console.error("Error fetching class details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClassDetails();
  }, [classId, onUpdate]);

  const handlePromoteSuccess = (promotedClass) => {
    navigate(`/classes/manage/${promotedClass.id}`);
    onUpdate();
  };

  if (loading) return <div>Loading class details...</div>;
  if (!classData) return <div>Class not found</div>;

  const className = `${classData.grade_level} ${
    classData.stream?.name || ""
  }`.trim();

  return (
    <div className="class-details-container">
      <button className="back-button" onClick={() => navigate(-1)}>
        <FiArrowLeft /> Back to Classes
      </button>

      <div className="class-header">
        <h1>{className}</h1>
        <div className="class-meta">
          <span>Academic Year: {classData.academic_year}</span>
          <span>Room: {classData.room_number || "Not assigned"}</span>
          <span>Status: {classData.is_active ? "Active" : "Archived"}</span>
        </div>
      </div>

      <div className="class-actions">
        <button
          className="action-btn promote-btn"
          onClick={() => setShowPromoteModal(true)}
        >
          Promote Class
        </button>
        <button
          className="action-btn archive-btn"
          onClick={() => {
            /* Archive functionality */
          }}
        >
          {classData.is_active ? "Archive Class" : "Activate Class"}
        </button>
      </div>

      <div className="class-tabs">
        <button
          className={`tab-btn ${activeTab === "students" ? "active" : ""}`}
          onClick={() => setActiveTab("students")}
        >
          <FiUsers /> Students
        </button>
        <button
          className={`tab-btn ${activeTab === "teacher" ? "active" : ""}`}
          onClick={() => setActiveTab("teacher")}
        >
          <FiUser /> Teacher
        </button>
        <button
          className={`tab-btn ${activeTab === "documents" ? "active" : ""}`}
          onClick={() => setActiveTab("documents")}
        >
          <FiFileText /> Documents
        </button>
        <button
          className={`tab-btn ${activeTab === "reports" ? "active" : ""}`}
          onClick={() => setActiveTab("reports")}
        >
          <FiBarChart2 /> Reports
        </button>
        <button
          className={`tab-btn ${activeTab === "attendance" ? "active" : ""}`}
          onClick={() => setActiveTab("attendance")}
        >
          <FiCalendar /> Attendance
        </button>
      </div>

      <div className="tab-content">
        {activeTab === "students" && (
          <div className="students-tab">
            <StudentPerformanceTable
              students={classData.students}
              classId={classId}
            />
            <button
              className="add-students-btn"
              onClick={() => navigate(`/classes/manage/${classId}/students`)}
            >
              Add/Remove Students
            </button>
          </div>
        )}

        {activeTab === "teacher" && (
          <div className="teacher-tab">
            {classData.class_teacher ? (
              <div className="teacher-info">
                <h3>{classData.class_teacher.user.full_name}</h3>
                <p>Email: {classData.class_teacher.user.email}</p>
                <p>
                  Phone:{" "}
                  {classData.class_teacher.phone_number || "Not provided"}
                </p>
                <button
                  className="change-teacher-btn"
                  onClick={() => setShowTeacherModal(true)}
                >
                  Change Teacher
                </button>
              </div>
            ) : (
              <div className="no-teacher">
                <p>No teacher assigned</p>
                <button
                  className="assign-teacher-btn"
                  onClick={() => setShowTeacherModal(true)}
                >
                  Assign Teacher
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === "attendance" && (
          <ClassAttendanceSummary classId={classId} />
        )}

        {/* Other tabs would be implemented similarly */}
      </div>

      {showPromoteModal && (
        <PromoteClassModal
          classData={classData}
          onClose={() => setShowPromoteModal(false)}
          onPromote={handlePromoteSuccess}
        />
      )}

      {showTeacherModal && (
        <AssignTeacherModal
          classId={classId}
          currentTeacher={classData.class_teacher}
          onClose={() => setShowTeacherModal(false)}
          onSuccess={(updatedClass) => {
            setClassData(updatedClass);
            onUpdate();
          }}
        />
      )}
    </div>
  );
};

export default ClassDetails;
