import { useState, useCallback } from "react";
import { useTimetableApi } from "./useTimetableApi";

export const useTimetableGenerator = () => {
  const api = useTimetableApi();
  const [loading, setLoading] = useState(false);
  const [generatedTimetable, setGeneratedTimetable] = useState(null);
  const [errors, setErrors] = useState([]);

  const generate = useCallback(
    async (config) => {
      try {
        setLoading(true);
        setErrors([]);

        // FIXED: Validate using correct field names
        if (
          !config.school_class_ids ||
          !Array.isArray(config.school_class_ids) ||
          config.school_class_ids.length === 0
        ) {
          throw new Error("At least one class ID is required");
        }

        if (!config.academic_year) {
          throw new Error("Academic year is required");
        }

        if (!config.term) {
          throw new Error("Term is required");
        }

        // Log what we're sending
        console.log("=== useTimetableGenerator: Sending to API ===");
        console.log("Class IDs:", config.school_class_ids);
        console.log("Academic Year:", config.academic_year);
        console.log("Term:", config.term);
        console.log(
          "Subject assignments:",
          config.subject_assignments?.length || 0
        );
        console.log("Constraints:", config.constraints?.length || 0);

        // Log subject details
        if (
          config.subject_assignments &&
          config.subject_assignments.length > 0
        ) {
          console.log("\nSubjects being sent to API:");
          config.subject_assignments.forEach((sub, idx) => {
            console.log(
              `  ${idx + 1}. ${sub.subject_name} (ID: ${
                sub.subject_id
              }) - Teacher: ${sub.teacher_id}, Periods: ${sub.required_periods}`
            );
          });
        } else {
          console.warn("WARNING: No subject assignments in config!");
        }

        const payload = {
          school_class_ids: config.school_class_ids,
          academic_year: config.academic_year,
          term: parseInt(config.term),
          regenerate_existing: config.regenerate_existing !== false,
          apply_constraints: config.apply_constraints !== false,
          subject_assignments: config.subject_assignments || [],
        };

        console.log("\n=== Payload to API ===");
        console.log(JSON.stringify(payload, null, 2));

        const response = await api.generateTimetable(payload);

        if (response.data) {
          console.log("\n=== Generation Response ===");
          console.log("Timetable ID:", response.data.id);
          console.log("Lessons created:", response.data.lessons?.length || 0);
          console.log("Time slots:", response.data.time_slots?.length || 0);
          console.log("Errors:", response.data.errors);

          // Log unique subjects in generated timetable
          if (response.data.lessons && response.data.lessons.length > 0) {
            const uniqueSubjects = new Set();
            response.data.lessons.forEach((lesson) => {
              if (lesson.subject_details?.name) {
                uniqueSubjects.add(lesson.subject_details.name);
              }
            });
            console.log(
              "\nUnique subjects in generated timetable:",
              Array.from(uniqueSubjects)
            );
            console.log("Total unique subjects:", uniqueSubjects.size);
          }

          setGeneratedTimetable(response.data);
          setErrors(response.data.errors || []);
          return response.data;
        } else {
          throw new Error("No data received from server");
        }
      } catch (error) {
        console.error("=== Error in useTimetableGenerator ===");
        console.error("Error:", error);
        console.error("Error response:", error.response?.data);

        const errorMessage =
          error.response?.data?.error ||
          error.response?.data?.detail ||
          error.message ||
          "Failed to generate timetable";

        setErrors([errorMessage]);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [api]
  );

  return {
    loading,
    generatedTimetable,
    errors,
    generate,
    reset: () => {
      setGeneratedTimetable(null);
      setErrors([]);
    },
  };
};
