import { Outlet } from "react-router-dom";

const ExamResultsWrapper = () => {
  return (
    <div className="exam-results-wrapper">
      <Outlet />
    </div>
  );
};

export default ExamResultsWrapper;
