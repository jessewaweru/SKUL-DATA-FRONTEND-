import { useState, useEffect, useCallback } from "react";
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

  // Memoize the fetch function to prevent unnecessary re-renders
  const fetchTimetables = useCallback(async () => {
    if (!user?.school?.id) {
      console.log("No user school ID found:", user);
      setTimetables([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log("Fetching timetables for school ID:", user.school.id);
      const response = await api.getTimetables(user.school.id);

      console.log("Raw API response:", response);

      // Handle paginated response - the actual data is in response.data.results
      let timetableData = [];
      if (response?.data) {
        // Check if it's a paginated response (has results field)
        if (response.data.results && Array.isArray(response.data.results)) {
          timetableData = response.data.results;
          console.log(
            "Found paginated results:",
            timetableData.length,
            "timetables"
          );
        }
        // Check if it's a direct array
        else if (Array.isArray(response.data)) {
          timetableData = response.data;
          console.log(
            "Found direct array:",
            timetableData.length,
            "timetables"
          );
        }
        // Single object response
        else if (response.data && typeof response.data === "object") {
          timetableData = [response.data];
          console.log("Found single object, wrapped in array");
        }
      }

      console.log("Processed timetable data:", timetableData);
      setTimetables(timetableData);
    } catch (err) {
      console.error("Error fetching timetables:", err);
      setError(
        "Failed to load timetables: " + (err.message || "Unknown error")
      );
      setTimetables([]);
    } finally {
      setLoading(false);
    }
  }, [user?.school?.id, api]);

  useEffect(() => {
    fetchTimetables();
  }, [fetchTimetables]);

  // Safe filtering with array check and optional chaining
  const filteredTimetables = Array.isArray(timetables)
    ? timetables.filter((timetable) => {
        const matchesYear =
          filter.academicYear === "" ||
          timetable?.academic_year?.includes(filter.academicYear);
        const matchesTerm =
          filter.term === "" || timetable?.term?.toString() === filter.term;
        const matchesActive = !filter.isActive || timetable?.is_active === true;

        return matchesYear && matchesTerm && matchesActive;
      })
    : [];

  const handleActivate = async (timetableId) => {
    try {
      await api.activateTimetable(timetableId);
      // Update the local state to reflect the changes
      setTimetables((prevTimetables) =>
        prevTimetables.map((t) => ({
          ...t,
          is_active: t.id === timetableId ? true : false,
        }))
      );
    } catch (err) {
      console.error("Failed to activate timetable:", err);
      setError(
        "Failed to activate timetable: " + (err.message || "Unknown error")
      );
    }
  };

  // Debug logging
  console.log("Current state:", {
    user: user?.email,
    schoolId: user?.school?.id,
    timetablesCount: timetables.length,
    filteredCount: filteredTimetables.length,
    loading,
    error,
  });

  // Show loading while user data is loading or timetables are loading
  if (!user || loading) {
    return <div className="loading">Loading timetables...</div>;
  }

  // Show error if there's an error
  if (error) {
    return (
      <div className="error">
        <p>{error}</p>
        <button onClick={fetchTimetables}>Retry</button>
      </div>
    );
  }

  return (
    <div className="view-all-timetables">
      <div className="header">
        <h2>All Timetables</h2>
        <button onClick={fetchTimetables} disabled={loading}>
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>
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
      <div className="timetables-info">
        <p>
          Showing {filteredTimetables.length} of {timetables.length} timetables
          {user?.school?.id && ` for School ID: ${user.school.id}`}
        </p>
      </div>
      <div className="timetables-grid">
        {filteredTimetables.length === 0 ? (
          <div className="no-results">
            {timetables.length === 0
              ? "No timetables found for this school. Create some timetables to get started."
              : "No timetables match the current filters."}
          </div>
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
      {/* Debug section - remove in production */}
      {/* {import.meta.env.MODE === "development" && (
        <div
          className="debug-info"
          style={{
            marginTop: "20px",
            padding: "10px",
            backgroundColor: "#f5f5f5",
            fontSize: "12px",
          }}
        >
          <h4>Debug Information:</h4>
          <pre>
            {JSON.stringify(
              {
                userSchoolId: user?.school?.id,
                timetablesCount: timetables.length,
                firstTimetable: timetables[0] || "None",
                filteredCount: filteredTimetables.length,
              },
              null,
              2
            )}
          </pre>
        </div> */}
      )}
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
