import "../../SchoolDashboards/SchoolDashboardSection/Timetables/timetables.css";

const ConstraintCard = ({ constraint, onRemove }) => {
  const getConstraintDescription = () => {
    const descriptions = {
      NO_TEACHER_CLASH:
        "Teachers cannot be scheduled in multiple classes at the same time",
      NO_TEACHER_SAME_SUBJECT_CLASH:
        "Same teacher cannot teach same subject in different classes simultaneously",
      NO_CLASS_CLASH:
        "Classes cannot have multiple subjects scheduled at the same time",
      SCIENCE_DOUBLE_PERIOD:
        "Science subjects must have one double period per week (8-4-4 curriculum)",
      NO_CORE_AFTER_LUNCH:
        "Core subjects (English, Kiswahili, Math) cannot be scheduled after lunch",
      NO_DOUBLE_CORE: "Core subjects cannot have double periods",
      MATH_NOT_AFTER_SCIENCE:
        "Mathematics lessons cannot be scheduled immediately after science subjects",
      MATH_MORNING_ONLY:
        "Mathematics must be scheduled in morning sessions only",
      ENGLISH_KISWAHILI_SEPARATE:
        "English and Kiswahili lessons cannot be scheduled consecutively",
      SUBJECT_GROUPING: "Groups subjects that students don't take together",
      MANDATORY_BREAKS:
        "Ensures timetable includes short break, long break and lunch break",
      INCLUDE_GAMES: "Includes games period in the timetable",
      INCLUDE_PREPS: "Includes preps period for boarding schools",
    };

    return (
      constraint.description ||
      descriptions[constraint.constraint_type] ||
      "Custom constraint"
    );
  };

  return (
    <div
      className={`constraint-card ${
        constraint.is_hard_constraint ? "hard" : "soft"
      }`}
    >
      <div className="constraint-header">
        <div className="constraint-type">
          {constraint.constraint_type.replace(/_/g, " ")}
        </div>
        <button className="btn-remove" onClick={onRemove}>
          Remove
        </button>
      </div>
      <div className="constraint-description">{getConstraintDescription()}</div>
      <div className="constraint-severity">
        {constraint.is_hard_constraint ? "Hard Constraint" : "Soft Constraint"}
      </div>
      {constraint.parameters &&
        Object.keys(constraint.parameters).length > 0 && (
          <div className="constraint-parameters">
            <strong>Parameters:</strong> {JSON.stringify(constraint.parameters)}
          </div>
        )}
    </div>
  );
};

export default ConstraintCard;
