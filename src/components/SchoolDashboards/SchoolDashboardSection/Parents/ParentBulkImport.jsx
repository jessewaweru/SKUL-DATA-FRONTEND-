// ParentBulkImport.jsx
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  FiUpload,
  FiDownload,
  FiX,
  FiCheck,
  FiAlertCircle,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import {
  bulkImportParents,
  downloadParentTemplate,
} from "../../../../services/parentsApi";
import "../Parents/parents.css";

const ParentBulkImport = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [file, setFile] = useState(null);
  const [sendWelcomeEmail, setSendWelcomeEmail] = useState(false);
  const [defaultStatus, setDefaultStatus] = useState("ACTIVE");
  const [importResults, setImportResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const mutation = useMutation({
    mutationFn: (formData) =>
      bulkImportParents(formData.file, {
        sendWelcomeEmail: formData.sendWelcomeEmail,
        defaultStatus: formData.defaultStatus,
      }),
    onSuccess: (data) => {
      setImportResults(data);
      queryClient.invalidateQueries(["parents"]);
    },
    onError: (error) => {
      setImportResults({
        error: error.message,
        success: [],
        errors: [],
      });
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file) return;
    setIsLoading(true);
    mutation.mutate({
      file,
      sendWelcomeEmail,
      defaultStatus,
    });
  };

  const handleDownloadTemplate = async () => {
    try {
      const blob = await downloadParentTemplate();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "parents_import_template.xlsx";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (error) {
      console.error("Failed to download template:", error);
    }
  };

  return (
    <div className="bulk-import-container">
      <div className="bulk-import-header">
        <h2>Bulk Import Parents</h2>
        <button
          className="cancel-button"
          onClick={() => navigate("/dashboard/parents")}
        >
          <FiX /> Cancel
        </button>
      </div>

      <div className="import-instructions">
        <p>
          Import multiple parents at once by uploading a CSV or Excel file.{" "}
          <button
            type="button"
            onClick={handleDownloadTemplate}
            className="text-link"
          >
            Download template
          </button>{" "}
          to ensure proper formatting.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="import-form">
        <div className="form-group">
          <label>Upload File (CSV or Excel)</label>
          <div className="file-upload">
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={(e) => setFile(e.target.files[0])}
              required
            />
            {file && (
              <div className="file-info">
                <span>{file.name}</span>
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="remove-file"
                >
                  <FiX />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={sendWelcomeEmail}
              onChange={(e) => setSendWelcomeEmail(e.target.checked)}
            />{" "}
            Send welcome email to new parents
          </label>
        </div>

        <div className="form-group">
          <label>Default Status</label>
          <select
            value={defaultStatus}
            onChange={(e) => setDefaultStatus(e.target.value)}
          >
            <option value="ACTIVE">Active</option>
            <option value="PENDING">Pending Approval</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>

        <div className="form-actions">
          <button type="submit" className="primary" disabled={isLoading}>
            {isLoading ? "Importing..." : "Import Parents"} <FiUpload />
          </button>
        </div>
      </form>

      {importResults && (
        <div className="import-results">
          <h3>Import Results</h3>

          {importResults.error ? (
            <div className="error-message">
              <FiAlertCircle /> {importResults.error}
            </div>
          ) : (
            <>
              <div className="summary">
                <div className="summary-item success">
                  <FiCheck /> {importResults.success.length} successful
                </div>
                <div className="summary-item error">
                  <FiAlertCircle /> {importResults.errors.length} failed
                </div>
              </div>

              {importResults.errors.length > 0 && (
                <div className="errors-list">
                  <h4>Error Details:</h4>
                  <table>
                    <thead>
                      <tr>
                        <th>Row</th>
                        <th>Email</th>
                        <th>Error</th>
                      </tr>
                    </thead>
                    <tbody>
                      {importResults.errors.map((error, index) => (
                        <tr key={index}>
                          <td>{error.row}</td>
                          <td>{error.email || "N/A"}</td>
                          <td>
                            {typeof error.error === "string"
                              ? error.error
                              : JSON.stringify(error.error)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ParentBulkImport;
