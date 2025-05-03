const DocumentMetrics = ({
  totalDocuments,
  mostDownloaded,
  uploadsThisMonth,
}) => {
  return (
    <div className="document-metrics">
      <div className="metric-card">
        <h3>Total Documents</h3>
        <p className="metric-value">{totalDocuments || 0}</p>
      </div>
      <div className="metric-card">
        <h3>Most Downloaded</h3>
        <p className="metric-value">{mostDownloaded?.title || "N/A"}</p>
        {mostDownloaded && (
          <p className="metric-subtext">{mostDownloaded.count} downloads</p>
        )}
      </div>
      <div className="metric-card">
        <h3>Uploads This Month</h3>
        <p className="metric-value">{uploadsThisMonth || 0}</p>
      </div>
    </div>
  );
};

export default DocumentMetrics;
