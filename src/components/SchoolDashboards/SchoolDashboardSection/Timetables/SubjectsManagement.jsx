import { useState, useEffect } from "react";
import { useTimetableApi } from "../../../../hooks/useTimetableApi";
import { useApi } from "../../../../hooks/useApi";
import useUser from "../../../../hooks/useUser";
import { FiBook, FiUser, FiClock, FiRefreshCw, FiPlus } from "react-icons/fi";
import "./timetables.css";

const SubjectsManagement = () => {
  const { user, schoolId } = useUser();
  const timetableApi = useTimetableApi();
  const rawApi = useApi(); // For raw API calls like pagination

  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrichedSubjects, setEnrichedSubjects] = useState([]);
  const [timetables, setTimetables] = useState({}); // Store timetable-class mapping

  // Fetch timetables for class name lookup
  useEffect(() => {
    if (!schoolId) return;

    const fetchTimetablesForMapping = async () => {
      try {
        console.log("Fetching timetables for class mapping...");
        const response = await timetableApi.getTimetables(schoolId);

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
      }
    };

    fetchTimetablesForMapping();
  }, [schoolId, timetableApi]);

  // Helper to get class name from lesson
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

    return null; // Return null instead of "Unknown Class"
  };

  // Fetch subjects from the subjects endpoint
  useEffect(() => {
    if (!schoolId) {
      console.log("Waiting for school ID...");
      return;
    }

    // Only fetch subjects after we have the timetable mapping
    if (Object.keys(timetables).length === 0) {
      console.log("Waiting for timetable mapping...");
      return;
    }

    const fetchSubjects = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("Fetching subjects for school:", schoolId);

        const response = await timetableApi.getSubjects(schoolId);
        console.log("Subjects API response:", response);

        let subjectsData = [];
        if (response?.data) {
          if (Array.isArray(response.data)) {
            subjectsData = response.data;
          } else if (
            response.data.results &&
            Array.isArray(response.data.results)
          ) {
            subjectsData = response.data.results;
          }
        }

        console.log("Subjects loaded:", subjectsData.length);
        setSubjects(subjectsData);

        // Now enrich with teacher and timetable data
        if (subjectsData.length > 0) {
          await enrichSubjectsWithTimetableData(subjectsData);
        }
      } catch (err) {
        console.error("Error fetching subjects:", err);
        setError(
          err.response?.data?.detail || err.message || "Failed to load subjects"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, [schoolId, timetableApi, timetables]);

  // Enrich subjects with teacher assignments and period counts from lessons
  const enrichSubjectsWithTimetableData = async (subjectsData) => {
    try {
      console.log("Enriching subjects with timetable data...");

      // Fetch all lessons
      const lessonsResponse = await timetableApi.getLessons();

      // Extract lessons array from response
      let allLessons = [];
      if (lessonsResponse?.data) {
        if (Array.isArray(lessonsResponse.data)) {
          allLessons = lessonsResponse.data;
        } else if (
          lessonsResponse.data.results &&
          Array.isArray(lessonsResponse.data.results)
        ) {
          allLessons = lessonsResponse.data.results;

          // Handle pagination if needed - use rawApi for pagination
          let nextUrl = lessonsResponse.data.next;
          while (nextUrl) {
            console.log("Fetching next page of lessons...");
            try {
              // Extract just the path from the full URL
              const urlPath = nextUrl.replace(/^https?:\/\/[^\/]+/, "");
              const nextResponse = await rawApi.get(urlPath);

              if (nextResponse?.data?.results) {
                allLessons = [...allLessons, ...nextResponse.data.results];
                nextUrl = nextResponse.data.next;
              } else {
                nextUrl = null;
              }
            } catch (pageError) {
              console.error("Error fetching next page:", pageError);
              nextUrl = null; // Stop pagination on error
            }
          }
        }
      }

      console.log("Total lessons fetched:", allLessons.length);

      // Create a map to track teacher assignments and period counts per subject
      const subjectEnrichmentMap = new Map();

      allLessons.forEach((lesson, lessonIdx) => {
        const subjectId = lesson.subject_details?.id || lesson.subject;
        if (!subjectId) {
          if (lessonIdx < 3)
            console.log(`Lesson ${lessonIdx + 1}: No subject ID`);
          return;
        }

        if (!subjectEnrichmentMap.has(subjectId)) {
          subjectEnrichmentMap.set(subjectId, {
            teachers: new Map(),
            periodsPerWeek: 0,
            classes: new Set(),
          });
        }

        const enrichment = subjectEnrichmentMap.get(subjectId);

        // Add teacher
        const teacherId =
          lesson.teacher_details?.id ||
          lesson.teacher_details?.user?.id ||
          lesson.teacher;

        if (teacherId) {
          if (!enrichment.teachers.has(teacherId)) {
            const teacherName = getTeacherName(lesson.teacher_details);
            enrichment.teachers.set(teacherId, {
              id: teacherId,
              name: teacherName,
            });
          }
        }

        // Count periods
        enrichment.periodsPerWeek += 1;

        // Track classes
        const className = getClassName(lesson);
        if (className) {
          enrichment.classes.add(className);
        }
      });

      console.log("\n=== ENRICHMENT MAP SUMMARY ===");
      console.log("Total subjects in map:", subjectEnrichmentMap.size);
      subjectEnrichmentMap.forEach((value, key) => {
        console.log(
          `Subject ${key}: ${value.teachers.size} teachers, ${value.periodsPerWeek} periods, ${value.classes.size} classes`
        );
        if (value.classes.size > 0) {
          console.log(`  Classes: ${Array.from(value.classes).join(", ")}`);
        }
      });

      // Merge enrichment data with subjects
      const enriched = subjectsData.map((subject) => {
        const enrichment = subjectEnrichmentMap.get(subject.id);

        const result = {
          ...subject,
          teachers: enrichment ? Array.from(enrichment.teachers.values()) : [],
          periodsPerWeek: enrichment ? enrichment.periodsPerWeek : 0,
          classesCount: enrichment ? enrichment.classes.size : 0,
          classes: enrichment ? Array.from(enrichment.classes) : [],
        };

        console.log(`Subject "${subject.name}" (ID: ${subject.id}):`, {
          teachers: result.teachers.length,
          periods: result.periodsPerWeek,
          classes: result.classesCount,
          classList: result.classes,
        });

        return result;
      });

      console.log("Enriched subjects completed:", enriched.length);
      console.log(
        "Subjects with classes:",
        enriched.filter((s) => s.classes.length > 0).length
      );
      console.log(
        "Subjects with teachers:",
        enriched.filter((s) => s.teachers.length > 0).length
      );

      setEnrichedSubjects(enriched);
    } catch (err) {
      console.error("Error enriching subjects:", err);
      // Still set the basic subjects even if enrichment fails
      setEnrichedSubjects(
        subjectsData.map((s) => ({
          ...s,
          teachers: [],
          periodsPerWeek: 0,
          classesCount: 0,
          classes: [],
        }))
      );
    }
  };

  // Helper to extract teacher name from different structures
  const getTeacherName = (teacher) => {
    if (!teacher) return "Unknown";

    // Try user.first_name and user.last_name (most common)
    if (teacher.user) {
      const firstName = teacher.user.first_name || "";
      const lastName = teacher.user.last_name || "";
      const fullName = `${firstName} ${lastName}`.trim();
      if (fullName) return fullName;
      if (teacher.user.username) return teacher.user.username;
    }

    // Try direct first_name and last_name
    if (teacher.first_name || teacher.last_name) {
      const fullName = `${teacher.first_name || ""} ${
        teacher.last_name || ""
      }`.trim();
      if (fullName) return fullName;
    }

    // Try name field
    if (teacher.name) return teacher.name;

    // Try full_name field
    if (teacher.full_name) return teacher.full_name;

    return "Unknown Teacher";
  };

  const handleRefresh = () => {
    setLoading(true);
    setSubjects([]);
    setEnrichedSubjects([]);
    setTimetables({}); // Clear timetables too
  };

  if (!schoolId) {
    return (
      <div className="subjects-management-container">
        <h2>Subjects Management</h2>
        <div className="loading">Loading school information...</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="subjects-management-container">
        <h2>Subjects Management</h2>
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading subjects...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="subjects-management-container">
        <h2>Subjects Management</h2>
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

  const displaySubjects =
    enrichedSubjects.length > 0 ? enrichedSubjects : subjects;

  return (
    <div className="subjects-management-container">
      <div className="header">
        <div>
          <h2>Subjects Management</h2>
          <p>
            Manage subjects and view teaching assignments at{" "}
            {user?.school?.name || "your school"}
          </p>
        </div>
        <button onClick={handleRefresh} className="btn-refresh">
          <FiRefreshCw /> Refresh
        </button>
      </div>

      {displaySubjects.length === 0 ? (
        <div className="no-subjects">
          <FiBook size={48} style={{ opacity: 0.3 }} />
          <h3>No Subjects Found</h3>
          <p>No subjects have been added to the system yet.</p>
          <p>Subjects need to be created before generating timetables.</p>
          <button className="btn-add-subject">
            <FiPlus /> Add Subject
          </button>
        </div>
      ) : (
        <div className="subjects-content">
          <div className="subjects-summary">
            <div className="summary-card">
              <FiBook size={24} />
              <div>
                <div className="summary-value">{displaySubjects.length}</div>
                <div className="summary-label">Total Subjects</div>
              </div>
            </div>
            <div className="summary-card">
              <FiUser size={24} />
              <div>
                <div className="summary-value">
                  {displaySubjects.reduce(
                    (sum, s) => sum + (s.teachers?.length || 0),
                    0
                  )}
                </div>
                <div className="summary-label">Teacher Assignments</div>
              </div>
            </div>
            <div className="summary-card">
              <FiClock size={24} />
              <div>
                <div className="summary-value">
                  {displaySubjects.reduce(
                    (sum, s) => sum + (s.periodsPerWeek || 0),
                    0
                  )}
                </div>
                <div className="summary-label">Total Periods/Week</div>
              </div>
            </div>
          </div>

          <div className="subjects-table-container">
            <table className="subjects-list-table">
              <thead>
                <tr>
                  <th>Subject Name</th>
                  <th>Code</th>
                  <th>Level/Grade</th>
                  <th>Assigned Teachers</th>
                  <th>Classes</th>
                  <th>Periods/Week</th>
                </tr>
              </thead>
              <tbody>
                {displaySubjects.map((subject) => (
                  <tr key={subject.id}>
                    <td>
                      <div className="subject-name">
                        <FiBook size={16} style={{ marginRight: "8px" }} />
                        {subject.name}
                      </div>
                    </td>
                    <td>
                      <span className="subject-code">
                        {subject.code ||
                          subject.name.substring(0, 3).toUpperCase()}
                      </span>
                    </td>
                    <td>
                      {subject.level || subject.grade_level || "All Levels"}
                    </td>
                    <td>
                      {subject.teachers && subject.teachers.length > 0 ? (
                        <div className="teachers-list">
                          {subject.teachers.map((teacher, idx) => (
                            <span key={idx} className="teacher-badge">
                              {teacher.name}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="no-assignment">Not assigned</span>
                      )}
                    </td>
                    <td>
                      {subject.classes && subject.classes.length > 0 ? (
                        <div className="classes-list">
                          {subject.classes.map((className, idx) => (
                            <span key={idx} className="class-badge">
                              {className}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="no-assignment">-</span>
                      )}
                    </td>
                    <td>
                      <span className="periods-count">
                        {subject.periodsPerWeek || 0}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubjectsManagement;
