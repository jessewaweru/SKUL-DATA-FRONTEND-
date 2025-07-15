import { Link } from "react-router-dom";
import "../../SchoolDashboards/SchoolDashboardSection/Timetables/timetables.css";

const TimetableCard = ({ timetable, onActivate }) => {
  return (
    <div className={`timetable-card ${timetable.is_active ? "active" : ""}`}>
      <div className="timetable-header">
        <h3>
          {timetable.school_class.name} - {timetable.academic_year} Term{" "}
          {timetable.term}
        </h3>
        {timetable.is_active && <span className="active-badge">Active</span>}
      </div>
      <div className="timetable-details">
        <div className="detail">
          <span className="label">Lessons:</span>
          <span className="value">{timetable.lessons_count || 0}</span>
        </div>
        <div className="detail">
          <span className="label">Status:</span>
          <span className="value">
            {timetable.is_active ? "Active" : "Inactive"}
          </span>
        </div>
        <div className="detail">
          <span className="label">Created:</span>
          <span className="value">
            {new Date(timetable.created_at).toLocaleDateString()}
          </span>
        </div>
      </div>
      <div className="timetable-actions">
        <Link to={`/dashboard/timetables/${timetable.id}`} className="btn-view">
          View
        </Link>
        {!timetable.is_active && (
          <button
            className="btn-activate"
            onClick={() => onActivate(timetable.id)}
          >
            Activate
          </button>
        )}
      </div>
    </div>
  );
};

export default TimetableCard;
