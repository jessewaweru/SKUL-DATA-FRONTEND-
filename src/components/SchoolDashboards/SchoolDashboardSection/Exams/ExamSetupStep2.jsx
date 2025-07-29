import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { useApi } from "../../../../hooks/useApi";

const ExamSetupStep2 = () => {
  const { get } = useApi();
  const { examData, handleNext, handleBack } = useOutletContext();
  const [subjects, setSubjects] = useState(null);
  const [gradingSystems, setGradingSystems] = useState(null);
  const [selectedSubjects, setSelectedSubjects] = useState(
    examData.subjects || []
  );
  const [selectedGrading, setSelectedGrading] = useState(
    examData.grading_system || null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [subjectsRes, gradingRes] = await Promise.all([
          get("/students/subjects/"),
          get("/exams/grading-systems/"),
        ]);

        // Updated to handle paginated responses
        setSubjects(subjectsRes.data?.results || subjectsRes.data || []);
        setGradingSystems(gradingRes.data?.results || gradingRes.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setSubjects([]);
        setGradingSystems([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleSubject = (subject) => {
    setSelectedSubjects((prev) =>
      prev.some((s) => s.id === subject.id)
        ? prev.filter((s) => s.id !== subject.id)
        : [...prev, subject]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleNext({
      subjects: selectedSubjects,
      grading_system: selectedGrading,
    });
  };

  if (loading || !subjects || !gradingSystems) {
    return <div className="loading-spinner">Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="exam-setup-form">
      <h3>Subjects & Grading System</h3>

      <div className="form-group">
        <label>Select Subjects</label>
        <div className="subjects-grid">
          {subjects.map((subject) => (
            <div
              key={subject.id}
              className={`subject-card ${
                selectedSubjects.some((s) => s.id === subject.id)
                  ? "selected"
                  : ""
              }`}
              onClick={() => toggleSubject(subject)}
            >
              {subject.name}
            </div>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label>Grading System</label>
        <select
          value={selectedGrading?.id || ""}
          onChange={(e) => {
            const selected = gradingSystems.find(
              (sys) => sys.id === parseInt(e.target.value)
            );
            setSelectedGrading(selected);
          }}
          required
        >
          <option value="">Select Grading System</option>
          {gradingSystems.map((sys) => (
            <option key={sys.id} value={sys.id}>
              {sys.name}
            </option>
          ))}
        </select>

        {selectedGrading && (
          <div className="grade-ranges-preview">
            <h4>Grade Ranges:</h4>
            <table>
              <thead>
                <tr>
                  <th>Min Score</th>
                  <th>Max Score</th>
                  <th>Grade</th>
                </tr>
              </thead>
              <tbody>
                {selectedGrading.grade_ranges?.map((range) => (
                  <tr key={range.id}>
                    <td>{range.min_score}</td>
                    <td>{range.max_score}</td>
                    <td>{range.grade}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="form-actions">
        <button type="button" className="btn-secondary" onClick={handleBack}>
          Back
        </button>
        <button type="submit" className="btn-primary">
          Next
        </button>
      </div>
    </form>
  );
};

export default ExamSetupStep2;
