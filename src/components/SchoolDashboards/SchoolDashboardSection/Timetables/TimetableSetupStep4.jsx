import { useState, useEffect, useCallback } from "react";
import { useTimetableApi } from "../../../../hooks/useTimetableApi";
import { useNavigate, useOutletContext } from "react-router-dom";
import ConstraintCard from "../../../common/SchoolTimetable/ConstraintCard";
import "./timetables.css";

const TimetableSetupStep4 = () => {
  const { timetableData, updateData } = useOutletContext();
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

  // Memoize the fetch functions to prevent infinite re-renders
  const fetchConstraints = useCallback(async () => {
    if (!timetableData?.school) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await api.getConstraints(timetableData.school);
      console.log("Constraints API response:", response);

      let constraintsData = [];
      if (response?.data) {
        if (Array.isArray(response.data)) {
          constraintsData = response.data;
        } else if (
          response.data.results &&
          Array.isArray(response.data.results)
        ) {
          constraintsData = response.data.results;
        } else {
          constraintsData = [];
        }
      }

      setConstraints(constraintsData);

      // Only update parent data if we have actual constraints from API
      if (constraintsData.length > 0) {
        updateData({ constraints: constraintsData });
      }
    } catch (err) {
      console.error("Failed to load constraints:", err);
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.detail ||
        err.message ||
        "Failed to load constraints";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [timetableData?.school, api, updateData]);

  const fetchSubjectGroups = useCallback(async () => {
    if (!timetableData?.school) return;

    try {
      const response = await api.getSubjectGroups(timetableData.school);
      console.log("Subject groups API response:", response);

      let subjectGroupsData = [];
      if (response?.data) {
        if (Array.isArray(response.data)) {
          subjectGroupsData = response.data;
        } else if (
          response.data.results &&
          Array.isArray(response.data.results)
        ) {
          subjectGroupsData = response.data.results;
        } else {
          subjectGroupsData = [];
        }
      }

      setSubjectGroups(subjectGroupsData);
    } catch (err) {
      console.error("Failed to load subject groups", err);
    }
  }, [timetableData?.school, api]);

  useEffect(() => {
    // Only fetch if we have school data and we're not already loading
    if (timetableData?.school && loading) {
      console.log(
        "Fetching constraints and subject groups for school:",
        timetableData.school
      );
      fetchConstraints();
      fetchSubjectGroups();
    }
  }, [timetableData?.school, fetchConstraints, fetchSubjectGroups, loading]);

  // Reset loading state when school changes
  useEffect(() => {
    setLoading(true);
  }, [timetableData?.school]);

  const handleAddConstraint = () => {
    // For subject grouping, ensure parameters include subject_group_id
    const constraintToAdd = { ...newConstraint };
    if (constraintToAdd.constraint_type === "SUBJECT_GROUPING") {
      constraintToAdd.parameters = {
        subject_group: constraintToAdd.parameters.subject_group || null,
      };
    }

    const updatedConstraints = [
      ...constraints,
      { ...constraintToAdd, id: Date.now() },
    ];
    setConstraints(updatedConstraints);
    updateData({ constraints: updatedConstraints });

    // Reset form
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
    navigate("/dashboard/timetables/create/step-5");
  };

  const handlePrev = () => {
    navigate("/dashboard/timetables/create/step-3");
  };

  // Show error if timetableData is not available
  if (!timetableData) {
    return (
      <div className="error">
        <p>Timetable data not available. Please start over from Step 1.</p>
        <button onClick={() => navigate("/dashboard/timetables/create/step-1")}>
          Go to Step 1
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="loading">
        <p>Loading constraints...</p>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <h4>Error Loading Constraints</h4>
        <p>{error}</p>
        <div className="error-actions">
          <button onClick={fetchConstraints}>Try Again</button>
          <button onClick={handlePrev}>Go Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="timetable-step-4">
      <h3>Set Timetable Constraints</h3>

      <div className="constraints-info">
        <p>
          Constraints are rules that guide how the timetable is generated.
          <strong> Hard constraints</strong> must be followed, while{" "}
          <strong>soft constraints</strong> are preferred but not required.
        </p>
      </div>

      <div className="constraints-list">
        {constraints.length === 0 ? (
          <div className="no-constraints">
            <p>
              No constraints set yet. Add some constraints to guide timetable
              generation.
            </p>
            <p>Common constraints include:</p>
            <ul>
              <li>
                <strong>No Teacher Double Booking</strong> - Teachers can't be
                in two classes at once
              </li>
              <li>
                <strong>No Class Subject Overlap</strong> - One subject per
                class at a time
              </li>
              <li>
                <strong>Core Subjects in Morning</strong> - Math, English,
                Kiswahili before lunch
              </li>
            </ul>
          </div>
        ) : (
          constraints.map((constraint, index) => (
            <ConstraintCard
              key={constraint.id || index}
              constraint={constraint}
              onRemove={() => handleRemoveConstraint(index)}
            />
          ))
        )}
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
            <option value="INCLUDE_GAMES">Include Games Period</option>
            <option value="INCLUDE_PREPS">Include Preps Period</option>
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
            {subjectGroups.length === 0 && (
              <p className="no-groups-warning">
                No subject groups found. Create subject groups first in the
                Subject Groups section.
              </p>
            )}
          </div>
        )}

        <div className="form-group checkbox-group">
          <label className="checkbox-label">
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
            <span className="checkmark"></span>
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
