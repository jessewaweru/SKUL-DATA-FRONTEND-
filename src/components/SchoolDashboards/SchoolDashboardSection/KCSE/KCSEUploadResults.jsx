import { useState } from "react";
import { useApi } from "../../../../hooks/useApi";
import "./kcsemanagement.css";

const KCSEUploadResults = () => {
  const api = useApi();
  const [year, setYear] = useState(new Date().getFullYear());
  const [file, setFile] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [publish, setPublish] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    previewFile(selectedFile);
  };

  const previewFile = (file) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        if (file.name.endsWith(".csv")) {
          const csvData = e.target.result;
          const lines = csvData.split("\n");
          const headers = lines[0].split(",");
          const firstFewRows = lines.slice(1, 6).map((line) => line.split(","));

          setPreviewData({
            type: "csv",
            headers,
            rows: firstFewRows,
          });
        } else {
          // Handle Excel preview (would need a library like xlsx)
          setPreviewData({
            type: "excel",
            message: "Excel file selected - preview not available",
          });
        }
      } catch {
        setPreviewData({
          type: "error",
          message: "Could not preview file",
        });
      }
    };

    if (file.name.endsWith(".csv")) {
      reader.readAsText(file);
    } else {
      // For Excel, we'd need to implement actual parsing
      setPreviewData({
        type: "excel",
        message: "Excel file selected - preview not available",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !year) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("year", year);
    formData.append("publish", publish);

    try {
      const response = await api.upload(
        "/kcse/results/upload-results/",
        formData
      );
      setSuccess(
        `Successfully uploaded results for ${year}. ${response.data.processed} records processed.`
      );
      setFile(null);
      setPreviewData(null);
    } catch (err) {
      setError(
        err.response?.data?.error || err.message || "Failed to upload results"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-results-container">
      <h2>Upload KCSE Results</h2>
      <p className="instructions">
        Upload your school's KCSE results from the KNEC portal. The file should
        be in CSV or Excel format.
      </p>

      <form onSubmit={handleSubmit} className="kcse-upload-form">
        <div className="kcse-form-group">
          <label htmlFor="year">Examination Year:</label>
          <input
            type="number"
            id="year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            min="1989"
            max={new Date().getFullYear()}
            required
          />
        </div>

        <div className="kcse-form-group">
          <label htmlFor="file">Results File:</label>
          <input
            type="file"
            id="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileChange}
            required
          />
        </div>

        <div className="kcse-form-group checkbox-group">
          <input
            type="checkbox"
            id="publish"
            checked={publish}
            onChange={(e) => setPublish(e.target.checked)}
          />
          <label htmlFor="publish">Publish results immediately</label>
        </div>

        {previewData && (
          <div className="kcse-file-preview">
            <h3>File Preview</h3>
            {previewData.type === "csv" ? (
              <div className="preview-table">
                <table>
                  <thead>
                    <tr>
                      {previewData.headers.map((header, i) => (
                        <th key={i}>{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.rows.map((row, i) => (
                      <tr key={i}>
                        {row.map((cell, j) => (
                          <td key={j}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p>Showing first 5 rows...</p>
              </div>
            ) : (
              <p>{previewData.message}</p>
            )}
          </div>
        )}

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <button
          type="submit"
          disabled={loading || !file}
          className="kcse-upload-button"
        >
          {loading ? "Uploading..." : "Upload Results"}
        </button>
      </form>

      <div className="kcse-upload-instructions">
        <h3>Upload Requirements:</h3>
        <ul>
          <li>
            File must be in CSV or Excel format (as downloaded from KNEC portal)
          </li>
          <li>
            Must include columns: Index Number, Admission Number, Name, and all
            subject grades
          </li>
          <li>
            For best results, use the template downloaded from this system
          </li>
          <li>Ensure the year matches the actual examination year</li>
        </ul>
      </div>
    </div>
  );
};

export default KCSEUploadResults;
