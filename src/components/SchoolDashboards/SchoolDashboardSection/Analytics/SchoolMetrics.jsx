const SchoolMetrics = ({
  activeUsers,
  engagementRate,
  reportGenerationRate,
}) => {
  const formatValue = (value, suffix = "") => {
    if (value === null || value === undefined) return "N/A";
    if (typeof value === "number") {
      return suffix ? `${value.toFixed(1)}${suffix}` : value.toString();
    }
    return value;
  };

  return (
    <div className="school-metrics">
      <div className="metric-card">
        <h3>Active Users</h3>
        <p className="metric-value">{formatValue(activeUsers)}</p>
        <small className="metric-description">
          Total active users in the system
        </small>
      </div>

      <div className="metric-card">
        <h3>Engagement Rate</h3>
        <p className="metric-value">{formatValue(engagementRate, "%")}</p>
        <small className="metric-description">
          User interaction with the platform
        </small>
      </div>

      <div className="metric-card">
        <h3>Report Generation</h3>
        <p className="metric-value">{formatValue(reportGenerationRate, "%")}</p>
        <small className="metric-description">
          Completed report generation rate
        </small>
      </div>
    </div>
  );
};

export default SchoolMetrics;
