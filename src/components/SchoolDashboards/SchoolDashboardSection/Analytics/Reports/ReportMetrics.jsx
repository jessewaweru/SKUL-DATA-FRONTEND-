const ReportMetrics = ({ reportsGenerated, mostAccessed, missingReports }) => {
  return (
    <div className="report-metrics">
      <div className="metric-card">
        <h3>Reports Generated</h3>
        <p className="metric-value">{reportsGenerated || 0}</p>
      </div>
      <div className="metric-card">
        <h3>Most Accessed</h3>
        <p className="metric-value">{mostAccessed || "N/A"}</p>
      </div>
      <div className="metric-card">
        <h3>Missing Reports</h3>
        <p className="metric-value">{missingReports || 0}</p>
      </div>
    </div>
  );
};

export default ReportMetrics;
