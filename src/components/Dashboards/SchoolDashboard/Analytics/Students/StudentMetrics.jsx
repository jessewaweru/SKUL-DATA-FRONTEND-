const StudentMetrics = ({
  totalStudents,
  attendanceRate,
  dropoutRate,
  documentAccess,
}) => {
  return (
    <div className="student-metrics">
      <div className="metric-card">
        <h3>Total Students</h3>
        <p className="metric-value">{totalStudents || 0}</p>
      </div>
      <div className="metric-card">
        <h3>Avg. Attendance</h3>
        <p className="metric-value">
          {attendanceRate ? `${attendanceRate.toFixed(1)}%` : "N/A"}
        </p>
      </div>
      <div className="metric-card">
        <h3>Dropout Rate</h3>
        <p className="metric-value">
          {dropoutRate ? `${dropoutRate.toFixed(1)}%` : "N/A"}
        </p>
      </div>
      <div className="metric-card">
        <h3>Document Access</h3>
        <p className="metric-value">{documentAccess || 0}</p>
      </div>
    </div>
  );
};

export default StudentMetrics;
