import { useState } from "react";
import { useApi } from "../../../hooks/useApi";
import "../../SchoolDashboards/SchoolDashboardSection/FeeManagement/feemanagement.css";

const FeeUploadForm = ({ onSuccess }) => {
  const api = useApi();
  const [file, setFile] = useState(null);
  const [classId, setClassId] = useState("");
  const [term, setTerm] = useState("");
  const [year, setYear] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !classId || !term || !year) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("school_class_id", classId);
      formData.append("term", term);
      formData.append("year", year);

      await api.upload("/api/fees/fee-uploads", formData);

      setSuccess(true);
      onSuccess();
      // Reset form
      setFile(null);
      setClassId("");
      setTerm("");
      setYear("");
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message || "Failed to upload file");
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = async () => {
    try {
      const response = await api.download(
        "/api/fees/fee-csv-templates/download",
        {
          school_class_id: classId,
          term,
          year,
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `fee_template_${classId}_${term}_${year}.csv`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError(err.message || "Failed to download template");
    }
  };

  return (
    <div className="fee-upload-form">
      <h3>Upload Fee Records</h3>

      {success && (
        <div className="success-message">
          File uploaded successfully! Processing in progress.
        </div>
      )}

      {error && <div className="fee-error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="payment-form-group">
          <label>Class</label>
          <select
            value={classId}
            onChange={(e) => setClassId(e.target.value)}
            required
          >
            <option value="">Select Class</option>
            {/* Options would be populated from API */}
          </select>
        </div>

        <div className="payment-form-group">
          <label>Term</label>
          <select
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            required
          >
            <option value="">Select Term</option>
            <option value="term_1">Term 1</option>
            <option value="term_2">Term 2</option>
            <option value="term_3">Term 3</option>
          </select>
        </div>

        <div className="payment-form-group">
          <label>Year</label>
          <input
            type="text"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="YYYY"
            required
          />
        </div>

        <div className="payment-form-group">
          <label>CSV File</label>
          <input
            type="file"
            accept=".csv"
            onChange={(e) => setFile(e.target.files[0])}
            required
          />
        </div>

        <div className="fee-form-actions">
          <button
            type="button"
            onClick={downloadTemplate}
            disabled={!classId || !term || !year}
          >
            Download Template
          </button>
          <button type="submit" disabled={loading}>
            {loading ? "Uploading..." : "Upload File"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FeeUploadForm;
