import "../../SchoolDashboards/SchoolDashboardSection/Timetables/timetables.css";

const SubjectAssignmentCard = ({
  subject,
  teachers,
  selectedTeacher,
  requiredPeriods,
  onTeacherChange,
  onPeriodsChange,
}) => {
  const getTeacherDisplayName = (teacher) => {
    // Handle different teacher data structures
    if (teacher.user) {
      return `${teacher.user.first_name} ${teacher.user.last_name}`;
    } else if (teacher.first_name && teacher.last_name) {
      return `${teacher.first_name} ${teacher.last_name}`;
    } else if (teacher.full_name) {
      return teacher.full_name;
    } else if (teacher.username) {
      return teacher.username;
    }
    return `Teacher ${teacher.id}`;
  };

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
            {teachers.map((teacher) => (
              <option key={teacher.id} value={teacher.id}>
                {getTeacherDisplayName(teacher)}
              </option>
            ))}
          </select>
          {teachers.length === 0 && (
            <p className="no-teachers-warning">
              No teachers available for this subject
            </p>
          )}
          {teachers.length > 0 && (
            <p className="teachers-count">
              {teachers.length} teacher(s) available
            </p>
          )}
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
