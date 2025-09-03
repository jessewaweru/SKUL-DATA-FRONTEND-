import { useEffect, useState } from "react";
import api from "../../../../services/api";
import SchoolMetrics from "./SchoolMetrics";
import UserGrowthChart from "./Charts/UserGrowthChart";
import EngagementRateChart from "./Charts/EngagementRateChart";
import ReportGenerationRateChart from "./Charts/ReportGenerationRateChart";
import TeacherRatioChart from "./Charts/TeacherRatioChart";
import "../Analytics/analytics.css";

const SchoolWideAnalytics = () => {
  const [schoolData, setSchoolData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSchoolData = async () => {
      try {
        setLoading(true);
        setError(null);
        // Fixed URL: using hyphen instead of underscore
        const response = await api.get("/analytics/school-wide/");
        console.log("School-wide analytics response:", response.data);
        setSchoolData(response.data);
      } catch (error) {
        console.error("Error fetching school-wide analytics:", error);
        setError(error.message || "Failed to fetch analytics data");
      } finally {
        setLoading(false);
      }
    };

    fetchSchoolData();
  }, []);

  if (loading) {
    return (
      <div className="loading-spinner">Loading school-wide analytics...</div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        <p>Error loading analytics: {error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  if (!schoolData) {
    return (
      <div className="no-data-message">
        No analytics data available at the moment.
      </div>
    );
  }

  // Transform the backend data to match chart expectations
  const transformDataForCharts = () => {
    if (!schoolData) return null;

    // Transform active_users data for UserGrowthChart
    const userGrowthData = schoolData.active_users
      ? [
          {
            month: "Current",
            teachers: schoolData.active_users.teachers || 0,
            students: 0, // Backend doesn't provide students in active_users
            parents: schoolData.active_users.parents || 0,
            admins: schoolData.active_users.admins || 0,
          },
        ]
      : [];

    // Transform engagement data for EngagementRateChart
    const engagementData = schoolData.engagement
      ? [
          {
            week: "Current",
            engagement:
              ((schoolData.engagement.documents || 0) +
                (schoolData.engagement.reports || 0)) /
              2,
          },
        ]
      : [];

    // Transform report_generation data for ReportGenerationRateChart
    const reportGenerationData = schoolData.report_generation
      ? schoolData.report_generation.map((report, index) => ({
          month: report.report_type__name.substring(0, 10), // Shortened name
          rate: report.on_time_rate || 0,
        }))
      : [];

    return {
      userGrowthData,
      engagementData,
      reportGenerationData,
    };
  };

  const chartData = transformDataForCharts();

  // Calculate metrics from the actual data structure
  const totalActiveUsers = schoolData?.active_users
    ? (schoolData.active_users.admins || 0) +
      (schoolData.active_users.parents || 0) +
      (schoolData.active_users.teachers || 0)
    : 0;

  const engagementRate = schoolData?.engagement
    ? ((schoolData.engagement.documents || 0) +
        (schoolData.engagement.reports || 0)) /
      2
    : 0;

  const averageReportRate = schoolData?.report_generation
    ? schoolData.report_generation.reduce(
        (sum, report) => sum + (report.on_time_rate || 0),
        0
      ) / schoolData.report_generation.length
    : 0;

  return (
    <div className="school-wide-analytics">
      <SchoolMetrics
        activeUsers={totalActiveUsers}
        engagementRate={engagementRate}
        reportGenerationRate={averageReportRate}
      />

      <div className="school-charts-grid">
        <div className="chart-container">
          <h3>Active Users Breakdown</h3>
          {chartData?.userGrowthData?.length > 0 ? (
            <UserGrowthChart data={chartData.userGrowthData} />
          ) : (
            <div className="no-chart-data">
              <p>Active Users: {totalActiveUsers}</p>
              <ul>
                <li>Admins: {schoolData?.active_users?.admins || 0}</li>
                <li>Teachers: {schoolData?.active_users?.teachers || 0}</li>
                <li>Parents: {schoolData?.active_users?.parents || 0}</li>
              </ul>
            </div>
          )}
        </div>

        <div className="chart-container">
          <h3>Engagement Overview</h3>
          {schoolData?.engagement ? (
            <div className="engagement-summary">
              <div className="engagement-metric">
                <h4>Document Interactions</h4>
                <p>{schoolData.engagement.documents || 0}</p>
              </div>
              <div className="engagement-metric">
                <h4>Report Interactions</h4>
                <p>{schoolData.engagement.reports || 0}</p>
              </div>
            </div>
          ) : (
            <div className="no-chart-data">No engagement data available</div>
          )}
        </div>

        <div className="chart-container">
          <h3>Report Generation Status</h3>
          {schoolData?.report_generation &&
          Array.isArray(schoolData.report_generation) ? (
            <div className="report-generation-summary">
              {schoolData.report_generation.map((report, index) => (
                <div key={index} className="report-metric">
                  <h4>{report.report_type__name}</h4>
                  <div className="report-stats">
                    <span>Total: {report.total}</span>
                    <span>On Time: {report.on_time_count}</span>
                    <span>Rate: {report.on_time_rate.toFixed(1)}%</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-chart-data">
              No report generation data available
            </div>
          )}
        </div>

        <div className="chart-container">
          <h3>Teacher-Student Ratios</h3>
          {schoolData?.teacher_ratios &&
          Array.isArray(schoolData.teacher_ratios) ? (
            <TeacherRatioChart data={schoolData.teacher_ratios} />
          ) : (
            <div className="no-chart-data">No teacher ratio data available</div>
          )}
        </div>
      </div>

      {schoolData?.growth && (
        <div className="growth-overview">
          <h3>School Growth Statistics</h3>
          <div className="growth-metrics">
            <div className="growth-metric">
              <h4>New Students</h4>
              <p>{schoolData.growth.new_students || 0}</p>
            </div>
            <div className="growth-metric">
              <h4>New Teachers</h4>
              <p>{schoolData.growth.new_teachers || 0}</p>
            </div>
            <div className="growth-metric">
              <h4>New Parents</h4>
              <p>{schoolData.growth.new_parents || 0}</p>
            </div>
            <div className="growth-metric">
              <h4>New Classes</h4>
              <p>{schoolData.growth.new_classes || 0}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchoolWideAnalytics;
