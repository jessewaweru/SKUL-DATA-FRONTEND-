import { useEffect, useState } from "react";
import api from "../../../../services/api";
import SchoolMetrics from "./SchoolMetrics";
import UserGrowthChart from "./Charts/UserGrowthChart";
import EngagementRateChart from "./Charts/EngagementRateChart";
import ReportGenerationRateChart from "./Charts/ReportGenerationRateChart";
import "../Analytics/analytics.css";

const SchoolWideAnalytics = () => {
  const [schoolData, setSchoolData] = useState(null);
  const [loading, setLoading] = useState(true);
  //   const api = useApi();

  useEffect(() => {
    const fetchSchoolData = async () => {
      try {
        setLoading(true);
        const response = await api.get("/analytics/school_wide/");
        setSchoolData(response.data);
      } catch (error) {
        console.error("Error fetching school-wide analytics:", error);
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

  return (
    <div className="school-wide-analytics">
      <SchoolMetrics
        activeUsers={schoolData?.active_users?.total}
        engagementRate={schoolData?.engagement?.rate}
        reportGenerationRate={schoolData?.report_generation?.rate}
      />

      <div className="school-charts-grid">
        <div className="chart-container">
          <h3>User Growth</h3>
          <UserGrowthChart data={schoolData?.growth} />
        </div>
        <div className="chart-container">
          <h3>Engagement Rate</h3>
          <EngagementRateChart data={schoolData?.engagement?.trends} />
        </div>
        <div className="chart-container">
          <h3>Report Generation</h3>
          <ReportGenerationRateChart
            data={schoolData?.report_generation?.timeline}
          />
        </div>
        <div className="chart-container">
          <h3>Teacher Ratios</h3>
          <TeacherRatioChart data={schoolData?.teacher_ratios} />
        </div>
      </div>
    </div>
  );
};

export default SchoolWideAnalytics;
