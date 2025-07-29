import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import "./exammanagement.css";

const ExamSetupWrapper = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(1);
  const [examData, setExamData] = useState({
    name: "",
    exam_type: null,
    term: "",
    academic_year: "",
    school_class: null,
    grading_system: null,
    subjects: [],
    start_date: "",
    end_date: "",
  });

  const handleNext = (stepData) => {
    setExamData((prev) => ({ ...prev, ...stepData }));
    setActiveStep((prev) => prev + 1);
    navigate(`step-${activeStep + 1}`);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
    navigate(`step-${activeStep - 1}`);
  };

  const handleSubmit = async () => {
    // API call to save exam
    console.log("Submitting exam:", examData);
    // navigate('/dashboard/exams');
  };

  return (
    <div className="exam-setup-wizard">
      <div className="wizard-steps">
        <div className={`wizard-step ${activeStep >= 1 ? "active" : ""}`}>
          <span>1. Basic Info</span>
        </div>
        <div className={`wizard-step ${activeStep >= 2 ? "active" : ""}`}>
          <span>2. Subjects & Grading</span>
        </div>
        <div className={`wizard-step ${activeStep >= 3 ? "active" : ""}`}>
          <span>3. Schedule</span>
        </div>
      </div>

      <div className="wizard-content">
        <Outlet context={{ examData, handleNext, handleBack, handleSubmit }} />
      </div>
    </div>
  );
};

export default ExamSetupWrapper;
