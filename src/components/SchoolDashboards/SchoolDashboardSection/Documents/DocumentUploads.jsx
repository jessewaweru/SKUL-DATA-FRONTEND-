import React, { useState, useEffect } from "react";
import { FiUpload, FiClock, FiUser, FiDownload } from "react-icons/fi";
import UploadModal from "./UploadModal";
import { useApi } from "../../../../hooks/useApi";
import useUser from "../../../../hooks/useUser";

const DocumentUploads = () => {
  const [recentUploads, setRecentUploads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const { user } = useUser();
  const api = useApi();

  useEffect(() => {
    fetchRecentUploads();
  }, []);

  const fetchRecentUploads = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/documents/?recent_uploads=true");
      setRecentUploads(response.data.results || []); // Use results array or fallback to empty array
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch recent uploads");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadSuccess = () => {
    fetchRecentUploads();
    setUploadModalOpen(false);
  };

  return (
    <div className="document-uploads">
      <div className="uploads-header">
        <h2>Recent Uploads</h2>
        <button
          className="btn-primary"
          onClick={() => setUploadModalOpen(true)}
          disabled={
            !user ||
            (user.user_type !== "school_superuser" &&
              user.user_type !== "teacher")
          }
        >
          <FiUpload /> Upload Files
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {isLoading ? (
        <div className="loading-spinner">Loading recent uploads...</div>
      ) : (
        <div className="uploads-list">
          {recentUploads.length === 0 ? (
            <div className="empty-state">
              <p>No recent uploads found</p>
              <button
                className="btn-primary"
                onClick={() => setUploadModalOpen(true)}
                disabled={
                  !user ||
                  (user.user_type !== "school_superuser" &&
                    user.user_type !== "teacher")
                }
              >
                <FiUpload /> Upload Your First Document
              </button>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Document</th>
                  <th>
                    <FiClock /> Uploaded
                  </th>
                  <th>
                    <FiUser /> By
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentUploads.map((doc) => (
                  <tr key={doc.id}>
                    <td>
                      <div className="document-info">
                        <FiFile />
                        <div>
                          <div className="document-title">{doc.title}</div>
                          <div className="document-category">
                            {doc.category?.name || "No category"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      {new Date(doc.uploaded_at).toLocaleDateString()}
                      <div className="document-time">
                        {new Date(doc.uploaded_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </td>
                    <td>{doc.uploaded_by_name}</td>
                    <td>
                      <button
                        className="icon-button"
                        onClick={() => window.open(doc.file_url, "_blank")}
                        title="Download"
                      >
                        <FiDownload />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {uploadModalOpen && (
        <UploadModal
          onClose={() => setUploadModalOpen(false)}
          onUploadSuccess={handleUploadSuccess}
        />
      )}
    </div>
  );
};

export default DocumentUploads;
