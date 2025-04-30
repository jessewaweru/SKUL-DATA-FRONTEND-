import { useState } from "react";
import { FiFileText, FiDownload, FiShare2, FiSearch } from "react-icons/fi";
import { useQuery } from "@tanstack/react-query";
import { fetchParentDocuments } from "../../../../services/parentsApi";
import "../Parents/parents.css";

const ParentDocuments = ({ parent }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: documents } = useQuery(["parentDocuments", parent.id], () =>
    fetchParentDocuments(parent.id)
  );

  const filteredDocs = documents?.filter(
    (doc) =>
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="parent-documents">
      <div className="documents-header">
        <h3>Shared Documents</h3>
        <div className="search-filter">
          <FiSearch />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="documents-grid">
        {filteredDocs?.length > 0 ? (
          filteredDocs.map((document) => (
            <div key={document.id} className="document-card">
              <div className="document-icon">
                <FiFileText />
              </div>
              <div className="document-info">
                <h4>{document.title}</h4>
                <p className="description">
                  {document.description || "No description"}
                </p>
                <div className="document-meta">
                  <span className="date">
                    {new Date(document.uploaded_at).toLocaleDateString()}
                  </span>
                  <span className="type">{document.document_type}</span>
                </div>
              </div>
              <div className="document-actions">
                <button title="Download">
                  <FiDownload />
                </button>
                <button title="Share">
                  <FiShare2 />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            No documents shared with this parent
          </div>
        )}
      </div>
    </div>
  );
};

export default ParentDocuments;
