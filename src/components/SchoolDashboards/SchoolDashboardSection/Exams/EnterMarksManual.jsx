import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApi } from "../../../../hooks/useApi";

const EnterMarksManual = () => {
  const { examId, subjectId } = useParams();
  const { get, post, put } = useApi();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [subject, setSubject] = useState(null);
  const [examSubject, setExamSubject] = useState(null);
  const [students, setStudents] = useState([]);
  const [marks, setMarks] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // First, get exam details
        const examResponse = await get(`/exams/exams/${examId}/`);
        console.log("Exam response:", examResponse);
        setExam(examResponse.data);

        // Get exam subject details (this contains the relationship between exam and subject)
        const examSubjectsResponse = await get(
          `/exams/exam-subjects/?exam=${examId}`
        );
        console.log("Exam subjects response:", examSubjectsResponse);

        const examSubjectData = examSubjectsResponse.data.results
          ? examSubjectsResponse.data.results.find(
              (es) => es.subject.id == subjectId
            )
          : examSubjectsResponse.data.find((es) => es.subject.id == subjectId);

        if (!examSubjectData) {
          throw new Error("Subject not found for this exam");
        }

        setExamSubject(examSubjectData);
        setSubject(examSubjectData.subject);

        // Get students for the class
        const studentsResponse = await get(
          `/students/students/?school_class=${examResponse.data.school_class.id}`
        );
        console.log("Students response:", studentsResponse);

        const studentsData =
          studentsResponse.data.results || studentsResponse.data;
        setStudents(Array.isArray(studentsData) ? studentsData : []);

        // Get existing exam results
        const resultsResponse = await get(
          `/exams/exam-results/?exam_subject=${examSubjectData.id}`
        );
        console.log("Results response:", resultsResponse);

        // Initialize marks with existing results or empty values
        const marksData = {};
        studentsData.forEach((student) => {
          const existingResult = resultsResponse.data.results
            ? resultsResponse.data.results.find(
                (r) => r.student.id === student.id
              )
            : resultsResponse.data.find((r) => r.student.id === student.id);

          marksData[student.id] = {
            score: existingResult?.score || "",
            is_absent: existingResult?.is_absent || false,
            teacher_comment: existingResult?.teacher_comment || "",
            id: existingResult?.id || null, // Store result ID for updates
          };
        });
        setMarks(marksData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(`Failed to load exam data: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (examId && subjectId) {
      fetchData();
    }
  }, [examId, subjectId, get]);

  const handleMarkChange = (studentId, field, value) => {
    setMarks((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]:
          field === "score" ? (value === "" ? "" : parseFloat(value)) : value,
      },
    }));
  };

  const handleToggleAbsent = (studentId) => {
    setMarks((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        is_absent: !prev[studentId].is_absent,
        score: prev[studentId].is_absent ? "" : "",
      },
    }));
  };

  const handleSubmit = async () => {
    if (!examSubject) {
      alert("Exam subject data not loaded");
      return;
    }

    setSaving(true);
    try {
      // Prepare bulk update data
      const bulkData = Object.entries(marks).map(([studentId, data]) => ({
        student_id: parseInt(studentId),
        score: data.is_absent ? null : data.score === "" ? null : data.score,
        is_absent: data.is_absent,
        teacher_comment: data.teacher_comment || "",
      }));

      console.log("Submitting bulk data:", bulkData);

      // Use the bulk update endpoint
      await post(
        `/exams/exam-subjects/${examSubject.id}/bulk_update_results/`,
        bulkData
      );

      alert("Marks saved successfully!");

      // Optionally navigate back or refresh data
      // navigate("/dashboard/exams/enter-marks");
    } catch (error) {
      console.error("Error saving marks:", error);
      alert(
        `Failed to save marks: ${error.response?.data?.detail || error.message}`
      );
    } finally {
      setSaving(false);
    }
  };

  const calculateGrade = (score, gradingSystem) => {
    if (
      !gradingSystem ||
      !gradingSystem.grade_ranges ||
      score === "" ||
      score === null ||
      score === undefined
    ) {
      return "-";
    }

    const numericScore = parseFloat(score);
    if (isNaN(numericScore)) return "-";

    const range = gradingSystem.grade_ranges.find(
      (r) =>
        numericScore >= parseFloat(r.min_score) &&
        numericScore <= parseFloat(r.max_score)
    );

    return range ? range.grade : "-";
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading exam data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">
          <h3>Error Loading Data</h3>
          <p>{error}</p>
          <button
            onClick={() => navigate("/dashboard/exams/enter-marks")}
            className="btn-primary"
          >
            Back to Exams
          </button>
        </div>
      </div>
    );
  }

  if (!exam || !subject || !examSubject) {
    return (
      <div className="error-container">
        <div className="error-message">
          <h3>Data Not Found</h3>
          <p>Could not load exam or subject data.</p>
          <button
            onClick={() => navigate("/dashboard/exams/enter-marks")}
            className="btn-primary"
          >
            Back to Exams
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="enter-marks-container">
      <div className="marks-header">
        <h2>
          Enter Marks: {exam.name} - {subject.name}
        </h2>
        <div className="marks-subheader">
          <p>Class: {exam.school_class?.name || "N/A"}</p>
          <p>Max Score: {examSubject.max_score}</p>
          <p>
            Term: {exam.term} {exam.academic_year}
          </p>
          <p>Status: {exam.status}</p>
        </div>
      </div>

      <div className="marks-table-container">
        <table className="marks-table">
          <thead>
            <tr>
              <th>Adm No.</th>
              <th>Student Name</th>
              <th>Score</th>
              <th>Grade</th>
              <th>Absent</th>
              <th>Teacher Comment</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr
                key={student.id}
                className={marks[student.id]?.is_absent ? "absent-row" : ""}
              >
                <td>{student.admission_number}</td>
                <td>
                  {student.first_name} {student.last_name}
                </td>
                <td>
                  <input
                    type="number"
                    value={marks[student.id]?.score || ""}
                    onChange={(e) =>
                      handleMarkChange(student.id, "score", e.target.value)
                    }
                    disabled={marks[student.id]?.is_absent}
                    min="0"
                    max={examSubject.max_score}
                    step="0.01"
                    className="score-input"
                  />
                </td>
                <td className="grade-cell">
                  {marks[student.id]?.is_absent
                    ? "ABS"
                    : calculateGrade(
                        marks[student.id]?.score,
                        exam.grading_system
                      )}
                </td>
                <td>
                  <input
                    type="checkbox"
                    checked={marks[student.id]?.is_absent || false}
                    onChange={() => handleToggleAbsent(student.id)}
                    className="absent-checkbox"
                  />
                </td>
                <td>
                  <textarea
                    value={marks[student.id]?.teacher_comment || ""}
                    onChange={(e) =>
                      handleMarkChange(
                        student.id,
                        "teacher_comment",
                        e.target.value
                      )
                    }
                    rows={1}
                    className="comment-textarea"
                    placeholder="Optional comment..."
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="marks-actions">
        <button
          className="btn-secondary"
          onClick={() => navigate("/dashboard/exams/enter-marks")}
        >
          Back to Exams
        </button>
        <button
          className="btn-primary"
          onClick={handleSubmit}
          disabled={saving || students.length === 0}
        >
          {saving ? "Saving..." : "Save Marks"}
        </button>
      </div>

      <style jsx>{`
        .enter-marks-container {
          padding: 24px;
          max-width: 1400px;
          margin: 0 auto;
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

        .marks-header {
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 2px solid #e2e8f0;
        }

        .marks-header h2 {
          font-size: 24px;
          font-weight: 600;
          color: #1a202c;
          margin-bottom: 12px;
        }

        .marks-subheader {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }

        .marks-subheader p {
          margin: 0;
          color: #4a5568;
          font-size: 14px;
          padding: 8px 12px;
          background: #f7fafc;
          border-radius: 6px;
        }

        .marks-table-container {
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          margin-bottom: 24px;
        }

        .marks-table {
          width: 100%;
          border-collapse: collapse;
        }

        .marks-table th {
          background: #4a5568;
          color: white;
          padding: 12px;
          text-align: left;
          font-weight: 600;
          font-size: 14px;
        }

        .marks-table td {
          padding: 12px;
          border-bottom: 1px solid #e2e8f0;
          vertical-align: middle;
        }

        .marks-table tr:hover {
          background: #f7fafc;
        }

        .absent-row {
          background: #fed7d7 !important;
          opacity: 0.7;
        }

        .score-input {
          width: 80px;
          padding: 6px 8px;
          border: 1px solid #cbd5e0;
          border-radius: 4px;
          font-size: 14px;
        }

        .score-input:disabled {
          background: #f7fafc;
          color: #a0aec0;
        }

        .grade-cell {
          font-weight: 600;
          text-align: center;
          min-width: 60px;
        }

        .absent-checkbox {
          transform: scale(1.2);
        }

        .comment-textarea {
          width: 100%;
          min-width: 150px;
          padding: 6px 8px;
          border: 1px solid #cbd5e0;
          border-radius: 4px;
          resize: vertical;
          font-size: 12px;
        }

        .marks-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          padding-top: 24px;
          border-top: 1px solid #e2e8f0;
        }

        .btn-primary,
        .btn-secondary {
          padding: 12px 24px;
          border: none;
          border-radius: 6px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-primary {
          background: #4299e1;
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          background: #3182ce;
        }

        .btn-primary:disabled {
          background: #a0aec0;
          cursor: not-allowed;
        }

        .btn-secondary {
          background: #e2e8f0;
          color: #4a5568;
        }

        .btn-secondary:hover {
          background: #cbd5e0;
        }

        @media (max-width: 768px) {
          .marks-table-container {
            overflow-x: auto;
          }

          .marks-subheader {
            grid-template-columns: 1fr;
          }

          .marks-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default EnterMarksManual;
