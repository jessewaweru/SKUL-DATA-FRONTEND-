import { useEffect, useState } from "react";
import { useApi } from "../../../../hooks/useApi";
import { FiUser, FiTrendingUp, FiTrendingDown } from "react-icons/fi";
import "../Classes/classes.css";

const StudentPerformanceTable = ({ students, classId }) => {
  const [performanceData, setPerformanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({
    key: "average_score",
    direction: "desc",
  });
  const api = useApi();

  useEffect(() => {
    const fetchPerformanceData = async () => {
      try {
        const response = await api.get(
          `/classes/${classId}/student-performance/`
        );
        setPerformanceData(response.data);
      } catch (error) {
        console.error("Error fetching performance data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPerformanceData();
  }, [classId]);

  const sortedData = [...performanceData].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  if (loading) return <div>Loading student performance data...</div>;

  return (
    <div className="student-performance-table">
      <table>
        <thead>
          <tr>
            <th onClick={() => requestSort("student_name")}>
              Student
              {sortConfig.key === "student_name" && (
                <span>{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
              )}
            </th>
            <th onClick={() => requestSort("average_score")}>
              Average Score
              {sortConfig.key === "average_score" && (
                <span>{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
              )}
            </th>
            <th onClick={() => requestSort("attendance_rate")}>
              Attendance
              {sortConfig.key === "attendance_rate" && (
                <span>{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
              )}
            </th>
            <th>Trend</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((student) => (
            <tr key={student.student_id}>
              <td>
                <div className="student-info">
                  <div className="student-avatar">
                    <FiUser />
                  </div>
                  <div>
                    <div className="student-name">{student.student_name}</div>
                    <div className="student-id">ID: {student.student_id}</div>
                  </div>
                </div>
              </td>
              <td>
                <div className="score-cell">
                  {student.average_score?.toFixed(1) || "N/A"}
                  {student.average_score && (
                    <div className="score-bar">
                      <div
                        className="score-fill"
                        style={{ width: `${student.average_score}%` }}
                      />
                    </div>
                  )}
                </div>
              </td>
              <td>{student.attendance_rate?.toFixed(1)}%</td>
              <td>
                {student.trend === "up" ? (
                  <FiTrendingUp className="trend-up" />
                ) : student.trend === "down" ? (
                  <FiTrendingDown className="trend-down" />
                ) : (
                  <span className="trend-neutral">-</span>
                )}
              </td>
              <td>
                <button
                  className="view-btn"
                  onClick={() => {
                    /* Navigate to student profile */
                  }}
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentPerformanceTable;
