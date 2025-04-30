import { FiTrendingUp, FiTrendingDown, FiMinus } from "react-icons/fi";

const StatCard = ({
  icon,
  title,
  value,
  trend = "neutral",
  trendValue = "",
  onClick,
}) => {
  return (
    <div
      className={`stat-card ${onClick ? "clickable" : ""}`}
      onClick={onClick}
    >
      <div className="card-icon">{icon}</div>
      <div className="card-content">
        <h3 className="card-title">{title}</h3>
        <p className="card-value">{value}</p>
        {(trend !== "neutral" || trendValue) && (
          <div className={`card-trend ${trend}`}>
            {trend === "up" && <FiTrendingUp />}
            {trend === "down" && <FiTrendingDown />}
            {trend === "neutral" && <FiMinus />}
            {trendValue && <span>{trendValue}</span>}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
