import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../../../../hooks/useApi";

const SelectExamForMarks = () => {
  const { get } = useApi();
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        setLoading(true);
        setError(null);

        // Use the correct endpoint: /exams/exams/ instead of /exams/
        const response = await get("/exams/exams/");

        console.log("Exams API Response:", response);

        // Handle the response data structure
        if (response.data && response.data.results) {
          // If paginated response
          setExams(
            Array.isArray(response.data.results) ? response.data.results : []
          );
        } else if (Array.isArray(response.data)) {
          // If direct array response
          setExams(response.data);
        } else {
          console.warn("Unexpected response structure:", response.data);
          setExams([]);
        }
      } catch (error) {
        console.error("Error fetching exams:", error);
        setError("Failed to fetch exams. Please try again.");
        setExams([]);
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, [get]);

  const handleSelectExam = (examId) => {
    const exam = exams.find((e) => e.id === examId);

    if (!exam) {
      console.error("Exam not found:", examId);
      return;
    }

    // Check if exam has subjects
    if (exam.subjects && exam.subjects.length > 0) {
      navigate(`manual/${examId}/${exam.subjects[0].id}`);
    } else {
      console.warn("No subjects found for exam:", exam.name);
      // You might want to show a message to the user or navigate differently
      alert("This exam has no subjects configured yet.");
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case "upcoming":
        return "status-upcoming";
      case "ongoing":
        return "status-ongoing";
      case "completed":
        return "status-completed";
      default:
        return "status-default";
    }
  };

  const canEnterMarks = (exam) => {
    const status = exam.status?.toLowerCase();
    return status === "ongoing" || status === "completed";
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading exams...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">
          <h3>Error Loading Exams</h3>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="select-exam-container">
      <div className="page-header">
        <h2>Select Exam to Enter Marks</h2>
        <p className="page-description">
          Choose an exam to enter or update student marks. Only ongoing and
          completed exams are available for mark entry.
        </p>
      </div>

      <div className="exams-list">
        {exams.length === 0 ? (
          <div className="no-data-container">
            <div className="no-data-content">
              <h3>No Exams Found</h3>
              <p>No exams are available for mark entry at the moment.</p>
              <p>Please ensure that:</p>
              <ul>
                <li>Exams have been created for your school</li>
                <li>You have the necessary permissions to enter marks</li>
                <li>The exams are in "Ongoing" or "Completed" status</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="exams-grid">
            {exams.map((exam) => (
              <div key={exam.id} className="exam-card">
                <div className="exam-card-header">
                  <h3 className="exam-name">{exam.name}</h3>
                  <span
                    className={`status-badge ${getStatusBadgeClass(
                      exam.status
                    )}`}
                  >
                    {exam.status || "Unknown"}
                  </span>
                </div>

                <div className="exam-info">
                  <div className="info-row">
                    <span className="info-label">Class:</span>
                    <span className="info-value">
                      {exam.school_class?.name || "N/A"}
                    </span>
                  </div>

                  <div className="info-row">
                    <span className="info-label">Term:</span>
                    <span className="info-value">
                      {exam.term} {exam.academic_year}
                    </span>
                  </div>

                  <div className="info-row">
                    <span className="info-label">Type:</span>
                    <span className="info-value">
                      {exam.exam_type?.name || "N/A"}
                    </span>
                  </div>

                  <div className="info-row">
                    <span className="info-label">Subjects:</span>
                    <span className="info-value">
                      {exam.subjects?.length || 0} subject
                      {exam.subjects?.length !== 1 ? "s" : ""}
                    </span>
                  </div>

                  <div className="info-row">
                    <span className="info-label">Duration:</span>
                    <span className="info-value">
                      {exam.start_date} to {exam.end_date}
                    </span>
                  </div>

                  {exam.is_published && (
                    <div className="info-row">
                      <span className="published-indicator">✓ Published</span>
                    </div>
                  )}
                </div>

                <div className="exam-actions">
                  <button
                    className={`btn-action ${
                      canEnterMarks(exam) ? "btn-primary" : "btn-disabled"
                    }`}
                    onClick={() => handleSelectExam(exam.id)}
                    disabled={!canEnterMarks(exam)}
                    title={
                      !canEnterMarks(exam)
                        ? `Cannot enter marks for ${exam.status || "this"} exam`
                        : "Click to enter marks for this exam"
                    }
                  >
                    {canEnterMarks(exam) ? "Enter Marks" : "Not Available"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .select-exam-container {
          padding: 24px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .page-header {
          margin-bottom: 32px;
          text-align: center;
        }

        .page-header h2 {
          font-size: 28px;
          font-weight: 600;
          color: #1a202c;
          margin-bottom: 8px;
        }

        .page-description {
          color: #718096;
          font-size: 16px;
          line-height: 1.5;
        }

        .loading-container,
        .error-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 400px;
        }

        .loading-spinner {
          font-size: 18px;
          color: #4a5568;
        }

        .error-message {
          text-align: center;
          padding: 32px;
          background: #fed7d7;
          border-radius: 8px;
          border-left: 4px solid #e53e3e;
        }

        .error-message h3 {
          color: #c53030;
          margin-bottom: 16px;
        }

        .no-data-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 400px;
        }

        .no-data-content {
          text-align: center;
          padding: 48px 32px;
          background: #f7fafc;
          border-radius: 12px;
          border: 2px dashed #cbd5e0;
          max-width: 500px;
        }

        .no-data-content h3 {
          color: #4a5568;
          font-size: 24px;
          margin-bottom: 16px;
        }

        .no-data-content p {
          color: #718096;
          margin-bottom: 16px;
          line-height: 1.6;
        }

        .no-data-content ul {
          text-align: left;
          color: #718096;
          margin-top: 16px;
        }

        .exams-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
          gap: 24px;
        }

        .exam-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          transition: all 0.2s ease;
        }

        .exam-card:hover {
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          transform: translateY(-2px);
        }

        .exam-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 1px solid #f1f5f9;
        }

        .exam-name {
          font-size: 20px;
          font-weight: 600;
          color: #1a202c;
          margin: 0;
          flex: 1;
          margin-right: 16px;
        }

        .status-badge {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .status-upcoming {
          background: #bee3f8;
          color: #2b6cb0;
        }

        .status-ongoing {
          background: #c6f6d5;
          color: #25855a;
        }

        .status-completed {
          background: #fed7d7;
          color: #c53030;
        }

        .status-default {
          background: #e2e8f0;
          color: #4a5568;
        }

        .exam-info {
          margin-bottom: 24px;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
          border-bottom: 1px solid #f8f9fa;
        }

        .info-row:last-child {
          border-bottom: none;
        }

        .info-label {
          font-weight: 500;
          color: #4a5568;
          font-size: 14px;
        }

        .info-value {
          color: #1a202c;
          font-size: 14px;
          text-align: right;
        }

        .published-indicator {
          color: #25855a;
          font-weight: 500;
          font-size: 14px;
        }

        .exam-actions {
          margin-top: 20px;
        }

        .btn-action {
          width: 100%;
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-primary {
          background: #4299e1;
          color: white;
        }

        .btn-primary:hover {
          background: #3182ce;
          transform: translateY(-1px);
        }

        .btn-disabled {
          background: #e2e8f0;
          color: #a0aec0;
          cursor: not-allowed;
        }

        .btn-disabled:hover {
          transform: none;
        }
      `}</style>
    </div>
  );
};

export default SelectExamForMarks;
