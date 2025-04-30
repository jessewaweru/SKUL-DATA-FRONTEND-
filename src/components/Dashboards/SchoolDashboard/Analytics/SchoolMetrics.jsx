const SchoolMetrics = ({
  activeUsers,
  engagementRate,
  reportGenerationRate,
}) => {
  return (
    <div className="school-metrics">
      <div className="metric-card">
        <h3>Active Users</h3>
        <p className="metric-value">{activeUsers || 0}</p>
      </div>
      <div className="metric-card">
        <h3>Engagement Rate</h3>
        <p className="metric-value">
          {engagementRate ? `${engagementRate.toFixed(1)}%` : "N/A"}
        </p>
      </div>
      <div className="metric-card">
        <h3>Report Generation</h3>
        <p className="metric-value">
          {reportGenerationRate ? `${reportGenerationRate.toFixed(1)}%` : "N/A"}
        </p>
      </div>
    </div>
  );
};

export default SchoolMetrics;
