import { useState } from "react";
import { useApi } from "../../../../hooks/useApi";
import "./kcsemanagement.css";

const KCSETemplateDownload = () => {
  const api = useApi();
  const [formData, setFormData] = useState({
    year: new Date().getFullYear(),
    class_name: "Form 4",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await api.post(
        "/kcse/results/download-template/",
        formData,
        {
          responseType: "blob",
        }
      );

      // Create a download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `kcse_template_${formData.year}.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);

      setSuccess("Template downloaded successfully!");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to download template"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="template-download-container">
      <h2>Download KCSE Student Template</h2>
      <p className="instructions">
        Download a CSV template with your students' details to prepare for KCSE
        results upload. The template will include admission numbers, names, and
        streams - you'll only need to add index numbers.
      </p>

      <form onSubmit={handleSubmit} className="template-form">
        <div className="kcse-form-group">
          <label htmlFor="year">Examination Year:</label>
          <input
            type="number"
            id="year"
            name="year"
            value={formData.year}
            onChange={handleChange}
            min="1989"
            max={new Date().getFullYear()}
            required
          />
        </div>

        <div className="kcse-form-group">
          <label htmlFor="class_name">Class Name:</label>
          <input
            type="text"
            id="class_name"
            name="class_name"
            value={formData.class_name}
            onChange={handleChange}
            placeholder="e.g. Form 4 East"
            required
          />
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <button type="submit" disabled={loading} className="download-button">
          {loading ? "Preparing Template..." : "Download Template"}
        </button>
      </form>

      <div className="template-instructions">
        <h3>Instructions:</h3>
        <ol>
          <li>Download the template for the correct year and class</li>
          <li>Fill in the index numbers for each student</li>
          <li>Save the file (do not modify other columns)</li>
          <li>Upload the completed template along with the KCSE results</li>
        </ol>
      </div>
    </div>
  );
};

export default KCSETemplateDownload;
