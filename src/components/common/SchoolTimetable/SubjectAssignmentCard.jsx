import "../../SchoolDashboards/SchoolDashboardSection/Timetables/timetables.css";

const SubjectAssignmentCard = ({
  subject,
  teachers,
  selectedTeacher,
  requiredPeriods,
  onTeacherChange,
  onPeriodsChange,
}) => {
  return (
    <div className="subject-assignment-card">
      <div className="subject-info">
        <h4>{subject.name}</h4>
        <p>{subject.code}</p>
      </div>

      <div className="assignment-controls">
        <div className="form-group">
          <label>Teacher:</label>
          <select
            value={selectedTeacher || ""}
            onChange={(e) => onTeacherChange(e.target.value)}
          >
            <option value="">Select teacher</option>
            {teachers
              .filter((teacher) => teacher.subjects_taught.includes(subject.id))
              .map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.user.first_name} {teacher.user.last_name}
                </option>
              ))}
          </select>
        </div>

        <div className="form-group">
          <label>Periods per week:</label>
          <input
            type="number"
            min="1"
            max="10"
            value={requiredPeriods}
            onChange={(e) => onPeriodsChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default SubjectAssignmentCard;
