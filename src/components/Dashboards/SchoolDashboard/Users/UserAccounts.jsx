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
} from "react-icons/fi";

const UserAccounts = () => {
  const [users, setUsers] = useState([]); // Stores all users from API
  const [filteredUsers, setFilteredUsers] = useState([]); // Stores filtered users
  const [loading, setLoading] = useState(true); // Loading state
  const [searchTerm, setSearchTerm] = useState(""); // Search input value
  const [showCreateModal, setShowCreateModal] = useState(false); // Create modal visibility
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Delete modal visibility
  const [selectedUser, setSelectedUser] = useState(null); // Currently selected user
  const [filters, setFilters] = useState({
    // Filter options
    role: "",
    status: "",
    school: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const mockUsers = [
          {
            id: 1,
            name: "John Doe",
            email: "john@peponi.school",
            role: "Teacher",
            status: "Active",
            lastLogin: "2023-06-15T10:30:00",
            school: "Peponi School",
          },
          {
            id: 2,
            name: "Mary Smith",
            email: "mary.smith@peponi.school",
            role: "Parent",
            status: "Active",
            lastLogin: "2023-06-18T14:15:00",
            school: "Peponi School",
          },
          {
            id: 3,
            name: "David Johnson",
            email: "d.johnson@peponi.school",
            role: "Teacher",
            status: "Inactive",
            lastLogin: "2023-05-20T08:45:00",
            school: "Peponi School",
          },
          {
            id: 4,
            name: "Sarah Williams",
            email: "sarahw@peponi.school",
            role: "Admin",
            status: "Active",
            lastLogin: "2023-06-20T09:10:00",
            school: "Peponi School",
          },
        ];
        setUsers(mockUsers);
        setFilteredUsers(mockUsers);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
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

    setFilteredUsers(result);
  }, [users, searchTerm, filters]);

  const handleCreateUser = (type) => {
    if (type === "direct") {
      navigate("/dashboard/users/create");
    } else {
      // Generate invite link logic would go here
      console.log("Generate invite link");
    }
  };
  const handleEditUser = (userId) => {
    navigate(`/dashboard/users/edit/${userId}`);
  };

  const handleToggleStatus = (userId) => {
    // API call to toggle status
    console.log("Toggle status for user:", userId);
  };

  const handleDeleteUser = () => {
    // API call to delete user
    console.log("Delete user:", selectedUser.id);
    setShowDeleteModal(false);
  };

  const handleResetPassword = (userId) => {
    // API call to reset password
    console.log("Reset password for user:", userId);
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
              <option value="Teacher">Teacher</option>
              <option value="Parent">Parent</option>
              <option value="Admin">Admin</option>
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
              <option value="Pending">Pending</option>
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
                      <span className={`role-badge ${user.role.toLowerCase()}`}>
                        {user.role}
                      </span>
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
                      <button
                        className="icon-button"
                        onClick={() => handleResetPassword(user.id)}
                        title="Reset Password"
                      >
                        <FiRefreshCw />
                      </button>
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
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="no-results">
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
    </div>
  );
};
export default UserAccounts;
