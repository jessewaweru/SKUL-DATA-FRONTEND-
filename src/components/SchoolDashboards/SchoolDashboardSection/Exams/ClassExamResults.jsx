import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useApi } from "../../../../hooks/useApi";

const ClassExamResults = () => {
  const { classId } = useParams();
  const [searchParams] = useSearchParams();
  const examId = searchParams.get("exam");
  const { get } = useApi();
  const navigate = useNavigate();
  const [classInfo, setClassInfo] = useState(null);
  const [exam, setExam] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [classRes, examRes, resultsRes] = await Promise.all([
          get(`/schools/classes/${classId}/`),
          examId ? get(`/exams/${examId}/`) : Promise.resolve({ data: null }),
          examId
            ? get(`/exams/results/?exam_subject__exam=${examId}`)
            : Promise.resolve({ data: [] }),
        ]);

        setClassInfo(classRes.data);
        setExam(examRes?.data || null);

        // Group results by student
        const groupedResults = {};
        resultsRes.data.forEach((result) => {
          if (!groupedResults[result.student.id]) {
            groupedResults[result.student.id] = {
              student: result.student,
              subjects: {},
              total: 0,
              average: 0,
            };
          }
          groupedResults[result.student.id].subjects[
            result.exam_subject.subject
          ] = {
            score: result.score,
            grade: result.grade,
            remark: result.remark,
          };
          groupedResults[result.student.id].total += result.score || 0;
        });

        // Calculate averages
        Object.values(groupedResults).forEach((studentResult) => {
          const subjectCount = Object.keys(studentResult.subjects).length;
          studentResult.average =
            subjectCount > 0 ? studentResult.total / subjectCount : 0;
        });

        // Convert to array and sort by average
        setResults(
          Object.values(groupedResults).sort((a, b) => b.average - a.average)
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [classId, examId]);

  if (loading) return <div className="loading-spinner">Loading...</div>;

  return (
    <div className="class-results-container">
      <div className="results-header">
        <button
          className="btn-secondary"
          onClick={() => navigate("/dashboard/exams/results")}
        >
          Back to Results
        </button>
        <h2>
          {exam ? exam.name : "All Exams"} - {classInfo?.name || "Class"}{" "}
          Results
        </h2>
        {exam && (
          <button className="btn-primary">
            {exam.is_published ? "Republish Results" : "Publish Results"}
          </button>
        )}
      </div>

      <div className="results-summary">
        <div className="summary-card">
          <h3>Class Average</h3>
          <p>
            {results.length > 0
              ? (
                  results.reduce((sum, r) => sum + r.average, 0) /
                  results.length
                ).toFixed(2)
              : 0}
          </p>
        </div>
        <div className="summary-card">
          <h3>Top Student</h3>
          <p>
            {results.length > 0
              ? `${results[0].student.first_name} ${results[0].student.last_name}`
              : "-"}
          </p>
        </div>
        <div className="summary-card">
          <h3>Students Count</h3>
          <p>{results.length}</p>
        </div>
      </div>

      <div className="results-table-container">
        <table className="results-table">
          <thead>
            <tr>
              <th rowSpan="2">Position</th>
              <th rowSpan="2">Adm No.</th>
              <th rowSpan="2">Student Name</th>
              {exam ? (
                <>
                  {exam.subjects.map((subject) => (
                    <th key={subject.id}>{subject.subject.name}</th>
                  ))}
                  <th>Total</th>
                  <th>Average</th>
                  <th>Grade</th>
                </>
              ) : (
                <th colSpan="2">Overall Performance</th>
              )}
            </tr>
          </thead>
          <tbody>
            {results.map((result, index) => (
              <tr key={result.student.id}>
                <td>{index + 1}</td>
                <td>{result.student.admission_number}</td>
                <td>
                  {result.student.first_name} {result.student.last_name}
                </td>

                {exam ? (
                  <>
                    {exam.subjects.map((subject) => (
                      <td key={subject.id}>
                        {result.subjects[subject.subject.id]?.score || "-"}
                        <br />
                        <small>
                          {result.subjects[subject.subject.id]?.grade || ""}
                        </small>
                      </td>
                    ))}
                    <td>{result.total.toFixed(2)}</td>
                    <td>{result.average.toFixed(2)}</td>
                    <td>
                      {/* Calculate overall grade based on average */}
                      {exam.grading_system?.grade_ranges?.find(
                        (r) =>
                          result.average >= r.min_score &&
                          result.average <= r.max_score
                      )?.grade || "-"}
                    </td>
                  </>
                ) : (
                  <>
                    <td>{result.average.toFixed(2)}</td>
                    <td>
                      {/* Overall grade would need to be calculated differently for all exams */}
                      A
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="results-actions">
        <button className="btn-secondary">Download as PDF</button>
        <button className="btn-secondary">Download as Excel</button>
      </div>
    </div>
  );
};

export default ClassExamResults;
