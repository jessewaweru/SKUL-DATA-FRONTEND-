import { useEffect, useState } from "react";
import { useApi } from "../../../../hooks/useApi";
import { useNavigate } from "react-router-dom";
import { FiEdit, FiUsers, FiBarChart2, FiTrash2 } from "react-icons/fi";
import ConfirmModal from "../../../common/ConfirmModal";

const ClassList = ({ refresh }) => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("active");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [classToDelete, setClassToDelete] = useState(null);
  const [error, setError] = useState(null);
  const api = useApi();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);
        setError(null);
        const params = { is_active: filter === "active" };
        const response = await api.get("/api/schools/classes/", { params });

        // Debugging: Log the API response
        console.log("API Response:", response);

        // Check if response.data exists and is an array
        if (!response?.data) {
          throw new Error("No data received from API");
        }

        if (!Array.isArray(response.data)) {
          // If data isn't an array but might be an object with results
          if (response.data.results && Array.isArray(response.data.results)) {
            setClasses(response.data.results);
          } else {
            throw new Error("API response is not in expected format");
          }
        } else {
          setClasses(response.data);
        }
      } catch (error) {
        console.error("Error fetching classes:", error);
        setError(error.message || "Failed to load classes. Please try again.");
        setClasses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, [refresh, filter]);

  const handleDeleteClass = async () => {
    try {
      await api.delete(`/api/schools/classes/${classToDelete.id}/`);
      setClasses(classes.filter((c) => c.id !== classToDelete.id));
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting class:", error);
      setError("Failed to delete class. Please try again.");
    }
  };

  const toggleClassStatus = async (classId, currentStatus) => {
    try {
      const response = await api.patch(`/api/schools/classes/${classId}/`, {
        is_active: !currentStatus,
      });
      setClasses(classes.map((c) => (c.id === classId ? response.data : c)));
    } catch (error) {
      console.error("Error updating class status:", error);
      setError("Failed to update class status. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading classes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button
          className="retry-button"
          onClick={() => {
            setError(null);
            setLoading(true);
            // This will trigger the useEffect again
            setClasses([]);
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="class-list-container">
      <div className="list-filters">
        <button
          className={`filter-btn ${filter === "active" ? "active" : ""}`}
          onClick={() => setFilter("active")}
        >
          Active Classes
        </button>
        <button
          className={`filter-btn ${filter === "inactive" ? "active" : ""}`}
          onClick={() => setFilter("inactive")}
        >
          Archived Classes
        </button>
      </div>

      {classes.length === 0 ? (
        <div className="no-classes-message">
          No classes found.{" "}
          {filter === "active"
            ? "Create a new class to get started!"
            : "No archived classes found."}
        </div>
      ) : (
        <table className="class-list-table">
          <thead>
            <tr>
              <th>Class Name</th>
              <th>Level</th>
              <th>Academic Year</th>
              <th>Students</th>
              <th>Performance</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {classes.map((cls) => {
              const className = `${cls.grade_level} ${
                cls.stream?.name || ""
              }`.trim();
              return (
                <tr key={cls.id}>
                  <td>
                    <span
                      className="class-name-link"
                      onClick={() => navigate(`/classes/manage/${cls.id}`)}
                    >
                      {className}
                    </span>
                  </td>
                  <td>{cls.level}</td>
                  <td>{cls.academic_year}</td>
                  <td>
                    <div className="stat-cell">
                      <FiUsers />
                      <span>{cls.student_count}</span>
                    </div>
                  </td>
                  <td>
                    {cls.average_performance ? (
                      <div className="stat-cell">
                        <FiBarChart2 />
                        <span>{cls.average_performance.toFixed(1)}%</span>
                      </div>
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="edit-btn"
                        onClick={() => navigate(`/classes/manage/${cls.id}`)}
                      >
                        <FiEdit />
                      </button>
                      <button
                        className="status-btn"
                        onClick={() => toggleClassStatus(cls.id, cls.is_active)}
                      >
                        {cls.is_active ? "Archive" : "Activate"}
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => {
                          setClassToDelete(cls);
                          setShowDeleteModal(true);
                        }}
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {showDeleteModal && (
        <ConfirmModal
          title="Confirm Delete"
          message={`Are you sure you want to permanently delete ${classToDelete?.grade_level} ${classToDelete?.stream?.name}?`}
          onConfirm={handleDeleteClass}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  );
};

export default ClassList;
