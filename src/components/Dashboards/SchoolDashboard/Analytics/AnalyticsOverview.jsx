import { useEffect, useState } from "react";
import api from "../../../../services/api";
import MetricCard from "./MetricCard";
import TopTeachersChart from "./charts/TopTeachersChart";
import AttendanceTrendChart from "./charts/AttendanceTrendChart";
import DocumentUsageChart from "./charts/DocumentUsageChart";
import ClassPerformanceChart from "./charts/ClassPerformanceChart";
import "../Analytics/analytics.css";

const AnalyticsOverview = () => {
  const [overviewData, setOverviewData] = useState(null);
  const [loading, setLoading] = useState(true);
  //   const api = useApi();

  useEffect(() => {
    const fetchOverviewData = async () => {
      try {
        setLoading(true);
        const response = await api.get("/analytics/overview/");
        setOverviewData(response.data);
      } catch (error) {
        console.error("Error fetching analytics overview:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOverviewData();
  }, []);

  if (loading) {
    return <div className="loading-spinner">Loading analytics...</div>;
  }

  return (
    <div className="analytics-overview">
      <div className="top-metrics-grid">
        <MetricCard
          title="Most Active Teacher"
          value={overviewData?.most_active_teacher?.name || "N/A"}
          change={overviewData?.most_active_teacher?.login_count || 0}
          icon="teacher"
          trend="up"
        />
        <MetricCard
          title="Student Attendance"
          value={`${overviewData?.student_attendance_rate?.toFixed(1) || 0}%`}
          change={2.5} // Example change percentage
          icon="attendance"
          trend="up"
        />
        <MetricCard
          title="Top Document"
          value={overviewData?.most_downloaded_document?.title || "N/A"}
          change={overviewData?.most_downloaded_document?.download_count || 0}
          icon="document"
          trend="up"
        />
        <MetricCard
          title="Top Performing Class"
          value={overviewData?.top_performing_class?.class_name || "N/A"}
          change={overviewData?.top_performing_class?.average_score || 0}
          icon="class"
          trend="up"
        />
        <MetricCard
          title="Reports Generated"
          value={overviewData?.reports_generated || 0}
          change={15} // Example change percentage
          icon="report"
          trend="up"
        />
      </div>

      <div className="analytics-charts-grid">
        <div className="chart-container">
          <h3>Top Teachers by Activity</h3>
          <TopTeachersChart data={overviewData?.teacher_activity || []} />
        </div>
        <div className="chart-container">
          <h3>Attendance Trend</h3>
          <AttendanceTrendChart data={overviewData?.attendance_trend || []} />
        </div>
        <div className="chart-container">
          <h3>Document Usage</h3>
          <DocumentUsageChart data={overviewData?.document_usage || []} />
        </div>
        <div className="chart-container">
          <h3>Class Performance</h3>
          <ClassPerformanceChart data={overviewData?.class_performance || []} />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsOverview;
