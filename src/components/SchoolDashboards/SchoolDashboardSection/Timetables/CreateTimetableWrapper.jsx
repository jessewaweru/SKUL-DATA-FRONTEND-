import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import useUser from "../../../../hooks/useUser";
import Stepper from "../../../common/SchoolTimetable/Stepper";
import "./timetables.css";
import { useApi } from "../../../../hooks/useApi";

const steps = [
  { id: "step-1", name: "Select Classes" },
  { id: "step-2", name: "Set Structure" },
  { id: "step-3", name: "Assign Subjects" },
  { id: "step-4", name: "Set Constraints" },
  { id: "step-5", name: "Generate & Review" },
];

const CreateTimetableWrapper = () => {
  const navigate = useNavigate();
  const { user, loading } = useUser();
  const api = useApi();

  const [timetableData, setTimetableData] = useState({
    school: "", // Initialize empty
    classes: [],
    academicYear: new Date().getFullYear().toString(),
    term: "1",
  });

  // Define updateData BEFORE using it in effects
  const updateData = (newData) => {
    setTimetableData((prev) => ({ ...prev, ...newData }));
  };

  // Fetch school ID
  useEffect(() => {
    if (loading || !user) return;

    // Method 1: Use school_id from user object (recommended)
    if (user.school_id) {
      updateData({ school: user.school_id });
      return;
    }

    // Method 2: Fallback for old API versions
    if (user?.school_admin_profile?.school?.id) {
      updateData({ school: user.school_admin_profile.school.id });
      return;
    }

    // Method 3: Hardcode for membley_admin (temporary)
    if (user.username === "membley_admin") {
      updateData({ school: "MMS001" });
      return;
    }

    console.error("No school ID found for user:", user);
  }, [user, loading]);

  if (loading) return <div>Loading user data...</div>;
  if (!user) return <div>Please login first</div>;
  if (!timetableData.school) return <div>Loading school information...</div>;

  const getCurrentStep = () => {
    const pathParts = window.location.pathname.split("/");
    return pathParts[pathParts.length - 1];
  };

  return (
    <div className="create-timetable-wrapper">
      <h2>Create New Timetable</h2>
      <Stepper
        steps={steps}
        currentStep={getCurrentStep()}
        onStepClick={(step) => navigate(`/dashboard/timetables/create/${step}`)}
      />
      <div className="timetable-form-container">
        <Outlet context={{ timetableData, updateData }} />
      </div>
    </div>
  );
};

export default CreateTimetableWrapper;
