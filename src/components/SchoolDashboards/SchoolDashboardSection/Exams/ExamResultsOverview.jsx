import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../../../../hooks/useApi";

const ExamResultsOverview = () => {
  const { get } = useApi();
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await get("/exams/");
        // Ensure we always set an array, even if response.data is null/undefined
        setExams(Array.isArray(response?.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching exams:", error);
        setExams([]); // Set to empty array on error
      } finally {
        setLoading(false);
      }
    };
    fetchExams();
  }, []);

  const handleViewResults = (examId, classId) => {
    navigate(`class/${classId}?exam=${examId}`);
  };

  if (loading) return <div className="loading-spinner">Loading...</div>;

  return (
    <div className="results-overview-container">
      <h2>Exam Results Management</h2>

      <div className="results-filters">
        <div className="filter-group">
          <label>Term:</label>
          <select>
            <option value="">All Terms</option>
            <option value="Term 1">Term 1</option>
            <option value="Term 2">Term 2</option>
            <option value="Term 3">Term 3</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Academic Year:</label>
          <select>
            <option value="">All Years</option>
            <option value="2023">2023</option>
            <option value="2024">2024</option>
          </select>
        </div>
      </div>

      <div className="exams-results-list">
        {exams.length === 0 ? (
          <p>No exams found. Please create an exam first.</p>
        ) : (
          exams.map((exam) => (
            <div key={exam.id} className="exam-result-card">
              <div className="exam-result-info">
                <h3>{exam.name}</h3>
                <p>Class: {exam.school_class.name}</p>
                <p>
                  Term: {exam.term} {exam.academic_year}
                </p>
                <p>
                  Status:{" "}
                  <span className={`status-badge ${exam.status.toLowerCase()}`}>
                    {exam.status}
                  </span>
                </p>
                <p>Published: {exam.is_published ? "Yes" : "No"}</p>
              </div>

              <div className="exam-result-actions">
                <button
                  className="btn-primary"
                  onClick={() =>
                    handleViewResults(exam.id, exam.school_class.id)
                  }
                >
                  View Results
                </button>
                {!exam.is_published && (
                  <button className="btn-secondary">Publish Results</button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ExamResultsOverview;
