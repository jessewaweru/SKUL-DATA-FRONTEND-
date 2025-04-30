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
  //   const api = useApi();

  useEffect(() => {
    const fetchDocumentData = async () => {
      try {
        setLoading(true);
        const response = await api.get("/analytics/documents/");
        setDocumentData(response.data);
      } catch (error) {
        console.error("Error fetching document analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocumentData();
  }, []);

  if (loading) {
    return <div className="loading-spinner">Loading document analytics...</div>;
  }

  return (
    <div className="document-analytics">
      <DocumentMetrics
        totalDocuments={documentData?.total_documents}
        mostDownloaded={documentData?.download_frequency?.top}
        uploadsThisMonth={documentData?.uploads_by_user?.count}
      />

      <div className="document-charts-grid">
        <div className="chart-container">
          <h3>Document Types</h3>
          <DocumentTypeChart data={documentData?.types_distribution} />
        </div>
        <div className="chart-container">
          <h3>Uploads by User</h3>
          <DocumentUploadsChart data={documentData?.uploads_by_user?.details} />
        </div>
        <div className="chart-container">
          <h3>Access by Role</h3>
          <DocumentAccessChart data={documentData?.access_by_role} />
        </div>
      </div>
    </div>
  );
};

export default DocumentAnalytics;
