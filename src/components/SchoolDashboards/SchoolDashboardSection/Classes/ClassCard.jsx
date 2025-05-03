import { Link } from "react-router-dom";
import { FiUsers, FiBarChart2 } from "react-icons/fi";
import "../Classes/classes.css";

const ClassCard = ({ classData }) => {
  const className = `${classData.grade_level} ${
    classData.stream?.name || ""
  }`.trim();

  return (
    <Link to={`/classes/manage/${classData.id}`} className="class-card">
      <div className="class-header">
        <h3>{className}</h3>
        <span className="academic-year">{classData.academic_year}</span>
      </div>

      <div className="class-teacher">
        {classData.class_teacher
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
  );
};

export default ClassCard;
