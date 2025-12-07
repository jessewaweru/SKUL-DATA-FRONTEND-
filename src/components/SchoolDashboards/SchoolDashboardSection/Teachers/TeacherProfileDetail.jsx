import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
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
import TeacherDocuments from "./TeacherDocuments";
import "./teachers.css";

const TeacherProfileDetail = () => {
  const { id, tab } = useParams(); // Get both id and tab from URL
  const navigate = useNavigate();
  const location = useLocation();
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

  // Set active tab based on URL parameter
  useEffect(() => {
    if (tab && tabs.find((t) => t.id === tab)) {
      setActiveTab(tab);
    } else {
      setActiveTab("profile");
    }
  }, [tab]);

  useEffect(() => {
    const loadTeacher = async () => {
      console.log("=== TeacherProfileDetail Debug ===");
      console.log("Teacher ID from params:", id);
      console.log("Tab from params:", tab);
      console.log("Current location:", location.pathname);

      if (!id) {
        console.error("No teacher ID in URL params");
        navigate("/dashboard/teachers/profiles", { replace: true });
        return;
      }

      try {
        setLoading(true);
        console.log("Loading teacher with ID:", id);
        const data = await fetchTeacherById(id);
        console.log("Teacher data loaded:", data);
        setTeacher(data);
      } catch (error) {
        console.error("Failed to fetch teacher:", error);
        alert(`Failed to load teacher: ${error.message}`);
        navigate("/dashboard/teachers/profiles", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadTeacher();
    } else {
      setLoading(false);
    }
  }, [id, navigate]);

  // Handle tab changes with URL updates
  const handleTabChange = (newTab) => {
    console.log("Changing tab to:", newTab);
    setActiveTab(newTab);

    // Update URL without navigation
    const newPath = `/dashboard/teachers/profiles/${id}/${newTab}`;
    window.history.pushState(null, "", newPath);
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <p>Loading teacher profile (ID: {id})...</p>
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="error-state">
        <p>Teacher not found (ID: {id})</p>
        <button onClick={() => navigate("/dashboard/teachers/profiles")}>
          Back to Teachers
        </button>
      </div>
    );
  }

  console.log("=== Render TeacherProfileDetail ===");
  console.log("Teacher ID:", id);
  console.log("Active tab:", activeTab);
  console.log("Teacher data:", teacher);

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
            {teacher.first_name?.charAt(0) || "T"}
            {teacher.last_name?.charAt(0) || "T"}
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
                Joined{" "}
                {teacher.hire_date
                  ? new Date(teacher.hire_date).toLocaleDateString()
                  : "Unknown"}
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

      {/* Custom tab navigation without automatic routing */}
      <div className="tab-navigation">
        {tabs.map((tabItem) => (
          <button
            key={tabItem.id}
            className={`tab ${activeTab === tabItem.id ? "active" : ""}`}
            onClick={() => handleTabChange(tabItem.id)}
          >
            {tabItem.label}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {activeTab === "profile" && (
          <div className="profile-content">
            <div className="profile-details-grid">
              <div className="detail-section">
                <h3>Personal Information</h3>
                <div className="detail-card">
                  <div className="detail-item">
                    <span className="detail-label">Full Name:</span>
                    <span className="detail-value">
                      {teacher.first_name} {teacher.last_name}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Email:</span>
                    <span className="detail-value">{teacher.email}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Phone:</span>
                    <span className="detail-value">
                      {teacher.phone_number || "Not provided"}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Status:</span>
                    <span className="detail-value">
                      <StatusBadge status={teacher.status} />
                    </span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Professional Information</h3>
                <div className="detail-card">
                  <div className="detail-item">
                    <span className="detail-label">Qualification:</span>
                    <span className="detail-value">
                      {teacher.qualification || "Not specified"}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Specialization:</span>
                    <span className="detail-value">
                      {teacher.specialization || "Not specified"}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Years of Experience:</span>
                    <span className="detail-value">
                      {teacher.years_of_experience || "0"} years
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Hire Date:</span>
                    <span className="detail-value">
                      {teacher.hire_date
                        ? new Date(teacher.hire_date).toLocaleDateString()
                        : "Not available"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Office Information</h3>
                <div className="detail-card">
                  <div className="detail-item">
                    <span className="detail-label">Office Location:</span>
                    <span className="detail-value">
                      {teacher.office_location || "Not specified"}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Office Hours:</span>
                    <span className="detail-value">
                      {teacher.office_hours || "Not specified"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Roles & Responsibilities</h3>
                <div className="detail-card">
                  <div className="detail-item">
                    <span className="detail-label">Class Teacher:</span>
                    <span className="detail-value">
                      {teacher.is_class_teacher ? "Yes" : "No"}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Department Head:</span>
                    <span className="detail-value">
                      {teacher.is_department_head ? "Yes" : "No"}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Administrator:</span>
                    <span className="detail-value">
                      {teacher.is_administrator ? "Yes" : "No"}
                    </span>
                  </div>
                </div>
              </div>

              {teacher.bio && (
                <div className="detail-section full-width">
                  <h3>Bio</h3>
                  <div className="detail-card">
                    <p className="bio-text">{teacher.bio}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "classes" && (
          <div className="classes-content">
            <h3>Assigned Classes</h3>
            {teacher.assigned_classes_ids?.length > 0 ? (
              <div className="classes-grid">
                {teacher.assigned_classes_ids.map((classId, index) => (
                  <div key={classId} className="class-card">
                    <h4>Class {classId}</h4>
                    <p>Class details will be displayed here</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>No classes assigned to this teacher</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "subjects" && (
          <div className="subjects-content">
            <h3>Subjects Taught</h3>
            {teacher.subjects_taught?.length > 0 ? (
              <div className="subjects-grid">
                {teacher.subjects_taught.map((subject, index) => (
                  <div key={index} className="subject-card">
                    <h4>{subject.name || subject}</h4>
                    <p>Subject details will be displayed here</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>No subjects assigned to this teacher</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "reports" && (
          <div className="reports-content">
            <h3>Teacher Reports</h3>
            <div className="empty-state">
              <p>Teacher reports will be displayed here</p>
            </div>
          </div>
        )}

        {activeTab === "documents" && (
          <div className="documents-content">
            <h3>
              Documents for {teacher.first_name} {teacher.last_name}
            </h3>
            <p className="debug-info">
              Passing Teacher ID: {id} (Type: {typeof id})
            </p>
            <TeacherDocuments teacherId={id} />
          </div>
        )}

        {activeTab === "activity" && (
          <div className="activity-content">
            <h3>Activity Logs</h3>
            <div className="empty-state">
              <p>Teacher activity logs will be displayed here</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherProfileDetail;
