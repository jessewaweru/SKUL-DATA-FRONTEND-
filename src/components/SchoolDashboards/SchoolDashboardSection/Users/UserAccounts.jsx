import { useNavigate } from "react-router-dom";
import "../Users/users.css";
import { useEffect, useState } from "react";
import {
  FiUsers,
  FiSearch,
  FiFilter,
  FiPlus,
  FiUser,
  FiMail,
  FiEdit2,
  FiEyeOff,
  FiEye,
  FiRefreshCw,
  FiTrash2,
  FiShield,
} from "react-icons/fi";

const UserAccounts = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [filters, setFilters] = useState({
    role: "",
    status: "",
    school: "",
    isAdministrator: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    // Mock data with administrator examples
    const mockUsers = [
      {
        id: 1,
        name: "John Doe",
        email: "john@peponi.school",
        role: "Teacher",
        isAdministrator: true,
        status: "Active",
        lastLogin: "2023-06-15T10:30:00",
        school: "Peponi School",
      },
      {
        id: 2,
        name: "Mary Smith",
        email: "mary.smith@peponi.school",
        role: "Parent",
        isAdministrator: false,
        status: "Active",
        lastLogin: "2023-06-18T14:15:00",
        school: "Peponi School",
      },
      {
        id: 3,
        name: "David Johnson",
        email: "d.johnson@peponi.school",
        role: "Administrator",
        isAdministrator: true,
        status: "Active",
        lastLogin: "2023-06-20T09:10:00",
        school: "Peponi School",
      },
      {
        id: 4,
        name: "Sarah Williams",
        email: "sarahw@peponi.school",
        role: "School Owner",
        isAdministrator: true,
        status: "Active",
        lastLogin: "2023-06-20T09:10:00",
        school: "Peponi School",
      },
    ];
    setUsers(mockUsers);
    setFilteredUsers(mockUsers);
    setLoading(false);
  }, []);

  useEffect(() => {
    let result = users;
    if (searchTerm) {
      result = result.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    // Apply role filter
    if (filters.role) {
      result = result.filter((user) => user.role === filters.role);
    }

    // Apply status filter
    if (filters.status) {
      result = result.filter((user) => user.status === filters.status);
    }

    // Apply administrator filter
    if (filters.isAdministrator !== "") {
      result = result.filter((user) =>
        filters.isAdministrator === "true"
          ? user.isAdministrator
          : !user.isAdministrator
      );
    }

    setFilteredUsers(result);
  }, [users, searchTerm, filters]);

  const handleCreateUser = (type) => {
    if (type === "direct") {
      navigate("/dashboard/users/create");
    } else {
      console.log("Generate invite link");
    }
  };

  const handleEditUser = (userId) => {
    navigate(`/dashboard/users/edit/${userId}`);
  };

  const handleToggleStatus = (userId) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId
          ? {
              ...user,
              status: user.status === "Active" ? "Inactive" : "Active",
            }
          : user
      )
    );
  };

  const handleDeleteUser = () => {
    setUsers((prev) => prev.filter((user) => user.id !== selectedUser.id));
    setShowDeleteModal(false);
  };

  const handleResetPassword = (userId) => {
    console.log("Reset password for user:", userId);
  };

  const handleToggleAdministrator = () => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === selectedUser.id
          ? { ...user, isAdministrator: !user.isAdministrator }
          : user
      )
    );
    setShowAdminModal(false);
  };

  return (
    <div className="user-accounts">
      <div className="user-accounts-header">
        <h2>
          <FiUsers /> User Accounts Management
        </h2>
        <p>View and manage all user accounts in the system</p>
      </div>

      {/* Controls Bar */}
      <div className="controls-bar">
        <div className="search-filter">
          <div className="search-box">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-dropdowns">
            <select
              value={filters.role}
              onChange={(e) => setFilters({ ...filters, role: e.target.value })}
            >
              <option value="">All Roles</option>
              <option value="School Owner">School Owner</option>
              <option value="Administrator">Administrator</option>
              <option value="Teacher">Teacher</option>
              <option value="Parent">Parent</option>
            </select>

            <select
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
            >
              <option value="">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>

            <select
              value={filters.isAdministrator}
              onChange={(e) =>
                setFilters({ ...filters, isAdministrator: e.target.value })
              }
            >
              <option value="">All Users</option>
              <option value="true">Administrators Only</option>
              <option value="false">Non-Administrators</option>
            </select>

            <button className="filter-button">
              <FiFilter /> More Filters
            </button>
          </div>
        </div>
        <div className="action-buttons">
          <button
            className="primary-button"
            onClick={() => setShowCreateModal(true)}
          >
            <FiPlus /> Create User
          </button>
        </div>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="loading-indicator">Loading users...</div>
      ) : (
        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Admin</th>
                <th>Status</th>
                <th>Last Login</th>
                <th>School</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <span
                        className={`role-badge ${user.role
                          .toLowerCase()
                          .replace(" ", "-")}`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td>
                      {user.isAdministrator && (
                        <span className="admin-badge">
                          <FiShield /> Admin
                        </span>
                      )}
                    </td>
                    <td>
                      <span
                        className={`status-badge ${user.status.toLowerCase()}`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td>{new Date(user.lastLogin).toLocaleString()}</td>
                    <td>{user.school}</td>
                    <td className="actions-cell">
                      <button
                        className="icon-button"
                        onClick={() => handleEditUser(user.id)}
                        title="Edit"
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        className="icon-button"
                        onClick={() => handleToggleStatus(user.id)}
                        title={
                          user.status === "Active" ? "Deactivate" : "Activate"
                        }
                      >
                        {user.status === "Active" ? <FiEyeOff /> : <FiEye />}
                      </button>
                      {user.role !== "School Owner" && (
                        <button
                          className="icon-button"
                          onClick={() => {
                            setSelectedUser(user);
                            setShowAdminModal(true);
                          }}
                          title={
                            user.isAdministrator ? "Remove Admin" : "Make Admin"
                          }
                        >
                          <FiShield
                            color={user.isAdministrator ? "#4CAF50" : "#9E9E9E"}
                          />
                        </button>
                      )}
                      <button
                        className="icon-button"
                        onClick={() => handleResetPassword(user.id)}
                        title="Reset Password"
                      >
                        <FiRefreshCw />
                      </button>
                      {user.role !== "School Owner" && (
                        <button
                          className="icon-button danger"
                          onClick={() => {
                            setSelectedUser(user);
                            setShowDeleteModal(true);
                          }}
                          title="Delete"
                        >
                          <FiTrash2 />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="no-results">
                    No users found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Create New User</h3>
            <div className="modal-options">
              <button
                className="option-button"
                onClick={() => handleCreateUser("direct")}
              >
                <div className="option-icon">
                  <FiUser />
                </div>
                <div className="option-text">
                  <h4>Create Directly</h4>
                  <p>Enter all user details yourself</p>
                </div>
              </button>
              <button
                className="option-button"
                onClick={() => handleCreateUser("invite")}
              >
                <div className="option-icon">
                  <FiMail />
                </div>
                <div className="option-text">
                  <h4>Send Invitation</h4>
                  <p>User completes their own registration</p>
                </div>
              </button>
            </div>
            <div className="modal-footer">
              <button
                className="secondary-button"
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirm Deletion</h3>
            <p>
              Are you sure you want to delete {selectedUser?.name}? This action
              cannot be undone.
            </p>

            <div className="modal-footer">
              <button
                className="secondary-button"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button className="danger-button" onClick={handleDeleteUser}>
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Administrator Confirmation Modal */}
      {showAdminModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>
              {selectedUser?.isAdministrator
                ? "Remove Administrator Privileges"
                : "Grant Administrator Privileges"}
            </h3>
            <p>
              {selectedUser?.isAdministrator
                ? `Are you sure you want to remove ${selectedUser.name}'s administrator privileges?`
                : `Are you sure you want to make ${selectedUser.name} an administrator?`}
            </p>
            <p>
              {selectedUser?.isAdministrator
                ? "They will lose access to administrative features."
                : "They will gain access to administrative features based on their role permissions."}
            </p>

            <div className="modal-footer">
              <button
                className="secondary-button"
                onClick={() => setShowAdminModal(false)}
              >
                Cancel
              </button>
              <button
                className={
                  selectedUser?.isAdministrator
                    ? "danger-button"
                    : "primary-button"
                }
                onClick={handleToggleAdministrator}
              >
                {selectedUser?.isAdministrator ? "Remove Admin" : "Make Admin"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserAccounts;
