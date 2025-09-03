import React, { useState, useEffect } from "react";
import DocumentList from "./DocumentList";
import { useApi } from "../../../../hooks/useApi";
import useUser from "../../../../hooks/useUser";

const SharedDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const api = useApi();
  const { user } = useUser();

  useEffect(() => {
    fetchSharedDocuments();
  }, []);

  const fetchSharedDocuments = async () => {
    try {
      setIsLoading(true);
      // Change the endpoint to fetch actual shared documents
      // Either filter by shared=true or get documents where current user is in allowed_users
      const response = await api.get(
        `/api/documents/documents/?allowed_users=${user.id}`
      );
      setDocuments(response.data.results || response.data); // Handle both paginated and non-paginated responses
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to fetch shared documents"
      );
      console.error("Error fetching shared documents:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="shared-documents">
      <div className="shared-header">
        <h2>Shared With Me</h2>
      </div>

      {error && <div className="error-message">{error}</div>}

      <DocumentList
        documents={documents}
        isLoading={isLoading}
        selectedDocs={[]}
        onSelectDoc={() => {}}
        onSelectAll={() => {}}
        showCheckboxes={false}
      />
    </div>
  );
};

export default SharedDocuments;
