import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  FiUpload,
  FiDownload,
  FiX,
  FiCheck,
  FiAlertCircle,
  FiInfo,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import {
  bulkImportParents,
  downloadParentTemplate,
} from "../../../../services/parentsApi";
import useUser from "../../../../hooks/useUser";
import "../Parents/parents.css";

const ParentBulkImport = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { schoolId } = useUser(); // Get school ID

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
        schoolId: formData.schoolId, // Add school ID
      }),
    onSuccess: (data) => {
      console.log("Import successful:", data);
      setImportResults(data);
      queryClient.invalidateQueries(["parents"]);
    },
    onError: (error) => {
      console.error("Import error:", error);
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
    if (!file) {
      alert("Please select a file to upload");
      return;
    }
    if (!schoolId) {
      alert("School ID not found. Please try logging in again.");
      return;
    }

    setIsLoading(true);
    setImportResults(null); // Reset previous results

    mutation.mutate({
      file,
      sendWelcomeEmail,
      defaultStatus,
      schoolId, // Include school ID
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
      alert("Failed to download template. Please try again.");
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validate file size (5MB max as per backend)
      const maxSize = 5 * 1024 * 1024;
      if (selectedFile.size > maxSize) {
        alert("File too large. Maximum size is 5MB.");
        return;
      }

      // Validate file type
      const validTypes = [".csv", ".xlsx", ".xls"];
      const fileExt = selectedFile.name
        .toLowerCase()
        .substring(selectedFile.name.lastIndexOf("."));
      if (!validTypes.includes(fileExt)) {
        alert("Invalid file type. Please upload a CSV or Excel file.");
        return;
      }

      setFile(selectedFile);
      setImportResults(null); // Reset results when new file is selected
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
        <div className="instruction-box">
          <FiInfo />
          <div>
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
            <ul className="instruction-list">
              <li>Required fields: email, first_name, last_name</li>
              <li>
                Optional fields: phone_number, address, occupation,
                preferred_language
              </li>
              <li>
                To assign children: add student IDs in the children_ids column
                (comma-separated)
              </li>
              <li>
                Phone numbers should include country code (e.g., +254712345678)
              </li>
              <li>Maximum file size: 5MB</li>
            </ul>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="import-form">
        <div className="form-group">
          <label>Upload File (CSV or Excel) *</label>
          <div className="file-upload">
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileChange}
              required
              disabled={isLoading}
            />
            {file && (
              <div className="file-info">
                <span className="file-name">{file.name}</span>
                <span className="file-size">
                  ({(file.size / 1024).toFixed(2)} KB)
                </span>
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="remove-file"
                  disabled={isLoading}
                >
                  <FiX />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={sendWelcomeEmail}
              onChange={(e) => setSendWelcomeEmail(e.target.checked)}
              disabled={isLoading}
            />
            <span>Send welcome email to new parents</span>
          </label>
          <p className="help-text">
            Parents will receive an email with their login credentials
          </p>
        </div>

        <div className="form-group">
          <label>Default Status *</label>
          <select
            value={defaultStatus}
            onChange={(e) => setDefaultStatus(e.target.value)}
            disabled={isLoading}
          >
            <option value="ACTIVE">Active</option>
            <option value="PENDING">Pending Approval</option>
            <option value="INACTIVE">Inactive</option>
          </select>
          <p className="help-text">
            All imported parents will be assigned this status by default
          </p>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="secondary"
            onClick={() => navigate("/dashboard/parents")}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="primary"
            disabled={isLoading || !file}
          >
            {isLoading ? (
              <>
                <span className="spinner-small"></span>
                Importing...
              </>
            ) : (
              <>
                <FiUpload /> Import Parents
              </>
            )}
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
                  <FiCheck />
                  <div>
                    <strong>{importResults.success?.length || 0}</strong>
                    <span>Successful</span>
                  </div>
                </div>
                <div className="summary-item error">
                  <FiAlertCircle />
                  <div>
                    <strong>{importResults.errors?.length || 0}</strong>
                    <span>Failed</span>
                  </div>
                </div>
              </div>

              {importResults.success?.length > 0 && (
                <div className="success-list">
                  <h4>
                    Successfully Imported ({importResults.success.length})
                  </h4>
                  <div className="success-items">
                    {importResults.success.slice(0, 5).map((item, index) => (
                      <div key={index} className="success-item">
                        <FiCheck />
                        <span>
                          {item.name} ({item.email})
                        </span>
                      </div>
                    ))}
                    {importResults.success.length > 5 && (
                      <p className="more-items">
                        + {importResults.success.length - 5} more
                      </p>
                    )}
                  </div>
                </div>
              )}

              {importResults.errors?.length > 0 && (
                <div className="errors-list">
                  <h4>Errors ({importResults.errors.length})</h4>
                  <div className="errors-table-container">
                    <table className="errors-table">
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
                            <td className="error-detail">
                              {typeof error.error === "string"
                                ? error.error
                                : JSON.stringify(error.error)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div className="results-actions">
                <button
                  className="primary"
                  onClick={() => {
                    setImportResults(null);
                    setFile(null);
                  }}
                >
                  Import Another File
                </button>
                <button
                  className="secondary"
                  onClick={() => navigate("/dashboard/parents")}
                >
                  View All Parents
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ParentBulkImport;
