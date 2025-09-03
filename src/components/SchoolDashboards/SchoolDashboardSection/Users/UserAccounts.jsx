import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../../../../hooks/useApi";
import {
  FiUsers,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiShield,
  FiEye,
  FiEyeOff,
  FiMail,
  FiUser,
  FiSearch,
} from "react-icons/fi";

const UserAccounts = () => {
  const api = useApi();
  const navigate = useNavigate();
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
    isAdministrator: "",
  });

  // Fetch users from API - FIXED TO USE CORRECT ENDPOINT
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/users/"); // Changed from /api/users/me/
      console.log("Raw API response:", response.data);

      // Ensure we always set an array, even if response.data is not one
      const userData = Array.isArray(response.data) ? response.data : [];

      // Transform backend data to match frontend expectations
      const transformedUsers = userData.map((user) => ({
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        user_type: user.user_type.toUpperCase(), // Convert to uppercase to match frontend expectations
        is_active: user.is_active,
        is_administrator: user.is_administrator || false,
        last_login: user.last_login || null,
        username: user.username,
        user_tag: user.user_tag,
        is_staff: user.is_staff || false,
        role: user.role,
        // Add computed properties for compatibility
        name: `${user.first_name} ${user.last_name}`,
        status: user.is_active ? "Active" : "Inactive",
        isAdministrator:
          user.is_administrator || user.user_type === "administrator",
      }));

      console.log("Transformed users:", transformedUsers);
      setUsers(transformedUsers);
      setFilteredUsers(transformedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      // Set empty arrays on error
      setUsers([]);
      setFilteredUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Load users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // FIXED filtering logic with proper guards
  useEffect(() => {
    console.log("Filtering users. Total users:", users.length);

    // Ensure users is always treated as an array
    let result = Array.isArray(users) ? [...users] : [];

    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        (user) =>
          `${user.first_name || ""} ${user.last_name || ""}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          (user.email || "").toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply role filter
    if (filters.role) {
      result = result.filter(
        (user) => getUserRoleDisplay(user) === filters.role
      );
    }

    // Apply status filter
    if (filters.status) {
      const isActiveFilter = filters.status === "Active";
      result = result.filter((user) => user.is_active === isActiveFilter);
    }

    // Apply administrator filter
    if (filters.isAdministrator !== "") {
      const isAdminFilter = filters.isAdministrator === "true";
      result = result.filter(
        (user) =>
          (user.is_administrator || user.user_type === "ADMINISTRATOR") ===
          isAdminFilter
      );
    }

    console.log("Filtered result:", result);
    setFilteredUsers(result);
  }, [users, searchTerm, filters]);

  // Handle user status toggle - FIXED API endpoint
  const handleToggleStatus = async (userId) => {
    try {
      const user = users.find((u) => u.id === userId);
      const newStatus = !user.is_active;

      await api.patch(`/api/users/${userId}/`, { is_active: newStatus });

      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId
            ? {
                ...u,
                is_active: newStatus,
                status: newStatus ? "Active" : "Inactive",
              }
            : u
        )
      );
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

  // Handle user deletion - FIXED API endpoint
  const handleDeleteUser = async () => {
    try {
      await api.delete(`/api/users/${selectedUser.id}/`);
      setUsers((prev) => prev.filter((u) => u.id !== selectedUser.id));
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  // Handle admin status toggle - FIXED API endpoints
  const handleToggleAdministrator = async () => {
    try {
      const user = selectedUser;
      const isAdmin =
        user.is_administrator || user.user_type === "ADMINISTRATOR";

      if (isAdmin) {
        await api.post(`/api/users/${user.id}/remove-administrator/`);
      } else {
        await api.post(`/api/users/${user.id}/make-administrator/`);
      }

      // Refresh user list
      await fetchUsers();
      setShowAdminModal(false);
    } catch (error) {
      console.error("Error updating admin status:", error);
    }
  };

  // Handle user creation options
  const handleCreateUser = (type) => {
    if (type === "direct") {
      navigate("/dashboard/users/create");
    } else {
      // Generate invite link logic
      console.log("Generate invite link functionality would go here");
      // In a real implementation, you might call an API endpoint to generate an invite
    }
  };

  // FIXED Helper function to display user roles nicely
  const getUserRoleDisplay = (user) => {
    switch (user.user_type) {
      case "SCHOOL_ADMIN":
        return "School Admin";
      case "ADMINISTRATOR":
        return "Administrator";
      case "TEACHER":
        return "Teacher";
      case "PARENT":
        return "Parent";
      default:
        return "Other";
    }
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
              <option value="School Admin">School Admin</option>
              <option value="Administrator">Administrator</option>
              <option value="Teacher">Teacher</option>
              <option value="Parent">Parent</option>
              <option value="Other">Other</option>
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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      {user.first_name} {user.last_name}
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <span
                        className={`role-badge ${user.user_type
                          .toLowerCase()
                          .replace("_", "-")}`}
                      >
                        {getUserRoleDisplay(user)}
                      </span>
                    </td>
                    <td>
                      {(user.is_administrator ||
                        user.user_type === "ADMINISTRATOR") && (
                        <span className="admin-badge">
                          <FiShield /> Admin
                        </span>
                      )}
                    </td>
                    <td>
                      <span
                        className={`status-badge ${
                          user.is_active ? "active" : "inactive"
                        }`}
                      >
                        {user.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      {user.last_login
                        ? new Date(user.last_login).toLocaleString()
                        : "Never"}
                    </td>
                    <td className="actions-cell">
                      <button
                        className="icon-button"
                        onClick={() =>
                          navigate(`/dashboard/users/edit/${user.id}`)
                        }
                        title="Edit"
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        className="icon-button"
                        onClick={() => handleToggleStatus(user.id)}
                        title={user.is_active ? "Deactivate" : "Activate"}
                      >
                        {user.is_active ? <FiEyeOff /> : <FiEye />}
                      </button>
                      {user.user_type !== "SCHOOL_ADMIN" && (
                        <button
                          className="icon-button"
                          onClick={() => {
                            setSelectedUser(user);
                            setShowAdminModal(true);
                          }}
                          title={
                            user.is_administrator ||
                            user.user_type === "ADMINISTRATOR"
                              ? "Remove Admin"
                              : "Make Admin"
                          }
                        >
                          <FiShield
                            color={
                              user.is_administrator ||
                              user.user_type === "ADMINISTRATOR"
                                ? "#4CAF50"
                                : "#9E9E9E"
                            }
                          />
                        </button>
                      )}
                      {user.user_type !== "SCHOOL_ADMIN" && (
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
              Are you sure you want to delete {selectedUser?.first_name}{" "}
              {selectedUser?.last_name}? This action cannot be undone.
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
              {selectedUser?.is_administrator ||
              selectedUser?.user_type === "ADMINISTRATOR"
                ? "Remove Administrator Privileges"
                : "Grant Administrator Privileges"}
            </h3>
            <p>
              {selectedUser?.is_administrator ||
              selectedUser?.user_type === "ADMINISTRATOR"
                ? `Are you sure you want to remove ${selectedUser?.first_name} ${selectedUser?.last_name}'s administrator privileges?`
                : `Are you sure you want to make ${selectedUser?.first_name} ${selectedUser?.last_name} an administrator?`}
            </p>
            <p>
              {selectedUser?.is_administrator ||
              selectedUser?.user_type === "ADMINISTRATOR"
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
                  selectedUser?.is_administrator ||
                  selectedUser?.user_type === "ADMINISTRATOR"
                    ? "danger-button"
                    : "primary-button"
                }
                onClick={handleToggleAdministrator}
              >
                {selectedUser?.is_administrator ||
                selectedUser?.user_type === "ADMINISTRATOR"
                  ? "Remove Admin"
                  : "Make Admin"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserAccounts;
