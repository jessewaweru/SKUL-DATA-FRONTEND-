import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../../../../hooks/useApi";
import {
  FiUsers,
  FiBarChart2,
  FiPlus,
  FiUser,
  FiBook,
  FiCalendar,
} from "react-icons/fi";
import StatCard from "../../../common/StatCard/StatCard";
import "../Students/students.css";

const StudentsOverview = () => {
  const api = useApi();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/students/analytics/");
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching student stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div className="loading">Loading student data...</div>;

  return (
    <div className="students-overview">
      <div className="overview-header">
        <h2>
          <FiUsers /> Students Overview
        </h2>
        <div className="header-actions">
          <button
            onClick={() => navigate("/dashboard/students/create")}
            className="primary-btn"
          >
            <FiPlus /> Add New Student
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard
          icon={<FiUsers size={24} />}
          title="Total Students"
          value={stats?.total_students || 0}
          trend="up"
          trendValue="5%"
          onClick={() => navigate("/dashboard/students/directory")}
        />
        <StatCard
          icon={<FiUser size={24} />}
          title="Active Students"
          value={
            stats?.students_by_status?.find((s) => s.status === "ACTIVE")
              ?.count || 0
          }
          trend="up"
          trendValue="3%"
        />
        <StatCard
          icon={<FiBook size={24} />}
          title="Top Performers"
          value={
            stats?.performance_distribution?.find(
              (p) => p.performance_tier === "A"
            )?.count || 0
          }
          trend="neutral"
        />
        <StatCard
          icon={<FiCalendar size={24} />}
          title="Avg Attendance"
          value="92%"
          trend="down"
          trendValue="2%"
        />
      </div>

      <div className="overview-sections">
        <div className="section recent-students">
          <div className="section-header">
            <h3>
              <FiUser /> Recently Added Students
            </h3>
            <button
              onClick={() => navigate("/dashboard/students/directory")}
              className="text-btn"
            >
              View All
            </button>
          </div>
          {/* Placeholder for recent students table */}
          <div className="placeholder-content">
            <p>Recent students list will appear here</p>
          </div>
        </div>

        <div className="section quick-actions">
          <div className="section-header">
            <h3>
              <FiUsers /> Quick Actions
            </h3>
          </div>
          <div className="action-buttons">
            <button
              onClick={() => navigate("/dashboard/students/create")}
              className="action-btn"
            >
              <FiPlus /> Add Student
            </button>
            <button
              onClick={() => navigate("/dashboard/students/analytics")}
              className="action-btn"
            >
              <FiBarChart2 /> View Analytics
            </button>
            <button
              onClick={() => navigate("/dashboard/students/directory")}
              className="action-btn"
            >
              <FiUsers /> Browse Directory
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentsOverview;
