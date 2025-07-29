import { useEffect, useState } from "react";
import { useApi } from "../../../../hooks/useApi";
import ExamStatsCard from "../../../common/ExamManagement/ExamStatsCard";

const ExamsDashboard = () => {
  const { get } = useApi();
  const [stats, setStats] = useState({
    upcomingExams: 0,
    examsInProgress: 0,
    marksEntered: 0,
    resultsPublished: 0,
  });
  const [recentExams, setRecentExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, examsRes] = await Promise.all([
          get("/exams/stats/"),
          get("/exams/recent/"),
        ]);

        setStats(statsRes.data);
        setRecentExams(examsRes.data);
      } catch (error) {
        console.error("Error fetching exam data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="loading-spinner">Loading...</div>;

  return (
    <div className="exams-dashboard">
      <h2>Exam Management Dashboard</h2>

      <div className="stats-grid">
        <ExamStatsCard
          title="Upcoming Exams"
          value={stats.upcomingExams}
          icon="calendar"
        />
        <ExamStatsCard
          title="Exams In Progress"
          value={stats.examsInProgress}
          icon="clock"
        />
        <ExamStatsCard
          title="Marks Entered"
          value={stats.marksEntered}
          icon="check"
        />
        <ExamStatsCard
          title="Results Published"
          value={stats.resultsPublished}
          icon="publish"
        />
      </div>

      <div className="recent-exams-section">
        <h3>Recent Exams</h3>
        <div className="exams-table">
          <table>
            <thead>
              <tr>
                <th>Exam Name</th>
                <th>Type</th>
                <th>Class</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentExams.map((exam) => (
                <tr key={exam.id}>
                  <td>{exam.name}</td>
                  <td>{exam.exam_type}</td>
                  <td>{exam.school_class}</td>
                  <td>
                    <span
                      className={`status-badge ${exam.status.toLowerCase()}`}
                    >
                      {exam.status}
                    </span>
                  </td>
                  <td>
                    <button className="action-btn view-btn">View</button>
                    {exam.status === "Completed" && !exam.is_published && (
                      <button className="action-btn publish-btn">
                        Publish
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ExamsDashboard;
