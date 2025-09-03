const DocumentMetrics = ({
  totalDocuments,
  mostDownloaded,
  uploadsThisMonth,
}) => {
  // Helper function to safely get the most downloaded document info
  const getMostDownloadedInfo = () => {
    if (!mostDownloaded) return { title: "No data available", count: 0 };

    // Handle different possible data structures
    if (typeof mostDownloaded === "object") {
      if (mostDownloaded.title || mostDownloaded.name) {
        return {
          title:
            mostDownloaded.title || mostDownloaded.name || "Unknown Document",
          count: mostDownloaded.count || mostDownloaded.downloads || 0,
        };
      }
      // If it's an array, get the first item
      if (Array.isArray(mostDownloaded) && mostDownloaded.length > 0) {
        const first = mostDownloaded[0];
        return {
          title: first.title || first.name || "Unknown Document",
          count: first.count || first.downloads || 0,
        };
      }
    }

    return { title: "No data available", count: 0 };
  };

  const downloadedInfo = getMostDownloadedInfo();

  return (
    <div
      className="document-metrics"
      style={{
        display: "flex",
        gap: "20px",
        marginBottom: "20px",
        flexWrap: "wrap",
      }}
    >
      <div
        className="metric-card"
        style={{
          backgroundColor: "#fff",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          flex: "1",
          minWidth: "200px",
          textAlign: "center",
        }}
      >
        <h3
          style={{
            color: "#666",
            fontSize: "14px",
            margin: "0 0 10px 0",
            textTransform: "uppercase",
          }}
        >
          Total Documents
        </h3>
        <p
          className="metric-value"
          style={{
            fontSize: "32px",
            fontWeight: "bold",
            color: "#2c3e50",
            margin: "0 0 5px 0",
          }}
        >
          {totalDocuments || 0}
        </p>
        <p
          className="metric-subtext"
          style={{ color: "#7f8c8d", fontSize: "12px", margin: 0 }}
        >
          Across all categories
        </p>
      </div>

      <div
        className="metric-card"
        style={{
          backgroundColor: "#fff",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          flex: "1",
          minWidth: "200px",
          textAlign: "center",
        }}
      >
        <h3
          style={{
            color: "#666",
            fontSize: "14px",
            margin: "0 0 10px 0",
            textTransform: "uppercase",
          }}
        >
          Most Downloaded
        </h3>
        <p
          className="metric-value"
          title={downloadedInfo.title}
          style={{
            fontSize:
              downloadedInfo.title === "No data available" ? "16px" : "18px",
            fontWeight: "bold",
            color:
              downloadedInfo.title === "No data available"
                ? "#95a5a6"
                : "#2c3e50",
            margin: "0 0 5px 0",
            lineHeight: "1.2",
          }}
        >
          {downloadedInfo.title.length > 20
            ? `${downloadedInfo.title.substring(0, 20)}...`
            : downloadedInfo.title}
        </p>
        <p
          className="metric-subtext"
          style={{ color: "#7f8c8d", fontSize: "12px", margin: 0 }}
        >
          {downloadedInfo.count > 0
            ? `${downloadedInfo.count} downloads`
            : "No downloads tracked"}
        </p>
      </div>

      <div
        className="metric-card"
        style={{
          backgroundColor: "#fff",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          flex: "1",
          minWidth: "200px",
          textAlign: "center",
        }}
      >
        <h3
          style={{
            color: "#666",
            fontSize: "14px",
            margin: "0 0 10px 0",
            textTransform: "uppercase",
          }}
        >
          Total Uploads
        </h3>
        <p
          className="metric-value"
          style={{
            fontSize: "32px",
            fontWeight: "bold",
            color: "#27ae60",
            margin: "0 0 5px 0",
          }}
        >
          {uploadsThisMonth || 0}
        </p>
        <p
          className="metric-subtext"
          style={{ color: "#7f8c8d", fontSize: "12px", margin: 0 }}
        >
          By all users
        </p>
      </div>
    </div>
  );
};

export default DocumentMetrics;
