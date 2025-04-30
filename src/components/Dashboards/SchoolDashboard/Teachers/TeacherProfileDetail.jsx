// components/SchoolDashboard/Teachers/TeacherProfileDetail.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiEdit,
  FiMail,
  FiPhone,
  FiCalendar,
  FiBook,
  FiUsers,
  FiFileText,
} from "react-icons/fi";
import { fetchTeacherById } from "../../../../services/teacherService";
import StatusBadge from "../../../common/StatusBadge";
import TabNavigation from "../../../common/TabNavigation";
import "../Teachers/teachers.css";

const TeacherProfileDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");

  const tabs = [
    { id: "profile", label: "Profile" },
    { id: "classes", label: "Classes" },
    { id: "subjects", label: "Subjects" },
    { id: "reports", label: "Reports" },
    { id: "documents", label: "Documents" },
    { id: "activity", label: "Activity" },
  ];

  useEffect(() => {
    const loadTeacher = async () => {
      try {
        const data = await fetchTeacherById(id);
        setTeacher(data);
      } catch (error) {
        console.error("Failed to fetch teacher:", error);
        navigate("/dashboard/teachers/profiles", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    loadTeacher();
  }, [id, navigate]);

  if (loading) {
    return <div className="loading-spinner">Loading teacher profile...</div>;
  }

  if (!teacher) {
    return <div>Teacher not found</div>;
  }

  return (
    <div className="teacher-profile-detail">
      <div className="profile-header">
        <button onClick={() => navigate(-1)} className="back-button">
          <FiArrowLeft /> Back to Teachers
        </button>
        <div className="header-actions">
          <button
            onClick={() => navigate(`/dashboard/teachers/profiles/${id}/edit`)}
            className="edit-button"
          >
            <FiEdit /> Edit Profile
          </button>
        </div>
      </div>

      <div className="profile-overview">
        <div className="teacher-avatar-section">
          <div className="teacher-avatar">
            {teacher.first_name.charAt(0)}
            {teacher.last_name.charAt(0)}
          </div>
          <div className="status-badge">
            <StatusBadge status={teacher.status} />
          </div>
        </div>
        <div className="info-section">
          <h2>
            {teacher.first_name} {teacher.last_name}
          </h2>
          <div className="info-grid">
            <div className="info-item">
              <FiMail className="info-icon" />
              <span>{teacher.email}</span>
            </div>
            <div className="info-item">
              <FiPhone className="info-icon" />
              <span>{teacher.phone_number || "Not provided"}</span>
            </div>
            <div className="info-item">
              <FiCalendar className="info-icon" />
              <span>
                Joined {new Date(teacher.hire_date).toLocaleDateString()}
              </span>
            </div>
            <div className="info-item">
              <FiBook className="info-icon" />
              <span>{teacher.qualification || "Not specified"}</span>
            </div>
            <div className="info-item">
              <FiUsers className="info-icon" />
              <span>{teacher.assigned_classes_ids?.length || 0} classes</span>
            </div>
            <div className="info-item">
              <FiFileText className="info-icon" />
              <span>{teacher.subjects_taught?.length || 0} subjects</span>
            </div>
          </div>
        </div>
      </div>

      <TabNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        basePath={`/dashboard/teachers/profiles/${id}`}
      />

      <div className="tab-content">
        {activeTab === "profile" && (
          <div className="profile-content">
            <div className="bio-section">
              <h3>Bio</h3>
              <p>{teacher.bio || "No bio provided"}</p>
            </div>
            <div className="details-section">
              <div className="detail-card">
                <h4>Specialization</h4>
                <p>{teacher.specialization || "Not specified"}</p>
              </div>
              <div className="detail-card">
                <h4>Years of Experience</h4>
                <p>{teacher.years_of_experience || "0"}</p>
              </div>
              <div className="detail-card">
                <h4>Office Location</h4>
                <p>{teacher.office_location || "Not specified"}</p>
              </div>
              <div className="detail-card">
                <h4>Office Hours</h4>
                <p>{teacher.office_hours || "Not specified"}</p>
              </div>
            </div>
          </div>
        )}
        {activeTab === "classes" && (
          <div className="classes-content">
            {/* Class assignments content */}
            <p>Class assignments will be displayed here</p>
          </div>
        )}
        {activeTab === "subjects" && (
          <div className="subjects-content">
            {/* Subjects taught content */}
            <p>Subjects taught will be displayed here</p>
          </div>
        )}
        {activeTab === "reports" && (
          <div className="reports-content">
            {/* Reports content */}
            <p>Teacher reports will be displayed here</p>
          </div>
        )}
        {activeTab === "documents" && (
          <div className="documents-content">
            {/* Documents content */}
            <p>Teacher documents will be displayed here</p>
          </div>
        )}
        {activeTab === "activity" && (
          <div className="activity-content">
            {/* Activity logs content */}
            <p>Teacher activity logs will be displayed here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherProfileDetail;
