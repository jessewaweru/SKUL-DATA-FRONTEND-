import React, { useState, useEffect } from "react";
import DocumentList from "./DocumentList";
import { useApi } from "../../../../hooks/useApi";

const SharedDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const api = useApi();

  useEffect(() => {
    fetchSharedDocuments();
  }, []);

  const fetchSharedDocuments = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/documents/?shared=true");
      setDocuments(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to fetch shared documents"
      );
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
