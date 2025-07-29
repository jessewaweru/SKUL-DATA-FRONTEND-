import { Outlet } from "react-router-dom";

const ExamReportsWrapper = () => {
  return (
    <div className="exam-reports-wrapper">
      <Outlet />
    </div>
  );
};

export default ExamReportsWrapper;
