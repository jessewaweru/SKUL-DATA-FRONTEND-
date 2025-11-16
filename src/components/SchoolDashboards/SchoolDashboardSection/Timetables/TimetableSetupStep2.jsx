import { useTimetableApi } from "../../../../hooks/useTimetableApi";
import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import "./timetables.css";

const TimetableSetupStep2 = () => {
  const { timetableData, updateData } = useOutletContext();
  const api = useTimetableApi();
  const navigate = useNavigate();
  const [structure, setStructure] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStructure = async () => {
      if (!timetableData?.school) {
        setError("School information not available");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Use the correct endpoint with query parameter
        const response = await api.getTimetableStructures(timetableData.school);

        // Handle both array and object responses
        let structureData = null;
        if (Array.isArray(response.data) && response.data.length > 0) {
          structureData = response.data[0];
        } else if (response.data.results && response.data.results.length > 0) {
          structureData = response.data.results[0];
        } else if (response.data && typeof response.data === "object") {
          structureData = response.data;
        }

        if (structureData) {
          setStructure(structureData);
          updateData({ structure: structureData });
        } else {
          setError(
            "No timetable structure found for this school. Please set up the structure first."
          );
        }
      } catch (err) {
        console.error("Failed to load timetable structure:", err);
        const errorMessage =
          err.response?.data?.detail ||
          err.message ||
          "Failed to load timetable structure";
        setError(errorMessage);

        // Check if it's an authentication error
        if (err.response?.status === 401) {
          // Redirect to login or show login modal
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login";
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStructure();
  }, [timetableData?.school]);

  const handleNext = () => {
    if (!structure) {
      alert("Please set up the timetable structure first");
      return;
    }
    // navigate("/school_timetables/timetables/create/step-3");
    navigate("/dashboard/timetables/create/step-3");
  };

  const handlePrev = () => {
    // navigate("/school_timetables/timetables/create/step-1");
    navigate("/dashboard/timetables/create/step-1");
  };

  if (loading)
    return <div className="loading">Loading timetable structure...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="timetable-step-2">
      <h3>Timetable Structure</h3>

      {structure && (
        <div className="structure-details">
          <div className="detail-row">
            <span className="detail-label">Curriculum:</span>
            <span className="detail-value">{structure.curriculum}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Days of Week:</span>
            <span className="detail-value">
              {Array.isArray(structure.days_of_week)
                ? structure.days_of_week.join(", ")
                : "Not specified"}
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">School Day:</span>
            <span className="detail-value">
              {structure.default_start_time} - {structure.default_end_time}
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Period Duration:</span>
            <span className="detail-value">
              {structure.period_duration} minutes
            </span>
          </div>
        </div>
      )}

      {structure?.time_slots && structure.time_slots.length > 0 ? (
        <div className="time-slots-preview">
          <h4>Generated Time Slots</h4>
          <div className="time-slots-grid">
            {structure.time_slots.map((slot) => (
              <div key={slot.id} className="time-slot-item">
                <div className="slot-day">{slot.day_of_week}</div>
                <div className="slot-time">
                  {slot.start_time} - {slot.end_time}
                </div>
                <div className="slot-name">
                  {slot.is_break ? (
                    <span className="break-slot">{slot.break_name}</span>
                  ) : (
                    <span className="period-slot">{slot.name}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="no-time-slots">
          <p>
            No time slots generated yet. Please generate time slots in the
            timetable structure.
          </p>
        </div>
      )}

      <div className="step-actions">
        <button className="btn-prev" onClick={handlePrev}>
          Back: Select Classes
        </button>
        <button className="btn-next" onClick={handleNext} disabled={!structure}>
          Next: Assign Subjects
        </button>
      </div>
    </div>
  );
};

export default TimetableSetupStep2;
