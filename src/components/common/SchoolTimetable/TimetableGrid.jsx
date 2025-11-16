import { Table, Text, Badge } from "@mantine/core";

export default function TimetableGrid({ timetable = {} }) {
  if (!timetable || !timetable.time_slots) {
    return (
      <div className="no-timetable-data">
        <Text align="center" color="dimmed">
          No timetable data available. Please generate a timetable first.
        </Text>
      </div>
    );
  }

  const lessons = timetable.lessons || [];
  const timeSlots = timetable.time_slots || [];

  if (timeSlots.length === 0) {
    return (
      <div className="no-timetable-data">
        <Text align="center" color="dimmed">
          No time slots configured.
        </Text>
      </div>
    );
  }

  // Days in order
  const days = [
    { name: "Monday", short: "MON" },
    { name: "Tuesday", short: "TUE" },
    { name: "Wednesday", short: "WED" },
    { name: "Thursday", short: "THU" },
    { name: "Friday", short: "FRI" },
  ];

  console.log("=== TimetableGrid Debug ===");
  console.log("Total time slots:", timeSlots.length);
  console.log("Total lessons:", lessons.length);

  // Get UNIQUE time periods (one per time, not per day)
  const uniquePeriods = [];
  const seenTimes = new Set();

  // Sort all non-break slots by time
  const sortedSlots = timeSlots
    .filter((slot) => !slot.is_break)
    .sort((a, b) => {
      const timeA = new Date(`1970/01/01 ${a.start_time}`);
      const timeB = new Date(`1970/01/01 ${b.start_time}`);
      return timeA - timeB;
    });

  console.log("Sorted non-break slots:", sortedSlots.length);

  // Extract unique times (take first occurrence)
  sortedSlots.forEach((slot) => {
    const timeKey = `${slot.start_time}-${slot.end_time}`;
    if (!seenTimes.has(timeKey)) {
      seenTimes.add(timeKey);
      uniquePeriods.push({
        start_time: slot.start_time,
        end_time: slot.end_time,
        name: slot.name || `Period ${uniquePeriods.length + 1}`,
      });
    }
  });

  console.log("Unique periods:", uniquePeriods.length);
  uniquePeriods.forEach((p, i) => {
    console.log(`  ${i + 1}. ${p.start_time} - ${p.end_time} (${p.name})`);
  });

  if (uniquePeriods.length === 0) {
    return (
      <div className="no-timetable-data">
        <Text align="center" color="dimmed">
          No valid time periods found. Please check timetable structure.
        </Text>
      </div>
    );
  }

  // Create lesson lookup: lessons[day][start_time] = lesson
  const lessonLookup = {};

  lessons.forEach((lesson) => {
    const day =
      lesson.time_slot_details?.day_of_week ||
      lesson.day_of_week ||
      lesson.time_slot?.day_of_week;

    const startTime =
      lesson.time_slot_details?.start_time ||
      lesson.start_time ||
      lesson.time_slot?.start_time;

    if (!day || !startTime) {
      console.warn("Lesson missing day/time:", lesson);
      return;
    }

    if (!lessonLookup[day]) {
      lessonLookup[day] = {};
    }

    lessonLookup[day][startTime] = lesson;
  });

  console.log("Lesson lookup created");
  console.log("Days with lessons:", Object.keys(lessonLookup));
  Object.keys(lessonLookup).forEach((day) => {
    console.log(`  ${day}: ${Object.keys(lessonLookup[day]).length} lessons`);
  });

  // Helper functions
  const getTeacherName = (lesson) => {
    if (lesson.teacher_details?.user) {
      return `${lesson.teacher_details.user.first_name} ${lesson.teacher_details.user.last_name}`;
    }
    if (lesson.teacher_details) {
      return lesson.teacher_details.name || "Teacher";
    }
    return "Teacher";
  };

  const getSubjectName = (lesson) => {
    return lesson.subject_details?.name || lesson.subject?.name || "Subject";
  };

  // Calculate statistics
  const totalExpectedLessons = uniquePeriods.length * days.length;
  const fillRate = (lessons.length / totalExpectedLessons) * 100;

  return (
    <div className="timetable-container">
      <Table
        className="class-timetable-grid"
        striped
        highlightOnHover
        withBorder
      >
        <thead>
          <tr>
            <th style={{ minWidth: "120px", backgroundColor: "#f8f9fa" }}>
              Time
            </th>
            {days.map((day) => (
              <th key={day.short} style={{ backgroundColor: "#f8f9fa" }}>
                {day.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {uniquePeriods.map((period, idx) => (
            <tr key={`period-${idx}`}>
              <td className="time-cell" style={{ fontWeight: "bold" }}>
                <div className="time-range">
                  {period.start_time} - {period.end_time}
                </div>
                <div
                  className="slot-name"
                  style={{ fontSize: "0.85em", color: "#666" }}
                >
                  {period.name}
                </div>
              </td>

              {days.map((day) => {
                const lesson = lessonLookup[day.short]?.[period.start_time];

                return (
                  <td key={`${day.short}-${idx}`} className="lesson-cell">
                    {lesson ? (
                      <div
                        className="lesson-content"
                        style={{ padding: "8px" }}
                      >
                        <div
                          className="lesson-subject"
                          style={{
                            fontWeight: "bold",
                            marginBottom: "4px",
                            color: "#2c3e50",
                          }}
                        >
                          {getSubjectName(lesson)}
                        </div>
                        <div
                          className="lesson-teacher"
                          style={{
                            fontSize: "0.9em",
                            color: "#7f8c8d",
                          }}
                        >
                          {getTeacherName(lesson)}
                        </div>
                        {lesson.room && (
                          <div
                            className="lesson-room"
                            style={{
                              fontSize: "0.85em",
                              color: "#95a5a6",
                              marginTop: "2px",
                            }}
                          >
                            Room: {lesson.room}
                          </div>
                        )}
                        {lesson.is_double_period && (
                          <Badge
                            size="xs"
                            color="blue"
                            style={{ marginTop: "4px" }}
                          >
                            Double
                          </Badge>
                        )}
                      </div>
                    ) : (
                      <div
                        style={{
                          color: "#adb5bd",
                          fontStyle: "italic",
                          fontSize: "0.9em",
                          padding: "8px",
                        }}
                      >
                        Free
                      </div>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </Table>

      <div
        className="timetable-summary"
        style={{
          marginTop: "20px",
          padding: "15px",
          backgroundColor: "#f8f9fa",
          borderRadius: "8px",
        }}
      >
        <Text weight={500} style={{ marginBottom: "8px" }}>
          Timetable Summary:
        </Text>
        <Text size="sm">Total Lessons: {lessons.length}</Text>
        <Text size="sm">
          Time Slots: {uniquePeriods.length} periods per day
        </Text>
        <Text size="sm">Days: {days.length}</Text>
        <Text size="sm" style={{ marginTop: "8px", color: "#e67e22" }}>
          Expected Total Lessons: {totalExpectedLessons}
        </Text>
        <Text
          size="sm"
          style={{
            color:
              fillRate >= 80
                ? "#27ae60"
                : fillRate >= 60
                ? "#f39c12"
                : "#e74c3c",
            fontWeight: "bold",
          }}
        >
          Fill Rate: {fillRate.toFixed(1)}%
          {fillRate < 60 && " ⚠️ Low fill rate"}
        </Text>
      </div>
    </div>
  );
}
