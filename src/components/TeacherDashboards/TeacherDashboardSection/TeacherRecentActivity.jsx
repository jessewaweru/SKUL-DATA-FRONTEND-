import "../TeacherDashboardSection/teacherdashboard.css";

const TeacherRecentActivity = () => {
  return (
    <div className="teacher-table-container">
      <div className="teacher-table-header">
        <h3 className="teacher-table-title">Recent Activity</h3>
        <button className="teacher-see-all-button">See all</button>
      </div>
      <table className="teacher-data-table">
        <thead>
          <tr className="teacher-table-head-row">
            <th className="teacher-table-head-cell">Activity</th>
            <th className="teacher-table-head-cell">Class</th>
            <th className="teacher-table-head-cell">Date</th>
          </tr>
        </thead>
        <tbody>
          <TeacherTableRow
            activity="Submitted Math Report"
            class="Grade 5A"
            date="Apr 1, 2025 10:23 AM"
          />
          <TeacherTableRow
            activity="Marked Attendance"
            class="Grade 5A"
            date="Apr 1, 2025 08:45 AM"
          />
          <TeacherTableRow
            activity="Uploaded Lesson Plan"
            class="Grade 5A"
            date="Mar 31, 2025 04:12 PM"
          />
        </tbody>
      </table>
    </div>
  );
};

export default TeacherRecentActivity;

const TeacherTableRow = ({ activity, class: className, date }) => {
  return (
    <tr className="teacher-table-row">
      <td className="teacher-table-cell">{activity}</td>
      <td className="teacher-table-cell">{className}</td>
      <td className="teacher-table-cell">{date}</td>
    </tr>
  );
};
