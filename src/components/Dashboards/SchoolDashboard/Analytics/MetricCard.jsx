import { FiUser, FiBook, FiFileText, FiBarChart2 } from "react-icons/fi";
import "../Analytics/analytics.css";

const iconComponents = {
  teacher: FiUser,
  attendance: FiUser,
  document: FiFileText,
  class: FiBook,
  report: FiBarChart2,
};

const MetricCard = ({ title, value, change, icon, trend }) => {
  const IconComponent = iconComponents[icon] || FiBarChart2;

  return (
    <div className="metric-card">
      <div className="metric-icon">
        <IconComponent />
      </div>
      <div className="metric-content">
        <h3 className="metric-title">{title}</h3>
        <p className="metric-value">{value}</p>
        <div className={`metric-change ${trend}`}>
          {trend === "up" ? "↑" : "↓"} {change}%
        </div>
      </div>
    </div>
  );
};

export default MetricCard;
