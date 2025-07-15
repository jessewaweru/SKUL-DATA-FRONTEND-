import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTimetableApi } from "../../../../hooks/useTimetableApi";
import TimetableGrid from "../../../common/SchoolTimetable/TimetableGrid";
import {
  FiArrowLeft,
  FiPrinter,
  FiDownload,
  FiEdit,
  FiClock,
} from "react-icons/fi";
import "./timetables.css";

const TimetableDetailView = () => {
  const { timetableId } = useParams();
  const navigate = useNavigate();
  const { getTimetable, getLessons, activateTimetable } = useTimetableApi();
  const [timetable, setTimetable] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        setLoading(true);
        const timetableRes = await getTimetable(timetableId);
        const lessonsRes = await getLessons(timetableId);

        setTimetable(timetableRes.data);
        setLessons(lessonsRes.data);
      } catch (err) {
        setError("Failed to load timetable details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTimetable();
  }, [timetableId]);

  const handleActivate = async () => {
    if (
      !window.confirm(
        "Activating this timetable will deactivate any currently active timetable for this class. Continue?"
      )
    ) {
      return;
    }

    try {
      await activateTimetable(timetableId);
      setTimetable((prev) => ({ ...prev, is_active: true }));
      alert("Timetable activated successfully!");
    } catch (err) {
      console.error("Error activating timetable:", err);
      alert("Failed to activate timetable");
    }
  };

  if (loading) return <div className="loading-spinner">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!timetable) return <div className="not-found">Timetable not found</div>;

  return (
    <div className="timetable-detail-container">
      <div className="timetable-header">
        <button onClick={() => navigate(-1)} className="back-button">
          <FiArrowLeft /> Back
        </button>

        <div className="header-info">
          <h2>{timetable.school_class.name} Timetable</h2>
          <p>
            {timetable.academic_year} - Term {timetable.term} | Status:{" "}
            <span
              className={`status ${
                timetable.is_active ? "active" : "inactive"
              }`}
            >
              {timetable.is_active ? "Active" : "Inactive"}
            </span>
          </p>
        </div>

        <div className="action-buttons">
          {!timetable.is_active && (
            <button onClick={handleActivate} className="activate-btn">
              <FiClock /> Activate
            </button>
          )}
          <button className="print-btn">
            <FiPrinter /> Print
          </button>
          <button className="export-btn">
            <FiDownload /> Export
          </button>
          <button
            onClick={() =>
              navigate(
                `/school_timetables/timetables/create?clone=${timetableId}`
              )
            }
            className="edit-btn"
          >
            <FiEdit /> Clone
          </button>
        </div>
      </div>

      <div className="timetable-content">
        <TimetableGrid lessons={lessons} />
      </div>
    </div>
  );
};

export default TimetableDetailView;

// const TimetableDetailView = () => {
//   const { timetableId } = useParams();
//   const navigate = useNavigate();

//   const [timetable, setTimetable] = useState({
//     id: 1,
//     school_class: {
//       id: 101,
//       name: "Grade 1 A",
//       grade_level: "Grade 1",
//       students_count: 25,
//     },
//     academic_year: "2024",
//     term: 1,
//     is_active: true,
//     created_at: "2024-01-15T09:30:00Z",
//   });

//   const [lessons, setLessons] = useState([
//     {
//       id: 1,
//       subject: { id: 1, name: "Mathematics", code: "MATH101" },
//       teacher: {
//         id: 1,
//         user: {
//           first_name: "John",
//           last_name: "Smith",
//           full_name: "John Smith",
//         },
//       },
//       time_slot: {
//         id: 1,
//         day_of_week: "MON",
//         start_time: "08:00",
//         end_time: "08:40",
//         name: "Period 1",
//         is_break: false,
//       },
//       is_double_period: false,
//     },
//   ]);

//   const handleActivate = () => {
//     setTimetable((prev) => ({ ...prev, is_active: true }));
//     alert("Timetable activated successfully!");
//   };

//   return (
//     <div className="timetable-detail-container">
//       <div className="timetable-header">
//         <button onClick={() => navigate(-1)} className="back-button">
//           <FiArrowLeft /> Back
//         </button>

//         <div className="header-info">
//           <h2>{timetable.school_class.name} Timetable</h2>
//           <p>
//             {timetable.academic_year} - Term {timetable.term} | Status:{" "}
//             <span
//               className={`status ${
//                 timetable.is_active ? "active" : "inactive"
//               }`}
//             >
//               {timetable.is_active ? "Active" : "Inactive"}
//             </span>
//           </p>
//         </div>

//         <div className="action-buttons">
//           {!timetable.is_active && (
//             <button onClick={handleActivate} className="activate-btn">
//               <FiClock /> Activate
//             </button>
//           )}
//           <button className="print-btn">
//             <FiPrinter /> Print
//           </button>
//           <button className="export-btn">
//             <FiDownload /> Export
//           </button>
//         </div>
//       </div>

//       <div className="timetable-content">
//         <TimetableGrid lessons={lessons} />
//       </div>
//     </div>
//   );
// };

// export default TimetableDetailView;
