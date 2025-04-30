const TeacherMetrics = ({ totalTeachers, averageLogins, reportAccuracy }) => {
  return (
    <div className="teacher-metrics">
      <div className="metric-card">
        <h3>Total Teachers</h3>
        <p className="metric-value">{totalTeachers || 0}</p>
      </div>
      <div className="metric-card">
        <h3>Avg. Logins (Weekly)</h3>
        <p className="metric-value">{averageLogins?.toFixed(1) || 0}</p>
      </div>
      <div className="metric-card">
        <h3>Report Accuracy</h3>
        <p className="metric-value">
          {reportAccuracy ? `${(reportAccuracy * 100).toFixed(1)}%` : "N/A"}
        </p>
      </div>
    </div>
  );
};

export default TeacherMetrics;
