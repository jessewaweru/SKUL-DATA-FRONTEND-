import { useApi } from "../../../../hooks/useApi";
import { useState } from "react";
import FeeUploadHistory from "../../../common/FeeManagement/FeeUploadHistory";
import FeeUploadForm from "../../../common/FeeManagement/FeeUploadForm";
import "./feemanagement.css";

const FeeUploads = () => {
  const api = useApi();
  const [activeTab, setActiveTab] = useState("upload");
  const [refreshHistory, setRefreshHistory] = useState(false);

  const handleUploadSuccess = () => {
    setRefreshHistory((prev) => !prev);
  };

  return (
    <div className="fee-uploads">
      <div className="upload-tabs">
        <button
          className={activeTab === "upload" ? "active" : ""}
          onClick={() => setActiveTab("upload")}
        >
          Upload Fees
        </button>
        <button
          className={activeTab === "history" ? "active" : ""}
          onClick={() => setActiveTab("history")}
        >
          Upload History
        </button>
      </div>

      <div className="upload-content">
        {activeTab === "upload" ? (
          <FeeUploadForm onSuccess={handleUploadSuccess} />
        ) : (
          <FeeUploadHistory refresh={refreshHistory} />
        )}
      </div>
    </div>
  );
};

export default FeeUploads;
