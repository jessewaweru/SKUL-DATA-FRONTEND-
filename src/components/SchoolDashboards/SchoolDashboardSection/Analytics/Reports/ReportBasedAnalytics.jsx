import { useEffect, useState } from "react";
import api from "../../../../../services/api";
import ReportMetrics from "./ReportMetrics";
import ReportTypeChart from "../Charts/ReportTypeChart";
import ReportGenerationChart from "../Charts/ReportGenerationChart";
import ParentAccessChart from "../Charts/ParentAccessChart";
import "../../Analytics/analytics.css";

const ReportBasedAnalytics = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  //   const api = useApi();

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        setLoading(true);
        const response = await api.get("/analytics/reports/");
        setReportData(response.data);
      } catch (error) {
        console.error("Error fetching report analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, []);

  if (loading) {
    return <div className="loading-spinner">Loading report analytics...</div>;
  }

  return (
    <div className="report-analytics">
      <ReportMetrics
        reportsGenerated={reportData?.reports_generated?.total}
        mostAccessed={reportData?.most_accessed?.type}
        missingReports={reportData?.missing_reports?.count}
      />

      <div className="report-charts-grid">
        <div className="chart-container">
          <h3>Report Types</h3>
          <ReportTypeChart data={reportData?.reports_generated?.by_type} />
        </div>
        <div className="chart-container">
          <h3>Generation Timeline</h3>
          <ReportGenerationChart
            data={reportData?.reports_generated?.timeline}
          />
        </div>
        <div className="chart-container">
          <h3>Parent Access</h3>
          <ParentAccessChart data={reportData?.parent_views} />
        </div>
        <div className="chart-container">
          <h3>Top Students</h3>
          <TopStudentsChart data={reportData?.top_students} />
        </div>
      </div>
    </div>
  );
};

export default ReportBasedAnalytics;
