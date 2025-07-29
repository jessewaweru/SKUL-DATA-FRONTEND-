import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApi } from "../../../../hooks/useApi";

const EnterMarksManual = () => {
  const { examId, subjectId } = useParams();
  const { get, post, put } = useApi();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [subject, setSubject] = useState(null);
  const [students, setStudents] = useState([]);
  const [marks, setMarks] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [examRes, subjectRes, resultsRes] = await Promise.all([
          get(`/exams/${examId}/`),
          get(`/students/subjects/${subjectId}/`),
          get(
            `/exams/results/?exam_subject__exam=${examId}&exam_subject__subject=${subjectId}`
          ),
        ]);

        setExam(examRes.data);
        setSubject(subjectRes.data);

        // Get students for the class
        const studentsRes = await get(
          `/students/?class=${examRes.data.school_class.id}`
        );
        setStudents(studentsRes.data);

        // Initialize marks
        const marksData = {};
        studentsRes.data.forEach((student) => {
          const existingResult = resultsRes.data.find(
            (r) => r.student.id === student.id
          );
          marksData[student.id] = {
            score: existingResult?.score || "",
            is_absent: existingResult?.is_absent || false,
            teacher_comment: existingResult?.teacher_comment || "",
          };
        });
        setMarks(marksData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [examId, subjectId]);

  const handleMarkChange = (studentId, field, value) => {
    setMarks((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: field === "score" ? parseFloat(value) || "" : value,
      },
    }));
  };

  const handleToggleAbsent = (studentId) => {
    setMarks((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        is_absent: !prev[studentId].is_absent,
        score: prev[studentId].is_absent ? "" : null,
      },
    }));
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const results = Object.entries(marks).map(([studentId, data]) => ({
        student: parseInt(studentId),
        exam_subject: {
          exam: parseInt(examId),
          subject: parseInt(subjectId),
        },
        ...data,
      }));

      await post("/exams/results/bulk-update/", { results });
      alert("Marks saved successfully!");
    } catch (error) {
      console.error("Error saving marks:", error);
      alert("Failed to save marks. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading-spinner">Loading...</div>;

  return (
    <div className="enter-marks-container">
      <div className="marks-header">
        <h2>
          Enter Marks: {exam.name} - {subject.name}
        </h2>
        <div className="marks-subheader">
          <p>Class: {exam.school_class.name}</p>
          <p>
            Max Score:{" "}
            {exam.subjects.find((s) => s.id === parseInt(subjectId))
              ?.max_score || 100}
          </p>
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
              <tr key={student.id}>
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
                    max={
                      exam.subjects.find((s) => s.id === parseInt(subjectId))
                        ?.max_score || 100
                    }
                    step="0.01"
                  />
                </td>
                <td>
                  {/* Grade will be calculated automatically based on the score */}
                  {marks[student.id]?.score !== undefined &&
                  marks[student.id]?.score !== "" &&
                  !marks[student.id]?.is_absent
                    ? calculateGrade(
                        marks[student.id].score,
                        exam.grading_system
                      )
                    : marks[student.id]?.is_absent
                    ? "ABS"
                    : "-"}
                </td>
                <td>
                  <input
                    type="checkbox"
                    checked={marks[student.id]?.is_absent || false}
                    onChange={() => handleToggleAbsent(student.id)}
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
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Marks"}
        </button>
      </div>
    </div>
  );
};

// Helper function to calculate grade based on score and grading system
const calculateGrade = (score, gradingSystem) => {
  if (!gradingSystem || !gradingSystem.grade_ranges) return "-";

  const range = gradingSystem.grade_ranges.find(
    (r) => score >= r.min_score && score <= r.max_score
  );

  return range ? range.grade : "-";
};

export default EnterMarksManual;
