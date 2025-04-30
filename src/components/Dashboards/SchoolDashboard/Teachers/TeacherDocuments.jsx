// components/SchoolDashboard/Teachers/TeacherDocuments.jsx
import { useState } from "react";
import {
  FiFile,
  FiUpload,
  FiDownload,
  FiEye,
  FiShare2,
  FiTrash2,
} from "react-icons/fi";
import DocumentUploadModal from "../../../common/DocumentUploadModal/DocumentUploadModal";
import "../Teachers/teachers.css";

const TeacherDocuments = () => {
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("uploaded");
  const [documents, setDocuments] = useState([
    {
      id: 1,
      title: "Term 1 Lesson Plans",
      type: "Lesson Plan",
      date: "2023-01-15",
      size: "2.4 MB",
      uploadedBy: "Admin",
    },
    // ... more documents
  ]);

  const tabs = [
    { id: "uploaded", label: "Uploaded Documents" },
    { id: "shared", label: "Shared Documents" },
  ];

  const handleUpload = (files) => {
    // Handle document upload
    console.log("Uploading files:", files);
    setUploadModalOpen(false);
  };

  return (
    <div className="teacher-documents">
      <div className="documents-header">
        <h2>Teacher Documents</h2>
        <button
          className="upload-button"
          onClick={() => setUploadModalOpen(true)}
        >
          <FiUpload /> Upload Document
        </button>
      </div>

      <div className="tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="documents-content">
        {activeTab === "uploaded" && (
          <div className="uploaded-documents">
            {documents.length === 0 ? (
              <div className="empty-state">
                <FiFile className="empty-icon" />
                <p>No documents uploaded yet</p>
              </div>
            ) : (
              <table className="documents-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Type</th>
                    <th>Date</th>
                    <th>Size</th>
                    <th>Uploaded By</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((doc) => (
                    <tr key={doc.id}>
                      <td>{doc.title}</td>
                      <td>{doc.type}</td>
                      <td>{doc.date}</td>
                      <td>{doc.size}</td>
                      <td>{doc.uploadedBy}</td>
                      <td>
                        <div className="document-actions">
                          <button className="icon-button" title="View">
                            <FiEye />
                          </button>
                          <button className="icon-button" title="Download">
                            <FiDownload />
                          </button>
                          <button className="icon-button" title="Share">
                            <FiShare2 />
                          </button>
                          <button className="icon-button" title="Delete">
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

        {activeTab === "shared" && (
          <div className="shared-documents">
            {/* Similar structure for shared documents */}
            <div className="empty-state">
              <FiFile className="empty-icon" />
              <p>No shared documents</p>
            </div>
          </div>
        )}
      </div>

      <DocumentUploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onUpload={handleUpload}
        title="Upload Teacher Document"
      />
    </div>
  );
};

export default TeacherDocuments;
