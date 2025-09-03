import { useState, useEffect } from "react";
import useUser from "../../../../hooks/useUser";
import { useTimetableApi } from "../../../../hooks/useTimetableApi";
import "./timetables.css";

const SubjectGroupsManagement = () => {
  const { user } = useUser();
  const api = useTimetableApi();
  const [groups, setGroups] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newGroup, setNewGroup] = useState({
    name: "",
    description: "",
    subject_ids: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Debug logging
        console.log("User data:", user);
        console.log("School ID:", user?.school?.id || user?.schoolId);

        const schoolId = user?.school?.id || user?.schoolId;

        if (!schoolId) {
          throw new Error("School ID not found in user data");
        }

        // Fetch subject groups and subjects in parallel
        const [groupsRes, subjectsRes] = await Promise.all([
          api.getSubjectGroups(schoolId),
          api.getSubjects(schoolId), // This should use school ID for subjects endpoint
        ]);

        console.log("Groups response:", groupsRes.data);
        console.log("Subjects response:", subjectsRes.data);

        setGroups(groupsRes.data || []);
        setSubjects(subjectsRes.data || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(`Failed to load data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch data when we have user and school information
    if (user && (user.school?.id || user.schoolId)) {
      fetchData();
    } else if (user) {
      // User is loaded but no school info found
      setError("School information not found");
      setLoading(false);
    }
  }, [user, api]);

  const handleCreateGroup = async () => {
    if (!newGroup.name || newGroup.subject_ids.length === 0) {
      alert("Group name and at least one subject are required");
      return;
    }

    try {
      const schoolId = user?.school?.id || user?.schoolId;

      if (!schoolId) {
        alert("School information not found");
        return;
      }

      const response = await api.createSubjectGroup({
        school: schoolId,
        ...newGroup,
      });

      setGroups([...groups, response.data]);
      setNewGroup({
        name: "",
        description: "",
        subject_ids: [],
      });

      alert("Subject group created successfully!");
    } catch (err) {
      console.error("Failed to create group", err);
      alert(
        `Failed to create subject group: ${err.message || "Unknown error"}`
      );
    }
  };

  const handleDeleteGroup = async (groupId) => {
    if (!window.confirm("Are you sure you want to delete this group?")) return;

    try {
      await api.deleteSubjectGroup(groupId);
      setGroups(groups.filter((g) => g.id !== groupId));
      alert("Subject group deleted successfully!");
    } catch (err) {
      console.error("Failed to delete group", err);
      alert(
        `Failed to delete subject group: ${err.message || "Unknown error"}`
      );
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="loading">
        <div>Loading subject groups...</div>
        <div>Please wait while we fetch your data.</div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="error">
        <h3>Error Loading Data</h3>
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="btn-primary"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="subject-groups-management">
      <h2>Subject Groups Management</h2>
      <p>
        Create groups of subjects that students don't take together (e.g.,
        Technical Options)
      </p>

      <div className="create-group-form">
        <h3>Create New Subject Group</h3>
        <div className="form-group">
          <label>Group Name *</label>
          <input
            type="text"
            value={newGroup.name}
            onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
            placeholder="e.g. Technical Options, Science Practicals, Optional Languages"
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            value={newGroup.description}
            onChange={(e) =>
              setNewGroup({ ...newGroup, description: e.target.value })
            }
            placeholder="Optional description (e.g., Students choose one subject from this group)"
            rows={3}
          />
        </div>

        <div className="form-group">
          <label>Subjects in Group *</label>
          {subjects.length > 0 ? (
            <>
              <select
                multiple
                size={Math.min(subjects.length, 8)}
                value={newGroup.subject_ids.map(String)} // Convert to strings for comparison
                onChange={(e) => {
                  const selected = Array.from(
                    e.target.selectedOptions,
                    (opt) => parseInt(opt.value) // Convert back to integers
                  );
                  setNewGroup({ ...newGroup, subject_ids: selected });
                }}
                className="subject-select"
              >
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name} {subject.code && `(${subject.code})`}
                  </option>
                ))}
              </select>
              <small>
                Hold CTRL/CMD to select multiple subjects. Selected:{" "}
                {newGroup.subject_ids.length}
              </small>
            </>
          ) : (
            <div className="no-subjects">
              <p>
                No subjects available. Please ensure subjects are configured for
                your school.
              </p>
            </div>
          )}
        </div>

        <button
          onClick={handleCreateGroup}
          className="btn-primary"
          disabled={
            !newGroup.name ||
            newGroup.subject_ids.length === 0 ||
            subjects.length === 0
          }
        >
          Create Subject Group
        </button>
      </div>

      <div className="groups-list">
        <h3>Existing Subject Groups ({groups.length})</h3>
        {groups.length === 0 ? (
          <div className="no-groups">
            <p>No subject groups created yet.</p>
            <p>
              Subject groups help organize subjects that students don't take
              simultaneously, which is useful for timetable generation.
            </p>
          </div>
        ) : (
          <div className="groups-container">
            {groups.map((group) => (
              <div key={group.id} className="group-card">
                <div className="group-header">
                  <h4>{group.name}</h4>
                  <button
                    onClick={() => handleDeleteGroup(group.id)}
                    className="btn-delete"
                    title="Delete this subject group"
                  >
                    Delete
                  </button>
                </div>

                {group.description && (
                  <p className="group-description">{group.description}</p>
                )}

                <div className="subjects-list">
                  <h5>
                    Subjects in this group ({group.subjects?.length || 0}):
                  </h5>
                  {group.subjects && group.subjects.length > 0 ? (
                    <ul>
                      {group.subjects.map((subject) => (
                        <li key={subject.id}>
                          <strong>{subject.name}</strong>
                          {subject.code && (
                            <span className="subject-code">
                              {" "}
                              ({subject.code})
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="no-subjects-in-group">
                      No subjects assigned to this group
                    </p>
                  )}
                </div>

                <div className="group-meta">
                  <small>
                    Created: {new Date(group.created_at).toLocaleDateString()}
                  </small>
                  {group.updated_at !== group.created_at && (
                    <small>
                      {" "}
                      • Updated:{" "}
                      {new Date(group.updated_at).toLocaleDateString()}
                    </small>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Debug info (remove in production) */}
      <div
        className="debug-info"
        style={{
          marginTop: "20px",
          padding: "10px",
          background: "#f5f5f5",
          fontSize: "12px",
        }}
      >
        <strong>Debug Info:</strong>
        <div>User ID: {user?.id}</div>
        <div>School ID: {user?.school?.id || user?.schoolId}</div>
        <div>User Type: {user?.user_type}</div>
        <div>Groups loaded: {groups.length}</div>
        <div>Subjects loaded: {subjects.length}</div>
      </div>
    </div>
  );
};

export default SubjectGroupsManagement;
