import { useState } from "react";
import { useOutletContext } from "react-router-dom";

const ExamSetupStep3 = () => {
  const { examData, handleBack, handleSubmit } = useOutletContext();
  const [schedule, setSchedule] = useState({
    start_date: examData.start_date || "",
    end_date: examData.end_date || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSchedule((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSubmit({
      ...examData,
      ...schedule,
    });
  };

  return (
    <form onSubmit={handleFormSubmit} className="exam-setup-form">
      <h3>Exam Schedule</h3>

      <div className="form-group">
        <label>Start Date</label>
        <input
          type="date"
          name="start_date"
          value={schedule.start_date}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>End Date</label>
        <input
          type="date"
          name="end_date"
          value={schedule.end_date}
          onChange={handleChange}
          required
          min={schedule.start_date}
        />
      </div>

      <div className="exam-summary">
        <h4>Exam Summary</h4>
        <p>
          <strong>Name:</strong> {examData.name}
        </p>
        <p>
          <strong>Type:</strong> {examData.exam_type?.name}
        </p>
        <p>
          <strong>Class:</strong> {examData.school_class?.name}
        </p>
        <p>
          <strong>Term:</strong> {examData.term}
        </p>
        <p>
          <strong>Academic Year:</strong> {examData.academic_year}
        </p>
        <p>
          <strong>Subjects:</strong>{" "}
          {examData.subjects?.map((s) => s.name).join(", ")}
        </p>
        <p>
          <strong>Grading System:</strong> {examData.grading_system?.name}
        </p>
      </div>

      <div className="form-actions">
        <button type="button" className="btn-secondary" onClick={handleBack}>
          Back
        </button>
        <button type="submit" className="btn-primary">
          Create Exam
        </button>
      </div>
    </form>
  );
};

export default ExamSetupStep3;
