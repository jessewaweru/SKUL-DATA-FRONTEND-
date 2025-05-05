import "../ParentDashboardSection/parentdashboard.css";
import { FiActivity } from "react-icons/fi";

const ParentRecentActivityTable = () => {
  return (
    <div className="parent-table-container">
      <div className="parent-table-header">
        <h3 className="parent-table-title">
          <FiActivity /> Recent School Activities
        </h3>
        <button className="parent-see-all-button">See all</button>
      </div>
      <table className="parent-data-table">
        <ParentTableHead />
        <tbody>
          <ParentTableRow
            activity="Report Card Uploaded"
            child="John Doe (Grade 5)"
            timestamp="Apr 1, 2025 10:23 AM"
            status="New"
          />
          <ParentTableRow
            activity="Parent-Teacher Meeting Scheduled"
            child="Jane Doe (Grade 3)"
            timestamp="Mar 31, 2025 04:12 PM"
            status="Upcoming"
          />
          <ParentTableRow
            activity="School Event Reminder"
            child="All Children"
            timestamp="Mar 30, 2025 11:18 AM"
            status="New"
          />
        </tbody>
      </table>
    </div>
  );
};

const ParentTableHead = () => {
  return (
    <thead>
      <tr className="parent-table-head-row">
        <th className="parent-table-head-cell">Activity</th>
        <th className="parent-table-head-cell">Child</th>
        <th className="parent-table-head-cell">Timestamp</th>
        <th className="parent-table-head-cell">Status</th>
      </tr>
    </thead>
  );
};

const ParentTableRow = ({ activity, child, timestamp, status }) => {
  return (
    <tr className="parent-table-row">
      <td className="parent-table-cell">
        <a href="#" className="parent-activity-link">
          {activity}
        </a>
      </td>
      <td className="parent-table-cell">{child}</td>
      <td className="parent-table-cell">{timestamp}</td>
      <td className="parent-table-cell">
        <span
          className={`parent-status-badge parent-status-${status.toLowerCase()}`}
        >
          {status}
        </span>
      </td>
    </tr>
  );
};

export default ParentRecentActivityTable;
