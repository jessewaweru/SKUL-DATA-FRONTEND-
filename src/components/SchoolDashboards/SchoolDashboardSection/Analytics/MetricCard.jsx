import {
  FiUser,
  FiBook,
  FiFileText,
  FiBarChart2,
  FiUsers,
  FiTrendingUp,
} from "react-icons/fi";
import "../Analytics/analytics.css";

const iconComponents = {
  teacher: FiUser,
  attendance: FiUsers,
  document: FiFileText,
  class: FiBook,
  report: FiBarChart2,
  trend: FiTrendingUp,
};

const MetricCard = ({ title, value, change, icon, trend = "up" }) => {
  const IconComponent = iconComponents[icon] || FiBarChart2;

  // Ensure change is a number
  const numericChange =
    typeof change === "number" ? change : parseFloat(change) || 0;

  // Format the change value appropriately
  const formatChange = (changeValue) => {
    if (changeValue === 0) return "0";
    if (changeValue < 1 && changeValue > 0) return changeValue.toFixed(1);
    return Math.round(changeValue).toString();
  };

  return (
    <div className="metric-card">
      <div className="metric-icon">
        <IconComponent size={24} />
      </div>
      <div className="metric-content">
        <h3 className="metric-title">{title}</h3>
        <p className="metric-value">{value || "N/A"}</p>
        <div className={`metric-change ${trend}`}>
          {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"}
          {icon === "teacher" || icon === "document" || icon === "report"
            ? ` ${formatChange(numericChange)} total`
            : ` ${formatChange(numericChange)}%`}
        </div>
      </div>
    </div>
  );
};

export default MetricCard;
