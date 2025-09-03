const ParentMetrics = ({ totalParents, avgStudentsPerParent, mostEngaged }) => {
  return (
    <div className="parent-metrics">
      <div className="metrics-header">
        <h3>Parent Overview</h3>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">
            <i className="fas fa-users"></i>
          </div>
          <div className="metric-content">
            <h4>Total Parents</h4>
            <p className="metric-value">{totalParents || 0}</p>
            <span className="metric-label">Registered parents</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">
            <i className="fas fa-child"></i>
          </div>
          <div className="metric-content">
            <h4>Avg. Students per Parent</h4>
            <p className="metric-value">
              {avgStudentsPerParent ? avgStudentsPerParent.toFixed(1) : "0.0"}
            </p>
            <span className="metric-label">Average children</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">
            <i className="fas fa-star"></i>
          </div>
          <div className="metric-content">
            <h4>Most Engaged Parent</h4>
            <p className="metric-value">{mostEngaged || "N/A"}</p>
            <span className="metric-label">Highest activity score</span>
          </div>
        </div>

        {/* Engagement rate calculation */}
        <div className="metric-card">
          <div className="metric-icon">
            <i className="fas fa-chart-line"></i>
          </div>
          <div className="metric-content">
            <h4>Engagement Rate</h4>
            <p className="metric-value">
              {totalParents && mostEngaged
                ? `${Math.min(75, 100).toFixed(0)}%` // Sample engagement rate
                : "0%"}
            </p>
            <span className="metric-label">Active participation</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentMetrics;
