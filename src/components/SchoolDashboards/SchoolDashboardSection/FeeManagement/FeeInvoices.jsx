import { useApi } from "../../../../hooks/useApi";
import { useEffect, useState } from "react";
import InvoiceTemplates from "../../../common/FeeManagement/InvoiceTemplates";
import GenerateInvoices from "../../../common/FeeManagement/GenerateInvoices";
import "./feemanagement.css";

const FeeInvoices = () => {
  const api = useApi();
  const [templates, setTemplates] = useState([]);
  const [classes, setClasses] = useState([]);
  const [activeTab, setActiveTab] = useState("templates");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch templates and classes simultaneously
        const [templatesResponse, classesResponse] = await Promise.all([
          api.get("/api/fees/fee-invoice-templates"),
          api.get("/api/schools/classes"),
        ]);

        // Handle templates response - check if it has results array or is direct array
        const templatesData =
          templatesResponse.data.results || templatesResponse.data;
        setTemplates(Array.isArray(templatesData) ? templatesData : []);

        // Handle classes response
        const classesData =
          classesResponse.data.results || classesResponse.data;
        setClasses(Array.isArray(classesData) ? classesData : []);
      } catch (err) {
        console.error("Error fetching fee invoice data:", err);
        setError(err.message || "Failed to fetch invoice data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [api]);

  const handleSetDefaultTemplate = async (templateId) => {
    try {
      await api.post(
        `/api/fees/fee-invoice-templates/${templateId}/set_default/`
      );
      setTemplates((prev) =>
        prev.map((template) => ({
          ...template,
          is_active: template.id === templateId,
        }))
      );
    } catch (err) {
      console.error("Error setting default template:", err);
      setError(err.message || "Failed to set default template");
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading fee invoice data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">
          <h3>Error Loading Fee Invoices</h3>
          <p>{error}</p>
          <button
            className="retry-button"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fee-invoices">
      <div className="fee-invoices-header">
        <h2>Fee Invoice Management</h2>
        <p>Manage invoice templates and generate fee invoices for students</p>
      </div>

      <div className="invoice-tabs">
        <button
          className={`tab-button ${activeTab === "templates" ? "active" : ""}`}
          onClick={() => setActiveTab("templates")}
        >
          <span className="tab-icon">📄</span>
          Invoice Templates ({templates.length})
        </button>
        <button
          className={`tab-button ${activeTab === "generate" ? "active" : ""}`}
          onClick={() => setActiveTab("generate")}
        >
          <span className="tab-icon">⚡</span>
          Generate Invoices
        </button>
      </div>

      <div className="invoice-content">
        {activeTab === "templates" ? (
          <InvoiceTemplates
            templates={templates}
            onSetDefault={handleSetDefaultTemplate}
          />
        ) : (
          <GenerateInvoices templates={templates} classes={classes} />
        )}
      </div>
    </div>
  );
};

export default FeeInvoices;
