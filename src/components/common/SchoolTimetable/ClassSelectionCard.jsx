import "../../SchoolDashboards/SchoolDashboardSection/Timetables/timetables.css";

const ClassSelectionCard = ({ cls, selected, onToggle }) => {
  return (
    <div
      className={`class-card ${selected ? "selected" : ""}`}
      onClick={() => onToggle(cls.id)}
    >
      <h4>{cls.name}</h4>
      <p>{cls.grade_level}</p>
      <p>{cls.students_count} students</p>
      <div className="checkbox">
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onToggle(cls.id)}
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  );
};

export default ClassSelectionCard;
