import { Table, Text, Badge } from "@mantine/core";
import "../../SchoolDashboards/SchoolDashboardSection/Timetables/timetables.css";

export default function TimetableGrid({ timetable = {} }) {
  // Safely handle missing data
  if (!timetable?.lessons || !timetable?.time_slots) {
    return <div className="error">No timetable data available</div>;
  }

  // Define the days of the week
  const days = [
    { name: "Monday", short: "MON" },
    { name: "Tuesday", short: "TUE" },
    { name: "Wednesday", short: "WED" },
    { name: "Thursday", short: "THU" },
    { name: "Friday", short: "FRI" },
  ];

  // Get all unique teaching time slots (excluding breaks) and sort them by time
  const teachingSlots = timetable.time_slots
    .filter((slot) => !slot.is_break)
    .sort((a, b) => {
      const timeA = new Date(`1970/01/01 ${a.start_time}`);
      const timeB = new Date(`1970/01/01 ${b.start_time}`);
      return timeA - timeB;
    });

  // Group lessons by day for easier access
  const lessonsByDay = {};
  days.forEach((day) => {
    lessonsByDay[day.short] = timetable.lessons.filter(
      (lesson) => lesson.time_slot.day_of_week === day.short
    );
  });

  return (
    <div className="timetable-container">
      <Table className="class-timetable-grid">
        <thead>
          <tr>
            <th>Time/Day</th>
            {days.map((day) => (
              <th key={day.short}>{day.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {teachingSlots.map((slot) => (
            <tr key={`slot-${slot.id}`}>
              <td className="time-cell">
                {slot.start_time} - {slot.end_time}
              </td>
              {days.map((day) => {
                // Find lesson for this time slot and day
                const lesson = lessonsByDay[day.short]?.find(
                  (l) => l.time_slot.id === slot.id
                );

                return (
                  <td key={`${slot.id}-${day.short}`} className="lesson-cell">
                    {lesson ? (
                      <div className="lesson-content">
                        <div className="lesson-subject">
                          {lesson.subject?.name || "Subject"}
                        </div>
                        <div className="lesson-teacher">
                          {lesson.teacher?.user?.full_name || "Teacher"}
                        </div>
                        {lesson.is_double_period && (
                          <Badge className="double-badge" size="xs">
                            Double
                          </Badge>
                        )}
                      </div>
                    ) : (
                      <Text className="free-period" color="dimmed" italic>
                        Free
                      </Text>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
