import { useState, useEffect } from "react";
import { useTimetableApi } from "../../../../hooks/useTimetableApi";
import { useNavigate } from "react-router-dom";
import ConstraintCard from "../../../common/SchoolTimetable/ConstraintCard";
import "./timetables.css";

const TimetableSetupStep4 = ({ timetableData, updateData }) => {
  const api = useTimetableApi();
  const navigate = useNavigate();
  const [constraints, setConstraints] = useState([]);
  const [subjectGroups, setSubjectGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newConstraint, setNewConstraint] = useState({
    constraint_type: "NO_TEACHER_CLASH",
    is_hard_constraint: true,
    parameters: {},
  });

  useEffect(() => {
    const fetchConstraints = async () => {
      try {
        const response = await api.getConstraints(timetableData.school);
        setConstraints(response.data);

        // Initialize with default constraints if none exist
        if (response.data.length === 0) {
          const defaultConstraints = [
            {
              constraint_type: "NO_TEACHER_CLASH",
              is_hard_constraint: true,
              description: "Teachers cannot be scheduled in two places at once",
            },
            {
              constraint_type: "NO_CLASS_CLASH",
              is_hard_constraint: true,
              description: "Classes cannot have two subjects at the same time",
            },
          ];
          setConstraints(defaultConstraints);
        }
      } catch (err) {
        setError("Failed to load constraints");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    // Fetch subject groups when component mounts
    const fetchSubjectGroups = async () => {
      try {
        const response = await api.getSubjectGroups(timetableData.school);
        setSubjectGroups(response.data);
      } catch (err) {
        console.error("Failed to load subject groups", err);
      }
    };

    fetchConstraints();
    fetchSubjectGroups();
  }, [timetableData.school]);

  const handleAddConstraint = () => {
    // For subject grouping, ensure parameters include subject_group_id
    if (newConstraint.constraint_type === "SUBJECT_GROUPING") {
      newConstraint.parameters = {
        subject_group: newConstraint.parameters.subject_group || null,
      };
    }

    const updatedConstraints = [...constraints, newConstraint];
    setConstraints(updatedConstraints);
    updateData({ constraints: updatedConstraints });
    setNewConstraint({
      constraint_type: "NO_TEACHER_CLASH",
      is_hard_constraint: true,
      parameters: {},
    });
  };

  const handleRemoveConstraint = (index) => {
    const updatedConstraints = constraints.filter((_, i) => i !== index);
    setConstraints(updatedConstraints);
    updateData({ constraints: updatedConstraints });
  };

  const handleNext = () => {
    navigate("/school_timetables/timetables/create/step-5");
  };

  const handlePrev = () => {
    navigate("/school_timetables/timetables/create/step-3");
  };

  if (loading) return <div className="loading">Loading constraints...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="timetable-step-4">
      <h3>Set Timetable Constraints</h3>

      <div className="constraints-list">
        {constraints.map((constraint, index) => (
          <ConstraintCard
            key={index}
            constraint={constraint}
            onRemove={() => handleRemoveConstraint(index)}
          />
        ))}
      </div>

      <div className="add-constraint">
        <h4>Add New Constraint</h4>
        <div className="form-group">
          <label>Constraint Type:</label>
          <select
            value={newConstraint.constraint_type}
            onChange={(e) =>
              setNewConstraint({
                ...newConstraint,
                constraint_type: e.target.value,
                parameters: {}, // Reset parameters when type changes
              })
            }
          >
            <option value="NO_TEACHER_CLASH">No Teacher Double Booking</option>
            <option value="NO_TEACHER_SAME_SUBJECT_CLASH">
              No Same Subject Teaching at Same Time
            </option>
            <option value="NO_CLASS_CLASH">No Class Subject Overlap</option>
            <option value="SCIENCE_DOUBLE_PERIOD">
              Science Double Period (8-4-4)
            </option>
            <option value="NO_CORE_AFTER_LUNCH">
              No Core Subjects After Lunch
            </option>
            <option value="NO_DOUBLE_CORE">
              No Double Lessons for Core Subjects
            </option>
            <option value="MATH_NOT_AFTER_SCIENCE">
              Math Not After Science
            </option>
            <option value="MATH_MORNING_ONLY">Math Morning Only</option>
            <option value="ENGLISH_KISWAHILI_SEPARATE">
              English/Kiswahili Not Consecutive
            </option>
            <option value="SUBJECT_GROUPING">Subject Grouping</option>
            <option value="MANDATORY_BREAKS">Mandatory Breaks</option>
          </select>
        </div>

        {/* Add subject group selection when constraint type is SUBJECT_GROUPING */}
        {newConstraint.constraint_type === "SUBJECT_GROUPING" && (
          <div className="form-group">
            <label>Subject Group:</label>
            <select
              value={newConstraint.parameters.subject_group || ""}
              onChange={(e) =>
                setNewConstraint({
                  ...newConstraint,
                  parameters: {
                    subject_group: e.target.value,
                  },
                })
              }
            >
              <option value="">Select Subject Group</option>
              {subjectGroups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={newConstraint.is_hard_constraint}
              onChange={(e) =>
                setNewConstraint({
                  ...newConstraint,
                  is_hard_constraint: e.target.checked,
                })
              }
            />
            Hard Constraint (Must be enforced)
          </label>
        </div>
        <button className="btn-add" onClick={handleAddConstraint}>
          Add Constraint
        </button>
      </div>

      <div className="step-actions">
        <button className="btn-prev" onClick={handlePrev}>
          Back: Assign Subjects
        </button>
        <button className="btn-next" onClick={handleNext}>
          Next: Generate & Review
        </button>
      </div>
    </div>
  );
};

export default TimetableSetupStep4;

// const TimetableSetupStep4 = ({ timetableData, updateData }) => {
//   const navigate = useNavigate();

//   const [constraints, setConstraints] = useState([
//     {
//       constraint_type: "NO_TEACHER_CLASH",
//       is_hard_constraint: true,
//       description: "Teachers cannot be scheduled in two places at once",
//       parameters: {},
//     },
//     {
//       constraint_type: "NO_CLASS_CLASH",
//       is_hard_constraint: true,
//       description: "Classes cannot have two subjects at the same time",
//       parameters: {},
//     },
//   ]);

//   const [newConstraint, setNewConstraint] = useState({
//     constraint_type: "NO_TEACHER_CLASH",
//     is_hard_constraint: true,
//     parameters: {},
//   });

//   const handleAddConstraint = () => {
//     const updatedConstraints = [...constraints, newConstraint];
//     setConstraints(updatedConstraints);
//     updateData({ constraints: updatedConstraints });
//     setNewConstraint({
//       constraint_type: "NO_TEACHER_CLASH",
//       is_hard_constraint: true,
//       parameters: {},
//     });
//   };

//   const handleRemoveConstraint = (index) => {
//     const updatedConstraints = constraints.filter((_, i) => i !== index);
//     setConstraints(updatedConstraints);
//     updateData({ constraints: updatedConstraints });
//   };

//   const handleNext = () => {
//     navigate("/dashboard/timetables/create/step-5");
//   };

//   const handlePrev = () => {
//     navigate("/dashboard/timetables/create/step-3");
//   };

//   return (
//     <div className="timetable-step-4">
//       <h3>Set Timetable Constraints</h3>

//       <div className="constraints-list">
//         {constraints.map((constraint, index) => (
//           <ConstraintCard
//             key={index}
//             constraint={constraint}
//             onRemove={() => handleRemoveConstraint(index)}
//           />
//         ))}
//       </div>

//       <div className="add-constraint">
//         <h4>Add New Constraint</h4>
//         <div className="form-group">
//           <label>Constraint Type:</label>
//           <select
//             value={newConstraint.constraint_type}
//             onChange={(e) =>
//               setNewConstraint({
//                 ...newConstraint,
//                 constraint_type: e.target.value,
//               })
//             }
//           >
//             <option value="NO_TEACHER_CLASH">No Teacher Double Booking</option>
//             <option value="NO_CLASS_CLASH">No Class Subject Overlap</option>
//             <option value="SUBJECT_PAIRING">Subject Pairing</option>
//             <option value="SCIENCE_DOUBLE">Science Double Period</option>
//           </select>
//         </div>
//         <div className="form-group">
//           <label>
//             <input
//               type="checkbox"
//               checked={newConstraint.is_hard_constraint}
//               onChange={(e) =>
//                 setNewConstraint({
//                   ...newConstraint,
//                   is_hard_constraint: e.target.checked,
//                 })
//               }
//             />
//             Hard Constraint (Must be enforced)
//           </label>
//         </div>
//         <button className="btn-add" onClick={handleAddConstraint}>
//           Add Constraint
//         </button>
//       </div>

//       <div className="step-actions">
//         <button className="btn-prev" onClick={handlePrev}>
//           Back: Assign Subjects
//         </button>
//         <button className="btn-next" onClick={handleNext}>
//           Next: Generate & Review
//         </button>
//       </div>
//     </div>
//   );
// };

// export default TimetableSetupStep4;
