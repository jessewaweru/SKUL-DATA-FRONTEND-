import { Outlet, useLocation } from "react-router-dom";
// import ParentsSidebar from "./ParentsSidebar";
import "../Parents/parents.css";

const ParentsPage = () => {
  const location = useLocation();
  const isDetailView = location.pathname.includes("/parents/");

  return (
    <div className="parents-container">
      {/* {isDetailView && <ParentsSidebar />} */}
      <div className={`parents-content ${isDetailView ? "with-sidebar" : ""}`}>
        <Outlet />
      </div>
    </div>
  );
};

export default ParentsPage;
