import { Outlet } from "react-router-dom";
import TeachersHeader from "./TeachersHeader";
import "./teachers.css";

const TeachersPage = () => {
  return (
    <div className="teachers-container">
      <TeachersHeader />
      <Outlet />
    </div>
  );
};

export default TeachersPage;
