import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTimetableApi } from "../../../../hooks/useTimetableApi";
import TimetableGrid from "../../../common/SchoolTimetable/TimetableGrid";
import { FiArrowLeft, FiPrinter, FiClock, FiRefreshCw } from "react-icons/fi";
import "./timetables.css";

const TimetableDetailView = () => {
  const { timetableId } = useParams();
  const navigate = useNavigate();
  const api = useTimetableApi();
  const [timetable, setTimetable] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTimetable();
  }, [timetableId]);

  const fetchTimetable = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("=== Fetching Timetable Details ===");
      console.log("Timetable ID:", timetableId);

      // 1. Fetch timetable with lessons
      const timetableResponse = await api.getTimetable(timetableId);
      console.log("Timetable response:", timetableResponse.data);

      if (!timetableResponse.data) {
        throw new Error("No timetable data received");
      }

      const timetableData = timetableResponse.data;

      // 2. Extract school ID - try multiple paths
      let schoolId = null;

      // Path 1: school_class_details.school.id
      if (timetableData.school_class_details?.school?.id) {
        schoolId = timetableData.school_class_details.school.id;
      }
      // Path 2: school_class_details.school (direct ID)
      else if (timetableData.school_class_details?.school) {
        schoolId = timetableData.school_class_details.school;
      }
      // Path 3: school_class.school.id
      else if (timetableData.school_class?.school?.id) {
        schoolId = timetableData.school_class.school.id;
      }
      // Path 4: school_class.school (direct ID)
      else if (timetableData.school_class?.school) {
        schoolId = timetableData.school_class.school;
      }
      // Path 5: Extract from first lesson if available
      else if (timetableData.lessons && timetableData.lessons.length > 0) {
        const firstLesson = timetableData.lessons[0];
        if (firstLesson.timetable?.school_class?.school) {
          schoolId = firstLesson.timetable.school_class.school;
        }
      }

      console.log("Extracted school ID:", schoolId);

      if (!schoolId) {
        console.error("Timetable data structure:", timetableData);
        throw new Error("Could not determine school ID from timetable data");
      }

      // 3. Fetch ALL time slots for this school
      let timeSlots = [];
      try {
        const slotsResponse = await api.getTimeSlots(schoolId);
        console.log("Time slots response:", slotsResponse.data);

        if (Array.isArray(slotsResponse.data)) {
          timeSlots = slotsResponse.data;
        } else if (slotsResponse.data?.results) {
          timeSlots = slotsResponse.data.results;
        }

        console.log("Total time slots fetched:", timeSlots.length);
      } catch (slotError) {
        console.error("Error fetching time slots:", slotError);
        // Continue without time slots - they might be embedded in timetable
        if (timetableData.time_slots) {
          timeSlots = timetableData.time_slots;
          console.log("Using embedded time slots:", timeSlots.length);
        }
      }

      // Filter non-break slots and sort properly
      const lessonSlots = timeSlots
        .filter((slot) => !slot.is_break && slot.is_active !== false)
        .sort((a, b) => {
          // First sort by day order
          if (a.day_order !== b.day_order) {
            return a.day_order - b.day_order;
          }
          // Then by start time
          const timeA = new Date(`1970/01/01 ${a.start_time}`);
          const timeB = new Date(`1970/01/01 ${b.start_time}`);
          return timeA - timeB;
        });

      console.log("Filtered lesson slots:", lessonSlots.length);
      console.log("Lessons in timetable:", timetableData.lessons?.length || 0);

      // Log first few slots for verification
      if (lessonSlots.length > 0) {
        console.log("\nFirst 5 time slots:");
        lessonSlots.slice(0, 5).forEach((slot, i) => {
          console.log(
            `  ${i + 1}. ${slot.day_of_week} ${slot.start_time}-${
              slot.end_time
            } (${slot.name})`
          );
        });
      }

      // Log lesson distribution
      if (timetableData.lessons && timetableData.lessons.length > 0) {
        const lessonsByDay = {};
        timetableData.lessons.forEach((lesson) => {
          const day =
            lesson.time_slot_details?.day_of_week || lesson.day_of_week;
          if (day) {
            lessonsByDay[day] = (lessonsByDay[day] || 0) + 1;
          }
        });
        console.log("\nLessons by day:", lessonsByDay);
      }

      // 4. Set complete timetable data
      const completeTimetable = {
        ...timetableData,
        lessons: timetableData.lessons || [],
        time_slots: lessonSlots,
      };

      console.log("\n=== Final Timetable Object ===");
      console.log("Lessons:", completeTimetable.lessons.length);
      console.log("Time slots:", completeTimetable.time_slots.length);
      console.log(
        "Class:",
        completeTimetable.school_class_details?.name ||
          completeTimetable.school_class?.name
      );

      setTimetable(completeTimetable);
    } catch (err) {
      console.error("=== Error Fetching Timetable ===");
      console.error("Error:", err);
      console.error("Response:", err.response?.data);

      setError(
        err.response?.data?.detail || err.message || "Failed to load timetable"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleActivate = async () => {
    if (
      !window.confirm(
        "Activate this timetable? This will deactivate other timetables for this class."
      )
    ) {
      return;
    }

    try {
      await api.activateTimetable(timetableId);
      setTimetable((prev) => ({ ...prev, is_active: true }));
      alert("Timetable activated successfully!");
    } catch (err) {
      console.error("Error activating:", err);
      alert(
        "Failed to activate timetable: " + (err.message || "Unknown error")
      );
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading timetable...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">
          <h3>Error Loading Timetable</h3>
          <p>{error}</p>
        </div>
        <div className="error-actions">
          <button onClick={() => navigate(-1)} className="back-button">
            <FiArrowLeft /> Go Back
          </button>
          <button onClick={fetchTimetable} className="retry-button">
            <FiRefreshCw /> Retry
          </button>
        </div>
      </div>
    );
  }

  if (!timetable) {
    return (
      <div className="not-found">
        <h3>Timetable Not Found</h3>
        <p>The requested timetable could not be found.</p>
        <button onClick={() => navigate(-1)} className="back-button">
          <FiArrowLeft /> Go Back
        </button>
      </div>
    );
  }

  const className =
    timetable.school_class_details?.name ||
    timetable.school_class?.name ||
    "Class";

  return (
    <div className="timetable-detail-container">
      <div className="timetable-header">
        <button onClick={() => navigate(-1)} className="back-button">
          <FiArrowLeft /> Back
        </button>

        <div className="header-info">
          <h2>{className} Timetable</h2>
          <p>
            {timetable.academic_year} - Term {timetable.term} |
            <span
              className={`status ${
                timetable.is_active ? "active" : "inactive"
              }`}
            >
              {timetable.is_active ? " Active" : " Inactive"}
            </span>
          </p>
          <div className="stats">
            <p className="lessons-count">
              📚 {timetable.lessons?.length || 0} lessons scheduled
            </p>
            <p className="slots-count">
              ⏰ {timetable.time_slots?.length || 0} time slots per day
            </p>
          </div>
        </div>

        <div className="action-buttons">
          {!timetable.is_active && (
            <button onClick={handleActivate} className="activate-btn">
              <FiClock /> Activate
            </button>
          )}
          <button onClick={() => window.print()} className="print-btn">
            <FiPrinter /> Print
          </button>
        </div>
      </div>

      <div className="timetable-content">
        {timetable.time_slots && timetable.time_slots.length > 0 ? (
          <TimetableGrid timetable={timetable} />
        ) : (
          <div className="no-data">
            <h4>⚠️ No Time Slots Available</h4>
            <p>
              Time slots are required to display the timetable. Please configure
              the timetable structure in settings.
            </p>
            <button onClick={fetchTimetable} className="retry-button">
              <FiRefreshCw /> Refresh
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimetableDetailView;
