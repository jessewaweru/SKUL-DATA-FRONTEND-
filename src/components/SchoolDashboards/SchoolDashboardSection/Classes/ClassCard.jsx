import { Link } from "react-router-dom";
import {
  FiUsers,
  FiBarChart2,
  FiActivity,
  FiFileText,
  FiCalendar,
} from "react-icons/fi";
import "./classes.css";

const ClassCard = ({ classData }) => {
  const className = `${classData.grade_level} ${
    classData.stream?.name || ""
  }`.trim();

  return (
    <div className="class-card-container">
      <Link
        to={`/dashboard/classes/manage/${classData.id}`}
        className="class-card"
      >
        <div className="class-header">
          <h3>{className}</h3>
          <span className="academic-year">{classData.academic_year}</span>
        </div>

        <div className="class-teacher">
          {classData.class_teacher?.user?.full_name
            ? `Teacher: ${classData.class_teacher.user.full_name}`
            : "No teacher assigned"}
        </div>

        <div className="class-stats">
          <div className="stat">
            <FiUsers />
            <span>{classData.student_count} Students</span>
          </div>
          {classData.average_performance && (
            <div className="stat">
              <FiBarChart2 />
              <span>Avg: {classData.average_performance}%</span>
            </div>
          )}
        </div>
      </Link>

      <div className="class-actions">
        <Link
          to={`/dashboard/classes/analytics/${classData.id}`}
          className="action-link"
        >
          <FiActivity /> View Analytics
        </Link>
        <Link
          to={`/dashboard/classes/attendance/${classData.id}`}
          className="action-link"
        >
          <FiCalendar /> Take Attendance
        </Link>
        <Link
          to={`/dashboard/classes/documents/${classData.id}`}
          className="action-link"
        >
          <FiFileText /> View Documents
        </Link>
      </div>
    </div>
  );
};

export default ClassCard;
