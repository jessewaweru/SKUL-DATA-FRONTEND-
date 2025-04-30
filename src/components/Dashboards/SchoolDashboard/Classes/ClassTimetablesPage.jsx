import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useApi } from "../../../../hooks/useApi";
import { FiCalendar, FiUpload, FiDownload, FiTrash2 } from "react-icons/fi";
import TimetableUploadModal from "./TimetableUploadModal";
import "../Classes/classes.css";

const ClassTimetablesPage = () => {
  const { classId } = useParams();
  const [timetables, setTimetables] = useState([]);
  const [activeTimetable, setActiveTimetable] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const api = useApi();

  useEffect(() => {
    const fetchTimetables = async () => {
      try {
        const response = await api.get(
          `/class-timetables/?school_class=${classId}`
        );
        setTimetables(response.data);
        const active = response.data.find((t) => t.is_active);
        setActiveTimetable(active || null);
      } catch (error) {
        console.error("Error fetching timetables:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTimetables();
  }, [classId]);

  const handleUploadSuccess = (newTimetable) => {
    setTimetables([newTimetable, ...timetables]);
    setActiveTimetable(newTimetable);
    setShowUploadModal(false);
  };

  const handleSetActive = async (timetableId) => {
    try {
      await api.patch(`/class-timetables/${timetableId}/`, { is_active: true });
      setTimetables(
        timetables.map((t) => ({
          ...t,
          is_active: t.id === timetableId,
        }))
      );
      setActiveTimetable(timetables.find((t) => t.id === timetableId));
    } catch (error) {
      console.error("Error setting active timetable:", error);
    }
  };

  const handleDelete = async (timetableId) => {
    try {
      await api.delete(`/class-timetables/${timetableId}/`);
      setTimetables(timetables.filter((t) => t.id !== timetableId));
      if (activeTimetable?.id === timetableId) {
        setActiveTimetable(null);
      }
    } catch (error) {
      console.error("Error deleting timetable:", error);
    }
  };

  return (
    <div className="class-timetables-page">
      <div className="timetables-header">
        <h2>
          <FiCalendar /> Class Timetables
        </h2>
        <button className="upload-btn" onClick={() => setShowUploadModal(true)}>
          <FiUpload /> Upload Timetable
        </button>
      </div>

      {loading ? (
        <div>Loading timetables...</div>
      ) : (
        <>
          {activeTimetable && (
            <div className="active-timetable">
              <h3>Current Timetable</h3>
              <div className="timetable-card active">
                <div className="timetable-info">
                  <h4>{activeTimetable.description || "Class Timetable"}</h4>
                  <p>
                    Uploaded:{" "}
                    {new Date(activeTimetable.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="timetable-actions">
                  <a
                    href={activeTimetable.file}
                    download
                    className="download-btn"
                  >
                    <FiDownload /> Download
                  </a>
                  <button
                    onClick={() => handleDelete(activeTimetable.id)}
                    className="delete-btn"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="timetables-list">
            <h3>Previous Timetables</h3>
            {timetables.filter((t) => !t.is_active).length === 0 ? (
              <div className="no-timetables">No previous timetables found</div>
            ) : (
              <div className="timetable-grid">
                {timetables
                  .filter((t) => !t.is_active)
                  .map((timetable) => (
                    <div key={timetable.id} className="timetable-card">
                      <div className="timetable-info">
                        <h4>{timetable.description || "Class Timetable"}</h4>
                        <p>
                          {new Date(timetable.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="timetable-actions">
                        <button
                          onClick={() => handleSetActive(timetable.id)}
                          className="set-active-btn"
                        >
                          Set Active
                        </button>
                        <a
                          href={timetable.file}
                          download
                          className="download-btn"
                        >
                          <FiDownload />
                        </a>
                        <button
                          onClick={() => handleDelete(timetable.id)}
                          className="delete-btn"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </>
      )}

      {showUploadModal && (
        <TimetableUploadModal
          classId={classId}
          onClose={() => setShowUploadModal(false)}
          onSuccess={handleUploadSuccess}
        />
      )}
    </div>
  );
};

export default ClassTimetablesPage;
