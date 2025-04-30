import { useEffect, useState } from "react";
import api from "../../../../../services/api";
import StudentMetrics from "./StudentMetrics";
import AttendanceChart from "../Charts/AttendanceChart";
import PerformanceTrendChart from "../Charts/PerformanceTrendChart";
import DropoutRateChart from "../Charts/DropoutRateChart";
import "../../Analytics/analytics.css";

const StudentAnalytics = () => {
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  //   const api = useApi();

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setLoading(true);
        const response = await api.get("/analytics/students/");
        setStudentData(response.data);
      } catch (error) {
        console.error("Error fetching student analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, []);

  if (loading) {
    return <div className="loading-spinner">Loading student analytics...</div>;
  }

  return (
    <div className="student-analytics">
      <StudentMetrics
        totalStudents={studentData?.total_students}
        attendanceRate={studentData?.attendance?.average}
        dropoutRate={studentData?.dropouts?.rate}
        documentAccess={studentData?.document_access?.count}
      />

      <div className="student-charts-grid">
        <div className="chart-container">
          <h3>Attendance by Class</h3>
          <AttendanceChart data={studentData?.attendance?.by_class} />
        </div>
        <div className="chart-container">
          <h3>Performance Trends</h3>
          <PerformanceTrendChart data={studentData?.performance?.trends} />
        </div>
        <div className="chart-container">
          <h3>Dropout Rates</h3>
          <DropoutRateChart data={studentData?.dropouts?.trends} />
        </div>
        <div className="chart-container">
          <h3>Document Access</h3>
          <DocumentUsageChart data={studentData?.document_access?.types} />
        </div>
      </div>
    </div>
  );
};

export default StudentAnalytics;
