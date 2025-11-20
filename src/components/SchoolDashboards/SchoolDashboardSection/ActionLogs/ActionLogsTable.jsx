import { FiArrowUpRight, FiClock, FiUser, FiDatabase } from "react-icons/fi";
import { format } from "date-fns";
import "./ActionLogs.css";

const ActionLogsTable = ({
  logs,
  loading,
  onRowClick,
  pagination,
  onPageChange,
}) => {
  const renderCategoryBadge = (category) => {
    const badges = {
      CREATE: { class: "create", label: "Create" },
      UPDATE: { class: "update", label: "Update" },
      DELETE: { class: "delete", label: "Delete" },
      VIEW: { class: "view", label: "View" },
      LOGIN: { class: "login", label: "Login" },
      LOGOUT: { class: "logout", label: "Logout" },
      UPLOAD: { class: "upload", label: "Upload" },
      DOWNLOAD: { class: "download", label: "Download" },
      SHARE: { class: "share", label: "Share" },
    };

    const badge = badges[category] || { class: "other", label: "Other" };
    return <span className={`badge ${badge.class}`}>{badge.label}</span>;
  };

  const safeLogs = Array.isArray(logs) ? logs : [];
  const currentPage = pagination?.page || 1;
  const pageSize = pagination?.pageSize || 20;
  const totalCount = pagination?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  if (loading && safeLogs.length === 0) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading action logs...</p>
      </div>
    );
  }

  if (!loading && safeLogs.length === 0) {
    return (
      <div className="empty-state">
        <p>No action logs found matching your filters</p>
      </div>
    );
  }

  const formatTimestamp = (timestamp) => {
    try {
      return format(new Date(timestamp), "MMM d, yyyy HH:mm");
    } catch (error) {
      return "Invalid Date";
    }
  };

  return (
    <div className="action-logs-table-container">
      <div className="table-wrapper">
        <table className="action-logs-table">
          <thead>
            <tr>
              <th className="th-timestamp">
                <FiClock className="th-icon" />
                <span>Timestamp</span>
              </th>
              <th className="th-user">
                <FiUser className="th-icon" />
                <span>User</span>
              </th>
              <th className="th-category">Action Type</th>
              <th className="th-action">Action</th>
              <th className="th-model">
                <FiDatabase className="th-icon" />
                <span>Model</span>
              </th>
              <th className="th-arrow"></th>
            </tr>
          </thead>
          <tbody>
            {safeLogs.map((log) => (
              <tr
                key={log.id}
                onClick={() => onRowClick && onRowClick(log)}
                className="table-row"
              >
                <td className="td-timestamp">
                  {formatTimestamp(log.timestamp)}
                </td>
                <td className="td-user">
                  <div className="user-tag-text">
                    {log.user_tag || "System"}
                  </div>
                  {log.user_details && (
                    <div className="user-name-text">
                      {log.user_details.first_name} {log.user_details.last_name}
                    </div>
                  )}
                </td>
                <td className="td-category">
                  {renderCategoryBadge(log.category)}
                </td>
                <td className="td-action" title={log.action}>
                  {log.action || "No action description"}
                </td>
                <td className="td-model">{log.affected_model || "System"}</td>
                <td className="td-arrow">
                  <FiArrowUpRight className="arrow-icon" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination && totalPages > 1 && (
        <div className="pagination-controls">
          <button
            disabled={currentPage === 1}
            onClick={() => onPageChange && onPageChange(currentPage - 1)}
            className="pagination-btn"
          >
            ← Previous
          </button>

          <span className="pagination-info">
            Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
            <span className="total-count"> ({totalCount} records)</span>
          </span>

          <button
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange && onPageChange(currentPage + 1)}
            className="pagination-btn"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

export default ActionLogsTable;
