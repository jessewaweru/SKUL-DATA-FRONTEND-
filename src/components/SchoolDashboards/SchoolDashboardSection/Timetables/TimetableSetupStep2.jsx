import { useTimetableApi } from "../../../../hooks/useTimetableApi";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./timetables.css";

const TimetableSetupStep2 = ({ timetableData, updateData }) => {
  const api = useTimetableApi();
  const navigate = useNavigate();
  const [structure, setStructure] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStructure = async () => {
      try {
        const response = await api.get(
          `/school_timetables/timetable-structures/${timetableData.school}/`
        );
        setStructure(response.data);
        if (timetableData.structure === null) {
          updateData({ structure: response.data });
        }
      } catch (err) {
        setError("Failed to load timetable structure");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStructure();
  }, [timetableData.school]);

  const handleNext = () => {
    if (!structure) {
      alert("Please set up the timetable structure first");
      return;
    }
    navigate("/school_timetables/timetables/create/step-3");
  };

  const handlePrev = () => {
    navigate("/school_timetables/timetables/create/step-1");
  };

  if (loading) return <div className="loading">Loading structure...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="timetable-step-2">
      <h3>Timetable Structure</h3>

      {structure && (
        <div className="structure-details">
          <div className="detail-row">
            <span className="detail-label">Curriculum:</span>
            <span className="detail-value">{structure.curriculum}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Days of Week:</span>
            <span className="detail-value">
              {structure.days_of_week.join(", ")}
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">School Day:</span>
            <span className="detail-value">
              {structure.default_start_time} - {structure.default_end_time}
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Period Duration:</span>
            <span className="detail-value">
              {structure.period_duration} minutes
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Include Games:</span>
            <span className="detail-value">
              {structure.include_games ? "Yes" : "No"}
              {structure.include_games && ` (${structure.games_duration} mins)`}
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Include Preps:</span>
            <span className="detail-value">
              {structure.include_preps ? "Yes" : "No"}
              {structure.include_preps && ` (${structure.preps_duration} mins)`}
            </span>
          </div>
        </div>
      )}

      <div className="time-slots-preview">
        <h4>Time Slots</h4>
        {structure?.time_slots?.map((slot) => (
          <div key={slot.id} className="time-slot">
            <span className="slot-day">{slot.day_of_week}</span>
            <span className="slot-time">
              {slot.start_time} - {slot.end_time}
            </span>
            <span className="slot-name">
              {slot.is_break ? slot.break_name : slot.name}
            </span>
          </div>
        ))}
      </div>

      <div className="step-actions">
        <button className="btn-prev" onClick={handlePrev}>
          Back: Select Classes
        </button>
        <button className="btn-next" onClick={handleNext}>
          Next: Assign Subjects
        </button>
      </div>
    </div>
  );
};

export default TimetableSetupStep2;

// const TimetableSetupStep2 = ({ timetableData = {}, updateData }) => {
//   const navigate = useNavigate();

//   const [structure, setStructure] = useState({
//     id: 1,
//     curriculum: "CBC",
//     days_of_week: ["MON", "TUE", "WED", "THU", "FRI"],
//     default_start_time: "08:00",
//     default_end_time: "16:00",
//     period_duration: 40,
//     time_slots: [
//       {
//         id: 1,
//         name: "Period 1",
//         start_time: "08:00",
//         end_time: "08:40",
//         day_of_week: "MON",
//         is_break: false,
//       },
//     ],
//   });

//   useEffect(() => {
//     if (timetableData?.structure === null) {
//       updateData({ structure: structure });
//     }
//   }, [timetableData]);

//   const handleNext = () => {
//     navigate("/dashboard/timetables/create/step-3");
//   };

//   const handlePrev = () => {
//     navigate("/dashboard/timetables/create/step-1");
//   };

//   return (
//     <div className="timetable-step-2">
//       <h3>Timetable Structure</h3>

//       {structure && (
//         <div className="structure-details">
//           <div className="detail-row">
//             <span className="detail-label">Curriculum:</span>
//             <span className="detail-value">{structure.curriculum}</span>
//           </div>
//           <div className="detail-row">
//             <span className="detail-label">Days of Week:</span>
//             <span className="detail-value">
//               {structure.days_of_week.join(", ")}
//             </span>
//           </div>
//           <div className="detail-row">
//             <span className="detail-label">School Day:</span>
//             <span className="detail-value">
//               {structure.default_start_time} - {structure.default_end_time}
//             </span>
//           </div>
//           <div className="detail-row">
//             <span className="detail-label">Period Duration:</span>
//             <span className="detail-value">
//               {structure.period_duration} minutes
//             </span>
//           </div>
//         </div>
//       )}

//       <div className="step-actions">
//         <button className="btn-prev" onClick={handlePrev}>
//           Back: Select Classes
//         </button>
//         <button className="btn-next" onClick={handleNext}>
//           Next: Assign Subjects
//         </button>
//       </div>
//     </div>
//   );
// };

// export default TimetableSetupStep2;
