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
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Add required date parameters
        const params = new URLSearchParams({
          date_range: "last_30_days", // or you can use start_date and end_date
        });

        const response = await api.get(`/analytics/reports/?${params}`);
        console.log("Report Analytics Data:", response.data); // Debug log
        setReportData(response.data);
      } catch (error) {
        console.error("Error fetching report analytics:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, []);

  // Move the transformation logic here, before any conditional returns
  const transformedData = reportData
    ? {
        // Total reports generated (sum of all counts)
        totalReports:
          reportData?.reports_generated?.reduce(
            (sum, item) => sum + item.count,
            0
          ) || 0,

        // Most accessed report type
        mostAccessed:
          reportData?.most_accessed?.[0]?.report__report_type__name || "N/A",

        // Missing reports count
        missingReports: reportData?.missing_reports?.length || 0,

        // Transform reports_generated for ReportTypeChart (expects: [{type, count}])
        reportTypes:
          reportData?.reports_generated?.map((item) => ({
            type: item.report_type__name,
            count: item.count,
          })) || [],

        // Transform parent_views for ParentAccessChart (expects: [{report, views}])
        parentViews:
          reportData?.parent_views?.map((item) => ({
            report: item.action,
            views: item.count,
          })) || [],
      }
    : null;

  console.log("Transformed Data:", transformedData); // Debug log - now this is after initialization

  if (loading) {
    return <div className="loading-spinner">Loading report analytics...</div>;
  }

  if (error) {
    return (
      <div className="error-message">
        <p>Error loading report analytics: {error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  if (!reportData || !transformedData) {
    return <div className="no-data">No report analytics data available</div>;
  }

  return (
    <div className="report-analytics">
      <ReportMetrics
        reportsGenerated={transformedData.totalReports}
        mostAccessed={transformedData.mostAccessed}
        missingReports={transformedData.missingReports}
      />

      <div className="report-charts-grid">
        <div className="chart-container">
          <h3>Report Types</h3>
          <ReportTypeChart data={transformedData.reportTypes} />
        </div>
        <div className="chart-container">
          <h3>Most Accessed Reports</h3>
          <ReportTypeChart
            data={
              reportData?.most_accessed?.map((item) => ({
                type: item.report__report_type__name,
                count: item.access_count,
              })) || []
            }
          />
        </div>
        <div className="chart-container">
          <h3>Parent Actions</h3>
          <ParentAccessChart data={transformedData.parentViews} />
        </div>
        {/* Note: Generation Timeline requires time-series data which isn't available in current response
        <div className="chart-container">
          <h3>Generation Timeline</h3>
          <ReportGenerationChart
            data={reportData?.reports_generated?.timeline || []}
          />
        </div> */}
      </div>
    </div>
  );
};

export default ReportBasedAnalytics;
