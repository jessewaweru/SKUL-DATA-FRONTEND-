import { useState } from "react";
import { useTimetableApi } from "./useTimetableApi";

export const useTimetableGenerator = () => {
  const api = useTimetableApi();
  const [loading, setLoading] = useState(false);
  const [generatedTimetable, setGeneratedTimetable] = useState(null);
  const [errors, setErrors] = useState([]);

  const generate = async (config) => {
    try {
      setLoading(true);
      setErrors([]);
      const response = await api.generateTimetable(config);
      setGeneratedTimetable(response.data);
      setErrors(response.data.errors || []);
      return response.data;
    } catch (error) {
      console.error("Error generating timetable:", error);
      setErrors(["Failed to generate timetable. Please try again."]);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const regenerate = async (timetableId, config) => {
    try {
      setLoading(true);
      setErrors([]);
      const response = await api.regenerateTimetable(timetableId, config);
      setGeneratedTimetable(response.data);
      setErrors(response.data.errors || []);
      return response.data;
    } catch (error) {
      console.error("Error regenerating timetable:", error);
      setErrors(["Failed to regenerate timetable. Please try again."]);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    generatedTimetable,
    errors,
    generate,
    regenerate,
    reset: () => {
      setGeneratedTimetable(null);
      setErrors([]);
    },
  };
};
