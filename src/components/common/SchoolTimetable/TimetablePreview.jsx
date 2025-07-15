import "../../SchoolDashboards/SchoolDashboardSection/Timetables/timetables.css";

const TimetablePreview = ({ timetable, classId }) => {
  // Add null checks for timetable and its properties
  if (!timetable) {
    return <div>Loading timetable...</div>;
  }

  if (!timetable.classes || !Array.isArray(timetable.classes)) {
    return <div>No timetable data available</div>;
  }

  const classTimetable = timetable.classes.find((c) => c.id === classId);
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  if (!classTimetable) {
    return <div>No timetable found for this class</div>;
  }

  // Add null checks for classTimetable properties
  if (!classTimetable.time_slots || !Array.isArray(classTimetable.time_slots)) {
    return <div>No time slots available for this class</div>;
  }

  if (!classTimetable.lessons || !Array.isArray(classTimetable.lessons)) {
    return <div>No lessons available for this class</div>;
  }

  return (
    <div className="timetable-preview">
      <h4>{classTimetable.name} Timetable</h4>
      <div className="timetable-grid">
        <div className="timetable-header">
          <div className="time-header">Time</div>
          {days.map((day) => (
            <div key={day} className="day-header">
              {day}
            </div>
          ))}
        </div>

        {classTimetable.time_slots.map((slot) => (
          <div key={slot.id} className="timetable-row">
            <div className="time-slot">
              {slot.start_time} - {slot.end_time}
            </div>
            {days.map((day) => {
              const lesson = classTimetable.lessons.find(
                (l) =>
                  l.day_of_week === day.toUpperCase().substring(0, 3) &&
                  l.time_slot === slot.id
              );
              return (
                <div key={day} className="day-slot">
                  {lesson ? (
                    <div className="lesson">
                      <div className="subject">{lesson.subject}</div>
                      <div className="teacher">{lesson.teacher}</div>
                    </div>
                  ) : (
                    <div className="empty-slot">-</div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimetablePreview;
