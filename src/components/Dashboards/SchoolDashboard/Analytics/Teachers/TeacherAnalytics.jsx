import { useEffect, useState } from "react";
import api from "../../../../../services/api";
import TeacherMetrics from "./TeacherMetrics";
import TeacherActivityChart from "../Charts/TeacherActivityChart";
import ReportSubmissionChart from "../Charts/ReportSubmissionChart";
import ResponseTimeChart from "../Charts/ResponseTimeChart";
import "../../Analytics/analytics.css";

const TeacherAnalytics = () => {
  const [teacherData, setTeacherData] = useState(null);
  const [loading, setLoading] = useState(true);
  //   const api = useApi();

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        setLoading(true);
        const response = await api.get("/analytics/teachers/");
        setTeacherData(response.data);
      } catch (error) {
        console.error("Error fetching teacher analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherData();
  }, []);

  if (loading) {
    return <div className="loading-spinner">Loading teacher analytics...</div>;
  }

  return (
    <div className="teacher-analytics">
      <TeacherMetrics
        totalTeachers={teacherData?.total_teachers}
        averageLogins={teacherData?.logins?.average}
        reportAccuracy={teacherData?.attendance_accuracy?.average}
      />

      <div className="teacher-charts-grid">
        <div className="chart-container">
          <h3>Teacher Activity</h3>
          <TeacherActivityChart data={teacherData?.logins?.details} />
        </div>
        <div className="chart-container">
          <h3>Report Submissions</h3>
          <ReportSubmissionChart data={teacherData?.reports_per_teacher} />
        </div>
        <div className="chart-container">
          <h3>Response Times</h3>
          <ResponseTimeChart data={teacherData?.response_times} />
        </div>
      </div>
    </div>
  );
};

export default TeacherAnalytics;
