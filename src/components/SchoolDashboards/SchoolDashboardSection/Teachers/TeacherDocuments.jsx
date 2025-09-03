import { useState, useEffect } from "react";
import {
  FiFile,
  FiUpload,
  FiDownload,
  FiEye,
  FiShare2,
  FiTrash2,
  FiLoader,
  FiAlertCircle,
  FiRefreshCw,
} from "react-icons/fi";
import DocumentUploadModal from "../../../common/DocumentUploadModal/DocumentUploadModal";
import {
  fetchTeacherDocuments,
  uploadTeacherDocument,
  deleteTeacherDocument,
  fetchTeacherById, // Add this import
} from "../../../../services/teacherService";
import useUser from "../../../../hooks/useUser";
import "../Teachers/teachers.css";

const TeacherDocuments = ({ teacherId, teacher: teacherProp }) => {
  const { user, schoolId } = useUser();
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("uploaded");
  const [documents, setDocuments] = useState([]);
  const [teacher, setTeacher] = useState(teacherProp || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [debugInfo, setDebugInfo] = useState({});

  const tabs = [
    { id: "uploaded", label: "Uploaded Documents" },
    { id: "shared", label: "Shared Documents" },
  ];

  // Document type display names
  const documentTypeNames = {
    QUALIFICATION: "Qualification",
    CV: "Curriculum Vitae",
    CONTRACT: "Contract",
    CERTIFICATE: "Certificate",
    EVALUATION: "Performance Evaluation",
    OTHER: "Other",
  };

  // Load teacher data if not provided as prop
  const loadTeacherData = async (id) => {
    if (!id) return null;

    try {
      console.log("Loading teacher data for ID:", id);
      const teacherData = await fetchTeacherById(id);
      console.log("Teacher data loaded:", teacherData);
      return teacherData;
    } catch (error) {
      console.error("Failed to load teacher data:", error);
      return null;
    }
  };

  const loadDocuments = async () => {
    console.log("=== LoadDocuments Debug ===");
    console.log("Teacher ID:", teacherId);
    console.log("Teacher Prop:", teacherProp);
    console.log("School ID:", schoolId);
    console.log("User:", user);

    if (!teacherId) {
      console.error("No teacher ID provided to loadDocuments");
      setError("Teacher ID is required");
      setLoading(false);
      return;
    }

    // Convert teacherId to integer to ensure proper matching
    const numericTeacherId = parseInt(teacherId);
    if (isNaN(numericTeacherId)) {
      console.error("Invalid teacher ID:", teacherId);
      setError("Invalid teacher ID format");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log("Loading documents for teacher:", numericTeacherId);

      // Load teacher data if not provided
      if (!teacher && !teacherProp) {
        const teacherData = await loadTeacherData(numericTeacherId);
        if (teacherData) {
          setTeacher(teacherData);
          console.log("Teacher data set:", teacherData);
        }
      }

      // Call the API service with the numeric teacher ID
      const documentsData = await fetchTeacherDocuments(numericTeacherId);
      console.log("Raw Documents API response:", documentsData);

      // Store debug info for display
      setDebugInfo({
        teacherId: numericTeacherId,
        schoolId: schoolId,
        apiResponse: documentsData,
        responseType: Array.isArray(documentsData)
          ? "array"
          : typeof documentsData,
        responseLength: Array.isArray(documentsData) ? documentsData.length : 0,
        teacherInResponse:
          documentsData.length > 0 ? documentsData[0].teacher : null,
      });

      // Handle both paginated and non-paginated responses
      let docs = [];
      if (Array.isArray(documentsData)) {
        docs = documentsData;
      } else if (documentsData?.results) {
        docs = documentsData.results;
      } else if (documentsData?.data) {
        docs = Array.isArray(documentsData.data)
          ? documentsData.data
          : [documentsData.data];
      } else {
        docs = [];
      }

      console.log("Processed documents array:", docs);
      console.log("Documents count:", docs.length);

      // Additional filtering to ensure we only get documents for this specific teacher
      const teacherDocs = docs.filter((doc) => {
        const docTeacherId = doc.teacher?.id || doc.teacher;
        const matches = docTeacherId === numericTeacherId;
        console.log(
          `Document ${doc.id}: teacher=${docTeacherId}, target=${numericTeacherId}, matches=${matches}`
        );
        return matches;
      });

      console.log("Filtered teacher documents:", teacherDocs);
      setDocuments(teacherDocs);

      if (teacherDocs.length === 0) {
        console.log("No documents found for teacher:", numericTeacherId);
        // Check if teacher exists in system
        if (teacher || teacherProp) {
          console.log("Teacher exists but has no documents");
        } else {
          console.log("Teacher data not found - may not exist");
        }
      }
    } catch (err) {
      console.error("Failed to load documents:", err);
      console.error("Error details:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      setError(`Failed to load documents: ${err.message}`);
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("=== TeacherDocuments useEffect ===");
    console.log("TeacherId prop:", teacherId);
    console.log("TeacherId type:", typeof teacherId);
    console.log("Teacher prop:", teacherProp);
    console.log("SchoolId:", schoolId);

    // Set teacher from prop if available
    if (teacherProp && !teacher) {
      setTeacher(teacherProp);
    }

    if (teacherId) {
      loadDocuments();
    } else {
      console.warn("No teacherId provided to TeacherDocuments component");
      setError("Teacher ID is required");
      setLoading(false);
    }
  }, [teacherId, schoolId, teacherProp]);

  const handleUpload = async (files) => {
    if (!Array.isArray(files) || files.length === 0) {
      console.error("No files provided for upload");
      setError("No files selected for upload");
      return;
    }

    if (!teacherId) {
      console.error("Cannot upload: No teacher ID");
      setError("Teacher ID is required for upload");
      return;
    }

    const numericTeacherId = parseInt(teacherId);
    if (isNaN(numericTeacherId)) {
      console.error("Cannot upload: Invalid teacher ID");
      setError("Invalid teacher ID format");
      return;
    }

    try {
      setActionLoading("upload");
      setError(null);
      console.log("Uploading files:", files);

      // Upload each file
      const uploadPromises = files.map(async (file) => {
        const documentData = {
          title: file.name || `Document for Teacher ${numericTeacherId}`,
          document_type: file.document_type || "OTHER",
          description: file.description || "",
          is_confidential: file.is_confidential || false,
          file: file,
          teacher_id: numericTeacherId,
        };

        console.log("Uploading document with data:", documentData);
        return await uploadTeacherDocument(numericTeacherId, documentData);
      });

      const results = await Promise.all(uploadPromises);
      console.log("Upload results:", results);

      // Reload documents after successful upload
      await loadDocuments();
      setUploadModalOpen(false);

      console.log("Documents uploaded successfully");
    } catch (error) {
      console.error("Upload failed:", error);
      setError(`Failed to upload documents: ${error.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (documentId) => {
    if (!window.confirm("Are you sure you want to delete this document?")) {
      return;
    }

    if (!documentId) {
      console.error("No document ID provided for deletion");
      return;
    }

    try {
      setActionLoading(`delete-${documentId}`);
      console.log("Deleting document:", documentId);

      await deleteTeacherDocument(documentId);

      // Remove document from local state
      setDocuments((docs) => docs.filter((doc) => doc.id !== documentId));
      console.log("Document deleted successfully");
    } catch (error) {
      console.error("Delete failed:", error);
      setError(`Failed to delete document: ${error.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleView = async (document) => {
    try {
      console.log("Viewing document:", document);

      if (document.file) {
        // Open the document in a new tab
        window.open(document.file, "_blank");
      } else {
        console.error("No file URL available for document:", document);
        setError("Document file not available");
      }
    } catch (error) {
      console.error("Failed to view document:", error);
      setError(`Failed to view document: ${error.message}`);
    }
  };

  const handleDownload = async (document) => {
    try {
      console.log("Downloading document:", document);

      if (document.file) {
        // Create a temporary link to download the file
        const link = document.createElement("a");
        link.href = document.file;
        link.download = document.title || `document-${document.id}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        console.error("No file URL available for download:", document);
        setError("Document file not available for download");
      }
    } catch (error) {
      console.error("Failed to download document:", error);
      setError(`Failed to download document: ${error.message}`);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return "Invalid Date";
    }
  };

  // Filter documents based on active tab
  const filteredDocuments = documents.filter((doc) => {
    if (activeTab === "uploaded") {
      return true; // Show all documents in uploaded tab
    } else if (activeTab === "shared") {
      return !doc.is_confidential; // Show only non-confidential documents in shared tab
    }
    return true;
  });

  // Debug render
  console.log("=== TeacherDocuments Render ===");
  console.log("teacherId:", teacherId);
  console.log("teacher:", teacher);
  console.log("loading:", loading);
  console.log("error:", error);
  console.log("documents count:", documents.length);
  console.log("filtered documents count:", filteredDocuments.length);
  console.log("documents data:", documents);

  if (loading) {
    return (
      <div className="teacher-documents loading-state">
        <div className="loading-content">
          <FiLoader className="loading-spinner spinning" />
          <p>Loading documents for teacher {teacherId}...</p>
          {teacher && (
            <p>
              Teacher: {teacher.first_name} {teacher.last_name}
            </p>
          )}
        </div>
        <style jsx>{`
          .loading-spinner.spinning {
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }

  // Show error with retry option
  if (error) {
    return (
      <div className="teacher-documents error-state">
        <div className="error-content">
          <FiAlertCircle className="error-icon" />
          <p className="error-message">{error}</p>
          <div className="error-actions">
            <button
              onClick={loadDocuments}
              className="retry-button"
              disabled={!teacherId}
            >
              <FiRefreshCw />{" "}
              {teacherId ? "Retry Loading Documents" : "Teacher ID Missing"}
            </button>
          </div>
          {teacherId && (
            <div className="debug-info">
              <p>
                Teacher ID: {teacherId} (Type: {typeof teacherId})
              </p>
              <p>School ID: {schoolId}</p>
              <p>Teacher Data: {teacher ? "Available" : "Not loaded"}</p>
              {debugInfo.apiResponse && (
                <details>
                  <summary>Debug Information</summary>
                  <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
                </details>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="teacher-documents">
      <div className="documents-header">
        <div className="header-title">
          <h2>Teacher Documents</h2>
          <div className="header-meta">
            <span className="teacher-id-badge">Teacher ID: {teacherId}</span>
            {teacher && (
              <span className="teacher-name-badge">
                {teacher.first_name} {teacher.last_name}
              </span>
            )}
            <span className="documents-count-badge">
              {documents.length} document{documents.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
        <div className="header-actions">
          <button
            className="refresh-button"
            onClick={loadDocuments}
            disabled={actionLoading === "upload"}
            title="Refresh documents"
          >
            <FiRefreshCw />
          </button>
          <button
            className="upload-button"
            onClick={() => setUploadModalOpen(true)}
            disabled={actionLoading === "upload" || !teacherId}
          >
            {actionLoading === "upload" ? (
              <>
                <FiLoader className="spinning" /> Uploading...
              </>
            ) : (
              <>
                <FiUpload /> Upload Document
              </>
            )}
          </button>
        </div>
      </div>

      <div className="tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span className="tab-count">({filteredDocuments.length})</span>
            )}
          </button>
        ))}
      </div>

      <div className="documents-content">
        {activeTab === "uploaded" && (
          <div className="uploaded-documents">
            {filteredDocuments.length === 0 ? (
              <div className="empty-state">
                <FiFile className="empty-icon" />
                <h3>No documents uploaded yet</h3>
                <p>
                  No documents found for{" "}
                  {teacher
                    ? `${teacher.first_name} ${teacher.last_name}`
                    : `teacher ${teacherId}`}
                  .
                </p>
                <div className="debug-info">
                  <p>
                    <strong>Debug Information:</strong>
                  </p>
                  <p>
                    Teacher ID: {teacherId} | School ID: {schoolId}
                  </p>
                  <p>Total documents in response: {documents.length}</p>
                  <p>API Response Type: {debugInfo.responseType}</p>
                  {teacher && (
                    <p>
                      Teacher: {teacher.first_name} {teacher.last_name} (ID:{" "}
                      {teacher.id})
                    </p>
                  )}
                  {debugInfo.apiResponse && (
                    <details>
                      <summary>View API Response</summary>
                      <pre>
                        {JSON.stringify(debugInfo.apiResponse, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
                <button
                  className="upload-button-secondary"
                  onClick={() => setUploadModalOpen(true)}
                  disabled={!teacherId}
                >
                  <FiUpload /> Upload First Document
                </button>
              </div>
            ) : (
              <div className="documents-table-container">
                <table className="documents-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Type</th>
                      <th>Upload Date</th>
                      <th>Uploaded By</th>
                      <th>Confidential</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDocuments.map((doc) => (
                      <tr key={doc.id}>
                        <td>
                          <div className="document-title">
                            <FiFile className="document-icon" />
                            <span>{doc.title}</span>
                          </div>
                        </td>
                        <td>
                          <span className="document-type-badge">
                            {documentTypeNames[doc.document_type] ||
                              doc.document_type}
                          </span>
                        </td>
                        <td>{formatDate(doc.uploaded_at)}</td>
                        <td>
                          {doc.uploaded_by
                            ? `${doc.uploaded_by.first_name || ""} ${
                                doc.uploaded_by.last_name || ""
                              }`.trim() ||
                              doc.uploaded_by.username ||
                              "Unknown"
                            : "Unknown"}
                        </td>
                        <td>
                          <span
                            className={`confidential-badge ${
                              doc.is_confidential ? "confidential" : "public"
                            }`}
                          >
                            {doc.is_confidential ? "Yes" : "No"}
                          </span>
                        </td>
                        <td>
                          <div className="document-actions">
                            <button
                              className="icon-button"
                              title="View"
                              onClick={() => handleView(doc)}
                              disabled={!doc.file}
                            >
                              <FiEye />
                            </button>
                            <button
                              className="icon-button"
                              title="Download"
                              onClick={() => handleDownload(doc)}
                              disabled={!doc.file}
                            >
                              <FiDownload />
                            </button>
                            <button
                              className="icon-button"
                              title="Share"
                              disabled
                            >
                              <FiShare2 />
                            </button>
                            <button
                              className="icon-button delete-button"
                              title="Delete"
                              onClick={() => handleDelete(doc.id)}
                              disabled={actionLoading === `delete-${doc.id}`}
                            >
                              {actionLoading === `delete-${doc.id}` ? (
                                <FiLoader className="spinning" />
                              ) : (
                                <FiTrash2 />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === "shared" && (
          <div className="shared-documents">
            {filteredDocuments.length === 0 ? (
              <div className="empty-state">
                <FiFile className="empty-icon" />
                <h3>No shared documents available</h3>
                <p>Only non-confidential documents appear here</p>
              </div>
            ) : (
              <div className="documents-grid">
                {filteredDocuments.map((doc) => (
                  <div key={doc.id} className="document-card">
                    <div className="document-card-header">
                      <FiFile className="document-icon" />
                      <h4>{doc.title}</h4>
                    </div>
                    <div className="document-card-body">
                      <p>
                        <strong>Type:</strong>{" "}
                        {documentTypeNames[doc.document_type] ||
                          doc.document_type}
                      </p>
                      <p>
                        <strong>Uploaded:</strong> {formatDate(doc.uploaded_at)}
                      </p>
                      {doc.description && (
                        <p>
                          <strong>Description:</strong> {doc.description}
                        </p>
                      )}
                    </div>
                    <div className="document-card-actions">
                      <button
                        className="view-button"
                        onClick={() => handleView(doc)}
                        disabled={!doc.file}
                      >
                        <FiEye /> View
                      </button>
                      <button
                        className="download-button"
                        onClick={() => handleDownload(doc)}
                        disabled={!doc.file}
                      >
                        <FiDownload /> Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {uploadModalOpen && (
        <DocumentUploadModal
          isOpen={uploadModalOpen}
          onClose={() => setUploadModalOpen(false)}
          onUpload={handleUpload}
          title={`Upload Document for ${
            teacher
              ? `${teacher.first_name} ${teacher.last_name}`
              : `Teacher ${teacherId}`
          }`}
          acceptedTypes=".pdf,.doc,.docx,.jpg,.jpeg,.png"
        />
      )}
    </div>
  );
};

export default TeacherDocuments;
