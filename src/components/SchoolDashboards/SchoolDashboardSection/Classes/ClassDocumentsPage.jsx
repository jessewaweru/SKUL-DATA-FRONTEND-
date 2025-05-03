import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useApi } from "../../../../hooks/useApi";
import { FiFileText, FiUpload, FiTrash2, FiDownload } from "react-icons/fi";
import DocumentUploadModal from "./DocumentUploadModal";
import "../Classes/classes.css";

const ClassDocumentsPage = () => {
  const { classId } = useParams();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const api = useApi();

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await api.get(
          `/class-documents/?school_class=${classId}`
        );
        setDocuments(response.data);
      } catch (error) {
        console.error("Error fetching documents:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [classId]);

  const handleUploadSuccess = (newDocument) => {
    setDocuments([newDocument, ...documents]);
    setShowUploadModal(false);
  };

  const handleDelete = async (docId) => {
    try {
      await api.delete(`/class-documents/${docId}/`);
      setDocuments(documents.filter((doc) => doc.id !== docId));
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  const filteredDocuments = documents.filter((doc) => {
    if (filter === "ALL") return true;
    return doc.document_type === filter;
  });

  return (
    <div className="class-documents-page">
      <div className="documents-header">
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

      {loading ? (
        <div>Loading documents...</div>
      ) : (
        <div className="documents-list">
          {filteredDocuments.length === 0 ? (
            <div className="no-documents">
              No documents found for this class
            </div>
          ) : (
            <table className="documents-table">
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
      )}

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
