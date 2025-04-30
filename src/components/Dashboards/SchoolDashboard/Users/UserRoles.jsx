import "../../SchoolDashboard/dashboard.css";
import { useState, useEffect } from "react";
import {
  FiUsers,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSave,
  FiArrowLeft,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UserRoles = () => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [permissions, setPermissions] = useState({});
  const [allPermissions, setAllPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const API_BASE = "/users";

  // Fetch permissions and roles
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [permRes, roleRes] = await Promise.all([
          axios.get(`${API_BASE}/permissions/`),
          axios.get(`${API_BASE}/roles/`),
        ]);

        setAllPermissions(permRes.data);
        setRoles(roleRes.data.results);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching roles or permissions:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Update permission checkboxes when a role is selected
  useEffect(() => {
    if (selectedRole) {
      const initialPermissions = {};
      allPermissions.forEach((perm) => {
        initialPermissions[perm.code] = selectedRole.permissions.includes(
          perm.id
        );
      });
      setPermissions(initialPermissions);
      setNewRoleName(selectedRole.name);
    }
  }, [selectedRole, allPermissions]);

  const handlePermissionChange = (permissionId) => {
    setPermissions((prev) => ({
      ...prev,
      [permissionId]: !prev[permissionId],
    }));
  };

  const handleSaveRole = async () => {
    if (!newRoleName.trim()) return;

    const selectedPermissionIds = allPermissions
      .filter((perm) => permissions[perm.code])
      .map((perm) => perm.id);

    try {
      if (isEditing) {
        const updated = await axios.put(
          `${API_BASE}/roles/${selectedRole.id}/`,
          {
            name: newRoleName,
            permissions: selectedPermissionIds,
          }
        );
        setRoles((prev) =>
          prev.map((r) => (r.id === selectedRole.id ? updated.data : r))
        );
      } else {
        const created = await axios.post(`${API_BASE}/roles/`, {
          name: newRoleName,
          permissions: selectedPermissionIds,
        });
        setRoles((prev) => [...prev, created.data]);
      }
      resetForm();
    } catch (error) {
      console.error("Error saving role:", error);
    }
  };

  const handleDeleteRole = async (roleId) => {
    try {
      await axios.delete(`${API_BASE}/roles/${roleId}/`);
      setRoles((prev) => prev.filter((r) => r.id !== roleId));
      if (selectedRole?.id === roleId) resetForm();
    } catch (error) {
      console.error("Error deleting role:", error);
    }
  };

  const resetForm = () => {
    setSelectedRole(null);
    setIsEditing(false);
    setNewRoleName("");
    setPermissions({});
    setShowCreateModal(false);
  };

  const startCreateNew = () => {
    resetForm();
    const initialPermissions = {};
    allPermissions.forEach((perm) => {
      initialPermissions[perm.code] = false;
    });
    setPermissions(initialPermissions);
    setShowCreateModal(true);
  };

  return (
    <div className="user-roles-container">
      <div className="header">
        <button
          onClick={() => navigate("/dashboard/users")}
          className="back-button"
        >
          <FiArrowLeft /> Back to Users
        </button>
        <h2>
          <FiUsers /> User Roles & Permissions
        </h2>
        <button onClick={startCreateNew} className="primary-button">
          <FiPlus /> Create New Role
        </button>
      </div>

      <div className="roles-layout">
        {/* Roles List */}
        <div className="roles-list">
          {loading ? (
            <div className="loading">Loading roles...</div>
          ) : Array.isArray(roles) && roles.length > 0 ? (
            roles.map((role) => (
              <div
                key={role.id}
                className={`role-card ${
                  selectedRole?.id === role.id ? "selected" : ""
                }`}
                onClick={() => {
                  setSelectedRole(role);
                  setIsEditing(false);
                }}
              >
                <h3>{role.name}</h3>
                <div className="permissions-summary">
                  {role.permissions.length} permissions
                </div>
                <div className="role-actions">
                  <button
                    className="icon-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedRole(role);
                      setIsEditing(true);
                    }}
                  >
                    <FiEdit2 />
                  </button>
                  <button
                    className="icon-button danger"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteRole(role.id);
                    }}
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="error">No roles found or failed to load.</div>
          )}
        </div>

        {/* Role Details/Editor */}
        <div className="role-editor">
          {selectedRole || showCreateModal ? (
            <div className="role-form">
              <h3>
                {isEditing
                  ? "Edit Role"
                  : showCreateModal
                  ? "Create New Role"
                  : "Role Details"}
              </h3>

              <div className="form-group">
                <label>Role Name</label>
                <input
                  type="text"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  placeholder="Enter role name"
                  disabled={!isEditing && !showCreateModal}
                />
              </div>

              <div className="permissions-list">
                <h4>Permissions</h4>
                {allPermissions.map((permission) => (
                  <div key={permission.id} className="permission-item">
                    <label>
                      <input
                        type="checkbox"
                        checked={permissions[permission.code] || false}
                        onChange={() => handlePermissionChange(permission.code)}
                        disabled={!isEditing && !showCreateModal}
                      />
                      {permission.name}
                    </label>
                  </div>
                ))}
              </div>

              {(isEditing || showCreateModal) && (
                <div className="form-actions">
                  <button onClick={resetForm} className="secondary-button">
                    Cancel
                  </button>
                  <button onClick={handleSaveRole} className="primary-button">
                    <FiSave /> Save Role
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="empty-state">
              <p>
                Select a role from the list or create a new one to view or edit
                permissions
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserRoles;
