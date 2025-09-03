import { useEffect, useState } from "react";
import api from "../../../../../services/api";
import DocumentMetrics from "./DocumentMetrics";
import DocumentTypeChart from "../Charts/DocumentTypeChart";
import DocumentUploadsChart from "../Charts/DocumentUploadsChart";
import DocumentAccessChart from "../Charts/DocumentAccessChart";
import "../../Analytics/analytics.css";

const DocumentAnalytics = () => {
  const [documentData, setDocumentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDocumentData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Add default date range parameters to avoid validation error
        const params = new URLSearchParams({
          date_range: "30_days", // or you can use start_date and end_date
        });

        const response = await api.get(
          `/analytics/documents/?${params.toString()}`
        );

        console.log("Document analytics response:", response.data);
        setDocumentData(response.data);
      } catch (error) {
        console.error("Error fetching document analytics:", error);
        setError(error);

        // Log more detailed error information
        if (error.response) {
          console.error("Error response data:", error.response.data);
          console.error("Error response status:", error.response.status);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDocumentData();
  }, []);

  if (loading) {
    return <div className="loading-spinner">Loading document analytics...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <h3>Error Loading Document Analytics</h3>
        <p>Unable to fetch document analytics data. Please try again later.</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  if (!documentData) {
    return (
      <div className="no-data-container">
        <h3>No Document Analytics Data</h3>
        <p>No analytics data available for documents.</p>
      </div>
    );
  }

  // Calculate total uploads this month from uploads_by_user array
  const totalUploads =
    documentData?.uploads_by_user?.reduce(
      (sum, user) => sum + (user.upload_count || 0),
      0
    ) || 0;

  // Find most downloaded document (if download_frequency has data)
  const mostDownloaded =
    documentData?.download_frequency &&
    documentData.download_frequency.length > 0
      ? documentData.download_frequency[0]
      : null;

  return (
    <div
      className="document-analytics"
      style={{
        padding: "20px",
        backgroundColor: "#f5f6fa",
        minHeight: "100vh",
      }}
    >
      <h2 style={{ color: "#2c3e50", marginBottom: "20px", fontSize: "28px" }}>
        Document Analytics
      </h2>
      <DocumentMetrics
        totalDocuments={documentData?.total_documents || 0}
        mostDownloaded={mostDownloaded}
        uploadsThisMonth={totalUploads}
      />

      <div
        className="document-charts-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        <div
          className="chart-container"
          style={{
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <h3 style={{ margin: "0 0 15px 0", color: "#333" }}>
            Document Types Distribution
          </h3>
          {documentData?.types_distribution &&
          documentData.types_distribution.length > 0 ? (
            <DocumentTypeChart data={documentData.types_distribution} />
          ) : (
            <div className="no-chart-data">
              No document types data available
            </div>
          )}
        </div>

        <div
          className="chart-container"
          style={{
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <h3 style={{ margin: "0 0 15px 0", color: "#333" }}>
            Uploads by User
          </h3>
          {documentData?.uploads_by_user &&
          documentData.uploads_by_user.length > 0 ? (
            <DocumentUploadsChart data={documentData.uploads_by_user} />
          ) : (
            <div className="no-chart-data">No uploads data available</div>
          )}
        </div>

        <div
          className="chart-container"
          style={{
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <h3 style={{ margin: "0 0 15px 0", color: "#333" }}>
            Access by Role
          </h3>
          {documentData?.access_by_role &&
          documentData.access_by_role.length > 0 ? (
            <DocumentAccessChart data={documentData.access_by_role} />
          ) : (
            <div
              className="no-chart-data"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "300px",
                color: "#666",
                fontStyle: "italic",
                backgroundColor: "#f9f9f9",
                border: "1px dashed #ddd",
                borderRadius: "8px",
                textAlign: "center",
                padding: "20px",
              }}
            >
              <p style={{ margin: "0 0 10px 0", fontSize: "16px" }}>
                No access data available
              </p>
              <small style={{ color: "#999" }}>
                Document access tracking may not be enabled yet
              </small>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentAnalytics;
