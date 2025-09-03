import { useEffect, useState } from "react";
import api from "../../../../../services/api";
import ParentMetrics from "./ParentMetrics";
import ParentEngagementChart from "../Charts/ParentEngagementChart";
import FeedbackChart from "../Charts/FeedbackChart";
import LoginTrendsChart from "../Charts/LoginTrendsChart";
import "../../Analytics/analytics.css";

const ParentAnalytics = () => {
  const [parentData, setParentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchParentData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Add required query parameters to satisfy the serializer validation
        const params = new URLSearchParams({
          date_range: "last_30_days", // or you can use start_date and end_date
        });

        const response = await api.get(`/analytics/parents/?${params}`);
        console.log("Parent analytics data received:", response.data);
        console.log("Most engaged parent:", response.data?.most_engaged?.[0]);
        console.log(
          "Students per parent:",
          response.data?.students_per_parent?.[0]
        );
        console.log("Login trends:", response.data?.login_trends);
        setParentData(response.data);
      } catch (error) {
        console.error("Error fetching parent analytics:", error);
        setError(
          error.response?.data?.message || "Failed to fetch parent analytics"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchParentData();
  }, []);

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p>Loading parent analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        <h3>Error loading parent analytics</h3>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  if (!parentData) {
    return (
      <div className="no-data">
        <h3>No parent data available</h3>
        <p>There is no parent analytics data to display at this time.</p>
      </div>
    );
  }

  return (
    <div className="parent-analytics">
      <div className="analytics-header">
        <h2>Parent Analytics</h2>
        <p>Overview of parent engagement and activities</p>
      </div>

      <ParentMetrics
        totalParents={parentData?.students_per_parent?.[0]?.parent_count}
        avgStudentsPerParent={
          parentData?.students_per_parent?.[0]
            ? parentData.students_per_parent[0].child_count /
              parentData.students_per_parent[0].parent_count
            : null
        }
        mostEngaged={
          parentData?.most_engaged?.[0]
            ? `${parentData.most_engaged[0].user__first_name} ${parentData.most_engaged[0].user__last_name}`
            : null
        }
      />

      <div className="parent-charts-grid">
        <div className="chart-container">
          <h3>Parent Engagement Levels</h3>
          {parentData?.most_engaged && parentData.most_engaged.length > 0 ? (
            <ParentEngagementChart
              data={parentData.most_engaged.map((parent) => ({
                name: `${parent.user__first_name} ${parent.user__last_name}`,
                activity: parent.activity_score,
                logins: parent.login_count,
                notifications: parent.notification_count,
              }))}
            />
          ) : (
            <div className="no-chart-data">
              <p>No engagement data available</p>
            </div>
          )}
        </div>

        <div className="chart-container">
          <h3>Parent Feedback</h3>
          {parentData?.feedback && parentData.feedback.length > 0 ? (
            <FeedbackChart data={parentData.feedback} />
          ) : (
            <div className="no-chart-data">
              <p>No feedback data available</p>
            </div>
          )}
        </div>

        <div className="chart-container">
          <h3>Login Trends</h3>
          {parentData?.login_trends && parentData.login_trends.length > 0 ? (
            <LoginTrendsChart
              data={parentData.login_trends.map((trend) => ({
                date: trend.login_date,
                logins: trend.login_count,
              }))}
            />
          ) : (
            <div className="no-chart-data">
              <p>No login trend data available</p>
            </div>
          )}
        </div>

        {parentData?.report_views && parentData.report_views.length > 0 && (
          <div className="chart-container">
            <h3>Report Views</h3>
            <div className="report-views-summary">
              {parentData.report_views.map((view, index) => (
                <div key={index} className="stat-item">
                  <span className="label">{view.action}:</span>
                  <span className="value">{view.count}</span>
                </div>
              ))}
              <div className="stat-item total">
                <span className="label">Total Actions:</span>
                <span className="value">
                  {parentData.report_views.reduce(
                    (acc, curr) => acc + curr.count,
                    0
                  )}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Additional insights section */}
      <div className="analytics-insights">
        <h3>Key Insights</h3>
        <div className="insights-grid">
          <div className="insight-card">
            <h4>Parent Participation</h4>
            <p>
              {parentData?.students_per_parent?.[0]?.parent_count || 0} parents
              are registered, with an average of{" "}
              {parentData?.students_per_parent?.[0]
                ? (
                    parentData.students_per_parent[0].child_count /
                    parentData.students_per_parent[0].parent_count
                  ).toFixed(1)
                : "0.0"}{" "}
              students per parent.
            </p>
          </div>

          {parentData?.most_engaged?.[0] && (
            <div className="insight-card">
              <h4>Most Active Parent</h4>
              <p>
                <strong>
                  {parentData.most_engaged[0].user__first_name}{" "}
                  {parentData.most_engaged[0].user__last_name}
                </strong>{" "}
                is the most engaged parent with{" "}
                {parentData.most_engaged[0].activity_score} activity points and{" "}
                {parentData.most_engaged[0].notification_count} notifications.
              </p>
            </div>
          )}

          <div className="insight-card">
            <h4>Communication & Engagement</h4>
            <p>
              Total report actions:{" "}
              {parentData?.report_views?.reduce(
                (acc, curr) => acc + curr.count,
                0
              ) || 0}
              (
              {parentData?.report_views?.find(
                (item) => item.action === "VIEWED"
              )?.count || 0}{" "}
              views,
              {parentData?.report_views?.find(
                (item) => item.action === "SHARED"
              )?.count || 0}{" "}
              shares,
              {parentData?.report_views?.find(
                (item) => item.action === "DOWNLOADED"
              )?.count || 0}{" "}
              downloads). Recent login activity shows{" "}
              {parentData?.login_trends?.reduce(
                (acc, curr) => acc + curr.login_count,
                0
              ) || 0}{" "}
              total logins.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentAnalytics;
