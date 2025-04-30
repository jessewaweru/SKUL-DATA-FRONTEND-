const ClassMetrics = ({ totalClasses, avgClassSize, topPerformingClass }) => {
  return (
    <div className="class-metrics">
      <div className="metric-card">
        <h3>Total Classes</h3>
        <p className="metric-value">{totalClasses || 0}</p>
      </div>
      <div className="metric-card">
        <h3>Avg. Class Size</h3>
        <p className="metric-value">
          {avgClassSize ? avgClassSize.toFixed(1) : "N/A"}
        </p>
      </div>
      <div className="metric-card">
        <h3>Top Performing Class</h3>
        <p className="metric-value">{topPerformingClass?.name || "N/A"}</p>
        {topPerformingClass && (
          <p className="metric-subtext">{topPerformingClass.score} avg score</p>
        )}
      </div>
    </div>
  );
};

export default ClassMetrics;
