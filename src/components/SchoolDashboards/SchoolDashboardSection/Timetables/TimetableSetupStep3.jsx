import { useState, useEffect } from "react";
import { useTimetableApi } from "../../../../hooks/useTimetableApi";
import { useNavigate, useOutletContext } from "react-router-dom";
import SubjectAssignmentCard from "../../../common/SchoolTimetable/SubjectAssignmentCard";
import "./timetables.css";

const TimetableSetupStep3 = () => {
  const { timetableData, updateData } = useOutletContext();
  const api = useTimetableApi();
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!timetableData) {
      console.error("Timetable data is undefined");
      setError("Timetable data not available. Please start over from Step 1.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!timetableData.school) {
          throw new Error("School information not available");
        }

        if (!timetableData.classes || timetableData.classes.length === 0) {
          throw new Error(
            "No classes selected. Please go back to Step 1 and select classes."
          );
        }

        console.log(
          "Fetching data for school:",
          timetableData.school,
          "classes:",
          timetableData.classes
        );

        // Fetch subjects
        let subjectsResponse;
        try {
          subjectsResponse = await api.getSubjects(timetableData.school);
          console.log("Subjects API response:", subjectsResponse);
        } catch (subjectsError) {
          console.error("Failed to fetch subjects:", subjectsError);
          // Try alternative endpoint if first one fails
          try {
            const altUrl = `/students/subjects/?school_id=${timetableData.school}`;
            subjectsResponse = await api.get(altUrl);
            console.log("Subjects alternative API response:", subjectsResponse);
          } catch (altError) {
            throw new Error(`Failed to load subjects: ${altError.message}`);
          }
        }

        // Fetch teachers - try multiple endpoints
        let teachersData = [];
        try {
          // First try: users/teachers endpoint
          const teachersResponse = await api.getTeachers(timetableData.school);
          console.log(
            "Teachers API response (users endpoint):",
            teachersResponse
          );

          if (teachersResponse?.data) {
            if (Array.isArray(teachersResponse.data)) {
              teachersData = teachersResponse.data;
            } else if (
              teachersResponse.data.results &&
              Array.isArray(teachersResponse.data.results)
            ) {
              teachersData = teachersResponse.data.results;
            } else if (
              teachersResponse.data.teachers &&
              Array.isArray(teachersResponse.data.teachers)
            ) {
              teachersData = teachersResponse.data.teachers;
            }
          }
        } catch (teachersError) {
          console.error(
            "Failed to fetch teachers from users endpoint:",
            teachersError
          );

          // Second try: schools/teachers endpoint
          try {
            const schoolsTeachersResponse = await api.getSchoolTeachers(
              timetableData.school
            );
            console.log(
              "Teachers API response (schools endpoint):",
              schoolsTeachersResponse
            );

            if (schoolsTeachersResponse?.data) {
              if (Array.isArray(schoolsTeachersResponse.data)) {
                teachersData = schoolsTeachersResponse.data;
              } else if (
                schoolsTeachersResponse.data.teachers &&
                Array.isArray(schoolsTeachersResponse.data.teachers)
              ) {
                teachersData = schoolsTeachersResponse.data.teachers;
              } else if (
                schoolsTeachersResponse.data.results &&
                Array.isArray(schoolsTeachersResponse.data.results)
              ) {
                teachersData = schoolsTeachersResponse.data.results;
              }
            }
          } catch (schoolsTeachersError) {
            console.error(
              "Failed to fetch teachers from schools endpoint:",
              schoolsTeachersError
            );

            // Third try: alternative users endpoint
            try {
              const altUrl = `/users/teachers/?school_id=${timetableData.school}`;
              const altTeachersResponse = await api.get(altUrl);
              console.log(
                "Teachers alternative API response:",
                altTeachersResponse
              );

              if (altTeachersResponse?.data) {
                if (Array.isArray(altTeachersResponse.data)) {
                  teachersData = altTeachersResponse.data;
                } else if (
                  altTeachersResponse.data.results &&
                  Array.isArray(altTeachersResponse.data.results)
                ) {
                  teachersData = altTeachersResponse.data.results;
                }
              }
            } catch (finalError) {
              throw new Error(
                `Failed to load teachers from all endpoints: ${finalError.message}`
              );
            }
          }
        }

        // Process subjects data
        let subjectsData = [];
        if (subjectsResponse?.data) {
          if (Array.isArray(subjectsResponse.data)) {
            subjectsData = subjectsResponse.data;
          } else if (
            subjectsResponse.data.results &&
            Array.isArray(subjectsResponse.data.results)
          ) {
            subjectsData = subjectsResponse.data.results;
          } else {
            subjectsData = [];
          }
        }

        console.log("Processed subjects:", subjectsData);
        console.log("Processed teachers:", teachersData);

        // Filter subjects based on selected classes
        const filteredSubjects = subjectsData.filter((subject) => {
          // If subject has classes array, check if it matches any selected class
          if (subject.classes && Array.isArray(subject.classes)) {
            return timetableData.classes.some((classId) =>
              subject.classes.includes(classId)
            );
          }
          // If no classes array, include all subjects for now
          return true;
        });

        console.log("Filtered subjects for classes:", filteredSubjects);

        setSubjects(filteredSubjects);
        setTeachers(teachersData);

        // Initialize subject assignments if not already set
        if (!timetableData.subjects || timetableData.subjects.length === 0) {
          updateData({
            subjects: filteredSubjects.map((subject) => ({
              subject_id: subject.id,
              subject_name: subject.name,
              teacher_id: null, // Start as null, will be set by user
              required_periods: subject.periods_per_week || 5,
            })),
          });
        }
      } catch (err) {
        console.error("Failed to load data:", err);
        const errorMessage =
          err.response?.data?.error ||
          err.response?.data?.detail ||
          err.message ||
          "Failed to load subjects and teachers data";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timetableData, api, updateData]);

  const handleTeacherChange = (subjectId, teacherId) => {
    if (!timetableData?.subjects) return;

    console.log(`Assigning teacher ${teacherId} to subject ${subjectId}`);

    updateData({
      subjects: timetableData.subjects.map((subject) =>
        subject.subject_id === subjectId
          ? {
              ...subject,
              teacher_id: teacherId ? parseInt(teacherId, 10) : null, // Convert to integer
            }
          : subject
      ),
    });
  };

  const handlePeriodsChange = (subjectId, periods) => {
    if (!timetableData?.subjects) return;

    updateData({
      subjects: timetableData.subjects.map((subject) =>
        subject.subject_id === subjectId
          ? {
              ...subject,
              required_periods: parseInt(periods, 10) || 5,
            }
          : subject
      ),
    });
  };

  const handleNext = () => {
    if (!timetableData || !timetableData.subjects) {
      alert("Timetable data not available. Please start over.");
      return;
    }

    // Validate that all subjects have teachers assigned
    const unassignedSubjects = timetableData.subjects.filter(
      (sub) => !sub.teacher_id || sub.teacher_id === null
    );

    if (unassignedSubjects.length > 0) {
      alert(
        `Please assign teachers to all subjects. Missing: ${unassignedSubjects
          .map((s) => s.subject_name)
          .join(", ")}`
      );
      return;
    }

    // Validate teacher IDs are integers
    const invalidAssignments = timetableData.subjects.filter(
      (sub) => typeof sub.teacher_id !== "number"
    );

    if (invalidAssignments.length > 0) {
      console.error("Invalid teacher ID types:", invalidAssignments);
      alert(
        "Some teacher assignments are invalid. Please refresh and try again."
      );
      return;
    }

    // DEBUG: Log what we're sending
    console.log("=== Step 3 Complete - Subject Assignments ===");
    console.log("Total subjects assigned:", timetableData.subjects.length);
    console.log("Subject details:");
    timetableData.subjects.forEach((s, idx) => {
      console.log(
        `  ${idx + 1}. ${s.subject_name} (ID: ${s.subject_id}) - ` +
          `Teacher ID: ${s.teacher_id} (type: ${typeof s.teacher_id}), ` +
          `Periods: ${s.required_periods}`
      );
    });

    navigate("/dashboard/timetables/create/step-4");
  };
  // Also add this useEffect to verify data flow
  useEffect(() => {
    console.log("=== Step 3 Data Check ===");
    console.log("Timetable data:", timetableData);
    console.log("Subjects available:", subjects.length);
    console.log("Teachers available:", teachers.length);
    console.log("Subject assignments:", timetableData?.subjects?.length || 0);
  }, [timetableData, subjects, teachers]);

  const handlePrev = () => {
    navigate("/dashboard/timetables/create/step-2");
  };

  // Show error if timetableData is not available
  if (!timetableData) {
    return (
      <div className="error">
        <p>Timetable data not available. Please start over from Step 1.</p>
        <button onClick={() => navigate("/dashboard/timetables/create/step-1")}>
          Go to Step 1
        </button>
      </div>
    );
  }

  if (loading) {
    return <div className="loading">Loading subjects and teachers...</div>;
  }

  if (error) {
    return (
      <div className="error">
        <h4>Error Loading Data</h4>
        <p>{error}</p>
        <div className="error-actions">
          <button onClick={() => window.location.reload()}>Try Again</button>
          <button onClick={handlePrev}>Go Back</button>
        </div>
      </div>
    );
  }

  // Replace the entire return section with this enhanced version:
  return (
    <div className="timetable-step-3">
      <h3>Assign Subjects and Teachers</h3>

      <div className="data-summary">
        <p>
          <strong>School:</strong> {timetableData.school}
        </p>
        <p>
          <strong>Selected Classes:</strong>{" "}
          {timetableData.classes?.length || 0}
        </p>
        <p>
          <strong>Available Subjects:</strong> {subjects.length}
        </p>
        <p>
          <strong>Available Teachers:</strong> {teachers.length}
        </p>
      </div>

      {subjects.length === 0 ? (
        <div className="no-subjects">
          <h4>No Subjects Found</h4>
          <p>No subjects were found for the selected classes and school.</p>
          <div className="action-buttons">
            <button onClick={handlePrev}>Back to Step 2</button>
            <button onClick={() => window.location.reload()}>
              Refresh Page
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="subjects-list">
            {subjects.map((subject) => {
              const subjectAssignment = timetableData.subjects?.find(
                (sub) => sub.subject_id === subject.id
              ) || {
                teacher_id: null,
                required_periods: subject.periods_per_week || 5,
              };

              // Enhanced teacher filtering with debugging
              const availableTeachers = teachers.filter((teacher) => {
                console.log(
                  `Teacher ${teacher.id} (${teacher.first_name} ${teacher.last_name}) subjects_taught:`,
                  teacher.subjects_taught
                );

                // Check multiple possible field names for subjects
                const teacherSubjects =
                  teacher.subjects_taught ||
                  teacher.subjects ||
                  teacher.assigned_subjects ||
                  [];

                // If teacher has no subjects assigned, include them for all (fallback)
                if (!teacherSubjects || teacherSubjects.length === 0) {
                  console.log(
                    `Teacher ${teacher.id} has no subjects assigned - including for all subjects`
                  );
                  return true;
                }

                // Check if teacher teaches this subject
                const teachesSubject = teacherSubjects.some((sub) => {
                  if (typeof sub === "object") {
                    return sub.id === subject.id;
                  }
                  return sub === subject.id;
                });

                console.log(
                  `Teacher ${teacher.id} teaches subject ${subject.id}: ${teachesSubject}`
                );
                return teachesSubject;
              });

              console.log(
                `Subject ${subject.name} has ${availableTeachers.length} available teachers`
              );

              return (
                <SubjectAssignmentCard
                  key={subject.id}
                  subject={subject}
                  teachers={availableTeachers}
                  selectedTeacher={subjectAssignment.teacher_id}
                  requiredPeriods={subjectAssignment.required_periods}
                  onTeacherChange={(teacherId) =>
                    handleTeacherChange(subject.id, teacherId)
                  }
                  onPeriodsChange={(periods) =>
                    handlePeriodsChange(subject.id, periods)
                  }
                />
              );
            })}
          </div>

          <div className="step-info">
            <p>
              <strong>Progress:</strong>{" "}
              {timetableData.subjects?.filter((sub) => sub.teacher_id).length ||
                0}{" "}
              / {subjects.length} subjects assigned
            </p>
          </div>

          <div className="step-actions">
            <button className="btn-prev" onClick={handlePrev}>
              Back: Set Structure
            </button>
            <button
              className="btn-next"
              onClick={handleNext}
              disabled={subjects.length === 0}
            >
              Next: Set Constraints
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TimetableSetupStep3;
