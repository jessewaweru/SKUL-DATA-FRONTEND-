import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../../../../hooks/useApi";

const ExamResultsOverview = () => {
  const { get } = useApi();
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [selectedTerm, setSelectedTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [filteredExams, setFilteredExams] = useState([]);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        setLoading(true);
        setError(null);

        // Correct endpoint - should be /api/exams/exams/ not /api/exams/
        const response = await get("/exams/exams/");

        console.log("Exams response:", response); // Debug log

        // Handle the response structure
        const examData = response?.data || [];

        if (Array.isArray(examData)) {
          setExams(examData);
          setFilteredExams(examData); // Initialize filtered exams
        } else if (examData.results && Array.isArray(examData.results)) {
          // Handle paginated response
          setExams(examData.results);
          setFilteredExams(examData.results);
        } else {
          console.warn("Unexpected response structure:", response);
          setExams([]);
          setFilteredExams([]);
        }
      } catch (error) {
        console.error("Error fetching exams:", error);
        setError(error.message || "Failed to fetch exams");
        setExams([]);
        setFilteredExams([]);
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  // Filter exams when filter criteria change
  useEffect(() => {
    let filtered = [...exams];

    if (selectedTerm) {
      filtered = filtered.filter((exam) => exam.term === selectedTerm);
    }

    if (selectedYear) {
      filtered = filtered.filter((exam) => exam.academic_year === selectedYear);
    }

    setFilteredExams(filtered);
  }, [exams, selectedTerm, selectedYear]);

  // Get unique terms and years for filter options
  const getUniqueValues = (key) => {
    const values = exams.map((exam) => exam[key]).filter(Boolean);
    return [...new Set(values)].sort();
  };

  const handleViewResults = (examId, classId) => {
    navigate(`class/${classId}?exam=${examId}`);
  };

  const handlePublishResults = async (examId) => {
    try {
      await get(`/exams/exams/${examId}/publish/`, { method: "POST" });
      // Refresh the exams list
      const response = await get("/exams/exams/");
      const examData = response?.data || [];
      if (Array.isArray(examData)) {
        setExams(examData);
      } else if (examData.results) {
        setExams(examData.results);
      }
    } catch (error) {
      console.error("Error publishing results:", error);
    }
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "status-completed";
      case "ongoing":
        return "status-ongoing";
      case "upcoming":
        return "status-upcoming";
      default:
        return "status-default";
    }
  };

  if (loading) {
    return (
      <div
        className="loading-container"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "200px",
        }}
      >
        <div className="loading-spinner">Loading exams...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="error-container"
        style={{
          padding: "20px",
          backgroundColor: "#fee",
          border: "1px solid #fcc",
          borderRadius: "4px",
          margin: "20px 0",
        }}
      >
        <h3>Error Loading Exams</h3>
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: "8px 16px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="results-overview-container">
      <div className="header-section">
        <h2>Exam Results Management</h2>
        <p>Manage and view exam results for all classes and terms</p>
      </div>

      <div className="results-filters">
        <div className="filter-group">
          <label htmlFor="term-filter">Term:</label>
          <select
            id="term-filter"
            value={selectedTerm}
            onChange={(e) => setSelectedTerm(e.target.value)}
          >
            <option value="">All Terms</option>
            {getUniqueValues("term").map((term) => (
              <option key={term} value={term}>
                {term}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="year-filter">Academic Year:</label>
          <select
            id="year-filter"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <option value="">All Years</option>
            {getUniqueValues("academic_year").map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-info">
          <span>
            Showing {filteredExams.length} of {exams.length} exams
          </span>
        </div>
      </div>

      <div className="exams-results-list">
        {filteredExams.length === 0 ? (
          <div className="no-results">
            {exams.length === 0 ? (
              <>
                <h3>No Exams Found</h3>
                <p>
                  No exams have been created yet. Create an exam to get started.
                </p>
              </>
            ) : (
              <>
                <h3>No Matching Exams</h3>
                <p>
                  No exams match your current filter criteria. Try adjusting
                  your filters.
                </p>
              </>
            )}
          </div>
        ) : (
          filteredExams.map((exam) => (
            <div key={exam.id} className="exam-result-card">
              <div className="exam-result-info">
                <div className="exam-header">
                  <h3>{exam.name}</h3>
                  <span
                    className={`status-badge ${getStatusClass(exam.status)}`}
                  >
                    {exam.status || "Unknown"}
                  </span>
                </div>

                <div className="exam-details">
                  <p>
                    <strong>Class:</strong> {exam.school_class?.name || "N/A"}
                  </p>
                  <p>
                    <strong>Term:</strong> {exam.term} {exam.academic_year}
                  </p>
                  <p>
                    <strong>Exam Type:</strong> {exam.exam_type?.name || "N/A"}
                  </p>
                  <p>
                    <strong>Date Range:</strong>{" "}
                    {exam.start_date && exam.end_date
                      ? `${new Date(
                          exam.start_date
                        ).toLocaleDateString()} - ${new Date(
                          exam.end_date
                        ).toLocaleDateString()}`
                      : "Not specified"}
                  </p>
                  <p>
                    <strong>Published:</strong>
                    <span
                      className={`publish-status ${
                        exam.is_published ? "published" : "unpublished"
                      }`}
                    >
                      {exam.is_published ? "Yes" : "No"}
                    </span>
                  </p>
                </div>
              </div>

              <div className="exam-result-actions">
                <button
                  className="btn-primary"
                  onClick={() =>
                    handleViewResults(exam.id, exam.school_class?.id)
                  }
                  disabled={!exam.school_class?.id}
                  title={
                    !exam.school_class?.id
                      ? "Class information not available"
                      : "View detailed results"
                  }
                >
                  View Results
                </button>

                {!exam.is_published && (
                  <button
                    className="btn-secondary"
                    onClick={() => handlePublishResults(exam.id)}
                    title="Publish exam results to make them visible to students and parents"
                  >
                    Publish Results
                  </button>
                )}

                {exam.is_published && (
                  <button
                    className="btn-success"
                    disabled
                    title="Results are already published"
                  >
                    Published ✓
                  </button>
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
