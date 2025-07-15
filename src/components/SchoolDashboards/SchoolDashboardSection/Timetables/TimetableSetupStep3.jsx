import { useState, useEffect } from "react";
import { useTimetableApi } from "../../../../hooks/useTimetableApi";
import { useNavigate } from "react-router-dom";
import SubjectAssignmentCard from "../../../common/SchoolTimetable/SubjectAssignmentCard";
import "./timetables.css";

const TimetableSetupStep3 = ({ timetableData, updateData }) => {
  const api = useTimetableApi();
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch subjects for selected classes
        const subjectsResponse = await api.getSubjects(timetableData.school);
        const filteredSubjects = subjectsResponse.data.filter((subject) =>
          timetableData.classes.some((classId) =>
            subject.classes.includes(classId)
          )
        );

        // Fetch teachers
        const teachersResponse = await api.getTeachers(timetableData.school);

        setSubjects(filteredSubjects);
        setTeachers(teachersResponse.data);

        // Initialize subject assignments if not already set
        if (!timetableData.subjects || timetableData.subjects.length === 0) {
          updateData({
            subjects: filteredSubjects.map((subject) => ({
              subject_id: subject.id,
              teacher_id: null,
              required_periods: subject.periods_per_week || 1,
            })),
          });
        }
      } catch (err) {
        setError("Failed to load data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (timetableData.classes.length > 0) {
      fetchData();
    }
  }, [timetableData.classes, timetableData.school]);

  const handleTeacherChange = (subjectId, teacherId) => {
    updateData({
      subjects: timetableData.subjects.map((subject) =>
        subject.subject_id === subjectId
          ? { ...subject, teacher_id: teacherId }
          : subject
      ),
    });
  };

  const handlePeriodsChange = (subjectId, periods) => {
    updateData({
      subjects: timetableData.subjects.map((subject) =>
        subject.subject_id === subjectId
          ? { ...subject, required_periods: parseInt(periods) || 1 }
          : subject
      ),
    });
  };

  const handleNext = () => {
    // Validate that all subjects have teachers assigned
    const unassignedSubjects = timetableData.subjects.filter(
      (sub) => !sub.teacher_id
    );

    if (unassignedSubjects.length > 0) {
      alert("Please assign teachers to all subjects before proceeding");
      return;
    }

    navigate("/school_timetables/timetables/create/step-4");
  };

  const handlePrev = () => {
    navigate("/school_timetables/timetables/create/step-2");
  };

  if (loading)
    return <div className="loading">Loading subjects and teachers...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="timetable-step-3">
      <h3>Assign Subjects and Teachers</h3>

      <div className="subjects-list">
        {subjects.map((subject) => {
          const subjectAssignment = timetableData.subjects.find(
            (sub) => sub.subject_id === subject.id
          ) || { teacher_id: null, required_periods: 1 };

          return (
            <SubjectAssignmentCard
              key={subject.id}
              subject={subject}
              teachers={teachers}
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

      <div className="step-actions">
        <button className="btn-prev" onClick={handlePrev}>
          Back: Set Structure
        </button>
        <button className="btn-next" onClick={handleNext}>
          Next: Set Constraints
        </button>
      </div>
    </div>
  );
};

export default TimetableSetupStep3;

// import { useOutletContext } from "react-router-dom";

// const TimetableSetupStep3 = () => {
//   const { timetableData = {}, updateData } = useOutletContext();
//   const navigate = useNavigate();

//   const [subjects, setSubjects] = useState([
//     {
//       id: 1,
//       name: "Mathematics",
//       code: "MATH101",
//       periods_per_week: 5,
//       classes: [101, 102],
//     },
//     {
//       id: 2,
//       name: "English",
//       code: "ENG101",
//       periods_per_week: 4,
//       classes: [101, 102],
//     },
//   ]);

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
//     {
//       id: 2,
//       user: { first_name: "Gideon", last_name: "Othiambo" },
//       subjects_taught: [1, 2, 3],
//     },
//     {
//       id: 2,
//       user: { first_name: "John", last_name: "Kamau" },
//       subjects_taught: [2, 3],
//     },
//     {
//       id: 2,
//       user: { first_name: "Nancy", last_name: "Wambui" },
//       subjects_taught: [2, 1, 3],
//     },
//   ]);

//   useEffect(() => {
//     if (!timetableData?.subjects || timetableData.subjects.length === 0) {
//       updateData({
//         subjects: subjects.map((subject) => ({
//           subject_id: subject.id,
//           teacher_id: null,
//           required_periods: subject.periods_per_week || 1,
//         })),
//       });
//     }
//   }, [timetableData, updateData]); // Add dependency

//   const handleTeacherChange = (subjectId, teacherId) => {
//     updateData({
//       subjects:
//         timetableData?.subjects?.map((subject) =>
//           subject.subject_id === subjectId
//             ? { ...subject, teacher_id: teacherId }
//             : subject
//         ) || [],
//     });
//   };

//   const handlePeriodsChange = (subjectId, periods) => {
//     updateData({
//       subjects:
//         timetableData?.subjects?.map((subject) =>
//           subject.subject_id === subjectId
//             ? { ...subject, required_periods: parseInt(periods) || 1 }
//             : subject
//         ) || [],
//     });
//   };

//   const handleNext = () => {
//     const unassignedSubjects =
//       timetableData?.subjects?.filter((sub) => !sub.teacher_id) || [];

//     if (unassignedSubjects.length > 0) {
//       alert("Please assign teachers to all subjects before proceeding");
//       return;
//     }

//     navigate("/dashboard/timetables/create/step-4");
//   };

//   const handlePrev = () => {
//     navigate("/dashboard/timetables/create/step-2");
//   };

//   // Add early return if no timetableData
//   if (!timetableData) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="timetable-step-3">
//       <h3>Assign Subjects and Teachers</h3>

//       <div className="subjects-list">
//         {subjects.map((subject) => {
//           const subjectAssignment = timetableData?.subjects?.find(
//             (sub) => sub.subject_id === subject.id
//           ) || { teacher_id: null, required_periods: 1 };

//           return (
//             <SubjectAssignmentCard
//               key={subject.id}
//               subject={subject}
//               teachers={teachers.filter((t) =>
//                 t.subjects_taught.includes(subject.id)
//               )}
//               selectedTeacher={subjectAssignment.teacher_id}
//               requiredPeriods={subjectAssignment.required_periods}
//               onTeacherChange={(teacherId) =>
//                 handleTeacherChange(subject.id, teacherId)
//               }
//               onPeriodsChange={(periods) =>
//                 handlePeriodsChange(subject.id, periods)
//               }
//             />
//           );
//         })}
//       </div>

//       <div className="step-actions">
//         <button className="btn-prev" onClick={handlePrev}>
//           Back: Set Structure
//         </button>
//         <button className="btn-next" onClick={handleNext}>
//           Next: Set Constraints
//         </button>
//       </div>
//     </div>
//   );
// };

// export default TimetableSetupStep3;
