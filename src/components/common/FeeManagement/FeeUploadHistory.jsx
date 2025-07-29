import { useEffect, useState } from "react";
import { useApi } from "../../../hooks/useApi";
import "../../SchoolDashboards/SchoolDashboardSection/FeeManagement/feemanagement.css";

const FeeUploadHistory = ({ refresh }) => {
  const api = useApi();
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUploadHistory = async () => {
      try {
        const response = await api.get("/api/fees/fee-uploads");
        setUploads(response.data);
      } catch (err) {
        setError(err.message || "Failed to fetch upload history");
      } finally {
        setLoading(false);
      }
    };

    fetchUploadHistory();
  }, [refresh]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "completed":
        return "status-completed";
      case "failed":
        return "status-failed";
      case "processing":
        return "status-processing";
      default:
        return "status-pending";
    }
  };

  if (loading) return <div className="loading">Loading upload history...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="upload-history">
      <h3>Upload History</h3>
      {uploads.length === 0 ? (
        <p>No upload history found</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Class</th>
              <th>Term/Year</th>
              <th>Status</th>
              <th>Records</th>
              <th>Success</th>
              <th>Failed</th>
            </tr>
          </thead>
          <tbody>
            {uploads.map((upload) => (
              <tr key={upload.id}>
                <td>{formatDate(upload.created_at)}</td>
                <td>{upload.school_class?.name || "N/A"}</td>
                <td>
                  {upload.term} {upload.year}
                </td>
                <td>
                  <span
                    className={`fee-status-badge ${getStatusClass(
                      upload.status
                    )}`}
                  >
                    {upload.status}
                  </span>
                </td>
                <td>{upload.total_records}</td>
                <td>{upload.successful_records}</td>
                <td>{upload.failed_records}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default FeeUploadHistory;
