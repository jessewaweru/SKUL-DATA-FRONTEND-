import "../../SchoolDashboard/dashboard.css";

// components/SchoolDashboard/Users/UserSessions.jsx
import { useState, useEffect } from "react";
import {
  FiUsers,
  FiRefreshCw,
  FiLogOut,
  FiClock,
  FiHardDrive,
  FiArrowLeft,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const UserSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  const navigate = useNavigate();

  // Fetch active sessions
  const fetchSessions = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/users/sessions/");
      if (!response.ok) throw new Error("Failed to fetch sessions");
      const data = await response.json();
      setSessions(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchSessions();
  }, []);

  // Terminate a session
  const terminateSession = async (sessionId) => {
    try {
      const response = await fetch(`/api/users/sessions/${sessionId}/`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to terminate session");
      fetchSessions(); // Refresh the list
    } catch (err) {
      setError(err.message);
    }
  };

  // Format session duration
  const formatDuration = (startTime) => {
    const start = new Date(startTime);
    const now = new Date();
    const diff = Math.floor((now - start) / 1000); // in seconds

    const hours = Math.floor(diff / 3600);
    const minutes = Math.floor((diff % 3600) / 60);

    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="user-sessions-container">
      <div className="header">
        <button
          onClick={() => navigate("/dashboard/users")}
          className="back-button"
        >
          <FiArrowLeft /> Back to Users
        </button>
        <h2>
          <FiUsers /> Active User Sessions
        </h2>
        <button onClick={fetchSessions} className="secondary-button">
          <FiRefreshCw /> Refresh
        </button>
      </div>

      {error && <div className="error-alert">Error: {error}</div>}

      {loading ? (
        <div className="loading">Loading active sessions...</div>
      ) : (
        <div className="sessions-table-container">
          <table className="sessions-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>IP Address</th>
                <th>Device</th>
                <th>Login Time</th>
                <th>Duration</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sessions.length > 0 ? (
                sessions.map((session) => (
                  <tr
                    key={session.id}
                    className={
                      selectedSession?.id === session.id ? "selected" : ""
                    }
                    onClick={() => setSelectedSession(session)}
                  >
                    <td>
                      <div className="user-info">
                        <img
                          src={
                            session.user.avatar ||
                            `https://api.dicebear.com/9.x/initials/svg?seed=${session.user.name}`
                          }
                          alt="avatar"
                          className="avatar"
                        />
                        <div>
                          <strong>{session.user.name}</strong>
                          <small>{session.user.email}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`role-badge ${session.user.role.toLowerCase()}`}
                      >
                        {session.user.role}
                      </span>
                    </td>
                    <td>{session.ip_address}</td>
                    <td>
                      <div className="device-info">
                        <FiHardDrive />
                        <span>{session.device || "Unknown"}</span>
                      </div>
                    </td>
                    <td>{new Date(session.login_time).toLocaleString()}</td>
                    <td>
                      <div className="duration-info">
                        <FiClock />
                        <span>{formatDuration(session.login_time)}</span>
                      </div>
                    </td>
                    <td>
                      <button
                        className="danger-button small"
                        onClick={(e) => {
                          e.stopPropagation();
                          terminateSession(session.id);
                        }}
                      >
                        <FiLogOut /> Terminate
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="no-sessions">
                    No active sessions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Session Details Panel */}
      {selectedSession && (
        <div className="session-details">
          <h3>Session Details</h3>
          <div className="detail-row">
            <label>User:</label>
            <span>{selectedSession.user.name}</span>
          </div>
          <div className="detail-row">
            <label>Location:</label>
            <span>{selectedSession.location || "Unknown"}</span>
          </div>
          <div className="detail-row">
            <label>Browser:</label>
            <span>{selectedSession.browser || "Unknown"}</span>
          </div>
          <div className="detail-row">
            <label>OS:</label>
            <span>{selectedSession.os || "Unknown"}</span>
          </div>
          <div className="detail-row">
            <label>Last Activity:</label>
            <span>
              {new Date(selectedSession.last_activity).toLocaleString()}
            </span>
          </div>
          <button
            className="danger-button"
            onClick={() => terminateSession(selectedSession.id)}
          >
            <FiLogOut /> Terminate This Session
          </button>
        </div>
      )}
    </div>
  );
};

export default UserSessions;
