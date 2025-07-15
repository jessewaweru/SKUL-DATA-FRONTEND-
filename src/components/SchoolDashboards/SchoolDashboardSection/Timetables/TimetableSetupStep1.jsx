import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { useTimetableApi } from "../../../../hooks/useTimetableApi";
import { useNavigate } from "react-router-dom";
import ClassSelectionCard from "../../../common/SchoolTimetable/ClassSelectionCard";
import "./timetables.css";
import useUser from "../../../../hooks/useUser";

const TimetableSetupStep1 = () => {
  // Get context from parent Outlet
  const { timetableData, updateData } = useOutletContext();
  const { user } = useUser();
  const api = useTimetableApi();
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Set school from user context if not provided
  useEffect(() => {
    if (!timetableData || !user) return;

    // Get school ID from user's profile
    const schoolId =
      user?.school_admin_profile?.school?.id ||
      user?.administrator_profile?.school?.id ||
      user?.teacher_profile?.school?.id;

    if (schoolId && !timetableData.school) {
      updateData({ school: schoolId });
    }
  }, [user, timetableData, updateData]);

  // Fetch classes for the school
  useEffect(() => {
    const fetchClasses = async () => {
      if (!timetableData?.school) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await api.getClasses(timetableData.school);
        setClasses(response.data.results || response.data);
      } catch (err) {
        console.error("Failed to load classes:", err);
        setError(
          err.response?.data?.detail || err.message || "Failed to load classes"
        );

        if (err.response?.status === 401) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, [timetableData?.school]);

  const handleClassToggle = (classId) => {
    if (!timetableData) return;

    const updatedClasses = timetableData.classes.includes(classId)
      ? timetableData.classes.filter((id) => id !== classId)
      : [...timetableData.classes, classId];
    updateData({ classes: updatedClasses });
  };

  const handleNext = () => {
    if (!timetableData || timetableData.classes.length === 0) {
      alert("Please select at least one class");
      return;
    }
    navigate("/school_timetables/timetables/create/step-2");
  };

  // Loading and error states
  if (!timetableData) {
    return <div className="timetable-step-1">Loading timetable data...</div>;
  }

  if (loading) {
    return (
      <div className="timetable-step-1">
        <div className="loading">Loading classes...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="timetable-step-1">
        <div className="error">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="timetable-step-1">
      <div className="form-group">
        <label>Academic Year:</label>
        <input
          type="text"
          value={timetableData.academicYear || ""}
          onChange={(e) => updateData({ academicYear: e.target.value })}
          placeholder="e.g. 2024"
        />
      </div>

      <div className="form-group">
        <label>Term:</label>
        <select
          value={timetableData.term || "1"}
          onChange={(e) => updateData({ term: e.target.value })}
        >
          <option value="1">Term 1</option>
          <option value="2">Term 2</option>
          <option value="3">Term 3</option>
        </select>
      </div>

      <h3>Select Classes</h3>

      {classes.length === 0 ? (
        <div className="no-classes">
          <p>No classes available for this school.</p>
          <button onClick={() => window.location.reload()}>Refresh</button>
        </div>
      ) : (
        <div className="classes-grid">
          {classes.map((cls) => (
            <ClassSelectionCard
              key={cls.id}
              cls={cls}
              selected={timetableData.classes?.includes(cls.id) || false}
              onToggle={handleClassToggle}
            />
          ))}
        </div>
      )}

      <div className="step-actions">
        <button
          className="btn-next"
          onClick={handleNext}
          disabled={
            !timetableData.classes || timetableData.classes.length === 0
          }
        >
          Next: Set Structure
        </button>
      </div>
    </div>
  );
};

export default TimetableSetupStep1;

// const TimetableSetupStep1 = () => {
//   const navigate = useNavigate();
//   const { timetableData, updateData } = useOutletContext(); // Get data from outlet context

//   const [classes, setClasses] = useState([
//     {
//       id: 101,
//       name: "Grade 1 A",
//       grade_level: "Grade 1",
//       students_count: 25,
//       level: "PRIMARY",
//     },
//     {
//       id: 102,
//       name: "Grade 1 B",
//       grade_level: "Grade 1",
//       students_count: 28,
//       level: "PRIMARY",
//     },
//   ]);

//   const handleClassToggle = (classId) => {
//     const updatedClasses = timetableData.classes.includes(classId)
//       ? timetableData.classes.filter((id) => id !== classId)
//       : [...timetableData.classes, classId];
//     updateData({ classes: updatedClasses });
//   };

//   const handleNext = () => {
//     if (timetableData.classes.length === 0) {
//       alert("Please select at least one class");
//       return;
//     }
//     navigate("/dashboard/timetables/create/step-2");
//   };

//   return (
//     <div className="timetable-step-1">
//       <div className="form-group">
//         <label>Academic Year:</label>
//         <input
//           type="text"
//           value={timetableData.academicYear}
//           onChange={(e) => updateData({ academicYear: e.target.value })}
//           placeholder="e.g. 2024"
//         />
//       </div>
//       <div className="form-group">
//         <label>Term:</label>
//         <select
//           value={timetableData.term}
//           onChange={(e) => updateData({ term: e.target.value })}
//         >
//           <option value="1">Term 1</option>
//           <option value="2">Term 2</option>
//           <option value="3">Term 3</option>
//         </select>
//       </div>
//       <h3>Select Classes</h3>
//       <div className="classes-grid">
//         {classes.map((cls) => (
//           <ClassSelectionCard
//             key={cls.id}
//             cls={cls}
//             selected={timetableData.classes.includes(cls.id)}
//             onToggle={handleClassToggle}
//           />
//         ))}
//       </div>
//       <div className="step-actions">
//         <button
//           className="btn-next"
//           onClick={handleNext}
//           disabled={timetableData.classes.length === 0}
//         >
//           Next: Set Structure
//         </button>
//       </div>
//     </div>
//   );
// };

// export default TimetableSetupStep1;
