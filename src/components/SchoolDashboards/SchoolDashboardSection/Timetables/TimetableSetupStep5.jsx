import { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useTimetableGenerator } from "../../../../hooks/useTimetableGenerator";
import TimetableGrid from "../../../common/SchoolTimetable/TimetableGrid";
import "./timetables.css";

const TimetableSetupStep5 = () => {
  const { timetableData, updateData } = useOutletContext();
  const { generate, loading, generatedTimetable, errors } =
    useTimetableGenerator();
  const navigate = useNavigate();
  const [activeClass, setActiveClass] = useState(null);
  const [formattedTimetable, setFormattedTimetable] = useState(null);

  useEffect(() => {
    // Auto-generate when coming to this step, but only if we have data
    if (!generatedTimetable && timetableData?.classes?.length > 0) {
      handleGenerate();
    }
  }, [timetableData, generatedTimetable]);

  useEffect(() => {
    if (generatedTimetable) {
      formatTimetableData(generatedTimetable);
    }
  }, [generatedTimetable]);

  const handleGenerate = async () => {
    if (
      !timetableData?.classes ||
      !Array.isArray(timetableData.classes) ||
      timetableData.classes.length === 0
    ) {
      alert("Missing class data. Please go back to Step 1.");
      return;
    }

    // CRITICAL: Verify we have subject assignments
    if (!timetableData.subjects || timetableData.subjects.length === 0) {
      alert(
        "No subjects assigned. Please go back to Step 3 and assign subjects."
      );
      return;
    }

    console.log("=== Generating Timetable ===");
    console.log("School:", timetableData.school, typeof timetableData.school);
    console.log("Classes:", timetableData.classes);
    console.log("Academic Year:", timetableData.academicYear);
    console.log("Term:", timetableData.term);
    console.log("Subject assignments:", timetableData.subjects.length);

    // Check for string teacher IDs and fix them
    const hasStringIds = timetableData.subjects.some(
      (sub) => typeof sub.teacher_id === "string"
    );

    if (hasStringIds) {
      console.warn("⚠️ Detected string teacher IDs, converting to integers...");
    }

    // Clean and validate subject assignments
    const cleanedSubjects = timetableData.subjects.map((sub) => ({
      subject_id: parseInt(sub.subject_id, 10),
      subject_name: sub.subject_name,
      teacher_id:
        typeof sub.teacher_id === "string"
          ? parseInt(sub.teacher_id, 10)
          : sub.teacher_id,
      required_periods: parseInt(sub.required_periods, 10) || 5,
    }));

    // Log cleaned subjects
    console.log("\nCleaned Subject Assignments:");
    cleanedSubjects.forEach((sub, idx) => {
      console.log(
        `  ${idx + 1}. ${sub.subject_name} (ID: ${sub.subject_id})`,
        `Teacher: ${sub.teacher_id} (${typeof sub.teacher_id}), Periods: ${
          sub.required_periods
        }`
      );
    });

    console.log("Constraints:", timetableData.constraints?.length || 0);

    // Create payload with cleaned data
    const payload = {
      school_class_ids: timetableData.classes.map((id) => parseInt(id, 10)),
      academic_year: timetableData.academicYear,
      term: parseInt(timetableData.term, 10),
      regenerate_existing: true,
      apply_constraints: true,
      subject_assignments: cleanedSubjects,
    };

    console.log("\n=== Complete Payload ===");
    console.log(JSON.stringify(payload, null, 2));

    // Verify payload structure
    console.log("\n=== Payload Validation ===");
    console.log(
      "✓ school_class_ids:",
      Array.isArray(payload.school_class_ids) ? "Array" : "❌ Not array"
    );
    console.log("✓ school_class_ids length:", payload.school_class_ids.length);
    console.log(
      "✓ academic_year:",
      payload.academic_year ? "Present" : "❌ Missing"
    );
    console.log(
      "✓ term:",
      typeof payload.term === "number" ? "Number" : "❌ Not number"
    );
    console.log(
      "✓ subject_assignments:",
      Array.isArray(payload.subject_assignments) ? "Array" : "❌ Not array"
    );
    console.log(
      "✓ subject_assignments length:",
      payload.subject_assignments.length
    );

    // Call generate with the complete payload
    try {
      await generate(payload);
    } catch (err) {
      console.error("Generation failed:", err);
      alert(`Failed to generate timetable: ${err.message}`);
    }
  };

  const formatTimetableData = (timetable) => {
    if (!timetable || !timetable.classes || !timetable.lessons) {
      console.log("No timetable data to format");
      return;
    }

    // Find the first class if none is selected
    const selectedClassId = activeClass || timetable.classes[0]?.id;
    if (!selectedClassId) return;

    const classTimetable = {
      id: timetable.id,
      school_class: timetable.classes.find((c) => c.id === selectedClassId),
      academic_year: timetable.academic_year,
      term: timetable.term,
      is_active: timetable.is_active,
      lessons: timetable.lessons.filter(
        (lesson) => lesson.class_id === selectedClassId
      ),
      time_slots: timetable.time_slots || [],
    };

    console.log("Formatted timetable:");
    console.log("- Lessons:", classTimetable.lessons.length);
    console.log("- Time slots:", classTimetable.time_slots.length);

    setFormattedTimetable(classTimetable);
    if (!activeClass) setActiveClass(selectedClassId);
  };

  const handleSave = async () => {
    try {
      alert("Timetable saved successfully!");
      navigate("/dashboard/timetables/view-all");
    } catch (error) {
      console.error("Error saving timetable:", error);
      alert("Failed to save timetable");
    }
  };

  const handlePrev = () => {
    navigate("/dashboard/timetables/create/step-4");
  };

  const handleClassChange = (classId) => {
    setActiveClass(classId);
    if (generatedTimetable) {
      formatTimetableData(generatedTimetable);
    }
  };

  // Show error if timetableData is not available
  if (!timetableData) {
    return (
      <div className="error">
        <p>Timetable data not available. Please start over from Step 1.</p>
        <button onClick={() => navigate("/dashboard/timetables/create/step-1")}>
          Go to Step 1
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="loading">
        <p>Generating timetable...</p>
        <div className="loading-spinner"></div>
        <p style={{ marginTop: "10px", fontSize: "0.9em", color: "#666" }}>
          Processing {timetableData.subjects?.length || 0} subjects across{" "}
          {timetableData.classes?.length || 0} class(es)...
        </p>
      </div>
    );
  }

  return (
    <div className="timetable-step-5">
      <h3>Review Generated Timetable</h3>

      <div className="generation-info">
        <p>
          <strong>School:</strong> {timetableData.school} |{" "}
          <strong>Academic Year:</strong> {timetableData.academicYear} |{" "}
          <strong>Term:</strong> {timetableData.term} |{" "}
          <strong>Classes:</strong> {timetableData.classes?.length || 0}
        </p>
        <p>
          <strong>Subjects Assigned:</strong>{" "}
          {timetableData.subjects?.length || 0} |{" "}
          <strong>Total Periods:</strong>{" "}
          {timetableData.subjects?.reduce(
            (sum, s) => sum + (s.required_periods || 0),
            0
          ) || 0}
        </p>
      </div>

      <div className="generation-actions">
        <button className="btn-regenerate" onClick={handleGenerate}>
          {generatedTimetable ? "Regenerate" : "Generate"}
        </button>
        <button
          className="btn-save"
          onClick={handleSave}
          disabled={!generatedTimetable || errors.length > 0}
        >
          Save Timetable
        </button>
      </div>

      {errors.length > 0 && (
        <div className="generation-errors">
          <h4>Generation Issues:</h4>
          <ul>
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {formattedTimetable && generatedTimetable?.classes?.length > 0 ? (
        <div className="timetable-preview-container">
          <div className="class-selector">
            <h4>Select Class to View:</h4>
            <select
              value={activeClass || ""}
              onChange={(e) => handleClassChange(e.target.value)}
            >
              {generatedTimetable.classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>

          <div className="timetable-header">
            <h4>{formattedTimetable.school_class?.name} Timetable</h4>
            <p>
              {formattedTimetable.academic_year} - Term{" "}
              {formattedTimetable.term}
            </p>
          </div>

          <TimetableGrid timetable={formattedTimetable} />
        </div>
      ) : (
        !loading && (
          <div className="no-timetable">
            <p>
              No timetable data available. Click Generate to create a timetable.
            </p>
            <button onClick={handleGenerate}>Generate Now</button>
          </div>
        )
      )}

      <div className="step-actions">
        <button className="btn-prev" onClick={handlePrev}>
          Back: Set Constraints
        </button>
      </div>
    </div>
  );
};

export default TimetableSetupStep5;
