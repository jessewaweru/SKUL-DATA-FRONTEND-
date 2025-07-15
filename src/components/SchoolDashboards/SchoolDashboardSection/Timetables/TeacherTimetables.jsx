import { useState, useEffect } from "react";
import { useTimetableApi } from "../../../../hooks/useTimetableApi";
import useUser from "../../../../hooks/useUser";
import TimetablePreview from "../../../common/SchoolTimetable/TimetablePreview";
import "./timetables.css";

const TeacherTimetables = () => {
  const { user } = useUser();
  const api = useTimetableApi();
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [timetable, setTimetable] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [teachersLoading, setTeachersLoading] = useState(true);
  const [timetableLoading, setTimetableLoading] = useState(false);

  useEffect(() => {
    // Debug: Log full user object
    console.log("Full user object:", user);

    // Get school ID from admin profile if available
    const schoolId = user?.school_admin_profile?.school?.id;
    const schoolCode = user?.school_admin_profile?.school?.code;

    if (!schoolId && !schoolCode) {
      console.error("No school ID or code found in user profile");
      setError("School information not found in your profile");
      setTeachersLoading(false);
      return;
    }

    const fetchTeachers = async () => {
      setTeachersLoading(true);
      try {
        console.log("Fetching teachers for school:", { schoolId, schoolCode });

        // Try both ID and code approaches
        const response = await api.getTeachers(schoolCode || schoolId);
        console.log("Teachers API response:", response);

        setTeachers(response.data);
        if (response.data.length > 0) {
          setSelectedTeacher(response.data[0].id);
        }
      } catch (err) {
        console.error("Full error:", {
          message: err.message,
          response: err.response,
          config: err.config,
        });
        setError(
          err.response?.data?.detail || err.message || "Failed to load teachers"
        );
      } finally {
        setTeachersLoading(false);
      }
    };

    fetchTeachers();
  }, [
    user?.school_admin_profile?.school?.id,
    user?.school_admin_profile?.school?.code,
  ]);

  useEffect(() => {
    if (selectedTeacher) {
      const fetchTeacherTimetable = async () => {
        setTimetableLoading(true);
        try {
          const response = await api.getTeacherTimetables(selectedTeacher);
          setTimetable(response.data);
        } catch (err) {
          console.error("Failed to load teacher timetable:", err);
        } finally {
          setTimetableLoading(false);
        }
      };
      fetchTeacherTimetable();
    }
  }, [selectedTeacher]);

  // Update render
  return (
    <div className="teacher-timetables-container">
      <h2>Teacher Timetables</h2>

      {teachersLoading && <div>Loading teachers...</div>}

      {!teachersLoading && teachers.length > 0 && (
        <div className="teacher-selector">
          <label>Select Teacher:</label>
          <select
            value={selectedTeacher || ""}
            onChange={(e) => setSelectedTeacher(e.target.value)}
          >
            {teachers.map((teacher) => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.user.first_name} {teacher.user.last_name}
              </option>
            ))}
          </select>
        </div>
      )}

      {timetableLoading && <div>Loading timetable...</div>}

      {timetable && !timetableLoading && (
        <TimetablePreview
          timetable={timetable}
          classId={timetable.classes[0]?.id}
        />
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
