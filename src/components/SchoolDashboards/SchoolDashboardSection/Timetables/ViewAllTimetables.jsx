import { useState, useEffect } from "react";
import { useTimetableApi } from "../../../../hooks/useTimetableApi";
import useUser from "../../../../hooks/useUser";
import TimetableCard from "../../../common/SchoolTimetable/TimetableCard";
import "./timetables.css";

const ViewAllTimetables = () => {
  const { user } = useUser();
  const api = useTimetableApi();
  const [timetables, setTimetables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState({
    academicYear: "",
    term: "",
    isActive: false,
  });

  useEffect(() => {
    const fetchTimetables = async () => {
      // Add this check before making the API call
      if (!user?.school?.id) {
        return;
      }

      try {
        setLoading(true);
        const response = await api.getTimetables(user.school.id);
        setTimetables(response.data);
      } catch (err) {
        setError("Failed to load timetables");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTimetables();
  }, [user?.school?.id, api]); // Use optional chaining in dependency array

  const filteredTimetables = timetables.filter((timetable) => {
    return (
      (filter.academicYear === "" ||
        timetable.academic_year.includes(filter.academicYear)) &&
      (filter.term === "" || timetable.term.toString() === filter.term) &&
      (!filter.isActive || timetable.is_active)
    );
  });

  const handleActivate = async (timetableId) => {
    try {
      await api.activateTimetable(timetableId);
      setTimetables(
        timetables.map((t) => ({
          ...t,
          is_active: t.id === timetableId ? true : false,
        }))
      );
    } catch (err) {
      console.error("Failed to activate timetable:", err);
    }
  };

  // Show loading while user data is loading
  if (!user || loading)
    return <div className="loading">Loading timetables...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="view-all-timetables">
      <div className="filters">
        <div className="filter-group">
          <label>Academic Year:</label>
          <input
            type="text"
            placeholder="e.g. 2024"
            value={filter.academicYear}
            onChange={(e) =>
              setFilter({ ...filter, academicYear: e.target.value })
            }
          />
        </div>
        <div className="filter-group">
          <label>Term:</label>
          <select
            value={filter.term}
            onChange={(e) => setFilter({ ...filter, term: e.target.value })}
          >
            <option value="">All Terms</option>
            <option value="1">Term 1</option>
            <option value="2">Term 2</option>
            <option value="3">Term 3</option>
          </select>
        </div>
        <div className="filter-group">
          <label>
            <input
              type="checkbox"
              checked={filter.isActive}
              onChange={(e) =>
                setFilter({ ...filter, isActive: e.target.checked })
              }
            />
            Active Only
          </label>
        </div>
      </div>

      <div className="timetables-grid">
        {filteredTimetables.length === 0 ? (
          <div className="no-results">No timetables found</div>
        ) : (
          filteredTimetables.map((timetable) => (
            <TimetableCard
              key={timetable.id}
              timetable={timetable}
              onActivate={handleActivate}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ViewAllTimetables;

// const ViewAllTimetables = () => {
//   const [timetables, setTimetables] = useState([
//     {
//       id: 1,
//       school_class: {
//         id: 101,
//         name: "Grade 1 A",
//         grade_level: "Grade 1",
//         students_count: 25,
//       },
//       academic_year: "2024",
//       term: 1,
//       is_active: true,
//       lessons_count: 30,
//       created_at: "2024-01-15T09:30:00Z",
//     },
//     {
//       id: 2,
//       school_class: {
//         id: 102,
//         name: "Grade 2 B",
//         grade_level: "Grade 2",
//         students_count: 28,
//       },
//       academic_year: "2024",
//       term: 1,
//       is_active: false,
//       lessons_count: 28,
//       created_at: "2024-01-16T10:15:00Z",
//     },
//   ]);

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [filter, setFilter] = useState({
//     academicYear: "",
//     term: "",
//     isActive: false,
//   });

//   const filteredTimetables = timetables.filter((timetable) => {
//     return (
//       (filter.academicYear === "" ||
//         timetable.academic_year.includes(filter.academicYear)) &&
//       (filter.term === "" || timetable.term.toString() === filter.term) &&
//       (!filter.isActive || timetable.is_active)
//     );
//   });

//   const handleActivate = async (timetableId) => {
//     setTimetables(
//       timetables.map((t) => ({
//         ...t,
//         is_active: t.id === timetableId ? true : false,
//       }))
//     );
//   };

//   if (loading) return <div className="loading">Loading timetables...</div>;
//   if (error) return <div className="error">{error}</div>;

//   return (
//     <div className="view-all-timetables">
//       <div className="filters">
//         <div className="filter-group">
//           <label>Academic Year:</label>
//           <input
//             type="text"
//             placeholder="e.g. 2024"
//             value={filter.academicYear}
//             onChange={(e) =>
//               setFilter({ ...filter, academicYear: e.target.value })
//             }
//           />
//         </div>
//         <div className="filter-group">
//           <label>Term:</label>
//           <select
//             value={filter.term}
//             onChange={(e) => setFilter({ ...filter, term: e.target.value })}
//           >
//             <option value="">All Terms</option>
//             <option value="1">Term 1</option>
//             <option value="2">Term 2</option>
//             <option value="3">Term 3</option>
//           </select>
//         </div>
//         <div className="filter-group">
//           <label>
//             <input
//               type="checkbox"
//               checked={filter.isActive}
//               onChange={(e) =>
//                 setFilter({ ...filter, isActive: e.target.checked })
//               }
//             />
//             Active Only
//           </label>
//         </div>
//       </div>

//       <div className="timetables-grid">
//         {filteredTimetables.length === 0 ? (
//           <div className="no-results">No timetables found</div>
//         ) : (
//           filteredTimetables.map((timetable) => (
//             <TimetableCard
//               key={timetable.id}
//               timetable={timetable}
//               onActivate={handleActivate}
//             />
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default ViewAllTimetables;
