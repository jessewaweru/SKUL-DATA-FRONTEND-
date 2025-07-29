import { useState, useEffect } from "react";
import { useApi } from "../../../../hooks/useApi";
import FeeStructureSettings from "../../../common/FeeManagement/FeeStructureSettings";
import PaymentMethodSettings from "../../../common/FeeManagement/PaymentMethodSettings";
import "./feemanagement.css";

const FeeSettings = () => {
  const api = useApi();
  const [activeTab, setActiveTab] = useState("structures");
  const [feeStructures, setFeeStructures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeeStructures = async () => {
      try {
        const response = await api.get("/api/fees/fee-structures");
        setFeeStructures(response.data);
      } catch (err) {
        setError(err.message || "Failed to fetch fee structures");
      } finally {
        setLoading(false);
      }
    };

    fetchFeeStructures();
  }, []);

  const handleAddFeeStructure = async (structureData) => {
    try {
      const response = await api.post(
        "/api/fees/fee-structures",
        structureData
      );
      setFeeStructures((prev) => [...prev, response.data]);
    } catch (err) {
      setError(err.message || "Failed to add fee structure");
    }
  };

  const handleUpdateFeeStructure = async (id, structureData) => {
    try {
      const response = await api.put(
        `/api/fees/fee-structures/${id}`,
        structureData
      );
      setFeeStructures((prev) =>
        prev.map((structure) =>
          structure.id === id ? response.data : structure
        )
      );
    } catch (err) {
      setError(err.message || "Failed to update fee structure");
    }
  };

  const handleDeleteFeeStructure = async (id) => {
    try {
      await api.delete(`/api/fees/fee-structures/${id}`);
      setFeeStructures((prev) =>
        prev.filter((structure) => structure.id !== id)
      );
    } catch (err) {
      setError(err.message || "Failed to delete fee structure");
    }
  };

  if (loading) return <div className="loading-spinner">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="fee-settings">
      <div className="settings-tabs">
        <button
          className={activeTab === "structures" ? "active" : ""}
          onClick={() => setActiveTab("structures")}
        >
          Fee Structures
        </button>
        <button
          className={activeTab === "methods" ? "active" : ""}
          onClick={() => setActiveTab("methods")}
        >
          Payment Methods
        </button>
      </div>

      <div className="settings-content">
        {activeTab === "structures" ? (
          <FeeStructureSettings
            structures={feeStructures}
            onAdd={handleAddFeeStructure}
            onUpdate={handleUpdateFeeStructure}
            onDelete={handleDeleteFeeStructure}
          />
        ) : (
          <PaymentMethodSettings />
        )}
      </div>
    </div>
  );
};

export default FeeSettings;
