import { useState, useEffect } from "react";
import { useTimetableApi } from "../../../../hooks/useTimetableApi";
import useUser from "../../../../hooks/useUser";
import TimetablePreview from "../../../common/SchoolTimetable/TimetablePreview";
import "./timetables.css";

const TeacherTimetables = () => {
  const { user, schoolId, school } = useUser();
  const api = useTimetableApi();
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [teacherLessons, setTeacherLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [teachersLoading, setTeachersLoading] = useState(true);
  const [lessonsLoading, setLessonsLoading] = useState(false);

  useEffect(() => {
    console.log("TeacherTimetables - Full user context:", {
      user,
      schoolId,
      school,
    });

    // Get school identifier - try multiple approaches
    let schoolIdentifier = null;

    // Method 1: Direct schoolId from useUser
    if (schoolId) {
      schoolIdentifier = schoolId;
      console.log("Using schoolId from useUser:", schoolId);
    }
    // Method 2: School object from useUser
    else if (school?.id) {
      schoolIdentifier = school.id;
      console.log("Using school.id from useUser:", school.id);
    }
    // Method 3: Role-based school from user.role.school
    else if (user?.role?.school) {
      schoolIdentifier = user.role.school;
      console.log("Using user.role.school:", user.role.school);
    }
    // Method 4: Try to extract from user object structure
    else if (user?.school_admin_profile?.school?.id) {
      schoolIdentifier = user.school_admin_profile.school.id;
      console.log(
        "Using user.school_admin_profile.school.id:",
        user.school_admin_profile.school.id
      );
    }

    if (!schoolIdentifier) {
      console.error("No school identifier found. Available data:", {
        user,
        schoolId,
        school,
        userRole: user?.role,
        userSchoolAdmin: user?.school_admin_profile,
      });
      setError(
        "School information not found. Please ensure you're properly logged in as a school administrator."
      );
      setTeachersLoading(false);
      return;
    }

    const fetchTeachers = async () => {
      setTeachersLoading(true);
      setError(null);

      try {
        console.log(
          "Fetching teachers for school identifier:",
          schoolIdentifier
        );

        // Use the school identifier to fetch teachers
        const response = await api.getTeachers(schoolIdentifier);
        console.log("Teachers API response:", response);

        if (response.data && Array.isArray(response.data)) {
          setTeachers(response.data);
          if (response.data.length > 0) {
            setSelectedTeacher(response.data[0].id);
            console.log("Selected first teacher:", response.data[0]);
          } else {
            console.warn("No teachers found for school:", schoolIdentifier);
            setError("No teachers found for this school.");
          }
        } else {
          console.error("Invalid teachers response format:", response);
          setError("Invalid response format from teachers API.");
        }
      } catch (err) {
        console.error("Error fetching teachers:", {
          message: err.message,
          response: err.response,
          status: err.response?.status,
          data: err.response?.data,
          config: err.config,
        });

        // More specific error messages
        if (err.response?.status === 404) {
          setError(
            "Teachers endpoint not found. Please check your API configuration."
          );
        } else if (err.response?.status === 403) {
          setError(
            "You don't have permission to view teachers. Please check your role permissions."
          );
        } else if (err.response?.status === 401) {
          setError("Authentication required. Please log in again.");
        } else {
          setError(
            err.response?.data?.detail ||
              err.message ||
              "Failed to load teachers"
          );
        }
      } finally {
        setTeachersLoading(false);
      }
    };

    fetchTeachers();
  }, [user, schoolId, school, api]);

  useEffect(() => {
    if (selectedTeacher && schoolId) {
      const fetchTeacherLessons = async () => {
        setLessonsLoading(true);
        setError(null);

        try {
          console.log("Fetching lessons for teacher:", selectedTeacher);

          // Fetch lessons directly since there's no specific teacher timetable endpoint
          // We'll get all lessons and filter by teacher
          const response = await api.getLessons();
          console.log("All lessons response:", response);

          if (response.data && Array.isArray(response.data)) {
            // Filter lessons for the selected teacher
            const teacherLessons = response.data.filter(
              (lesson) =>
                lesson.teacher === parseInt(selectedTeacher) ||
                lesson.teacher_details?.id === parseInt(selectedTeacher)
            );

            console.log("Filtered teacher lessons:", teacherLessons);
            setTeacherLessons(teacherLessons);
          } else {
            console.error("Invalid lessons response format:", response);
            setTeacherLessons([]);
          }
        } catch (err) {
          console.error("Failed to load teacher lessons:", err);
          setTeacherLessons([]);
          // Don't set error here as it's not critical - just show empty state
        } finally {
          setLessonsLoading(false);
        }
      };

      fetchTeacherLessons();
    } else {
      setTeacherLessons([]);
    }
  }, [selectedTeacher, schoolId, api]);

  // Helper function to organize lessons by day and time
  const organizeLessons = (lessons) => {
    const days = ["MON", "TUE", "WED", "THU", "FRI"];
    const organizedLessons = {};

    days.forEach((day) => {
      organizedLessons[day] = [];
    });

    lessons.forEach((lesson) => {
      const dayOfWeek = lesson.time_slot_details?.day_of_week;
      if (dayOfWeek && organizedLessons[dayOfWeek]) {
        organizedLessons[dayOfWeek].push(lesson);
      }
    });

    // Sort lessons by time within each day
    Object.keys(organizedLessons).forEach((day) => {
      organizedLessons[day].sort((a, b) => {
        const timeA = a.time_slot_details?.start_time || "00:00";
        const timeB = b.time_slot_details?.start_time || "00:00";
        return timeA.localeCompare(timeB);
      });
    });

    return organizedLessons;
  };

  if (teachersLoading) {
    return (
      <div className="teacher-timetables-container">
        <h2>Teacher Timetables</h2>
        <div className="loading">Loading teachers...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="teacher-timetables-container">
        <h2>Teacher Timetables</h2>
        <div
          className="error-message"
          style={{
            color: "red",
            padding: "20px",
            border: "1px solid red",
            borderRadius: "4px",
            backgroundColor: "#ffeaea",
          }}
        >
          <h3>Error:</h3>
          <p>{error}</p>
          <div style={{ marginTop: "10px", fontSize: "0.9em", color: "#666" }}>
            <strong>Debug Info:</strong>
            <pre>
              {JSON.stringify(
                { user: !!user, schoolId, school: !!school },
                null,
                2
              )}
            </pre>
          </div>
        </div>
      </div>
    );
  }

  if (teachers.length === 0) {
    return (
      <div className="teacher-timetables-container">
        <h2>Teacher Timetables</h2>
        <div className="no-teachers">
          <p>No teachers found for this school.</p>
          <p>Please ensure teachers are properly registered in the system.</p>
        </div>
      </div>
    );
  }

  const organizedLessons = organizeLessons(teacherLessons);
  const selectedTeacherDetails = teachers.find(
    (t) => t.id === parseInt(selectedTeacher)
  );

  return (
    <div className="teacher-timetables-container">
      <h2>Teacher Timetables</h2>

      <div className="teacher-selector" style={{ marginBottom: "20px" }}>
        <label
          htmlFor="teacher-select"
          style={{ marginRight: "10px", fontWeight: "bold" }}
        >
          Select Teacher:
        </label>
        <select
          id="teacher-select"
          value={selectedTeacher || ""}
          onChange={(e) => setSelectedTeacher(e.target.value)}
          style={{ padding: "8px", minWidth: "200px" }}
        >
          {teachers.map((teacher) => (
            <option key={teacher.id} value={teacher.id}>
              {teacher.user?.first_name} {teacher.user?.last_name}
              {teacher.employee_number && ` (${teacher.employee_number})`}
            </option>
          ))}
        </select>
      </div>

      {lessonsLoading && (
        <div
          className="loading"
          style={{ textAlign: "center", padding: "20px" }}
        >
          Loading timetable...
        </div>
      )}

      {selectedTeacherDetails && !lessonsLoading && (
        <div className="teacher-timetable-content">
          <div
            className="teacher-info"
            style={{
              marginBottom: "20px",
              padding: "15px",
              backgroundColor: "#f5f5f5",
              borderRadius: "5px",
            }}
          >
            <h3>
              {selectedTeacherDetails.user?.first_name}{" "}
              {selectedTeacherDetails.user?.last_name}
            </h3>
            {selectedTeacherDetails.employee_number && (
              <p>
                <strong>Employee Number:</strong>{" "}
                {selectedTeacherDetails.employee_number}
              </p>
            )}
            {selectedTeacherDetails.subjects_taught &&
              selectedTeacherDetails.subjects_taught.length > 0 && (
                <p>
                  <strong>Subjects:</strong>{" "}
                  {selectedTeacherDetails.subjects_taught
                    .map((s) => s.name)
                    .join(", ")}
                </p>
              )}
            <p>
              <strong>Total Lessons:</strong> {teacherLessons.length}
            </p>
          </div>

          {teacherLessons.length > 0 ? (
            <div
              className="timetable-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(6, 1fr)",
                gap: "10px",
                marginTop: "20px",
              }}
            >
              <div
                style={{
                  fontWeight: "bold",
                  padding: "10px",
                  backgroundColor: "#e0e0e0",
                }}
              >
                Time
              </div>
              {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map(
                (day) => (
                  <div
                    key={day}
                    style={{
                      fontWeight: "bold",
                      padding: "10px",
                      backgroundColor: "#e0e0e0",
                      textAlign: "center",
                    }}
                  >
                    {day}
                  </div>
                )
              )}

              {/* Generate time slots and lessons */}
              {(() => {
                // Get all unique time slots from lessons
                const timeSlots = new Set();
                teacherLessons.forEach((lesson) => {
                  if (lesson.time_slot_details) {
                    timeSlots.add(
                      `${lesson.time_slot_details.start_time}-${lesson.time_slot_details.end_time}`
                    );
                  }
                });

                const sortedTimeSlots = Array.from(timeSlots).sort();

                return sortedTimeSlots.map((timeSlot) => {
                  const [startTime, endTime] = timeSlot.split("-");

                  return (
                    <React.Fragment key={timeSlot}>
                      <div
                        style={{
                          padding: "10px",
                          backgroundColor: "#f9f9f9",
                          fontSize: "0.9em",
                          textAlign: "center",
                        }}
                      >
                        {startTime}
                        <br />-<br />
                        {endTime}
                      </div>

                      {["MON", "TUE", "WED", "THU", "FRI"].map((dayCode) => {
                        const dayLessons = organizedLessons[dayCode] || [];
                        const lesson = dayLessons.find(
                          (l) =>
                            l.time_slot_details?.start_time === startTime &&
                            l.time_slot_details?.end_time === endTime
                        );

                        return (
                          <div
                            key={`${timeSlot}-${dayCode}`}
                            style={{
                              padding: "8px",
                              border: "1px solid #ddd",
                              backgroundColor: lesson ? "#e8f5e8" : "#fafafa",
                              minHeight: "60px",
                              fontSize: "0.85em",
                            }}
                          >
                            {lesson ? (
                              <div>
                                <strong>{lesson.subject_details?.name}</strong>
                                <br />
                                <small>
                                  {lesson.timetable_details?.school_class
                                    ?.name || "Unknown Class"}
                                </small>
                                {lesson.room && (
                                  <div>
                                    <small>Room: {lesson.room}</small>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <span style={{ color: "#ccc" }}>Free</span>
                            )}
                          </div>
                        );
                      })}
                    </React.Fragment>
                  );
                });
              })()}
            </div>
          ) : (
            <div
              className="no-lessons"
              style={{
                textAlign: "center",
                padding: "40px",
                backgroundColor: "#f9f9f9",
                borderRadius: "5px",
              }}
            >
              <h3>No Lessons Assigned</h3>
              <p>
                This teacher has no lessons assigned in the current timetable.
              </p>
              <p>
                Please check the timetable generation or lesson assignments.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Debug information (remove in production) */}
      {process.env.NODE_ENV === "development" && (
        <div
          style={{
            marginTop: "20px",
            padding: "10px",
            backgroundColor: "#f0f0f0",
            fontSize: "0.8em",
            border: "1px solid #ddd",
          }}
        >
          <h4>Debug Information:</h4>
          <p>
            <strong>Teachers found:</strong> {teachers.length}
          </p>
          <p>
            <strong>Selected teacher ID:</strong> {selectedTeacher}
          </p>
          <p>
            <strong>Teacher lessons:</strong> {teacherLessons.length}
          </p>
          <p>
            <strong>School ID:</strong> {schoolId}
          </p>
          <p>
            <strong>User type:</strong> {user?.user_type}
          </p>
        </div>
      )}
    </div>
  );
};

export default TeacherTimetables;

// const TeacherTimetables = () => {
//   const [teachers, setTeachers] = useState([
//     {
//       id: 1,
//       user: { first_name: "John", last_name: "Smith" },
//       subjects_taught: [1, 4],
//     },
//     {
//       id: 2,
//       user: { first_name: "Mary", last_name: "Johnson" },
//       subjects_taught: [1],
//     },
//   ]);

//   const [selectedTeacher, setSelectedTeacher] = useState(1);
//   const [timetable, setTimetable] = useState({
//     id: 1,
//     classes: [{ id: 101, name: "Grade 1 A" }],
//     lessons: [
//       {
//         subject: { name: "Mathematics" },
//         teacher: { user: { full_name: "John Smith" } },
//         time_slot: {
//           day_of_week: "MON",
//           start_time: "08:00",
//           end_time: "08:40",
//           is_break: false,
//         },
//         is_double_period: false,
//       },
//     ],
//   });

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   return (
//     <div className="teacher-timetables-container">
//       <h2>Teacher Timetables</h2>

//       <div className="teacher-selector">
//         <label>Select Teacher:</label>
//         <select
//           value={selectedTeacher || ""}
//           onChange={(e) => setSelectedTeacher(e.target.value)}
//         >
//           {teachers.map((teacher) => (
//             <option key={teacher.id} value={teacher.id}>
//               {teacher.user.first_name} {teacher.user.last_name}
//             </option>
//           ))}
//         </select>
//       </div>

//       {timetable && (
//         <TimetablePreview
//           timetable={timetable}
//           classId={timetable.classes[0]?.id}
//         />
//       )}
//     </div>
//   );
// };

// export default TeacherTimetables;
