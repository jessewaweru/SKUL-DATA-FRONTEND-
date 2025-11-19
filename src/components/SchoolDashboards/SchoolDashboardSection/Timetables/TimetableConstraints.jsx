import { useState, useEffect } from "react";
import { useTimetableApi } from "../../../../hooks/useTimetableApi";
import useUser from "../../../../hooks/useUser";
import ConstraintCard from "../../../common/SchoolTimetable/ConstraintCard";
import "./timetables.css";

const TimetableConstraints = () => {
  const { user } = useUser();
  const api = useTimetableApi();
  const [constraints, setConstraints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newConstraint, setNewConstraint] = useState({
    constraint_type: "NO_TEACHER_CLASH",
    is_hard_constraint: true,
    parameters: {},
    description: "",
  });

  useEffect(() => {
    if (!user?.school?.code) {
      setLoading(false);
      return;
    }

    const fetchConstraints = async () => {
      try {
        const response = await api.getConstraints(user.school.code);
        setConstraints(response.data.results || response.data);
      } catch (err) {
        setError("Failed to load constraints");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchConstraints();
  }, [user?.school?.code]);

  const handleAddConstraint = async () => {
    if (!user?.school?.id) return;

    try {
      const response = await api.createConstraint({
        school: user.school.id,
        ...newConstraint,
      });
      setConstraints([...constraints, response.data]);
      setNewConstraint({
        constraint_type: "NO_TEACHER_CLASH",
        is_hard_constraint: true,
        parameters: {},
        description: "",
      });
    } catch (err) {
      console.error("Failed to add constraint:", err);
    }
  };

  const handleDeleteConstraint = async (id) => {
    try {
      await api.deleteConstraint(id);
      setConstraints(constraints.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Failed to delete constraint:", err);
    }
  };

  // Add early return for missing school data
  if (!user?.school?.id && !loading) {
    return <div className="error">No school data available</div>;
  }

  if (loading) return <div className="loading">Loading constraints...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="constraints-management-container">
      <h2>Timetable Constraints</h2>
      <p>Manage the rules that guide timetable generation</p>

      <button className="btn-add-constraint" onClick={handleAddConstraint}>
        Add New Constraint
      </button>

      <div className="add-constraint-form">
        <div className="form-group">
          <label>Constraint Type:</label>
          <select
            value={newConstraint.constraint_type}
            onChange={(e) =>
              setNewConstraint({
                ...newConstraint,
                constraint_type: e.target.value,
              })
            }
          >
            <option value="NO_TEACHER_CLASH">No Teacher Double Booking</option>
            <option value="NO_CLASS_CLASH">No Class Subject Overlap</option>
            <option value="SUBJECT_PAIRING">Subject Pairing</option>
            <option value="SCIENCE_DOUBLE">Science Double Period</option>
            <option value="NO_AFTERNOON_SCIENCE">
              No Science in Afternoon
            </option>
            <option value="MAX_PERIODS_PER_DAY">Max Periods Per Day</option>
          </select>
        </div>
        <div className="form-group">
          <label>Description:</label>
          <input
            type="text"
            value={newConstraint.description}
            onChange={(e) =>
              setNewConstraint({
                ...newConstraint,
                description: e.target.value,
              })
            }
            placeholder="Describe this constraint"
          />
        </div>
        <div className="form-group">
          <label>Parameters:</label>
          <textarea
            value={JSON.stringify(newConstraint.parameters, null, 2)}
            onChange={(e) => {
              try {
                setNewConstraint({
                  ...newConstraint,
                  parameters: JSON.parse(e.target.value),
                });
              } catch (error) {
                // Handle invalid JSON gracefully
                console.warn("Invalid JSON in parameters field");
              }
            }}
            placeholder="Define constraint parameters as JSON"
          />
        </div>
      </div>

      <div className="constraints-list">
        {constraints.map((constraint) => (
          <ConstraintCard
            key={constraint.id}
            constraint={constraint}
            onDelete={handleDeleteConstraint}
          />
        ))}
      </div>
    </div>
  );
};

export default TimetableConstraints;
