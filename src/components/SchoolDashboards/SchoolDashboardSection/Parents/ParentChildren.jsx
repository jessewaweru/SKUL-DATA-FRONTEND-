import { useOutletContext } from "react-router-dom";
import "../Parents/parents.css";

const ParentChildren = () => {
  const { parent } = useOutletContext();

  if (!parent) {
    return <div className="loading-container">Loading parent data...</div>;
  }

  const children = parent.children_details || parent.children || [];

  return (
    <div className="parent-children">
      <div className="section-header">
        <h3>Children</h3>
        <button className="add-button">Assign Child</button>
      </div>

      {children.length > 0 ? (
        <div className="children-grid">
          {children.map((child) => (
            <ChildCard key={child.id} child={child} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          No children assigned to this parent yet
        </div>
      )}
    </div>
  );
};

const ChildCard = ({ child }) => {
  return (
    <div className="child-card">
      <div className="child-header">
        <div className="child-avatar">
          {child.first_name?.[0] || ""}
          {child.last_name?.[0] || ""}
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

export default ParentChildren;
