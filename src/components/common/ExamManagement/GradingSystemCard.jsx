import "../../SchoolDashboards/SchoolDashboardSection/Exams/exammanagement.css";

const GradingSystemCard = ({ system, onDelete, onSetDefault }) => {
  return (
    <div
      className={`grading-system-card ${
        system.is_default ? "default-system" : ""
      }`}
    >
      <div className="grading-system-header">
        <h3>
          {system.name}
          {system.is_default && <span className="default-badge">Default</span>}
        </h3>
        <div className="grading-system-actions">
          {!system.is_default && (
            <button
              className="btn-primary small"
              onClick={() => onSetDefault(system.id)}
            >
              Set Default
            </button>
          )}
          <button
            className="btn-danger small"
            onClick={() => onDelete(system.id)}
          >
            Delete
          </button>
        </div>
      </div>

      <div className="grade-ranges-table">
        <table>
          <thead>
            <tr>
              <th>Min Score</th>
              <th>Max Score</th>
              <th>Grade</th>
              <th>Remark</th>
            </tr>
          </thead>
          <tbody>
            {system.grade_ranges.map((range, index) => (
              <tr key={index}>
                <td>{range.min_score}</td>
                <td>{range.max_score}</td>
                <td>{range.grade}</td>
                <td>{range.remark || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GradingSystemCard;
