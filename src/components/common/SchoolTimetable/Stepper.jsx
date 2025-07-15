import { NavLink } from "react-router-dom";
import "../../SchoolDashboards/SchoolDashboardSection/Timetables/timetables.css";

const Stepper = ({ steps, currentStep, onStepClick }) => {
  const currentStepIndex = steps.findIndex((step) => step.id === currentStep);

  return (
    <div className="stepper">
      {steps.map((step, index) => (
        <div
          key={step.id}
          className={`step ${index <= currentStepIndex ? "completed" : ""} ${
            step.id === currentStep ? "active" : ""
          }`}
        >
          <NavLink
            to={`#${step.id}`}
            onClick={(e) => {
              e.preventDefault();
              if (index <= currentStepIndex) {
                onStepClick(step.id);
              }
            }}
          >
            <div className="step-number">{index + 1}</div>
            <div className="step-name">{step.name}</div>
          </NavLink>
          {index < steps.length - 1 && <div className="step-connector"></div>}
        </div>
      ))}
    </div>
  );
};

export default Stepper;
