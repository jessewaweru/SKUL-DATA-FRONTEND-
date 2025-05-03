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
      const response = await api.get("/documents/?is_template=true");
      setTemplates(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch templates");
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
