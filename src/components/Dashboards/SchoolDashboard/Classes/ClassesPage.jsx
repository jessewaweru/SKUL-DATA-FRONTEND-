import { Outlet } from "react-router-dom";
import "../Classes/classes.css";

const ClassesPage = () => {
  return (
    <div className="classes-container">
      <div className="classes-content">
        <Outlet />
      </div>
    </div>
  );
};

export default ClassesPage;
