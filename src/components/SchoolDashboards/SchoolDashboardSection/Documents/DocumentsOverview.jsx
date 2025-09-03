import React, { useState, useEffect } from "react";
import DocumentList from "./DocumentList";
import BulkActionsBar from "./BulkActionsBar";
import DocumentFilters from "./DocumentFilters";
import useUser from "../../../../hooks/useUser";
import { useApi } from "../../../../hooks/useApi";
import "../Documents/documents.css";

const DocumentsPage = () => {
  const [documents, setDocuments] = useState([]);
  const [selectedDocs, setSelectedDocs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterValues, setFilterValues] = useState({
    category: "",
    school: "",
    related_class: "",
    is_public: "",
    search: "",
  });
  const [categories, setCategories] = useState([]);
  const [classes, setClasses] = useState([]);
  const { user } = useUser();
  const api = useApi();

  // Check if user has permission to upload
  const canUpload =
    user?.user_type === "school_superuser" || user?.user_type === "teacher";

  useEffect(() => {
    fetchDocuments();
    fetchCategories();
    fetchClasses();
  }, [filterValues]);

  const fetchDocuments = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();

      Object.entries(filterValues).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      // Change this endpoint to fetch the actual documents
      const response = await api.get(
        `/api/documents/documents/?${params.toString()}`
      );
      setDocuments(response.data.results || response.data); // Handle both paginated and non-paginated responses
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch documents");
      console.error("Error fetching documents:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get("/api/documents/categories/");
      setCategories(response.data.results || response.data); // Handle both paginated and non-paginated responses
    } catch (err) {
      console.error("Failed to fetch categories", err);
    }
  };

  const fetchClasses = async () => {
    if (user?.user_type === "teacher") {
      try {
        const response = await api.get(`/classes/?teacher=${user.id}`);
        setClasses(response.data.results || response.data);
      } catch (err) {
        console.error("Failed to fetch classes", err);
      }
    } else if (user?.user_type === "school_superuser") {
      try {
        const response = await api.get(
          `/classes/?school=${user.superuser_profile.school}`
        );
        setClasses(response.data.results || response.data);
      } catch (err) {
        console.error("Failed to fetch classes", err);
      }
    }
  };

  const handleBulkDelete = async () => {
    if (!selectedDocs.length) return;

    try {
      await api.post("/documents/bulk_delete/", { ids: selectedDocs });
      setSelectedDocs([]);
      fetchDocuments();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete documents");
    }
  };

  const handleBulkDownload = async () => {
    if (!selectedDocs.length) return;

    try {
      const idsParam = selectedDocs.map((id) => `ids=${id}`).join("&");
      window.open(`/api/documents/bulk_download/?${idsParam}`, "_blank");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to download documents");
    }
  };

  const toggleSelectDoc = (docId) => {
    setSelectedDocs((prev) =>
      prev.includes(docId)
        ? prev.filter((id) => id !== docId)
        : [...prev, docId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedDocs.length === documents.length) {
      setSelectedDocs([]);
    } else {
      setSelectedDocs(documents.map((doc) => doc.id));
    }
  };

  return (
    <div className="documents-overview">
      <div className="documents-header">
        <h2>All Documents</h2>
      </div>

      <DocumentFilters
        filterValues={filterValues}
        setFilterValues={setFilterValues}
        categories={categories}
        classes={classes}
      />

      {selectedDocs.length > 0 && (
        <BulkActionsBar
          count={selectedDocs.length}
          onDelete={handleBulkDelete}
          onDownload={handleBulkDownload}
          onClear={() => setSelectedDocs([])}
        />
      )}

      <DocumentList
        documents={documents}
        isLoading={isLoading}
        selectedDocs={selectedDocs}
        onSelectDoc={toggleSelectDoc}
        onSelectAll={toggleSelectAll}
        refreshList={fetchDocuments}
      />
    </div>
  );
};

export default DocumentsPage;
