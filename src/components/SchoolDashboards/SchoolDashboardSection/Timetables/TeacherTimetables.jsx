import { useState, useEffect } from "react";
import { useTimetableApi } from "../../../../hooks/useTimetableApi";
import useUser from "../../../../hooks/useUser";
import {
  FiUser,
  FiBook,
  FiClock,
  FiMapPin,
  FiRefreshCw,
  FiUsers,
} from "react-icons/fi";
import "./timetables.css";

const TeacherTimetables = () => {
  const { user, schoolId } = useUser();
  const api = useTimetableApi();

  const [teachers, setTeachers] = useState([]);
  const [selectedTeacherId, setSelectedTeacherId] = useState(null);
  const [teacherSchedule, setTeacherSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timetables, setTimetables] = useState({}); // Store timetable-class mapping

  // Helper function to get teacher display name
  const getTeacherDisplayName = (teacher) => {
    if (!teacher) return "Select a teacher";

    if (teacher.user) {
      const firstName = teacher.user.first_name || "";
      const lastName = teacher.user.last_name || "";
      return (
        `${firstName} ${lastName}`.trim() ||
        teacher.user.username ||
        "Unknown Teacher"
      );
    }

    if (teacher.first_name || teacher.last_name) {
      return `${teacher.first_name || ""} ${teacher.last_name || ""}`.trim();
    }

    if (teacher.full_name) {
      return teacher.full_name;
    }

    return teacher.username || `Teacher ${teacher.id}`;
  };

  // Enhanced helper to extract class name from lesson with timetable lookup
  const getClassName = (lesson) => {
    // First, check if we have the timetable in our lookup
    const timetableId = lesson.timetable;
    if (timetableId && timetables[timetableId]) {
      return timetables[timetableId];
    }

    // Fallback: Try multiple paths to get class name from lesson data
    if (lesson.timetable_details?.school_class_details?.name) {
      return lesson.timetable_details.school_class_details.name;
    }
    if (lesson.timetable_details?.school_class?.name) {
      return lesson.timetable_details.school_class.name;
    }
    if (lesson.school_class_details?.name) {
      return lesson.school_class_details.name;
    }
    if (lesson.school_class?.name) {
      return lesson.school_class.name;
    }
    if (lesson.class_name) {
      return lesson.class_name;
    }

    return "Unknown Class";
  };

  // Fetch teachers when component mounts
  useEffect(() => {
    if (!schoolId) {
      console.log("Waiting for school ID...");
      return;
    }

    const fetchTeachers = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("Fetching teachers for school:", schoolId);

        const response = await api.getSchoolTeachers(schoolId);
        console.log("Teachers response:", response);

        let teachersData = [];
        if (response?.data) {
          if (response.data.teachers && Array.isArray(response.data.teachers)) {
            teachersData = response.data.teachers;
          } else if (Array.isArray(response.data)) {
            teachersData = response.data;
          } else if (
            response.data.results &&
            Array.isArray(response.data.results)
          ) {
            teachersData = response.data.results;
          }
        }

        console.log("Extracted teachers data:", teachersData);

        if (teachersData.length > 0) {
          setTeachers(teachersData);
          setSelectedTeacherId(teachersData[0].id);
          console.log("Loaded teachers:", teachersData.length);
        } else {
          setError("No teachers found for this school");
        }
      } catch (err) {
        console.error("Error fetching teachers:", err);
        console.error("Error response:", err.response?.data);
        setError(
          err.response?.data?.detail || err.message || "Failed to load teachers"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, [schoolId, api]);

  // Fetch timetables to build timetable-class mapping
  useEffect(() => {
    if (!schoolId) return;

    const fetchTimetablesForMapping = async () => {
      try {
        console.log("Fetching timetables for class mapping...");
        const response = await api.getTimetables(schoolId);

        let timetableData = [];
        if (response?.data) {
          if (response.data.results && Array.isArray(response.data.results)) {
            timetableData = response.data.results;
          } else if (Array.isArray(response.data)) {
            timetableData = response.data;
          } else if (typeof response.data === "object") {
            timetableData = [response.data];
          }
        }

        // Create a mapping of timetable ID to class name
        const timetableMap = {};
        timetableData.forEach((timetable) => {
          if (timetable.id && timetable.school_class_details?.name) {
            timetableMap[timetable.id] = timetable.school_class_details.name;
          } else if (timetable.id && timetable.school_class?.name) {
            timetableMap[timetable.id] = timetable.school_class.name;
          }
        });

        console.log("Timetable-class mapping:", timetableMap);
        setTimetables(timetableMap);
      } catch (err) {
        console.error("Error fetching timetables for mapping:", err);
        // Continue without timetable mapping - we'll use fallbacks
      }
    };

    fetchTimetablesForMapping();
  }, [schoolId, api]);

  // Fetch teacher schedule when teacher is selected
  useEffect(() => {
    if (!selectedTeacherId || !schoolId) return;

    const fetchTeacherSchedule = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("Fetching schedule for teacher:", selectedTeacherId);

        // Fetch ALL lessons from all timetables with expanded data
        const response = await api.getLessons();
        console.log("All lessons response:", response);

        let allLessons = [];
        if (response?.data) {
          if (Array.isArray(response.data)) {
            allLessons = response.data;
          } else if (
            response.data.results &&
            Array.isArray(response.data.results)
          ) {
            allLessons = response.data.results;
          }
        }

        console.log("Total lessons fetched:", allLessons.length);

        // Filter lessons for selected teacher
        const teacherLessons = allLessons.filter((lesson) => {
          const teacherId = lesson.teacher || lesson.teacher_details?.id;
          return teacherId === selectedTeacherId;
        });

        console.log("Teacher lessons found:", teacherLessons.length);

        // DEBUG: Log lessons with class info
        if (teacherLessons.length > 0) {
          console.log("=== Teacher Lessons with Class Info ===");
          teacherLessons.forEach((lesson, idx) => {
            const className = getClassName(lesson);
            console.log(`Lesson ${idx + 1}:`, {
              id: lesson.id,
              subject: lesson.subject_details?.name,
              timetable_id: lesson.timetable,
              class_name: className,
              teacher:
                lesson.teacher_details?.user?.first_name +
                " " +
                lesson.teacher_details?.user?.last_name,
            });
          });
        }

        if (teacherLessons.length > 0) {
          const schedule = organizeSchedule(teacherLessons);
          setTeacherSchedule(schedule);
        } else {
          setTeacherSchedule({
            days: [],
            timeSlots: [],
            grid: {},
            totalLessons: 0,
          });
        }
      } catch (err) {
        console.error("Error fetching teacher schedule:", err);
        setError(
          err.response?.data?.detail ||
            err.message ||
            "Failed to load teacher schedule"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherSchedule();
  }, [selectedTeacherId, schoolId, api, timetables]); // Add timetables to dependencies

  // Organize lessons into a schedule grid
  const organizeSchedule = (lessons) => {
    const days = ["MON", "TUE", "WED", "THU", "FRI"];
    const dayNames = {
      MON: "Monday",
      TUE: "Tuesday",
      WED: "Wednesday",
      THU: "Thursday",
      FRI: "Friday",
    };

    // Extract unique time slots
    const timeSlotsMap = new Map();

    lessons.forEach((lesson) => {
      const timeSlot = lesson.time_slot_details || lesson.time_slot;
      if (timeSlot && timeSlot.start_time && timeSlot.end_time) {
        const key = `${timeSlot.start_time}-${timeSlot.end_time}`;
        if (!timeSlotsMap.has(key)) {
          timeSlotsMap.set(key, {
            start: timeSlot.start_time,
            end: timeSlot.end_time,
            order: timeSlot.order || 0,
          });
        }
      }
    });

    // Sort time slots by start time
    const sortedSlots = Array.from(timeSlotsMap.keys()).sort((a, b) => {
      const [startA] = a.split("-");
      const [startB] = b.split("-");
      return startA.localeCompare(startB);
    });

    // Initialize grid
    const grid = {};
    days.forEach((day) => {
      grid[day] = {};
      sortedSlots.forEach((slot) => {
        grid[day][slot] = null;
      });
    });

    // Fill grid with lessons
    lessons.forEach((lesson) => {
      const timeSlot = lesson.time_slot_details || lesson.time_slot;
      if (timeSlot && timeSlot.start_time && timeSlot.end_time) {
        const day = timeSlot.day_of_week;
        const slotKey = `${timeSlot.start_time}-${timeSlot.end_time}`;

        if (grid[day] && slotKey in grid[day]) {
          grid[day][slotKey] = lesson;
        }
      }
    });

    return {
      days: days.map((code) => ({ code, name: dayNames[code] })),
      timeSlots: sortedSlots,
      grid,
      totalLessons: lessons.length,
    };
  };

  const selectedTeacher = teachers.find((t) => t.id === selectedTeacherId);

  const handleRefresh = () => {
    if (selectedTeacherId && schoolId) {
      setTeacherSchedule(null);
      setLoading(true);
    }
  };

  if (!schoolId) {
    return (
      <div className="teacher-timetables-container">
        <h2>Teacher Timetables</h2>
        <div className="loading">Loading school information...</div>
      </div>
    );
  }

  if (loading && !teacherSchedule) {
    return (
      <div className="teacher-timetables-container">
        <h2>Teacher Timetables</h2>
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading teachers and schedules...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="teacher-timetables-container">
        <h2>Teacher Timetables</h2>
        <div className="error-message">
          <h3>Error</h3>
          <p>{error}</p>
          <button onClick={handleRefresh} className="btn-refresh">
            <FiRefreshCw /> Try Again
          </button>
        </div>
      </div>
    );
  }

  if (teachers.length === 0) {
    return (
      <div className="teacher-timetables-container">
        <h2>Teacher Timetables</h2>
        <div className="no-teachers">
          <h3>No Teachers Found</h3>
          <p>No teachers are registered in the system.</p>
          <p>Please add teachers first in the Teachers section.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="teacher-timetables-container">
      <div className="header">
        <h2>Teacher Timetables</h2>
        <button onClick={handleRefresh} className="btn-refresh">
          <FiRefreshCw /> Refresh
        </button>
      </div>

      {/* Teacher Selector Card */}
      <div className="teacher-selector-card">
        <div className="selector-header">
          <FiUser size={24} />
          <label>Select Teacher:</label>
        </div>
        <select
          value={selectedTeacherId || ""}
          onChange={(e) => setSelectedTeacherId(parseInt(e.target.value))}
          className="teacher-select"
        >
          <option value="">Select a teacher...</option>
          {teachers.map((teacher) => (
            <option key={teacher.id} value={teacher.id}>
              {getTeacherDisplayName(teacher)}
              {teacher.employee_number && ` (${teacher.employee_number})`}
            </option>
          ))}
        </select>

        {selectedTeacher && (
          <div className="teacher-info">
            <h3>{getTeacherDisplayName(selectedTeacher)}</h3>
            {selectedTeacher.employee_number && (
              <p className="employee-number">
                Employee #: {selectedTeacher.employee_number}
              </p>
            )}
            {teacherSchedule && (
              <p className="lesson-count">
                <FiBook /> {teacherSchedule.totalLessons} lessons per week
              </p>
            )}
          </div>
        )}
      </div>

      {/* Timetable Grid */}
      {teacherSchedule && teacherSchedule.timeSlots.length > 0 ? (
        <div className="timetable-card">
          <div className="timetable-scroll">
            <table className="teacher-timetable-grid">
              <thead>
                <tr>
                  <th className="time-header">
                    <FiClock /> Time
                  </th>
                  {teacherSchedule.days.map((day) => (
                    <th key={day.code} className="day-header">
                      {day.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {teacherSchedule.timeSlots.map((slot) => {
                  const [startTime, endTime] = slot.split("-");

                  return (
                    <tr key={slot}>
                      <td className="time-cell">
                        <div className="time-start">{startTime}</div>
                        <div className="time-end">{endTime}</div>
                      </td>

                      {teacherSchedule.days.map((day) => {
                        const lesson = teacherSchedule.grid[day.code][slot];

                        return (
                          <td
                            key={`${day.code}-${slot}`}
                            className={`lesson-cell ${
                              lesson ? "has-lesson" : "free-period"
                            }`}
                          >
                            {lesson ? (
                              <div className="lesson-content">
                                <div className="lesson-subject">
                                  {lesson.subject_details?.name ||
                                    lesson.subject?.name ||
                                    "Subject"}
                                </div>
                                <div className="lesson-class">
                                  <FiUsers
                                    size={12}
                                    style={{ marginRight: "4px" }}
                                  />
                                  {getClassName(lesson)}
                                </div>
                                {lesson.room && (
                                  <div className="lesson-room">
                                    <FiMapPin size={12} />
                                    {lesson.room}
                                  </div>
                                )}
                                {lesson.is_double_period && (
                                  <span className="double-badge">Double</span>
                                )}
                              </div>
                            ) : (
                              <span className="free-text">Free</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="schedule-summary">
            <h4>Weekly Summary</h4>
            <div className="summary-stats">
              <div className="stat">
                <span className="stat-label">Total Lessons</span>
                <span className="stat-value">
                  {teacherSchedule.totalLessons}
                </span>
              </div>
              <div className="stat">
                <span className="stat-label">Periods/Day</span>
                <span className="stat-value">
                  {teacherSchedule.timeSlots.length}
                </span>
              </div>
              <div className="stat">
                <span className="stat-label">Working Days</span>
                <span className="stat-value">
                  {teacherSchedule.days.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="no-schedule">
          <h3>No Schedule Available</h3>
          <p>This teacher has no lessons assigned in any active timetables.</p>
          <p>Lessons are assigned when you generate timetables for classes.</p>
        </div>
      )}
    </div>
  );
};

export default TeacherTimetables;
