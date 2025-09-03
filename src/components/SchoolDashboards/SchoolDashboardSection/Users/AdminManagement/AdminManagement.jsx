import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiShield,
  FiUserPlus,
  FiUserX,
  FiEdit2,
  FiSave,
  FiArrowLeft,
  FiSearch,
  FiRefreshCw,
} from "react-icons/fi";
import axios from "axios";
import "./adminmanagement.css";

const AdminManagement = () => {
  const navigate = useNavigate();
  const [administrators, setAdministrators] = useState([]);
  const [filteredAdmins, setFilteredAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    role: "",
    status: "",
    accessLevel: "",
  });
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [allPermissions, setAllPermissions] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  // Safely ensure we always have an array
  const safeFilteredAdmins = Array.isArray(filteredAdmins)
    ? filteredAdmins
    : [];

  // Fetch administrators and permissions options
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [adminsRes, permsRes] = await Promise.all([
          axios
            .get("/api/administrators/")
            .then((res) => (Array.isArray(res.data) ? res.data : [])),
          axios
            .get("/api/administrators/permissions-options/")
            .then((res) => (Array.isArray(res.data) ? res.data : [])),
        ]);

        setAdministrators(adminsRes);
        setFilteredAdmins(adminsRes);
        setAllPermissions(permsRes);
        setLoading(false);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.response?.data?.message || "Failed to load data");
        setLoading(false);
        setAdministrators([]);
        setFilteredAdmins([]);
      }
    };
    fetchData();
  }, []);

  // Filter administrators based on search and filters
  useEffect(() => {
    if (!Array.isArray(administrators)) {
      setFilteredAdmins([]);
      return;
    }

    let result = [...administrators];

    if (searchTerm) {
      result = result.filter((admin) => {
        const fullName = `${admin.user?.first_name || ""} ${
          admin.user?.last_name || ""
        }`.toLowerCase();
        const email = admin.user?.email?.toLowerCase() || "";
        const position = admin.position?.toLowerCase() || "";

        return (
          fullName.includes(searchTerm.toLowerCase()) ||
          email.includes(searchTerm.toLowerCase()) ||
          position.includes(searchTerm.toLowerCase())
        );
      });
    }

    if (filters.accessLevel) {
      result = result.filter(
        (admin) => admin.access_level === filters.accessLevel
      );
    }

    if (filters.status) {
      result = result.filter((admin) =>
        filters.status === "Active" ? admin.is_active : !admin.is_active
      );
    }

    setFilteredAdmins(Array.isArray(result) ? result : []);
  }, [administrators, searchTerm, filters]);

  const handleEditAdmin = (admin) => {
    setEditingAdmin({ ...admin });
  };

  const handleSaveAdmin = async () => {
    if (!editingAdmin) return;

    try {
      setIsSaving(true);
      const { id, ...updateData } = editingAdmin;
      const response = await axios.patch(
        `/users/administrators/${id}/`,
        updateData
      );
      setAdministrators((prev) =>
        prev.map((admin) => (admin.id === id ? response.data : admin))
      );
      setEditingAdmin(null);
    } catch (err) {
      console.error("Error updating administrator:", err);
      setError(err.response?.data?.message || "Failed to update administrator");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePermissionChange = (permissionCode, isChecked) => {
    setEditingAdmin((prev) => {
      if (!prev) return prev;
      const newPermissions = isChecked
        ? [...(prev.permissions || []), permissionCode]
        : (prev.permissions || []).filter((p) => p !== permissionCode);
      return { ...prev, permissions: newPermissions };
    });
  };

  const handleAddAdministrator = async (newAdmin) => {
    try {
      setIsSaving(true);
      const response = await axios.post("/users/administrators/", newAdmin);
      setAdministrators((prev) => [...(prev || []), response.data]);
      setShowAddModal(false);
    } catch (err) {
      console.error("Error adding administrator:", err);
      setError(err.response?.data?.message || "Failed to add administrator");
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveAdministrator = async () => {
    if (!selectedAdmin) return;

    try {
      setIsSaving(true);
      await axios.post(`/users/administrators/${selectedAdmin.id}/deactivate/`);
      setAdministrators((prev) =>
        (prev || []).filter((admin) => admin.id !== selectedAdmin.id)
      );
      setShowRemoveModal(false);
    } catch (err) {
      console.error("Error removing administrator:", err);
      setError(err.response?.data?.message || "Failed to remove administrator");
    } finally {
      setIsSaving(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setLoading(true);
      const response = await axios
        .get("/users/administrators/")
        .then((res) => (Array.isArray(res.data) ? res.data : []));
      setAdministrators(response);
      setError(null);
    } catch (err) {
      console.error("Error refreshing data:", err);
      setError(err.response?.data?.message || "Failed to refresh data");
    } finally {
      setLoading(false);
    }
  };

  const accessLevelOptions = [
    { value: "standard", label: "Standard Access" },
    { value: "elevated", label: "Elevated Access" },
    { value: "restricted", label: "Restricted Access" },
  ];

  if (error) {
    return (
      <div className="admin-dashboard error">
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <button onClick={() => navigate("/dashboard")} className="back-button">
          <FiArrowLeft /> Back to Dashboard
        </button>
        <h2>
          <FiShield /> Administrator Management
        </h2>
      </div>

      <div className="admin-controls">
        <div className="search-filter">
          <div className="search-box">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search administrators..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-dropdowns">
            <select
              value={filters.accessLevel}
              onChange={(e) =>
                setFilters({ ...filters, accessLevel: e.target.value })
              }
            >
              <option value="">All Access Levels</option>
              <option value="standard">Standard</option>
              <option value="elevated">Elevated</option>
              <option value="restricted">Restricted</option>
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

            <button
              className="icon-button"
              onClick={handleRefresh}
              title="Refresh"
            >
              <FiRefreshCw />
            </button>
          </div>
        </div>

        <button
          className="primary-button-add"
          onClick={() => setShowAddModal(true)}
        >
          <FiUserPlus /> Add Administrator
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading administrators...</div>
      ) : (
        <div className="admin-list">
          {safeFilteredAdmins.length > 0 ? (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Position</th>
                  <th>Role</th>
                  <th>Access Level</th>
                  <th>Status</th>
                  <th>Last Login</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {safeFilteredAdmins.map((admin) => (
                  <tr key={admin.id}>
                    <td>
                      <div className="admin-name">
                        {admin.user?.first_name} {admin.user?.last_name}
                        <span className="admin-email">{admin.user?.email}</span>
                      </div>
                    </td>
                    <td>{admin.position}</td>
                    <td>
                      <span className="role-badge administrator">
                        Administrator
                      </span>
                    </td>
                    <td>
                      <span className={`access-badge ${admin.access_level}`}>
                        {admin.access_level}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`status-badge ${
                          admin.is_active ? "active" : "inactive"
                        }`}
                      >
                        {admin.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      {admin.user?.last_login
                        ? new Date(admin.user.last_login).toLocaleString()
                        : "Never"}
                    </td>
                    <td className="admin-actions">
                      <button
                        className="icon-button"
                        onClick={() => handleEditAdmin(admin)}
                        title="Edit"
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        className="icon-button danger"
                        onClick={() => {
                          setSelectedAdmin(admin);
                          setShowRemoveModal(true);
                        }}
                        title="Remove Admin"
                      >
                        <FiUserX />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="no-results">
              No administrators found matching your criteria
            </div>
          )}
        </div>
      )}

      {editingAdmin && (
        <div className="modal-overlay">
          <div className="modal edit-admin-modal">
            <h3>
              <FiShield /> Edit Administrator
            </h3>

            <div className="form-group">
              <label>Name</label>
              <div className="admin-info">
                {editingAdmin.user?.first_name} {editingAdmin.user?.last_name}
              </div>
            </div>

            <div className="form-group">
              <label>Email</label>
              <div className="admin-info">{editingAdmin.user?.email}</div>
            </div>

            <div className="form-group">
              <label htmlFor="position">Position Title</label>
              <input
                type="text"
                id="position"
                value={editingAdmin.position || ""}
                onChange={(e) =>
                  setEditingAdmin({ ...editingAdmin, position: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label htmlFor="accessLevel">Access Level</label>
              <select
                id="accessLevel"
                value={editingAdmin.access_level || "standard"}
                onChange={(e) =>
                  setEditingAdmin({
                    ...editingAdmin,
                    access_level: e.target.value,
                  })
                }
              >
                {accessLevelOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Permissions</label>
              <div className="permissions-list">
                {allPermissions.map((permission) => (
                  <div key={permission.code} className="permission-item">
                    <label>
                      <input
                        type="checkbox"
                        checked={(editingAdmin.permissions || []).includes(
                          permission.code
                        )}
                        onChange={(e) =>
                          handlePermissionChange(
                            permission.code,
                            e.target.checked
                          )
                        }
                      />
                      <div className="permission-details">
                        <div className="permission-name">{permission.name}</div>
                        <div className="permission-description">
                          {permission.description}
                        </div>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="secondary-button"
                onClick={() => setEditingAdmin(null)}
              >
                Cancel
              </button>
              <button
                className="primary-button"
                onClick={handleSaveAdmin}
                disabled={isSaving}
              >
                {isSaving ? (
                  "Saving..."
                ) : (
                  <>
                    <FiSave /> Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <AddAdminModal
          onClose={() => setShowAddModal(false)}
          onSave={handleAddAdministrator}
          allPermissions={allPermissions}
          accessLevelOptions={accessLevelOptions}
          isSaving={isSaving}
        />
      )}

      {showRemoveModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirm Removal</h3>
            <p>
              Are you sure you want to remove {selectedAdmin?.user?.first_name}{" "}
              {selectedAdmin?.user?.last_name}'s administrator privileges?
            </p>
            <p>
              They will lose access to all administrative features but retain
              their base user account.
            </p>

            <div className="modal-footer">
              <button
                className="secondary-button"
                onClick={() => setShowRemoveModal(false)}
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                className="danger-button"
                onClick={handleRemoveAdministrator}
                disabled={isSaving}
              >
                {isSaving ? (
                  "Processing..."
                ) : (
                  <>
                    <FiUserX /> Remove Administrator
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const AddAdminModal = ({
  onClose,
  onSave,
  allPermissions,
  accessLevelOptions,
  isSaving,
}) => {
  const [newAdmin, setNewAdmin] = useState({
    user: {
      first_name: "",
      last_name: "",
      email: "",
      password: "defaultPassword123",
    },
    position: "",
    access_level: "standard",
    permissions: [],
    is_active: true,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("user.")) {
      const userField = name.split(".")[1];
      setNewAdmin((prev) => ({
        ...prev,
        user: {
          ...prev.user,
          [userField]: value,
        },
      }));
    } else {
      setNewAdmin((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handlePermissionChange = (permissionCode, isChecked) => {
    setNewAdmin((prev) => {
      const newPermissions = isChecked
        ? [...prev.permissions, permissionCode]
        : prev.permissions.filter((p) => p !== permissionCode);
      return { ...prev, permissions: newPermissions };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSave(newAdmin);
    } catch (error) {
      if (error.response?.data) {
        setErrors(error.response.data);
      }
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal add-admin-modal">
        <h3>
          <FiUserPlus /> Add New Administrator
        </h3>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="first_name">First Name</label>
            <input
              type="text"
              id="first_name"
              name="user.first_name"
              value={newAdmin.user.first_name}
              onChange={handleChange}
              required
            />
            {errors.user?.first_name && (
              <span className="error">{errors.user.first_name}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="last_name">Last Name</label>
            <input
              type="text"
              id="last_name"
              name="user.last_name"
              value={newAdmin.user.last_name}
              onChange={handleChange}
              required
            />
            {errors.user?.last_name && (
              <span className="error">{errors.user.last_name}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="user.email"
              value={newAdmin.user.email}
              onChange={handleChange}
              required
            />
            {errors.user?.email && (
              <span className="error">{errors.user.email}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="position">Position Title</label>
            <input
              type="text"
              id="position"
              name="position"
              value={newAdmin.position}
              onChange={handleChange}
              required
            />
            {errors.position && (
              <span className="error">{errors.position}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="access_level">Access Level</label>
            <select
              id="access_level"
              name="access_level"
              value={newAdmin.access_level}
              onChange={handleChange}
            >
              {accessLevelOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Permissions</label>
            <div className="permissions-list">
              {allPermissions.map((permission) => (
                <div key={permission.code} className="permission-item">
                  <label>
                    <input
                      type="checkbox"
                      checked={newAdmin.permissions.includes(permission.code)}
                      onChange={(e) =>
                        handlePermissionChange(
                          permission.code,
                          e.target.checked
                        )
                      }
                    />
                    <div className="permission-details">
                      <div className="permission-name">{permission.name}</div>
                      <div className="permission-description">
                        {permission.description}
                      </div>
                    </div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="secondary-button"
              onClick={onClose}
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="primary-button"
              disabled={isSaving}
            >
              {isSaving ? (
                "Adding..."
              ) : (
                <>
                  <FiSave /> Add Administrator
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminManagement;
