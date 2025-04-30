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
  //   const api = useApi();

  useEffect(() => {
    const fetchParentData = async () => {
      try {
        setLoading(true);
        const response = await api.get("/analytics/parents/");
        setParentData(response.data);
      } catch (error) {
        console.error("Error fetching parent analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchParentData();
  }, []);

  if (loading) {
    return <div className="loading-spinner">Loading parent analytics...</div>;
  }

  return (
    <div className="parent-analytics">
      <ParentMetrics
        totalParents={parentData?.students_per_parent?.total}
        avgStudentsPerParent={parentData?.students_per_parent?.average}
        mostEngaged={parentData?.most_engaged?.name}
      />

      <div className="parent-charts-grid">
        <div className="chart-container">
          <h3>Engagement Levels</h3>
          <ParentEngagementChart data={parentData?.most_engaged?.details} />
        </div>
        <div className="chart-container">
          <h3>Feedback Sent</h3>
          <FeedbackChart data={parentData?.feedback} />
        </div>
        <div className="chart-container">
          <h3>Login Trends</h3>
          <LoginTrendsChart data={parentData?.login_trends} />
        </div>
        <div className="chart-container">
          <h3>Report Views</h3>
          <ReportViewsChart data={parentData?.report_views} />
        </div>
      </div>
    </div>
  );
};

export default ParentAnalytics;
