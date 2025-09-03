import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApi } from "../../../../hooks/useApi";
import {
  FiFileText,
  FiUpload,
  FiTrash2,
  FiDownload,
  FiArrowLeft,
} from "react-icons/fi";
import DocumentUploadModal from "./DocumentUploadModal";
import "../Classes/classes.css";

const ClassDocumentsPage = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [error, setError] = useState(null);
  const api = useApi();

  useEffect(() => {
    if (!classId) {
      setError("No class ID provided");
      setLoading(false);
      return;
    }

    const fetchDocuments = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await api.get(
          `/api/schools/class-documents/?school_class=${classId}`
        );

        // Handle both paginated and non-paginated responses
        const docs = response.data.results || response.data;
        setDocuments(Array.isArray(docs) ? docs : []);
      } catch (error) {
        console.error("Error fetching documents:", {
          error: error.response?.data || error.message,
          status: error.response?.status,
        });
        setError(error.message || "Failed to load documents");
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [classId, api]);

  const handleUploadSuccess = (newDocument) => {
    setDocuments([newDocument, ...documents]);
    setShowUploadModal(false);
  };

  const handleDelete = async (docId) => {
    try {
      await api.delete(`/api/schools/class-documents/${docId}/`);
      setDocuments(documents.filter((doc) => doc.id !== docId));
    } catch (error) {
      console.error("Error deleting document:", error);
      setError("Failed to delete document");
    }
  };

  const filteredDocuments = documents.filter((doc) => {
    if (filter === "ALL") return true;
    return doc.document_type === filter;
  });

  if (!classId) {
    return (
      <div className="class-documents-page error-page">
        <div className="error-message">
          <h2>Class Not Specified</h2>
          <p>Please select a class to view documents.</p>
          <button
            className="back-button"
            onClick={() => navigate("/dashboard/classes")}
          >
            <FiArrowLeft /> Back to Classes
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="class-documents-page loading-page">
        <div className="loading-spinner">Loading documents...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="class-documents-page error-page">
        <div className="error-message">
          <h2>Error Loading Documents</h2>
          <p>{error}</p>
          <button
            className="back-button"
            onClick={() => navigate("/dashboard/classes")}
          >
            <FiArrowLeft /> Back to Classes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="class-documents-page">
      <div className="documents-header">
        <button
          className="back-button"
          onClick={() => navigate("/dashboard/classes")}
        >
          <FiArrowLeft /> Back to Classes
        </button>

        <h2>
          <FiFileText /> Class Documents
        </h2>

        <div className="documents-actions">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="document-filter"
          >
            <option value="ALL">All Types</option>
            <option value="ASSIGNMENT">Assignments</option>
            <option value="NOTES">Teacher Notes</option>
            <option value="SYLLABUS">Syllabus</option>
            <option value="OTHER">Other</option>
          </select>
          <button
            className="upload-btn"
            onClick={() => setShowUploadModal(true)}
          >
            <FiUpload /> Upload Document
          </button>
        </div>
      </div>

      <div className="documents-list">
        {filteredDocuments.length === 0 ? (
          <div className="no-documents">No documents found for this class</div>
        ) : (
          <table className="class-documents-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Uploaded</th>
                <th>Size</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocuments.map((doc) => (
                <tr key={doc.id}>
                  <td>
                    <a
                      href={doc.file}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {doc.title}
                    </a>
                  </td>
                  <td>{doc.document_type}</td>
                  <td>{new Date(doc.created_at).toLocaleDateString()}</td>
                  <td>{(doc.file_size / 1024).toFixed(1)} KB</td>
                  <td>
                    <div className="document-actions">
                      <a href={doc.file} download className="download-btn">
                        <FiDownload />
                      </a>
                      <button
                        onClick={() => handleDelete(doc.id)}
                        className="delete-btn"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showUploadModal && (
        <DocumentUploadModal
          classId={classId}
          onClose={() => setShowUploadModal(false)}
          onSuccess={handleUploadSuccess}
        />
      )}
    </div>
  );
};

export default ClassDocumentsPage;
