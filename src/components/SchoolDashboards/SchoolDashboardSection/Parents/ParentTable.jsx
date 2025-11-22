import { FiEdit, FiEye, FiMail, FiUserX, FiUserCheck } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const ParentTable = ({ parents, isLoading }) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p>Loading parents...</p>
      </div>
    );
  }

  // Ensure parents is always an array
  const safeParents = Array.isArray(parents) ? parents : [];

  console.log("ParentTable received parents:", safeParents);

  if (safeParents.length === 0) {
    return (
      <div className="empty-state-container">
        <p>No parents found</p>
      </div>
    );
  }

  return (
    <div className="primary-admin-parent-table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Children</th>
            <th>Last Login</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {safeParents.map((parent) => {
            // Debug log for each parent
            console.log("Rendering parent:", parent);

            // Safely extract values with fallbacks
            const firstName =
              parent?.first_name || parent?.user?.first_name || "";
            const lastName = parent?.last_name || parent?.user?.last_name || "";
            const email = parent?.email || parent?.user?.email || "N/A";
            const phone = parent?.phone_number || "Not provided";
            const childrenCount =
              parent?.children_count || parent?.children?.length || 0;
            const lastLogin = parent?.last_login || parent?.user?.last_login;
            const status = parent?.status || "UNKNOWN";

            return (
              <tr key={parent.id}>
                <td className="name-cell">
                  <span className="parent-name">
                    {firstName} {lastName}
                  </span>
                </td>
                <td className="email-cell">{email}</td>
                <td className="phone-cell">{phone}</td>
                <td className="children-cell">
                  <span className="children-badge">{childrenCount}</span>
                </td>
                <td className="login-cell">
                  {lastLogin
                    ? new Date(lastLogin).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "Never"}
                </td>
                <td className="status-cell">
                  <span className={`status-badge ${status.toLowerCase()}`}>
                    {status}
                  </span>
                </td>
                <td className="actions-cell">
                  <div className="action-buttons">
                    <button
                      onClick={() =>
                        navigate(`/dashboard/parents/${parent.id}`)
                      }
                      title="View Parent"
                      className="action-btn view-btn"
                    >
                      <FiEye />
                    </button>
                    <button
                      onClick={() =>
                        navigate(`/dashboard/parents/${parent.id}/actions`)
                      }
                      title="Edit Parent"
                      className="action-btn edit-btn"
                    >
                      <FiEdit />
                    </button>
                    <button
                      onClick={() =>
                        navigate(
                          `/dashboard/parents/${parent.id}/actions?action=message`
                        )
                      }
                      title="Send Message"
                      className="action-btn message-btn"
                    >
                      <FiMail />
                    </button>
                    {status === "ACTIVE" ? (
                      <button
                        title="Deactivate Parent"
                        className="action-btn deactivate-btn"
                        onClick={() => console.log("Deactivate", parent.id)}
                      >
                        <FiUserX />
                      </button>
                    ) : (
                      <button
                        title="Activate Parent"
                        className="action-btn activate-btn"
                        onClick={() => console.log("Activate", parent.id)}
                      >
                        <FiUserCheck />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ParentTable;
