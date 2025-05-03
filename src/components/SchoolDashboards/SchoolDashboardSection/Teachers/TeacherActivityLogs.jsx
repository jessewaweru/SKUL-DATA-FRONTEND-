// components/SchoolDashboard/Teachers/TeacherActivityLogs.jsx
import { useState } from "react";
import { FiLogIn, FiFileText, FiCalendar, FiAlertCircle } from "react-icons/fi";
import { FiFilter } from "react-icons/fi";
import "../Teachers/teachers.css";

const TeacherActivityLogs = () => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");

  const activityTypes = [
    { id: "all", label: "All Activity", icon: null },
    { id: "logins", label: "Logins", icon: <FiLogIn /> },
    { id: "reports", label: "Reports", icon: <FiFileText /> },
    { id: "attendance", label: "Attendance", icon: <FiCalendar /> },
    { id: "alerts", label: "Alerts", icon: <FiAlertCircle /> },
  ];

  // Mock data - replace with API calls
  const activities = [
    {
      id: 1,
      type: "login",
      timestamp: "2023-04-15T09:30:00Z",
      description: "Logged in to the system",
      details: "IP: 192.168.1.1, Device: Chrome on Windows",
    },
    // ... more activities
  ];

  const filteredActivities =
    activeFilter === "all"
      ? activities
      : activities.filter((act) => act.type === activeFilter);

  return (
    <div className="teacher-activity-logs">
      <div className="activity-header">
        <h2>Teacher Activity Logs</h2>
        <button
          className={`filter-button ${filterOpen ? "active" : ""}`}
          onClick={() => setFilterOpen(!filterOpen)}
        >
          <FiFilter /> Filters
        </button>
      </div>

      {filterOpen && (
        <div className="filter-panel">
          <div className="filter-group">
            <label>Date Range</label>
            <div className="date-range">
              <input type="date" />
              <span>to</span>
              <input type="date" />
            </div>
          </div>
          <div className="filter-group">
            <label>Activity Type</label>
            <select>
              <option>All Types</option>
              <option>Logins</option>
              <option>Reports</option>
              <option>Attendance</option>
              <option>Alerts</option>
            </select>
          </div>
          <div className="filter-actions">
            <button className="apply-button">Apply Filters</button>
            <button className="reset-button">Reset</button>
          </div>
        </div>
      )}

      <div className="activity-types">
        {activityTypes.map((type) => (
          <button
            key={type.id}
            className={`type-button ${
              activeFilter === type.id ? "active" : ""
            }`}
            onClick={() => setActiveFilter(type.id)}
          >
            {type.icon && <span className="type-icon">{type.icon}</span>}
            {type.label}
          </button>
        ))}
      </div>

      <div className="activity-list">
        {filteredActivities.length === 0 ? (
          <div className="empty-state">
            <p>No activity found for the selected filters</p>
          </div>
        ) : (
          <ul>
            {filteredActivities.map((activity) => (
              <li key={activity.id} className="activity-item">
                <div className="activity-icon">
                  {activity.type === "login" && <FiLogIn />}
                  {activity.type === "report" && <FiFileText />}
                  {activity.type === "attendance" && <FiCalendar />}
                  {activity.type === "alert" && <FiAlertCircle />}
                </div>
                <div className="activity-content">
                  <div className="activity-header">
                    <span className="activity-description">
                      {activity.description}
                    </span>
                    <span className="activity-timestamp">
                      {new Date(activity.timestamp).toLocaleString()}
                    </span>
                  </div>
                  {activity.details && (
                    <div className="activity-details">{activity.details}</div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TeacherActivityLogs;
