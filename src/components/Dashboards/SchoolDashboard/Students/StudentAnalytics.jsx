// components/SchoolDashboard/Students/StudentAnalytics.jsx
import { useState, useEffect } from "react";
import { useApi } from "../../../../hooks/useApi";
import { FiBarChart2, FiUsers, FiBook } from "react-icons/fi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "../Students/students.css";

const StudentAnalytics = () => {
  const api = useApi();
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await api.get("/students/analytics/");
        setAnalyticsData(response.data);
      } catch (err) {
        setError("Failed to load analytics data");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) return <div className="loading">Loading analytics...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="student-analytics">
      <div className="analytics-header">
        <h2>
          <FiBarChart2 /> Student Analytics
        </h2>
      </div>

      <div className="analytics-grid">
        <div className="analytics-card">
          <div className="card-header">
            <FiUsers />
            <h3>Total Students</h3>
          </div>
          <div className="card-value">{analyticsData.total_students}</div>
        </div>

        <div className="analytics-card">
          <div className="card-header">
            <FiUsers />
            <h3>Students by Class</h3>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData.students_by_class}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="student_class__name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" name="Students" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="analytics-card">
          <div className="card-header">
            <FiUsers />
            <h3>Gender Distribution</h3>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData.gender_distribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="gender" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#82ca9d" name="Students" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="analytics-card">
          <div className="card-header">
            <FiBook />
            <h3>Performance Distribution</h3>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData.performance_distribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="performance_tier" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#ffc658" name="Students" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentAnalytics;
