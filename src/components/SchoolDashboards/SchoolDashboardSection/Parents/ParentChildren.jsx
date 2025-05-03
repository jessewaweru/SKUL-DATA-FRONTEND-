import "../Parents/parents.css";

const ParentChildren = ({ parent }) => {
  return (
    <div className="parent-children">
      <div className="section-header">
        <h3>Children</h3>
        <button className="add-button">Assign Child</button>
      </div>

      <div className="children-grid">
        {parent.children.map((child) => (
          <ChildCard key={child.id} child={child} />
        ))}
      </div>
    </div>
  );
};
export default ParentChildren;

const ChildCard = ({ child }) => {
  return (
    <div className="child-card">
      <div className="child-header">
        <div className="child-avatar">
          {child.first_name[0]}
          {child.last_name[0]}
        </div>
        <div className="child-info">
          <h4>
            {child.first_name} {child.last_name}
          </h4>
          <span className="class-badge">
            {child.school_class?.name || "No class"}
          </span>
        </div>
      </div>

      <div className="child-stats">
        <div className="stat-item">
          <span>Performance</span>
          <span className="performance-badge good">B+</span>
        </div>
        <div className="stat-item">
          <span>Attendance</span>
          <span className="attendance-rate">94%</span>
        </div>
      </div>

      <div className="child-actions">
        <button className="view-reports">View Reports</button>
        <button className="view-attendance">Attendance</button>
      </div>
    </div>
  );
};
