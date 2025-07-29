import React, { useState } from "react";
import "../../SchoolDashboards/SchoolDashboardSection/Exams/exammanagement.css";

const CreateGradingSystem = ({ onCreate, onCancel }) => {
  const [name, setName] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  const [gradeRanges, setGradeRanges] = useState([
    { min_score: 90, max_score: 100, grade: "A", remark: "Excellent" },
    { min_score: 80, max_score: 89, grade: "B", remark: "Good" },
    { min_score: 70, max_score: 79, grade: "C", remark: "Average" },
    { min_score: 60, max_score: 69, grade: "D", remark: "Below Average" },
    { min_score: 0, max_score: 59, grade: "E", remark: "Fail" },
  ]);

  const handleRangeChange = (index, field, value) => {
    const updatedRanges = [...gradeRanges];
    updatedRanges[index] = {
      ...updatedRanges[index],
      [field]:
        field === "min_score" || field === "max_score"
          ? parseFloat(value)
          : value,
    };
    setGradeRanges(updatedRanges);
  };

  const addGradeRange = () => {
    setGradeRanges([
      ...gradeRanges,
      { min_score: 0, max_score: 0, grade: "", remark: "" },
    ]);
  };

  const removeGradeRange = (index) => {
    if (gradeRanges.length <= 1) return;
    setGradeRanges(gradeRanges.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate({
      name,
      is_default: isDefault,
      grade_ranges: gradeRanges,
    });
  };

  return (
    <div className="create-grading-system">
      <h3>Create New Grading System</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>System Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
            />
            Set as default grading system
          </label>
        </div>

        <div className="grade-ranges-section">
          <h4>Grade Ranges</h4>
          <table>
            <thead>
              <tr>
                <th>Min Score</th>
                <th>Max Score</th>
                <th>Grade</th>
                <th>Remark</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {gradeRanges.map((range, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="number"
                      value={range.min_score}
                      onChange={(e) =>
                        handleRangeChange(index, "min_score", e.target.value)
                      }
                      min="0"
                      max="100"
                      step="0.01"
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={range.max_score}
                      onChange={(e) =>
                        handleRangeChange(index, "max_score", e.target.value)
                      }
                      min="0"
                      max="100"
                      step="0.01"
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={range.grade}
                      onChange={(e) =>
                        handleRangeChange(index, "grade", e.target.value)
                      }
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={range.remark}
                      onChange={(e) =>
                        handleRangeChange(index, "remark", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn-danger small"
                      onClick={() => removeGradeRange(index)}
                      disabled={gradeRanges.length <= 1}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            type="button"
            className="btn-secondary"
            onClick={addGradeRange}
          >
            Add Grade Range
          </button>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            Create System
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateGradingSystem;
