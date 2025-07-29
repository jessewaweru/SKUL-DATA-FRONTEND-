import { Outlet } from "react-router-dom";
import FeeManagementHeader from "../../../common/FeeManagement/FeeManagementHeader";
import "./feemanagement.css";

const FeeManagementPage = () => {
  return (
    <div className="fee-management-page">
      <FeeManagementHeader />
      <div className="fee-management-content">
        <Outlet />
      </div>
    </div>
  );
};

export default FeeManagementPage;
