import { useEffect, useState } from "react";
import api from "../../../../../services/api";
import ClassMetrics from "./ClassMetrics";
import ClassSizeChart from "../Charts/ClassSizeChart";
import ClassPerformanceChart from "../Charts/ClassPerformanceChart";
import AttendanceByClassChart from "../Charts/AttendanceByClassChart";
import "../../Analytics/analytics.css";

const ClassAnalytics = () => {
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  //   const api = useApi();

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        setLoading(true);
        const response = await api.get("/analytics/classes/");
        setClassData(response.data);
      } catch (error) {
        console.error("Error fetching class analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClassData();
  }, []);

  if (loading) {
    return <div className="loading-spinner">Loading class analytics...</div>;
  }

  return (
    <div className="class-analytics">
      <ClassMetrics
        totalClasses={classData?.class_sizes?.length}
        avgClassSize={classData?.class_sizes?.average}
        topPerformingClass={classData?.average_grades?.top_class}
      />

      <div className="class-charts-grid">
        <div className="chart-container">
          <h3>Class Sizes</h3>
          <ClassSizeChart data={classData?.class_sizes?.details} />
        </div>
        <div className="chart-container">
          <h3>Class Performance</h3>
          <ClassPerformanceChart data={classData?.average_grades?.details} />
        </div>
        <div className="chart-container">
          <h3>Attendance by Class</h3>
          <AttendanceByClassChart data={classData?.attendance_rates} />
        </div>
        <div className="chart-container">
          <h3>Teacher Ratios</h3>
          <TeacherRatioChart data={classData?.teacher_ratios} />
        </div>
      </div>
    </div>
  );
};

export default ClassAnalytics;
