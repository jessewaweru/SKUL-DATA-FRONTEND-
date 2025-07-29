import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../../../../hooks/useApi";

const SelectExamForMarks = () => {
  const { get } = useApi();
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await get("/exams/");
        // Ensure we always set an array, even if response.data is null/undefined
        setExams(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching exams:", error);
        setExams([]); // Set to empty array on error too
      } finally {
        setLoading(false);
      }
    };
    fetchExams();
  }, []);

  const handleSelectExam = (examId) => {
    const exam = exams.find((e) => e.id === examId);
    if (exam.subjects.length > 0) {
      navigate(`manual/${examId}/${exam.subjects[0].id}`);
    }
  };

  if (loading) return <div className="loading-spinner">Loading...</div>;

  return (
    <div className="select-exam-container">
      <h2>Select Exam to Enter Marks</h2>

      <div className="exams-list">
        {exams.length === 0 ? (
          <p>No exams found. Please create an exam first.</p>
        ) : (
          exams.map((exam) => (
            <div key={exam.id} className="exam-card">
              <div className="exam-info">
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
              </div>

              <div className="exam-actions">
                <button
                  className="btn-primary"
                  onClick={() => handleSelectExam(exam.id)}
                  disabled={
                    exam.status !== "Ongoing" && exam.status !== "Completed"
                  }
                >
                  Enter Marks
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SelectExamForMarks;
