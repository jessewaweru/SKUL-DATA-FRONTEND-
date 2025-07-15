import "../../SchoolDashboards/SchoolDashboardSection/Timetables/timetables.css";

const ConstraintCard = ({ constraint, onRemove }) => {
  const getConstraintDescription = () => {
    switch (constraint.constraint_type) {
      case "NO_TEACHER_CLASH":
        return "Teachers cannot be scheduled in two places at once";
      case "NO_CLASS_CLASH":
        return "Classes cannot have two subjects at the same time";
      case "SUBJECT_PAIRING":
        return "Paired subjects won't be scheduled at the same time";
      case "SCIENCE_DOUBLE":
        return "Science subjects must have at least one double period";
      case "NO_AFTERNOON_SCIENCE":
        return "Science subjects won't be scheduled in the afternoon";
      case "MAX_PERIODS_PER_DAY":
        return `Maximum ${constraint.parameters.max_periods} periods per day for subjects`;
      default:
        return constraint.description || "Custom constraint";
    }
  };

  return (
    <div
      className={`constraint-card ${
        constraint.is_hard_constraint ? "hard" : "soft"
      }`}
    >
      <div className="constraint-type">
        {constraint.constraint_type.replace(/_/g, " ")}
      </div>
      <div className="constraint-description">{getConstraintDescription()}</div>
      <div className="constraint-severity">
        {constraint.is_hard_constraint ? "Hard Constraint" : "Soft Constraint"}
      </div>
      <button className="btn-remove" onClick={onRemove}>
        Remove
      </button>
    </div>
  );
};

export default ConstraintCard;
