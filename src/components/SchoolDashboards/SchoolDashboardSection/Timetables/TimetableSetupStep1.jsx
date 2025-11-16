import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { useTimetableApi } from "../../../../hooks/useTimetableApi";
import { useNavigate } from "react-router-dom";
import ClassSelectionCard from "../../../common/SchoolTimetable/ClassSelectionCard";
import "./timetables.css";
import useUser from "../../../../hooks/useUser";
import { useCallback } from "react";

// TimetableSetupStep1.jsx - Updated with better school ID handling
const TimetableSetupStep1 = () => {
  const { timetableData, updateData } = useOutletContext();
  const { user } = useUser();
  const api = useTimetableApi();
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper function to get school ID
  const getSchoolId = useCallback(() => {
    if (!user) return null;

    return (
      user.school_id ||
      user.school?.id ||
      user.school_admin_profile?.school?.id ||
      user.administrator_profile?.school?.id ||
      user.roleSchool
    );
  }, [user]);

  // Set school from user context
  useEffect(() => {
    if (!user) {
      console.log("Waiting for user data...");
      return;
    }

    const schoolId = getSchoolId();

    if (!schoolId) {
      console.error("No school ID found in user:", user);
      setError("School information not available. Please contact support.");
      setLoading(false);
      return;
    }

    console.log("Found school ID:", schoolId);

    if (!timetableData.school || timetableData.school !== schoolId) {
      updateData({
        school: schoolId,
        classes: [],
        academicYear: new Date().getFullYear().toString(),
        term: "1",
      });
    }
  }, [user, getSchoolId, timetableData, updateData]);

  // Fetch classes for the school
  useEffect(() => {
    const fetchClasses = async () => {
      const schoolId = getSchoolId();

      if (!schoolId) {
        console.log("No school ID available yet");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        console.log("Fetching classes for school:", schoolId);
        const response = await api.getClasses(schoolId);

        console.log("Classes API response:", response);

        let classesData = [];
        if (response.data) {
          if (response.data.results && Array.isArray(response.data.results)) {
            classesData = response.data.results;
          } else if (Array.isArray(response.data)) {
            classesData = response.data;
          } else if (typeof response.data === "object") {
            classesData = [response.data];
          }
        }

        console.log("Loaded classes:", classesData.length);
        setClasses(classesData);
      } catch (err) {
        console.error("Failed to load classes:", err);
        const errorMessage =
          err.response?.data?.error ||
          err.response?.data?.detail ||
          err.message ||
          "Failed to load classes";
        setError(errorMessage);
        setClasses([]);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchClasses();
    }
  }, [user, getSchoolId, api]);

  const handleClassToggle = (classId) => {
    const updatedClasses = timetableData.classes?.includes(classId)
      ? timetableData.classes.filter((id) => id !== classId)
      : [...(timetableData.classes || []), classId];

    updateData({ classes: updatedClasses });
  };

  const handleNext = () => {
    if (!timetableData.classes || timetableData.classes.length === 0) {
      alert("Please select at least one class");
      return;
    }

    if (!timetableData.academicYear) {
      alert("Please enter an academic year");
      return;
    }

    navigate("/dashboard/timetables/create/step-2");
  };

  // Show loading state
  if (!user || loading) {
    return (
      <div className="timetable-step-1">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="timetable-step-1">
        <div className="error">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="timetable-step-1">
      <h3>Create New Timetable - Step 1: Basic Information</h3>

      <div className="form-group">
        <label>Academic Year:</label>
        <input
          type="text"
          value={timetableData.academicYear || ""}
          onChange={(e) => updateData({ academicYear: e.target.value })}
          placeholder="e.g. 2024"
          required
        />
      </div>

      <div className="form-group">
        <label>Term:</label>
        <select
          value={timetableData.term || "1"}
          onChange={(e) => updateData({ term: e.target.value })}
        >
          <option value="1">Term 1</option>
          <option value="2">Term 2</option>
          <option value="3">Term 3</option>
        </select>
      </div>

      <h4>Select Classes for Timetable</h4>

      {classes.length === 0 ? (
        <div className="no-classes">
          <p>No classes available for this school.</p>
          <p>Please create classes first in the Classes section.</p>
        </div>
      ) : (
        <div className="classes-grid">
          {classes.map((cls) => (
            <ClassSelectionCard
              key={cls.id}
              cls={cls}
              selected={timetableData.classes?.includes(cls.id) || false}
              onToggle={handleClassToggle}
            />
          ))}
        </div>
      )}

      <div className="step-info">
        <p>
          <strong>Selected:</strong> {timetableData.classes?.length || 0}{" "}
          classes
        </p>
      </div>

      <div className="step-actions">
        <button
          className="btn-next"
          onClick={handleNext}
          disabled={
            !timetableData.classes ||
            timetableData.classes.length === 0 ||
            !timetableData.academicYear
          }
        >
          Next: Set Structure
        </button>
      </div>
    </div>
  );
};

export default TimetableSetupStep1;
