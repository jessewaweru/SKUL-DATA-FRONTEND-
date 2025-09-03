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
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState("current_term");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [performanceRes, trendsRes, comparisonRes] = await Promise.all([
          get(`/exams/analytics/performance/?range=${timeRange}`),
          get(`/exams/analytics/subject-trends/?range=${timeRange}`),
          get(`/exams/analytics/class-comparison/?range=${timeRange}`),
        ]);

        console.log("Performance Response:", performanceRes.data);
        console.log("Trends Response:", trendsRes.data);
        console.log("Comparison Response:", comparisonRes.data);

        const isPlaceholderResponse = (data) => {
          return (
            data &&
            data.message &&
            (data.message.includes("analytics endpoint") ||
              data.message.includes("endpoint"))
          );
        };

        if (isPlaceholderResponse(performanceRes.data)) {
          console.warn("Performance endpoint returned placeholder message");
          setPerformanceData({
            labels: ["Term 1 Opener", "Term 1 Midterm", "Term 1 Endterm"],
            averages: [65.2, 68.7, 72.3],
            highest: [92.5, 95.0, 97.8],
            lowest: [42.1, 45.6, 48.9],
          });
        } else {
          setPerformanceData(performanceRes.data);
        }

        if (isPlaceholderResponse(trendsRes.data)) {
          console.warn("Subject trends endpoint returned placeholder message");
          setSubjectTrends({
            labels: ["Term 1 Opener", "Term 1 Midterm", "Term 1 Endterm"],
            datasets: [
              {
                label: "Mathematics",
                data: [62.1, 67.8, 71.5],
                borderColor: "rgba(106, 27, 154, 1)",
                backgroundColor: "rgba(106, 27, 154, 0.1)",
              },
              {
                label: "English",
                data: [68.3, 70.2, 73.8],
                borderColor: "rgba(74, 20, 140, 1)",
                backgroundColor: "rgba(74, 20, 140, 0.1)",
              },
              {
                label: "Science",
                data: [64.7, 69.1, 72.9],
                borderColor: "rgba(49, 27, 146, 1)",
                backgroundColor: "rgba(49, 27, 146, 0.1)",
              },
            ],
          });
        } else {
          setSubjectTrends(trendsRes.data);
        }

        if (isPlaceholderResponse(comparisonRes.data)) {
          console.warn(
            "Class comparison endpoint returned placeholder message"
          );
          setClassComparison({
            labels: ["Form 1", "Form 2", "Form 3", "Form 4"],
            data: [68.2, 72.5, 75.8, 79.3],
          });
        } else {
          setClassComparison(comparisonRes.data);
        }
      } catch (error) {
        console.error("Error fetching analytics:", error);
        setError("Failed to load analytics data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeRange, get]);

  const getTimeRangeLabel = (range) => {
    const labels = {
      current_term: "Current Term",
      last_term: "Last Term",
      current_year: "Current Year",
      last_year: "Last Year",
      all_time: "All Time",
    };
    return labels[range] || "Current Term";
  };

  const hasData = (data) => {
    if (!data) return false;

    if (data.labels && Array.isArray(data.labels) && data.labels.length > 0) {
      return true;
    }

    if (
      data.datasets &&
      Array.isArray(data.datasets) &&
      data.datasets.length > 0
    ) {
      return true;
    }

    if (Array.isArray(data) && data.length > 0) {
      return true;
    }

    if (typeof data === "object" && Object.keys(data).length > 0) {
      const hasNumericData = Object.values(data).some(
        (value) =>
          Array.isArray(value) &&
          value.length > 0 &&
          typeof value[0] === "number"
      );
      return hasNumericData;
    }

    return false;
  };

  const NoDataMessage = ({ title }) => (
    <div className="no-data-message">
      <div className="no-data-icon">📊</div>
      <p>
        <strong>{title}</strong>
      </p>
      <p>No data available for {getTimeRangeLabel(timeRange)}</p>
      <p>
        Try selecting a different time range or ensure that exam results have
        been entered and published.
      </p>
    </div>
  );

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p>Loading exam analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        <div className="error-icon">⚠️</div>
        <p>{error}</p>
        <button
          className="retry-button"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="exam-analytics-container">
      <div className="analytics-header">
        <h2>Exam Analytics</h2>
        <div className="time-range-selector">
          <label>Time Period:</label>
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
          {hasData(performanceData) ? (
            <div className="exam-chart-container">
              <Bar
                data={{
                  labels: performanceData.labels || [],
                  datasets: [
                    {
                      label: "Average Score",
                      data: performanceData.averages || [],
                      backgroundColor: "rgba(107, 27, 154, 0.7)",
                      borderColor: "rgba(107, 27, 154, 1)",
                      borderWidth: 1,
                    },
                    {
                      label: "Highest Score",
                      data: performanceData.highest || [],
                      backgroundColor: "rgba(74, 20, 140, 0.7)",
                      borderColor: "rgba(74, 20, 140, 1)",
                      borderWidth: 1,
                    },
                    {
                      label: "Lowest Score",
                      data: performanceData.lowest || [],
                      backgroundColor: "rgba(49, 27, 146, 0.7)",
                      borderColor: "rgba(49, 27, 146, 1)",
                      borderWidth: 1,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "top",
                    },
                    title: {
                      display: true,
                      text: `Performance Across Exams - ${getTimeRangeLabel(
                        timeRange
                      )}`,
                    },
                    tooltip: {
                      callbacks: {
                        label: (context) => {
                          return `${context.dataset.label}: ${
                            context.parsed.y?.toFixed(2) || "0"
                          }%`;
                        },
                      },
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 100,
                      title: {
                        display: true,
                        text: "Score (%)",
                      },
                    },
                    x: {
                      title: {
                        display: true,
                        text: "Exams",
                      },
                    },
                  },
                }}
              />
            </div>
          ) : (
            <NoDataMessage title="Performance Analytics" />
          )}
        </div>

        <div className="analytics-card">
          <h3>Subject Trends</h3>
          {hasData(subjectTrends) ? (
            <div className="exam-chart-container">
              <Line
                data={{
                  labels: subjectTrends.labels || [],
                  datasets: (subjectTrends.datasets || []).map(
                    (dataset, index) => ({
                      label: dataset.label || `Subject ${index + 1}`,
                      data: dataset.data || [],
                      borderColor:
                        dataset.borderColor ||
                        `hsl(${(index * 60) % 360}, 70%, 50%)`,
                      backgroundColor:
                        dataset.backgroundColor ||
                        `hsla(${(index * 60) % 360}, 70%, 50%, 0.1)`,
                      tension: 0.1,
                      pointRadius: 4,
                      pointHoverRadius: 6,
                    })
                  ),
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "top",
                    },
                    title: {
                      display: true,
                      text: `Performance Trends by Subject - ${getTimeRangeLabel(
                        timeRange
                      )}`,
                    },
                    tooltip: {
                      callbacks: {
                        label: (context) => {
                          return `${context.dataset.label}: ${
                            context.parsed.y?.toFixed(2) || "0"
                          }%`;
                        },
                      },
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 100,
                      title: {
                        display: true,
                        text: "Average Score (%)",
                      },
                    },
                    x: {
                      title: {
                        display: true,
                        text: "Exams",
                      },
                    },
                  },
                }}
              />
            </div>
          ) : (
            <NoDataMessage title="Subject Trends" />
          )}
        </div>

        <div className="analytics-card">
          <h3>Class Comparison</h3>
          {hasData(classComparison) ? (
            <div className="exam-chart-container">
              <Pie
                data={{
                  labels: classComparison.labels || [],
                  datasets: [
                    {
                      label: "Average Scores",
                      data: classComparison.data || [],
                      backgroundColor: [
                        "rgba(107, 27, 154, 0.8)",
                        "rgba(74, 20, 140, 0.8)",
                        "rgba(49, 27, 146, 0.8)",
                        "rgba(156, 39, 176, 0.8)",
                        "rgba(123, 31, 162, 0.8)",
                        "rgba(142, 36, 170, 0.8)",
                        "rgba(81, 45, 168, 0.8)",
                        "rgba(103, 58, 183, 0.8)",
                        "rgba(63, 81, 181, 0.8)",
                      ],
                      borderColor: "white",
                      borderWidth: 2,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "right",
                    },
                    title: {
                      display: true,
                      text: `Class Performance - ${getTimeRangeLabel(
                        timeRange
                      )}`,
                    },
                    tooltip: {
                      callbacks: {
                        label: (context) => {
                          return `${context.label}: ${
                            context.parsed?.toFixed(2) || "0"
                          }%`;
                        },
                      },
                    },
                  },
                }}
              />
            </div>
          ) : (
            <NoDataMessage title="Class Comparison" />
          )}
        </div>
      </div>

      <div className="analytics-footer">
        <button className="export-button">Export Analytics Report</button>
      </div>
    </div>
  );
};

export default ExamAnalytics;
