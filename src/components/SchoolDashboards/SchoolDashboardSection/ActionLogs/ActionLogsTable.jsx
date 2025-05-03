import { FiArrowUpRight, FiClock, FiUser, FiDatabase } from "react-icons/fi";
import { format } from "date-fns";

const ActionLogsTable = ({
  logs,
  loading,
  onRowClick,
  pagination,
  onPageChange,
}) => {
  const renderCategoryIcon = (category) => {
    switch (category) {
      case "CREATE":
        return <span className="badge create">Create</span>;
      case "UPDATE":
        return <span className="badge update">Update</span>;
      case "DELETE":
        return <span className="badge delete">Delete</span>;
      case "VIEW":
        return <span className="badge view">View</span>;
      case "LOGIN":
        return <span className="badge login">Login</span>;
      case "LOGOUT":
        return <span className="badge logout">Logout</span>;
      default:
        return <span className="badge other">Other</span>;
    }
  };

  if (loading && logs.length === 0) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading action logs...</p>
      </div>
    );
  }

  if (!loading && logs.length === 0) {
    return (
      <div className="empty-state">
        <p>No action logs found matching your filters</p>
      </div>
    );
  }

  return (
    <div className="action-logs-table-container">
      <table className="action-logs-table">
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>User</th>
            <th>Action Type</th>
            <th>Action</th>
            <th>Affected Model</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id} onClick={() => onRowClick(log)}>
              <td>
                <div className="timestamp-cell">
                  <FiClock />
                  {format(new Date(log.timestamp), "MMM d, yyyy HH:mm")}
                </div>
              </td>
              <td>
                <div className="user-cell">
                  <FiUser />
                  <span className="user-tag">{log.user_tag}</span>
                  {log.user_details && (
                    <span className="user-name">
                      {log.user_details.first_name} {log.user_details.last_name}
                    </span>
                  )}
                </div>
              </td>
              <td>
                <div className="category-cell">
                  {renderCategoryIcon(log.category)}
                </div>
              </td>
              <td className="action-cell">
                <div className="action-text">{log.action}</div>
              </td>
              <td>
                <div className="model-cell">
                  <FiDatabase />
                  {log.affected_model || "System"}
                </div>
              </td>
              <td className="action-arrow">
                <FiArrowUpRight />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination-controls">
        <button
          disabled={pagination.page === 1}
          onClick={() => onPageChange(pagination.page - 1)}
        >
          Previous
        </button>

        <span>
          Page {pagination.page} of{" "}
          {Math.ceil(pagination.totalCount / pagination.pageSize)}
        </span>

        <button
          disabled={
            pagination.page * pagination.pageSize >= pagination.totalCount
          }
          onClick={() => onPageChange(pagination.page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ActionLogsTable;
