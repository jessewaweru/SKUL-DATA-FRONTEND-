import React, { useState, useEffect } from "react";
import DocumentList from "./DocumentList";
import { useApi } from "../../../../hooks/useApi";

const DocumentTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const api = useApi();

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setIsLoading(true);
      // Change the endpoint to fetch actual template documents
      const response = await api.get(
        "/api/documents/documents/?is_template=true"
      );
      setTemplates(response.data.results || response.data); // Handle both paginated and non-paginated responses
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch templates");
      console.error("Error fetching templates:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="document-templates">
      <div className="templates-header">
        <h2>Document Templates</h2>
      </div>

      {error && <div className="error-message">{error}</div>}

      <DocumentList
        documents={templates}
        isLoading={isLoading}
        selectedDocs={[]}
        onSelectDoc={() => {}}
        onSelectAll={() => {}}
        showCheckboxes={false}
      />
    </div>
  );
};

export default DocumentTemplates;
