import { FiCalendar, FiClock, FiCheck, FiUpload } from "react-icons/fi";
import "../../SchoolDashboards/SchoolDashboardSection/Exams/exammanagement.css";

const ExamStatsCard = ({ title, value, icon }) => {
  const getIcon = () => {
    switch (icon) {
      case "calendar":
        return <FiCalendar size={24} />;
      case "clock":
        return <FiClock size={24} />;
      case "check":
        return <FiCheck size={24} />;
      case "publish":
        return <FiUpload size={24} />;
      default:
        return <FiCalendar size={24} />;
    }
  };

  return (
    <div className="exam-stats-card">
      <div className="stats-icon">{getIcon()}</div>
      <div className="stats-content">
        <h3>{title}</h3>
        <p>{value}</p>
      </div>
    </div>
  );
};

export default ExamStatsCard;
