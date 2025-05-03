import React, { useState } from "react";
import PropTypes from "prop-types";
import { FiFile, FiDownload, FiShare2, FiTrash2 } from "react-icons/fi";
import DocumentPreviewModal from "./DocumentPreviewModal";
import "../Documents/documents.css";
import { useApi } from "../../../../hooks/useApi";

const DocumentList = ({
  documents,
  isLoading,
  selectedDocs,
  onSelectDoc,
  onSelectAll,
  refreshList,
  showCheckboxes = true,
}) => {
  const [previewDoc, setPreviewDoc] = useState(null);
  const api = useApi();

  const getFileIcon = (fileType) => {
    if (fileType.includes("pdf")) return <FiFile color="#E53E3E" />;
    if (fileType.includes("word")) return <FiFile color="#2B6CB0" />;
    if (fileType.includes("excel")) return <FiFile color="#2F855A" />;
    if (fileType.includes("image")) return <FiFile color="#805AD5" />;
    return <FiFile />;
  };

  if (isLoading) {
    return <div className="loading-spinner">Loading documents...</div>;
  }

  if (documents.length === 0) {
    return <div className="empty-state">No documents found</div>;
  }

  return (
    <div className="document-list">
      <table>
        <thead>
          <tr>
            {showCheckboxes && (
              <th>
                <input
                  type="checkbox"
                  checked={
                    selectedDocs.length === documents.length &&
                    documents.length > 0
                  }
                  onChange={onSelectAll}
                />
              </th>
            )}
            <th>Name</th>
            <th>Category</th>
            <th>Class</th>
            <th>Uploaded By</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc) => (
            <tr
              key={doc.id}
              className={selectedDocs.includes(doc.id) ? "selected" : ""}
            >
              {showCheckboxes && (
                <td>
                  <input
                    type="checkbox"
                    checked={selectedDocs.includes(doc.id)}
                    onChange={() => onSelectDoc(doc.id)}
                  />
                </td>
              )}
              <td>
                <div
                  className="document-name"
                  onClick={() => setPreviewDoc(doc)}
                >
                  {getFileIcon(doc.file_type)}
                  <span>{doc.title}</span>
                </div>
              </td>
              <td>{doc.category?.name || "-"}</td>
              <td>{doc.related_class?.name || "-"}</td>
              <td>{doc.uploaded_by_name}</td>
              <td>{new Date(doc.uploaded_at).toLocaleDateString()}</td>
              <td>
                <div className="action-buttons">
                  <button
                    className="icon-button"
                    onClick={() => window.open(doc.file_url, "_blank")}
                    title="Download"
                  >
                    <FiDownload />
                  </button>
                  <button
                    className="icon-button"
                    onClick={() => {
                      /* Implement share functionality */
                    }}
                    title="Share"
                  >
                    <FiShare2 />
                  </button>
                  <button
                    className="icon-button danger"
                    onClick={async () => {
                      try {
                        await api.delete(`/documents/${doc.id}/`);
                        refreshList();
                      } catch (err) {
                        console.error("Failed to delete document", err);
                      }
                    }}
                    title="Delete"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {previewDoc && (
        <DocumentPreviewModal
          document={previewDoc}
          onClose={() => setPreviewDoc(null)}
        />
      )}
    </div>
  );
};

DocumentList.propTypes = {
  documents: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  selectedDocs: PropTypes.array.isRequired,
  onSelectDoc: PropTypes.func.isRequired,
  onSelectAll: PropTypes.func.isRequired,
  refreshList: PropTypes.func.isRequired,
  showCheckboxes: PropTypes.bool,
};

DocumentList.defaultProps = {
  showCheckboxes: true,
};

export default DocumentList;
