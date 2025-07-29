import { useState } from "react";
import FeeSummaryReport from "../../../common/FeeManagement/FeeSummaryReport";
import FeeClassReport from "../../../common/FeeManagement/FeeClassReport";
import FeeDefaulterReport from "../../../common/FeeManagement/FeeDefaulterReport";
import "./feemanagement.css";

const FeeReports = () => {
  const [activeReport, setActiveReport] = useState("summary");

  return (
    <div className="fee-reports">
      <div className="report-selector">
        <h2>Fee Reports</h2>
        <div className="report-options">
          <button
            className={activeReport === "summary" ? "active" : ""}
            onClick={() => setActiveReport("summary")}
          >
            Summary Report
          </button>
          <button
            className={activeReport === "class" ? "active" : ""}
            onClick={() => setActiveReport("class")}
          >
            Class Report
          </button>
          <button
            className={activeReport === "defaulters" ? "active" : ""}
            onClick={() => setActiveReport("defaulters")}
          >
            Defaulter Report
          </button>
        </div>
      </div>

      <div className="fee-report-content">
        {activeReport === "summary" && <FeeSummaryReport />}
        {activeReport === "class" && <FeeClassReport />}
        {activeReport === "defaulters" && <FeeDefaulterReport />}
      </div>
    </div>
  );
};

export default FeeReports;
