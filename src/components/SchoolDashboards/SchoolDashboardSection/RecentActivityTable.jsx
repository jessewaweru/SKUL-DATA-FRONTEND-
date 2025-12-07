import { FiActivity, FiMoreHorizontal, FiArrowUpRight } from "react-icons/fi";
import "../SchoolDashboardSection/dashboard.css";

const RecentActivityTable = ({ activities = [] }) => {
  // Category color mapping
  const getCategoryColor = (category) => {
    const colors = {
      CREATE: "#10b981",
      UPDATE: "#3b82f6",
      DELETE: "#ef4444",
      VIEW: "#8b5cf6",
      LOGIN: "#06b6d4",
      LOGOUT: "#f59e0b",
      UPLOAD: "#ec4899",
      DOWNLOAD: "#14b8a6",
      SHARE: "#522978ff",
      SYSTEM: "#6366f1",
      OTHER: "#9ca3af",
    };
    return colors[category] || colors["OTHER"];
  };

  return (
    <div className="table-container">
      <div className="table-header">
        <div>
          <h3 className="table-title">
            <FiActivity /> Recent Activity
          </h3>
          <p
            style={{
              fontSize: "0.875rem",
              color: "#b0b0b0",
              marginTop: "0.25rem",
            }}
          >
            Latest actions performed in the system
          </p>
        </div>
        <button className="see-all-button">See all</button>
      </div>

      {activities && activities.length > 0 ? (
        <table className="data-table">
          <TableHead />
          <tbody>
            {activities.map((activity, index) => (
              <TableRow
                key={activity.id}
                user={activity.user}
                action={activity.action}
                category={activity.category}
                categoryColor={getCategoryColor(activity.category)}
                timestamp={activity.timestamp}
                affectedModel={activity.affectedModel}
                orderAccessed={index + 1}
              />
            ))}
          </tbody>
        </table>
      ) : (
        <div
          style={{
            padding: "2rem",
            textAlign: "center",
            color: "var(--text-color)",
          }}
        >
          No recent activity to display
        </div>
      )}
    </div>
  );
};

export default RecentActivityTable;

const TableHead = () => {
  return (
    <thead>
      <tr className="table-head-row">
        <th className="table-head-cell">User</th>
        <th className="table-head-cell">Action</th>
        <th className="table-head-cell">Category</th>
        <th className="table-head-cell">Affected Model</th>
        <th className="table-head-cell">Timestamp</th>
        <th className="cell-width-options"></th>
      </tr>
    </thead>
  );
};

const TableRow = ({
  user,
  action,
  category,
  categoryColor,
  timestamp,
  affectedModel,
  orderAccessed,
}) => {
  return (
    <tr className={orderAccessed % 2 ? "table-row-odd" : "table-row-even"}>
      <td className="table-cell">
        <span style={{ fontWeight: 600, color: "var(--highlight-text)" }}>
          {user}
        </span>
      </td>
      <td className="table-cell" style={{ maxWidth: "300px" }}>
        <span
          style={{
            fontSize: "0.875rem",
            display: "block",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {action}
        </span>
      </td>
      <td className="table-cell">
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "0.25rem 0.5rem",
            borderRadius: "0.25rem",
            fontSize: "0.75rem",
            fontWeight: 600,
            backgroundColor: `${categoryColor}20`,
            color: categoryColor,
            border: `1px solid ${categoryColor}40`,
          }}
        >
          {category}
        </span>
      </td>
      <td className="table-cell">
        <span style={{ color: "#b0b0b0", fontSize: "0.875rem" }}>
          {affectedModel}
        </span>
      </td>
      <td className="table-cell">
        <span style={{ fontSize: "0.875rem" }}>{timestamp}</span>
      </td>
      <td className="cell-width-options">
        <button className="action-button">
          <FiMoreHorizontal />
        </button>
      </td>
    </tr>
  );
};
