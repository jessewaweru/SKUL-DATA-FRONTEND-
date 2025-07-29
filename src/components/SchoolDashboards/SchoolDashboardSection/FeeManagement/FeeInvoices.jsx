import { useApi } from "../../../../hooks/useApi";
import { useEffect, useState } from "react";
import InvoiceTemplates from "../../../common/FeeManagement/InvoiceTemplates";
import GenerateInvoices from "../../../common/FeeManagement/GenerateInvoices";
import "./feemanagement.css";

const FeeInvoices = () => {
  const api = useApi();
  const [templates, setTemplates] = useState([]);
  const [activeTab, setActiveTab] = useState("templates");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await api.get("/api/fees/fee-invoice-templates");
        setTemplates(response.data);
      } catch (err) {
        setError(err.message || "Failed to fetch invoice templates");
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  const handleSetDefaultTemplate = async (templateId) => {
    try {
      await api.post(
        `/api/fees/fee-invoice-templates/${templateId}/set_default`
      );
      setTemplates((prev) =>
        prev.map((template) => ({
          ...template,
          is_active: template.id === templateId,
        }))
      );
    } catch (err) {
      setError(err.message || "Failed to set default template");
    }
  };

  if (loading) return <div className="loading-spinner">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="fee-invoices">
      <div className="invoice-tabs">
        <button
          className={activeTab === "templates" ? "active" : ""}
          onClick={() => setActiveTab("templates")}
        >
          Invoice Templates
        </button>
        <button
          className={activeTab === "generate" ? "active" : ""}
          onClick={() => setActiveTab("generate")}
        >
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
          <GenerateInvoices templates={templates} />
        )}
      </div>
    </div>
  );
};

export default FeeInvoices;
