import { useState, useEffect } from "react";
import { useTimetableApi } from "../../../../hooks/useTimetableApi";
import useUser from "../../../../hooks/useUser";

const SubjectsManagement = () => {
  const { user } = useUser();
  const api = useTimetableApi();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.school?.id) {
      setLoading(false);
      return;
    }

    const fetchSubjectsFromTimetables = async () => {
      try {
        setLoading(true);

        // First, get all timetables for the school
        const timetablesResponse = await api.getTimetables(user.school.id);
        const timetables = Array.isArray(timetablesResponse.data)
          ? timetablesResponse.data
          : timetablesResponse.data?.results || [];

        console.log("Timetables fetched:", timetables);

        if (timetables.length === 0) {
          setSubjects([]);
          setLoading(false);
          return;
        }

        // Get all lessons from all timetables
        const allLessons = [];
        for (const timetable of timetables) {
          try {
            const lessonsResponse = await api.getLessons(timetable.id);
            const lessons = Array.isArray(lessonsResponse.data)
              ? lessonsResponse.data
              : lessonsResponse.data?.results || [];
            allLessons.push(...lessons);
          } catch (lessonError) {
            console.error(
              `Error fetching lessons for timetable ${timetable.id}:`,
              lessonError
            );
          }
        }

        console.log("All lessons fetched:", allLessons);

        // Extract unique subjects with teacher information
        const subjectMap = new Map();

        allLessons.forEach((lesson) => {
          if (lesson.subject_details && lesson.teacher_details) {
            const subjectId = lesson.subject_details.id;
            const subject = lesson.subject_details;
            const teacher = lesson.teacher_details;

            if (subjectMap.has(subjectId)) {
              // Add teacher if not already in the list
              const existingSubject = subjectMap.get(subjectId);
              const teacherExists = existingSubject.teachers.some(
                (t) => t.id === teacher.user.id
              );
              if (!teacherExists) {
                existingSubject.teachers.push({
                  id: teacher.user.id,
                  first_name: teacher.user.first_name,
                  last_name: teacher.user.last_name,
                });
              }
              // Count periods per week
              existingSubject.periods_per_week += 1;
            } else {
              // Create new subject entry
              subjectMap.set(subjectId, {
                id: subject.id,
                name: subject.name,
                code:
                  subject.code || subject.name.substring(0, 3).toUpperCase(),
                level: subject.level || "All",
                teachers: [
                  {
                    id: teacher.user.id,
                    first_name: teacher.user.first_name,
                    last_name: teacher.user.last_name,
                  },
                ],
                periods_per_week: 1,
              });
            }
          }
        });

        // Convert map to array
        const uniqueSubjects = Array.from(subjectMap.values());

        console.log("Processed subjects:", uniqueSubjects);
        setSubjects(uniqueSubjects);
      } catch (err) {
        console.error("Error fetching timetable data:", err);
        setError("Failed to load subjects from timetables");
      } finally {
        setLoading(false);
      }
    };

    fetchSubjectsFromTimetables();
  }, [user?.school?.id, api]);

  if (!user?.school?.id && !loading) {
    return <div className="error">No school data available</div>;
  }

  if (loading)
    return <div className="loading">Loading subjects from timetables...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="subjects-management-container">
      <h2>Subjects Management</h2>
      <p>
        View and manage subjects currently scheduled in timetables at{" "}
        {user?.school?.name || "your school"}
      </p>

      {subjects.length === 0 ? (
        <div className="no-subjects">
          <p>No subjects found in current timetables.</p>
          <p>
            Subjects will appear here once timetables are generated and
            activated.
          </p>
        </div>
      ) : (
        <div className="subjects-summary">
          <p>Found {subjects.length} subjects across all active timetables</p>

          <table className="subjects-list-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Code</th>
                <th>Level</th>
                <th>Assigned Teachers</th>
                <th>Total Periods/Week</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((subject) => (
                <tr key={subject.id}>
                  <td>{subject.name}</td>
                  <td>{subject.code}</td>
                  <td>{subject.level}</td>
                  <td>
                    {subject.teachers && subject.teachers.length > 0
                      ? subject.teachers
                          .map((t) => `${t.first_name} ${t.last_name}`)
                          .join(", ")
                      : "Not assigned"}
                  </td>
                  <td>{subject.periods_per_week}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SubjectsManagement;

// import { useState, useEffect } from "react";
// import { useTimetableApi } from "../../../../hooks/useTimetableApi";
// import useUser from "../../../../hooks/useUser";
// import "./timetables.css";

// const SubjectsManagement = () => {
//   const { user } = useUser();
//   const { getSubjects } = useTimetableApi(); // Destructure getSubjects
//   const [subjects, setSubjects] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchSubjects = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         // 1. Get the school CODE (MMS001) - not the numeric ID
//         const schoolCode = "MMS001"; // Hardcoded for now - replace with dynamic value if needed

//         console.log("Fetching subjects for school code:", schoolCode);

//         // 2. Use the getSubjects method (which sends school_id=MMS001)
//         const response = await getSubjects(schoolCode);
//         console.log("API Response:", response);

//         // 3. Handle both paginated and non-paginated responses
//         const subjectsData = response.data.results || response.data;

//         if (!Array.isArray(subjectsData)) {
//           throw new Error("Unexpected response format");
//         }

//         setSubjects(subjectsData);
//       } catch (err) {
//         console.error("Error fetching subjects:", {
//           error: err.response?.data || err.message,
//           status: err.response?.status,
//         });
//         setError(err.message || "Failed to load subjects");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSubjects();
//   }, []); // Empty dependency array = runs once on mount

//   if (loading) {
//     return <div className="loading">Loading subjects...</div>;
//   }

//   if (error) {
//     return (
//       <div className="error">
//         <p>{error}</p>
//         <button onClick={() => window.location.reload()}>Try Again</button>
//       </div>
//     );
//   }

//   return (
//     <div className="subjects-management-container">
//       <h2>Subjects Management</h2>
//       <p>
//         View and manage all subjects taught at Membley Mixed School (MMS001)
//       </p>

//       {subjects.length === 0 ? (
//         <div className="no-subjects">
//           <p>No subjects found for this school.</p>
//           <p className="debug-hint">
//             Debug Tip: Check if subjects exist for school code MMS001 in Django
//             admin
//           </p>
//         </div>
//       ) : (
//         <table className="subjects-list-table">
//           <thead>
//             <tr>
//               <th>Name</th>
//               <th>Code</th>
//               <th>Level</th>
//               <th>Teachers</th>
//               <th>Periods/Week</th>
//             </tr>
//           </thead>
//           <tbody>
//             {subjects.map((subject) => (
//               <tr key={subject.id}>
//                 <td>{subject.name}</td>
//                 <td>{subject.code}</td>
//                 <td>{subject.level || "All"}</td>
//                 <td>
//                   {subject.teachers?.length > 0
//                     ? subject.teachers
//                         .map((t) => `${t.first_name} ${t.last_name}`)
//                         .join(", ")
//                     : "Not assigned"}
//                 </td>
//                 <td>{subject.periods_per_week || 1}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// };

// export default SubjectsManagement;

// const SubjectsManagement = () => {
//   const [subjects, setSubjects] = useState([
//     {
//       id: 1,
//       name: "Mathematics",
//       code: "MATH101",
//       level: "Primary",
//       teachers: [
//         { id: 1, first_name: "John", last_name: "Smith" },
//         { id: 2, first_name: "Mary", last_name: "Johnson" },
//       ],
//       periods_per_week: 5,
//     },
//     {
//       id: 2,
//       name: "English",
//       code: "ENG101",
//       level: "All",
//       teachers: [{ id: 3, first_name: "Sarah", last_name: "Williams" }],
//       periods_per_week: 4,
//     },
//   ]);

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   return (
//     <div className="subjects-management-container">
//       <h2>Subjects Management</h2>
//       <p>View and manage all subjects taught at your school</p>

//       <table className="subjects-list-table">
//         <thead>
//           <tr>
//             <th>Name</th>
//             <th>Code</th>
//             <th>Level</th>
//             <th>Teachers</th>
//             <th>Periods/Week</th>
//           </tr>
//         </thead>
//         <tbody>
//           {subjects.map((subject) => (
//             <tr key={subject.id}>
//               <td>{subject.name}</td>
//               <td>{subject.code}</td>
//               <td>{subject.level || "All"}</td>
//               <td>
//                 {subject.teachers && subject.teachers.length > 0
//                   ? subject.teachers
//                       .map((t) => `${t.first_name} ${t.last_name}`)
//                       .join(", ")
//                   : "Not assigned"}
//               </td>
//               <td>{subject.periods_per_week || 1}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default SubjectsManagement;
