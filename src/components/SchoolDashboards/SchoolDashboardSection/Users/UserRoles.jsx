// import "../Users/users.css";
// import { useState, useEffect } from "react";
// import {
//   FiShield,
//   FiPlus,
//   FiEdit2,
//   FiTrash2,
//   FiSave,
//   FiArrowLeft,
// } from "react-icons/fi";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// const UserRoles = () => {
//   const navigate = useNavigate();
//   const [roles, setRoles] = useState([]);
//   const [selectedRole, setSelectedRole] = useState(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const [newRoleName, setNewRoleName] = useState("");
//   const [permissions, setPermissions] = useState({});
//   const [allPermissions, setAllPermissions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showCreateModal, setShowCreateModal] = useState(false);

//   const API_BASE = "/api/users";

//   // Fetch permissions and roles
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [permRes, roleRes] = await Promise.all([
//           axios.get(`${API_BASE}/permissions/`),
//           axios.get(`${API_BASE}/roles/`),
//         ]);

//         console.log('Permissions response:', permRes.data);
//         console.log('Roles response:', roleRes.data);

//         // Handle different response structures
//         let permissionsData = permRes.data;
//         let rolesData = roleRes.data;

//         // If permissions response has a results field (paginated response)
//         if (permissionsData.results) {
//           permissionsData = permissionsData.results;
//         }

//         // If roles response has a results field (paginated response)
//         if (rolesData.results) {
//           rolesData = rolesData.results;
//         }

//         // Ensure permissionsData is an array
//         if (!Array.isArray(permissionsData)) {
//           console.error('Permissions data is not an array:', permissionsData);
//           permissionsData = [];
//         }

//         // Ensure rolesData is an array
//         if (!Array.isArray(rolesData)) {
//           console.error('Roles data is not an array:', rolesData);
//           rolesData = [];
//         }

//         // Add administrator-specific permissions if they don't exist
//         if (!permissionsData.some((p) => p.code === "manage_administrators")) {
//           permissionsData.push({
//             id: permissionsData.length + 1,
//             code: "manage_administrators",
//             name: "Manage Administrators",
//             description: "Can appoint and remove administrators",
//           });
//         }

//         setAllPermissions(permissionsData);
//         setRoles(rolesData);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching roles or permissions:", error);

//         // Check if it's a network error or API error
//         if (error.response) {
//           console.error('Response status:', error.response.status);
//           console.error('Response data:', error.response.data);
//         }

//         // Set empty arrays as fallback
//         setAllPermissions([]);
//         setRoles([]);
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   // Update permission checkboxes when a role is selected
//   useEffect(() => {
//     if (selectedRole && allPermissions.length > 0) {
//       const initialPermissions = {};
//       allPermissions.forEach((perm) => {
//         // Handle both array of IDs and array of objects
//         const hasPermission = Array.isArray(selectedRole.permissions)
//           ? selectedRole.permissions.includes(perm.id)
//           : selectedRole.permissions?.some?.(p => p.id === perm.id || p === perm.id);

//         initialPermissions[perm.code] = hasPermission || false;
//       });
//       setPermissions(initialPermissions);
//       setNewRoleName(selectedRole.name);
//     }
//   }, [selectedRole, allPermissions]);

//   const handlePermissionChange = (permissionCode) => {
//     setPermissions((prev) => ({
//       ...prev,
//       [permissionCode]: !prev[permissionCode],
//     }));
//   };

//   const handleSaveRole = async () => {
//     if (!newRoleName.trim()) {
//       alert('Role name is required');
//       return;
//     }

//     const selectedPermissionIds = allPermissions
//       .filter((perm) => permissions[perm.code])
//       .map((perm) => perm.id);

//     try {
//       if (isEditing && selectedRole) {
//         const response = await axios.put(
//           `${API_BASE}/roles/${selectedRole.id}/`,
//           {
//             name: newRoleName,
//             permissions: selectedPermissionIds,
//           }
//         );
//         setRoles((prev) =>
//           prev.map((r) => (r.id === selectedRole.id ? response.data : r))
//         );
//       } else {
//         const response = await axios.post(`${API_BASE}/roles/`, {
//           name: newRoleName,
//           permissions: selectedPermissionIds,
//         });
//         setRoles((prev) => [...prev, response.data]);
//       }
//       resetForm();
//     } catch (error) {
//       console.error("Error saving role:", error);
//       if (error.response) {
//         console.error('Save error details:', error.response.data);
//         alert(`Error saving role: ${error.response.data.detail || 'Unknown error'}`);
//       }
//     }
//   };

//   const handleDeleteRole = async (roleId) => {
//     if (!confirm('Are you sure you want to delete this role?')) {
//       return;
//     }

//     try {
//       await axios.delete(`${API_BASE}/roles/${roleId}/`);
//       setRoles((prev) => prev.filter((r) => r.id !== roleId));
//       if (selectedRole?.id === roleId) resetForm();
//     } catch (error) {
//       console.error("Error deleting role:", error);
//       if (error.response) {
//         alert(`Error deleting role: ${error.response.data.detail || 'Unknown error'}`);
//       }
//     }
//   };

//   const resetForm = () => {
//     setSelectedRole(null);
//     setIsEditing(false);
//     setNewRoleName("");
//     setPermissions({});
//     setShowCreateModal(false);
//   };

//   const startCreateNew = () => {
//     resetForm();
//     const initialPermissions = {};
//     allPermissions.forEach((perm) => {
//       initialPermissions[perm.code] = false;
//     });
//     setPermissions(initialPermissions);
//     setShowCreateModal(true);
//   };

//   // Filter permissions into categories for better organization
//   const permissionCategories = {
//     Administration: allPermissions.filter(
//       (p) =>
//         p.code.includes("manage_") ||
//         p.code.includes("administrator") ||
//         p.code === "access_all"
//     ),
//     "User Management": allPermissions.filter(
//       (p) =>
//         p.code.includes("user") ||
//         p.code.includes("teacher") ||
//         p.code.includes("parent")
//     ),
//     "School Operations": allPermissions.filter(
//       (p) =>
//         p.code.includes("school") ||
//         p.code.includes("class") ||
//         p.code.includes("student")
//     ),
//     "Documents & Reports": allPermissions.filter(
//       (p) => p.code.includes("document") || p.code.includes("report")
//     ),
//     Other: allPermissions.filter(
//       (p) =>
//         !p.code.includes("manage_") &&
//         !p.code.includes("user") &&
//         !p.code.includes("teacher") &&
//         !p.code.includes("parent") &&
//         !p.code.includes("school") &&
//         !p.code.includes("class") &&
//         !p.code.includes("student") &&
//         !p.code.includes("document") &&
//         !p.code.includes("report") &&
//         !p.code.includes("administrator") &&
//         p.code !== "access_all"
//     ),
//   };

//   if (loading) {
//     return (
//       <div className="user-roles-container">
//         <div className="loading" style={{ textAlign: 'center', padding: '2rem' }}>
//           Loading roles and permissions...
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="user-roles-container">
//       <div className="header">
//         <button
//           onClick={() => navigate("/dashboard/users")}
//           className="back-button"
//         >
//           <FiArrowLeft /> Back to Users
//         </button>
//         <h2>
//           <FiShield /> User Roles & Permissions
//         </h2>
//         <button onClick={startCreateNew} className="primary-button">
//           <FiPlus /> Create New Role
//         </button>
//       </div>

//       <div className="roles-layout">
//         {/* Roles List */}
//         <div className="roles-list">
//           {Array.isArray(roles) && roles.length > 0 ? (
//             roles.map((role) => (
//               <div
//                 key={role.id}
//                 className={`role-card ${
//                   selectedRole?.id === role.id ? "selected" : ""
//                 }`}
//                 onClick={() => {
//                   setSelectedRole(role);
//                   setIsEditing(false);
//                 }}
//               >
//                 <h3>{role.name}</h3>
//                 <div className="permissions-summary">
//                   {Array.isArray(role.permissions)
//                     ? role.permissions.length
//                     : 0} permissions
//                 </div>
//                 <div className="role-actions">
//                   <button
//                     className="icon-button"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       setSelectedRole(role);
//                       setIsEditing(true);
//                     }}
//                   >
//                     <FiEdit2 />
//                   </button>
//                   <button
//                     className="icon-button danger"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       handleDeleteRole(role.id);
//                     }}
//                   >
//                     <FiTrash2 />
//                   </button>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <div className="empty-state">
//               <p>No roles found. Create a new role to get started.</p>
//             </div>
//           )}
//         </div>

//         {/* Role Details/Editor */}
//         <div className="role-editor">
//           {selectedRole || showCreateModal ? (
//             <div className="role-form">
//               <h3>
//                 {isEditing
//                   ? "Edit Role"
//                   : showCreateModal
//                   ? "Create New Role"
//                   : "Role Details"}
//               </h3>

//               <div className="form-group">
//                 <label>Role Name</label>
//                 <input
//                   type="text"
//                   value={newRoleName}
//                   onChange={(e) => setNewRoleName(e.target.value)}
//                   placeholder="Enter role name"
//                   disabled={!isEditing && !showCreateModal}
//                 />
//               </div>

//               <div className="permissions-list">
//                 <h4>Permissions</h4>

//                 {allPermissions.length > 0 ? (
//                   Object.entries(permissionCategories).map(
//                     ([category, perms]) =>
//                       perms.length > 0 && (
//                         <div key={category} className="permission-category">
//                           <h5>{category}</h5>
//                           {perms.map((permission) => (
//                             <div key={permission.id} className="permission-item">
//                               <label>
//                                 <input
//                                   type="checkbox"
//                                   checked={permissions[permission.code] || false}
//                                   onChange={() =>
//                                     handlePermissionChange(permission.code)
//                                   }
//                                   disabled={!isEditing && !showCreateModal}
//                                 />
//                                 <span className="permission-name">
//                                   {permission.name}
//                                 </span>
//                                 <span className="permission-description">
//                                   {permission.description}
//                                 </span>
//                               </label>
//                             </div>
//                           ))}
//                         </div>
//                       )
//                   )
//                 ) : (
//                   <div className="empty-state">
//                     <p>No permissions available.</p>
//                   </div>
//                 )}
//               </div>

//               {(isEditing || showCreateModal) && (
//                 <div className="form-actions">
//                   <button onClick={resetForm} className="secondary-button">
//                     Cancel
//                   </button>
//                   <button onClick={handleSaveRole} className="primary-button">
//                     <FiSave /> Save Role
//                   </button>
//                 </div>
//               )}
//             </div>
//           ) : (
//             <div className="empty-state">
//               <p>
//                 Select a role from the list or create a new one to view or edit
//                 permissions
//               </p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserRoles;

import "../Users/users.css";
import { useState, useEffect } from "react";
import {
  FiShield,
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

        console.log("Permissions response:", permRes.data);
        console.log("Roles response:", roleRes.data);

        // Handle different response structures
        let permissionsData = permRes.data;
        let rolesData = roleRes.data;

        // If permissions response has a results field (paginated response)
        if (permissionsData.results) {
          permissionsData = permissionsData.results;
        }

        // If roles response has a results field (paginated response)
        if (rolesData.results) {
          rolesData = rolesData.results;
        }

        // Ensure permissionsData is an array
        if (!Array.isArray(permissionsData)) {
          console.error("Permissions data is not an array:", permissionsData);
          permissionsData = [];
        }

        // Ensure rolesData is an array
        if (!Array.isArray(rolesData)) {
          console.error("Roles data is not an array:", rolesData);
          rolesData = [];
        }

        // Add administrator-specific permissions if they don't exist
        if (!permissionsData.some((p) => p.code === "manage_administrators")) {
          permissionsData.push({
            id: permissionsData.length + 1,
            code: "manage_administrators",
            name: "Manage Administrators",
            description: "Can appoint and remove administrators",
          });
        }

        setAllPermissions(permissionsData);
        setRoles(rolesData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching roles or permissions:", error);

        // Check if it's a network error or API error
        if (error.response) {
          console.error("Response status:", error.response.status);
          console.error("Response data:", error.response.data);
        }

        // Set empty arrays as fallback
        setAllPermissions([]);
        setRoles([]);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Update permission checkboxes when a role is selected
  useEffect(() => {
    if (selectedRole && allPermissions.length > 0) {
      const initialPermissions = {};
      allPermissions.forEach((perm) => {
        // Handle both array of IDs and array of objects
        const hasPermission = Array.isArray(selectedRole.permissions)
          ? selectedRole.permissions.includes(perm.id)
          : selectedRole.permissions?.some?.(
              (p) => p.id === perm.id || p === perm.id
            );

        initialPermissions[perm.code] = hasPermission || false;
      });
      setPermissions(initialPermissions);
      setNewRoleName(selectedRole.name);
    }
  }, [selectedRole, allPermissions]);

  const handlePermissionChange = (permissionCode) => {
    setPermissions((prev) => ({
      ...prev,
      [permissionCode]: !prev[permissionCode],
    }));
  };

  const handleSaveRole = async () => {
    if (!newRoleName.trim()) {
      alert("Role name is required");
      return;
    }

    const selectedPermissionIds = allPermissions
      .filter((perm) => permissions[perm.code])
      .map((perm) => perm.id);

    try {
      if (isEditing && selectedRole) {
        const response = await axios.put(
          `${API_BASE}/roles/${selectedRole.id}/`,
          {
            name: newRoleName,
            permissions: selectedPermissionIds,
          }
        );
        setRoles((prev) =>
          prev.map((r) => (r.id === selectedRole.id ? response.data : r))
        );
      } else {
        const response = await axios.post(`${API_BASE}/roles/`, {
          name: newRoleName,
          permissions: selectedPermissionIds,
        });
        setRoles((prev) => [...prev, response.data]);
      }
      resetForm();
    } catch (error) {
      console.error("Error saving role:", error);
      if (error.response) {
        console.error("Save error details:", error.response.data);
        alert(
          `Error saving role: ${error.response.data.detail || "Unknown error"}`
        );
      }
    }
  };

  const handleDeleteRole = async (roleId) => {
    if (!confirm("Are you sure you want to delete this role?")) {
      return;
    }

    try {
      await axios.delete(`${API_BASE}/roles/${roleId}/`);
      setRoles((prev) => prev.filter((r) => r.id !== roleId));
      if (selectedRole?.id === roleId) resetForm();
    } catch (error) {
      console.error("Error deleting role:", error);
      if (error.response) {
        alert(
          `Error deleting role: ${
            error.response.data.detail || "Unknown error"
          }`
        );
      }
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

  // Filter permissions into categories for better organization
  const permissionCategories = {
    Administration: allPermissions.filter(
      (p) =>
        p.code.includes("manage_") ||
        p.code.includes("administrator") ||
        p.code === "access_all"
    ),
    "User Management": allPermissions.filter(
      (p) =>
        p.code.includes("user") ||
        p.code.includes("teacher") ||
        p.code.includes("parent")
    ),
    "School Operations": allPermissions.filter(
      (p) =>
        p.code.includes("school") ||
        p.code.includes("class") ||
        p.code.includes("student")
    ),
    "Documents & Reports": allPermissions.filter(
      (p) => p.code.includes("document") || p.code.includes("report")
    ),
    Other: allPermissions.filter(
      (p) =>
        !p.code.includes("manage_") &&
        !p.code.includes("user") &&
        !p.code.includes("teacher") &&
        !p.code.includes("parent") &&
        !p.code.includes("school") &&
        !p.code.includes("class") &&
        !p.code.includes("student") &&
        !p.code.includes("document") &&
        !p.code.includes("report") &&
        !p.code.includes("administrator") &&
        p.code !== "access_all"
    ),
  };

  if (loading) {
    return (
      <div className="user-roles-container">
        <div
          className="loading"
          style={{ textAlign: "center", padding: "2rem" }}
        >
          Loading roles and permissions...
        </div>
      </div>
    );
  }

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
          <FiShield /> User Roles & Permissions
        </h2>
        <button onClick={startCreateNew} className="primary-button">
          <FiPlus /> Create New Role
        </button>
      </div>

      <div className="roles-layout">
        {/* Roles List */}
        <div className="roles-list">
          {Array.isArray(roles) && roles.length > 0 ? (
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
                  {Array.isArray(role.permissions)
                    ? role.permissions.length
                    : 0}{" "}
                  permissions
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
            <div className="empty-state">
              <p>No roles found. Create a new role to get started.</p>
            </div>
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

                {allPermissions.length > 0 ? (
                  Object.entries(permissionCategories).map(
                    ([category, perms]) =>
                      perms.length > 0 && (
                        <div key={category} className="permission-category">
                          <h5>{category}</h5>
                          {perms.map((permission) => (
                            <div
                              key={permission.id}
                              className="permission-item"
                            >
                              <label>
                                <input
                                  type="checkbox"
                                  checked={
                                    permissions[permission.code] || false
                                  }
                                  onChange={() =>
                                    handlePermissionChange(permission.code)
                                  }
                                  disabled={!isEditing && !showCreateModal}
                                />
                                <span className="permission-name">
                                  {permission.name}
                                </span>
                                <span className="permission-description">
                                  {permission.description}
                                </span>
                              </label>
                            </div>
                          ))}
                        </div>
                      )
                  )
                ) : (
                  <div className="empty-state">
                    <p>No permissions available.</p>
                  </div>
                )}
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
