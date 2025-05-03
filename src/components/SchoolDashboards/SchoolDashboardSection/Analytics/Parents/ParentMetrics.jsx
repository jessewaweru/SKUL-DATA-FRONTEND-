const ParentMetrics = ({ totalParents, avgStudentsPerParent, mostEngaged }) => {
  return (
    <div className="parent-metrics">
      <div className="metric-card">
        <h3>Total Parents</h3>
        <p className="metric-value">{totalParents || 0}</p>
      </div>
      <div className="metric-card">
        <h3>Avg. Students per Parent</h3>
        <p className="metric-value">
          {avgStudentsPerParent ? avgStudentsPerParent.toFixed(1) : "N/A"}
        </p>
      </div>
      <div className="metric-card">
        <h3>Most Engaged Parent</h3>
        <p className="metric-value">{mostEngaged || "N/A"}</p>
      </div>
    </div>
  );
};

export default ParentMetrics;
