import { useState } from "react";
import { useApi } from "../../../../hooks/useApi";
import Modal from "../../../common/Modal/Modal";
import "../Classes/classes.css";

const PromoteClassModal = ({ classData, onClose, onPromote }) => {
  const [newAcademicYear, setNewAcademicYear] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const api = useApi();

  const handlePromote = async () => {
    if (!newAcademicYear) {
      setError("Please enter the new academic year");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post(`/classes/${classData.id}/promote/`, {
        new_academic_year: newAcademicYear,
      });
      onPromote(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to promote class");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal onClose={onClose}>
      <div className="promote-modal">
        <h2>
          Promote {classData.grade_level} {classData.stream?.name}
        </h2>

        <div className="form-group">
          <label>Current Academic Year:</label>
          <p>{classData.academic_year}</p>
        </div>

        <div className="form-group">
          <label htmlFor="newAcademicYear">New Academic Year:</label>
          <input
            id="newAcademicYear"
            type="text"
            value={newAcademicYear}
            onChange={(e) => setNewAcademicYear(e.target.value)}
            placeholder="e.g. 2024-2025"
          />
          <p className="hint">Format: YYYY-YYYY or YYYY/YYYY</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="modal-actions">
          <button className="cancel-btn" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button
            className="confirm-btn"
            onClick={handlePromote}
            disabled={loading}
          >
            {loading ? "Promoting..." : "Confirm Promotion"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default PromoteClassModal;
