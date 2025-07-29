import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApi } from "../../../../hooks/useApi";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const StudentExamResults = () => {
  const { studentId } = useParams();
  const { get } = useApi();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTerm, setSelectedTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentRes, resultsRes] = await Promise.all([
          get(`/students/${studentId}/`),
          get(`/exams/results/?student=${studentId}`),
        ]);

        setStudent(studentRes.data);

        // Group results by exam
        const groupedResults = {};
        resultsRes.data.forEach((result) => {
          if (!groupedResults[result.exam_subject.exam.id]) {
            groupedResults[result.exam_subject.exam.id] = {
              exam: result.exam_subject.exam,
              subjects: {},
              total: 0,
              count: 0,
            };
          }
          groupedResults[result.exam_subject.exam.id].subjects[
            result.exam_subject.subject.id
          ] = {
            score: result.score,
            grade: result.grade,
          };
          groupedResults[result.exam_subject.exam.id].total +=
            result.score || 0;
          groupedResults[result.exam_subject.exam.id].count += 1;
        });

        // Calculate averages
        Object.values(groupedResults).forEach((examResult) => {
          examResult.average =
            examResult.count > 0 ? examResult.total / examResult.count : 0;
        });

        setResults(Object.values(groupedResults));

        // Set default term to the most recent exam's term if available
        if (resultsRes.data.length > 0) {
          setSelectedTerm(
            `${resultsRes.data[0].exam_subject.exam.term}-${resultsRes.data[0].exam_subject.exam.academic_year}`
          );
        }
      } catch (error) {
        console.error("Error fetching student results:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [studentId]);

  if (loading) return <div className="loading-spinner">Loading...</div>;

  const filteredResults = selectedTerm
    ? results.filter(
        (r) => `${r.exam.term}-${r.exam.academic_year}` === selectedTerm
      )
    : results;

  const terms = [
    ...new Set(results.map((r) => `${r.exam.term}-${r.exam.academic_year}`)),
  ];

  const performanceChartData = {
    labels: filteredResults.map((r) => r.exam.name),
    datasets: [
      {
        label: "Average Score",
        data: filteredResults.map((r) => r.average),
        backgroundColor: "rgba(106, 27, 154, 0.7)",
      },
    ],
  };

  return (
    <div className="student-results-container">
      <div className="student-results-header">
        <button className="btn-secondary" onClick={() => navigate(-1)}>
          Back to Results
        </button>
        <h2>
          Exam Results for {student?.first_name} {student?.last_name}
        </h2>
      </div>

      <div className="student-info">
        <p>Admission Number: {student?.admission_number}</p>
        <p>Class: {student?.school_class?.name}</p>
      </div>

      <div className="term-selector">
        <label>Filter by Term:</label>
        <select
          value={selectedTerm}
          onChange={(e) => setSelectedTerm(e.target.value)}
        >
          <option value="">All Terms</option>
          {terms.map((term) => (
            <option key={term} value={term}>
              {term.replace("-", " ")}
            </option>
          ))}
        </select>
      </div>

      <div className="performance-chart">
        <Bar
          data={performanceChartData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: "top",
              },
              title: {
                display: true,
                text: "Performance Across Exams",
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                max: 100,
              },
            },
          }}
        />
      </div>

      <div className="detailed-results">
        <h3>Detailed Results</h3>
        {filteredResults.length === 0 ? (
          <p>No results found for the selected term.</p>
        ) : (
          filteredResults.map((examResult) => (
            <div key={examResult.exam.id} className="exam-result-card">
              <div className="exam-result-header">
                <h4>{examResult.exam.name}</h4>
                <p>
                  Term: {examResult.exam.term} {examResult.exam.academic_year}
                </p>
                <p>Average: {examResult.average.toFixed(2)}</p>
              </div>

              <table className="subject-results-table">
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Score</th>
                    <th>Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(examResult.subjects).map(
                    ([subjectId, subjectResult]) => (
                      <tr key={subjectId}>
                        <td>
                          {
                            examResult.exam.subjects.find(
                              (s) => s.subject.id === parseInt(subjectId)
                            )?.subject.name
                          }
                        </td>
                        <td>{subjectResult.score || "-"}</td>
                        <td>{subjectResult.grade || "-"}</td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          ))
        )}
      </div>

      <div className="results-actions">
        <button className="btn-primary">Download Full Report</button>
      </div>
    </div>
  );
};

export default StudentExamResults;
