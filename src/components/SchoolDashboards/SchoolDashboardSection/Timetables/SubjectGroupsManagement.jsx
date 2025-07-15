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
        const [groupsRes, subjectsRes] = await Promise.all([
          api.getSubjectGroups(user.school.id),
          api.getSubjects(user.school.id),
        ]);
        setGroups(groupsRes.data);
        setSubjects(subjectsRes.data);
      } catch (err) {
        setError("Failed to load data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.school?.id) {
      fetchData();
    }
  }, [user?.school?.id]);

  const handleCreateGroup = async () => {
    if (!newGroup.name || newGroup.subject_ids.length === 0) {
      alert("Group name and at least one subject are required");
      return;
    }

    try {
      const response = await api.createSubjectGroup({
        school: user.school.id,
        ...newGroup,
      });
      setGroups([...groups, response.data]);
      setNewGroup({
        name: "",
        description: "",
        subject_ids: [],
      });
    } catch (err) {
      console.error("Failed to create group", err);
      alert("Failed to create subject group");
    }
  };

  const handleDeleteGroup = async (groupId) => {
    if (!window.confirm("Are you sure you want to delete this group?")) return;

    try {
      await api.deleteSubjectGroup(groupId);
      setGroups(groups.filter((g) => g.id !== groupId));
    } catch (err) {
      console.error("Failed to delete group", err);
      alert("Failed to delete subject group");
    }
  };

  if (loading) return <div className="loading">Loading subject groups...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="subject-groups-management">
      <h2>Subject Groups Management</h2>
      <p>Create groups of subjects that students don't take together</p>

      <div className="create-group-form">
        <h3>Create New Subject Group</h3>
        <div className="form-group">
          <label>Group Name *</label>
          <input
            type="text"
            value={newGroup.name}
            onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
            placeholder="e.g. Technical Options"
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            value={newGroup.description}
            onChange={(e) =>
              setNewGroup({ ...newGroup, description: e.target.value })
            }
            placeholder="Optional description"
            rows={3}
          />
        </div>
        <div className="form-group">
          <label>Subjects in Group *</label>
          <select
            multiple
            size={5}
            value={newGroup.subject_ids}
            onChange={(e) => {
              const selected = Array.from(
                e.target.selectedOptions,
                (opt) => opt.value
              );
              setNewGroup({ ...newGroup, subject_ids: selected });
            }}
            className="subject-select"
          >
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name} ({subject.code})
              </option>
            ))}
          </select>
          <small>Hold CTRL/CMD to select multiple subjects</small>
        </div>
        <button
          onClick={handleCreateGroup}
          className="btn-primary"
          disabled={!newGroup.name || newGroup.subject_ids.length === 0}
        >
          Create Subject Group
        </button>
      </div>

      <div className="groups-list">
        <h3>Existing Subject Groups</h3>
        {groups.length === 0 ? (
          <p className="no-groups">No subject groups created yet</p>
        ) : (
          groups.map((group) => (
            <div key={group.id} className="group-card">
              <div className="group-header">
                <h4>{group.name}</h4>
                <button
                  onClick={() => handleDeleteGroup(group.id)}
                  className="btn-delete"
                >
                  Delete
                </button>
              </div>
              {group.description && (
                <p className="group-description">{group.description}</p>
              )}
              <div className="subjects-list">
                <h5>Subjects in this group:</h5>
                <ul>
                  {group.subjects.map((subject) => (
                    <li key={subject.id}>
                      {subject.name} ({subject.code})
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SubjectGroupsManagement;
