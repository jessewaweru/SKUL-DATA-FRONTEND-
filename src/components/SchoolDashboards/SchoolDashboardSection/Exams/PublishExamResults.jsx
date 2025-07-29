import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApi } from "../../../../hooks/useApi";

const PublishExamResults = () => {
  const { examId } = useParams();
  const { get, post } = useApi();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const response = await get(`/exams/${examId}/`);
        setExam(response.data);
      } catch (error) {
        console.error("Error fetching exam:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchExam();
  }, [examId]);

  const handlePublish = async () => {
    if (confirmText.toLowerCase() !== "publish") {
      alert('Please type "publish" to confirm');
      return;
    }

    setPublishing(true);
    try {
      await post(`/exams/${examId}/publish/`);
      alert("Results published successfully!");
      navigate(
        `/dashboard/exams/results/class/${exam.school_class.id}?exam=${examId}`
      );
    } catch (error) {
      console.error("Error publishing results:", error);
      alert("Failed to publish results. Please try again.");
    } finally {
      setPublishing(false);
    }
  };

  if (loading) return <div className="loading-spinner">Loading...</div>;

  return (
    <div className="publish-results-container">
      <div className="publish-header">
        <h2>Publish Exam Results</h2>
        <p>
          You are about to publish results for: <strong>{exam.name}</strong>
        </p>
      </div>

      <div className="publish-warning">
        <h3>Important Notice</h3>
        <ul>
          <li>
            Once published, results will be visible to parents and students
          </li>
          <li>
            Published results cannot be edited directly (you'll need to
            unpublish first)
          </li>
          <li>
            Ensure all marks have been entered correctly before publishing
          </li>
        </ul>
      </div>

      <div className="publish-confirmation">
        <p>
          To confirm, type <strong>"publish"</strong> in the box below:
        </p>
        <input
          type="text"
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          placeholder="Type 'publish' to confirm"
        />
      </div>

      <div className="publish-actions">
        <button
          className="btn-secondary"
          onClick={() =>
            navigate(
              `/dashboard/exams/results/class/${exam.school_class.id}?exam=${examId}`
            )
          }
        >
          Cancel
        </button>
        <button
          className="btn-primary"
          onClick={handlePublish}
          disabled={publishing || confirmText.toLowerCase() !== "publish"}
        >
          {publishing ? "Publishing..." : "Publish Results"}
        </button>
      </div>
    </div>
  );
};

export default PublishExamResults;
