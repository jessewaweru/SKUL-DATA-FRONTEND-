import { useState, useEffect } from "react";
import { useApi } from "../../../../hooks/useApi";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const ExamAnalytics = () => {
  const { get } = useApi();
  const [performanceData, setPerformanceData] = useState(null);
  const [subjectTrends, setSubjectTrends] = useState(null);
  const [classComparison, setClassComparison] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("current_term");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [performanceRes, trendsRes, comparisonRes] = await Promise.all([
          get(`/exams/analytics/performance/?range=${timeRange}`),
          get(`/exams/analytics/subject-trends/?range=${timeRange}`),
          get(`/exams/analytics/class-comparison/?range=${timeRange}`),
        ]);

        setPerformanceData(performanceRes.data);
        setSubjectTrends(trendsRes.data);
        setClassComparison(comparisonRes.data);
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [timeRange]);

  if (loading) return <div className="loading-spinner">Loading...</div>;

  return (
    <div className="exam-analytics-container">
      <div className="analytics-header">
        <h2>Exam Analytics</h2>
        <div className="time-range-selector">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="current_term">Current Term</option>
            <option value="last_term">Last Term</option>
            <option value="current_year">Current Year</option>
            <option value="last_year">Last Year</option>
            <option value="all_time">All Time</option>
          </select>
        </div>
      </div>

      <div className="analytics-grid">
        <div className="analytics-card">
          <h3>Overall Performance</h3>
          <Bar
            data={{
              labels: performanceData?.labels || [],
              datasets: [
                {
                  label: "Average Score",
                  data: performanceData?.averages || [],
                  backgroundColor: "rgba(106, 27, 154, 0.7)",
                },
                {
                  label: "Highest Score",
                  data: performanceData?.highest || [],
                  backgroundColor: "rgba(74, 20, 140, 0.7)",
                },
                {
                  label: "Lowest Score",
                  data: performanceData?.lowest || [],
                  backgroundColor: "rgba(49, 27, 146, 0.7)",
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: "top",
                },
                title: {
                  display: true,
                  text: "Performance Across Exams",
                },
              },
            }}
          />
        </div>

        <div className="analytics-card">
          <h3>Subject Trends</h3>
          <Line
            data={{
              labels: subjectTrends?.labels || [],
              datasets:
                subjectTrends?.datasets?.map((dataset) => ({
                  label: dataset.label,
                  data: dataset.data,
                  borderColor: `hsl(${Math.random() * 360}, 70%, 50%)`,
                  backgroundColor: `hsla(${
                    Math.random() * 360
                  }, 70%, 50%, 0.1)`,
                  tension: 0.1,
                })) || [],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: "top",
                },
                title: {
                  display: true,
                  text: "Performance Trends by Subject",
                },
              },
            }}
          />
        </div>

        <div className="analytics-card">
          <h3>Class Comparison</h3>
          <Pie
            data={{
              labels: classComparison?.labels || [],
              datasets: [
                {
                  label: "Average Scores",
                  data: classComparison?.data || [],
                  backgroundColor: [
                    "rgba(106, 27, 154, 0.7)",
                    "rgba(74, 20, 140, 0.7)",
                    "rgba(49, 27, 146, 0.7)",
                    "rgba(156, 39, 176, 0.7)",
                    "rgba(123, 31, 162, 0.7)",
                  ],
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: "top",
                },
                title: {
                  display: true,
                  text: "Class Performance Comparison",
                },
              },
            }}
          />
        </div>
      </div>

      <div className="analytics-export">
        <button className="btn-primary">Export Analytics Report</button>
      </div>
    </div>
  );
};

export default ExamAnalytics;
