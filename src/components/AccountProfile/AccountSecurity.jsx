import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FiShield, FiKey, FiClock, FiGlobe, FiLogOut } from "react-icons/fi";
import "../AccountProfile/accountprofile.css";

const AccountSecurity = () => {
  const { data: securityLogs, isLoading } = useQuery({
    queryKey: ["securityLogs"],
    queryFn: async () => {
      const response = await axios.get("/api/schools/security-logs/");
      return response.data.results; // ✅ use 'results' from paginated response
    },
  });

  const [activeDevices, setActiveDevices] = useState([]);

  useEffect(() => {
    const fetchActiveDevices = async () => {
      const devices = [
        {
          id: 1,
          device: "Chrome on Windows",
          location: "Nairobi, Kenya",
          lastActive: "2 hours ago",
        },
        {
          id: 2,
          device: "Safari on iPhone",
          location: "Nairobi, Kenya",
          lastActive: "5 minutes ago",
        },
      ];
      setActiveDevices(devices);
    };

    fetchActiveDevices();
  }, []);

  if (isLoading) return <div className="loading-spinner">Loading...</div>;

  return (
    <div className="security-container">
      <div className="security-section">
        <h2 className="section-title">
          <FiShield /> Security Overview
        </h2>

        <div className="security-cards">
          <div className="security-card">
            <div className="security-card-header">
              <FiKey className="security-icon" />
              <h3>Password</h3>
            </div>
            <p>Last changed 3 months ago</p>
            <button className="security-action-button">Change Password</button>
          </div>

          <div className="security-card">
            <div className="security-card-header">
              <FiGlobe className="security-icon" />
              <h3>Active Sessions</h3>
            </div>
            <p>{activeDevices.length} active devices</p>
            <button className="security-action-button">Manage Sessions</button>
          </div>
        </div>
      </div>

      <div className="security-section">
        <h2 className="section-title">
          <FiClock /> Recent Activity
        </h2>

        <div className="activity-list">
          {securityLogs?.map((log) => (
            <div key={log.id} className="activity-item">
              <div className="activity-icon">
                {log.action_type === "LOGIN" && (
                  <FiLogOut className="rotate-180" />
                )}
                {log.action_type === "LOGOUT" && <FiLogOut />}
                {log.action_type === "PASSWORD_CHANGE" && <FiKey />}
              </div>
              <div className="activity-details">
                <h4>{log.action_type.replaceAll("_", " ").toUpperCase()}</h4>
                <p>
                  {new Date(log.timestamp).toLocaleString()} •{" "}
                  {log.location || "Unknown location"}
                </p>
              </div>
              <div className="activity-device">{log.user_agent}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AccountSecurity;
