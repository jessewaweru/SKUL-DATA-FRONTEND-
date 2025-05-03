import { FiEdit, FiEye, FiMail, FiUserX, FiUserCheck } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import "../Parents/parents.css";

const ParentTable = ({ parents, isLoading }) => {
  const navigate = useNavigate();

  if (isLoading) return <div className="loading-spinner">Loading...</div>;

  return (
    <div className="parent-table-container">
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
          {parents?.map((parent) => (
            <tr key={parent.id}>
              <td>
                {parent.user.first_name} {parent.user.last_name}
              </td>
              <td>{parent.user.email}</td>
              <td>{parent.phone_number}</td>
              <td>{parent.children_count}</td>
              <td>
                {parent.user.last_login
                  ? new Date(parent.user.last_login).toLocaleDateString()
                  : "Never"}
              </td>
              <td>
                <span className={`status-badge ${parent.status.toLowerCase()}`}>
                  {parent.status}
                </span>
              </td>
              <td>
                <div className="action-buttons">
                  <button
                    onClick={() => navigate(`/dashboard/parents/${parent.id}`)}
                    title="View"
                  >
                    <FiEye />
                  </button>
                  <button
                    onClick={() =>
                      navigate(`/dashboard/parents/${parent.id}/actions`)
                    }
                    title="Edit"
                  >
                    <FiEdit />
                  </button>
                  <button
                    onClick={() =>
                      navigate(
                        `/dashboard/parents/${parent.id}/actions?action=message`
                      )
                    }
                    title="Message"
                  >
                    <FiMail />
                  </button>
                  {parent.status === "ACTIVE" ? (
                    <button title="Deactivate">
                      <FiUserX />
                    </button>
                  ) : (
                    <button title="Activate">
                      <FiUserCheck />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ParentTable;
