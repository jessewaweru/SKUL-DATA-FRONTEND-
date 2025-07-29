import { useState, useEffect } from "react";
import { useApi } from "../../../../hooks/useApi";
import Modal from "../../../common/Modal/Modal";
import { FiSearch, FiUser } from "react-icons/fi";
import "../Classes/classes.css";

const AssignTeacherModal = ({
  classId,
  currentTeacher,
  onClose,
  onSuccess,
}) => {
  const [teachers, setTeachers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const api = useApi();

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await api.get("/teachers/");
        setTeachers(response.data);
      } catch (err) {
        console.error("Error fetching teachers:", err);
      }
    };

    fetchTeachers();
  }, []);

  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.phone_number?.includes(searchTerm)
  );

  const handleAssignTeacher = async () => {
    if (!selectedTeacher) {
      setError("Please select a teacher");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post(`/classes/${classId}/assign_teacher/`, {
        teacher_id: selectedTeacher.id,
      });
      onSuccess(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to assign teacher");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal onClose={onClose}>
      <div className="assign-teacher-modal">
        <h2>
          {currentTeacher ? "Change Class Teacher" : "Assign Class Teacher"}
        </h2>

        <div className="search-teacher">
          <FiSearch />
          <input
            type="text"
            placeholder="Search teachers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="teachers-list">
          {filteredTeachers.length === 0 ? (
            <div className="no-results">No teachers found</div>
          ) : (
            filteredTeachers.map((teacher) => (
              <div
                key={teacher.id}
                className={`teacher-item ${
                  selectedTeacher?.id === teacher.id ? "selected" : ""
                }`}
                onClick={() => setSelectedTeacher(teacher)}
              >
                <div className="teacher-avatar">
                  <FiUser />
                </div>
                <div className="teacher-info">
                  <h4>{teacher.user.full_name}</h4>
                  <p>{teacher.phone_number || "No phone number"}</p>
                  <p>
                    {teacher.subjects_taught?.join(", ") ||
                      "No subjects listed"}
                  </p>
                </div>
                {currentTeacher?.id === teacher.id && (
                  <div className="current-teacher-badge">Current</div>
                )}
              </div>
            ))
          )}
        </div>

        {error && <div className="fee-error-message">{error}</div>}

        <div className="modal-actions">
          <button className="cancel-btn" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button
            className="confirm-btn"
            onClick={handleAssignTeacher}
            disabled={loading || !selectedTeacher}
          >
            {loading ? "Saving..." : "Assign Teacher"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AssignTeacherModal;
