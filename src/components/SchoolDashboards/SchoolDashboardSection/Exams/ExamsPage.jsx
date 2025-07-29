import { Outlet } from "react-router-dom";
import "./exammanagement.css";

const ExamsPage = () => {
  return (
    <div className="exams-container">
      <div className="exams-content">
        <Outlet />
      </div>
    </div>
  );
};

export default ExamsPage;
