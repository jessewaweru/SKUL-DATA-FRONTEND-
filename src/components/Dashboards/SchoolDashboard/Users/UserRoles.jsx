import "../../SchoolDashboard/dashboard.css";

// components/SchoolDashboard/Users/UserRoles.jsx
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

// Mock permission data
const allPermissions = [
  { id: "view_dashboard", name: "View Dashboard" },
  { id: "manage_users", name: "Manage Users" },
  { id: "manage_classes", name: "Manage Classes" },
  { id: "view_reports", name: "View Reports" },
  { id: "edit_grades", name: "Edit Grades" },
];

const UserRoles = () => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [permissions, setPermissions] = useState({});
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Load roles from API
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        // Mock data - replace with actual API call
        const mockRoles = [
          {
            id: 1,
            name: "Administrator",
            permissions: ["manage_users", "manage_classes", "view_reports"],
          },
          {
            id: 2,
            name: "Teacher",
            permissions: ["view_dashboard", "view_reports", "edit_grades"],
          },
          { id: 3, name: "Parent", permissions: ["view_dashboard"] },
        ];

        setRoles(mockRoles);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching roles:", error);
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);

  // Initialize permissions when role is selected
  useEffect(() => {
    if (selectedRole) {
      const initialPermissions = {};
      allPermissions.forEach((perm) => {
        initialPermissions[perm.id] = selectedRole.permissions.includes(
          perm.id
        );
      });
      setPermissions(initialPermissions);
      setNewRoleName(selectedRole.name);
    }
  }, [selectedRole]);

  const handlePermissionChange = (permissionId) => {
    setPermissions((prev) => ({
      ...prev,
      [permissionId]: !prev[permissionId],
    }));
  };

  const handleSaveRole = async () => {
    if (!newRoleName.trim()) return;

    const selectedPermissions = Object.keys(permissions).filter(
      (perm) => permissions[perm]
    );

    try {
      // In a real app, you would make an API call here
      if (isEditing) {
        // Update existing role
        const updatedRoles = roles.map((role) =>
          role.id === selectedRole.id
            ? { ...role, name: newRoleName, permissions: selectedPermissions }
            : role
        );
        setRoles(updatedRoles);
      } else {
        // Create new role
        const newRole = {
          id: roles.length + 1,
          name: newRoleName,
          permissions: selectedPermissions,
        };
        setRoles([...roles, newRole]);
      }

      resetForm();
    } catch (error) {
      console.error("Error saving role:", error);
    }
  };

  const handleDeleteRole = async (roleId) => {
    try {
      // In a real app, you would make an API call here
      setRoles(roles.filter((role) => role.id !== roleId));
      if (selectedRole && selectedRole.id === roleId) {
        resetForm();
      }
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
      initialPermissions[perm.id] = false;
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
          ) : (
            <>
              {roles.map((role) => (
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
              ))}
            </>
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
                        checked={permissions[permission.id] || false}
                        onChange={() => handlePermissionChange(permission.id)}
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
