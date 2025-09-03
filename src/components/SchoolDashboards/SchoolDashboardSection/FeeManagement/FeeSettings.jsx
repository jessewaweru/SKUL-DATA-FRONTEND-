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
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalCount: 0,
    hasNext: false,
    hasPrevious: false,
  });

  const fetchFeeStructures = async (page = 1) => {
    try {
      setLoading(true);
      const response = await api.get(`/api/fees/fee-structures/?page=${page}`);

      // Handle paginated response from Django REST Framework
      if (response.data.results) {
        setFeeStructures(response.data.results);
        setPagination({
          page: page,
          totalCount: response.data.count,
          totalPages: Math.ceil(response.data.count / 25), // Default page size is 25
          hasNext: !!response.data.next,
          hasPrevious: !!response.data.previous,
        });
      } else {
        // Handle non-paginated response (in case pagination is disabled)
        setFeeStructures(Array.isArray(response.data) ? response.data : []);
      }
    } catch (err) {
      console.error("Error fetching fee structures:", err);
      setError(
        err.response?.data?.detail ||
          err.message ||
          "Failed to fetch fee structures"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeeStructures();
  }, []);

  const handleAddFeeStructure = async (structureData) => {
    try {
      const response = await api.post(
        "/api/fees/fee-structures/",
        structureData
      );

      // Add new structure to the current list
      setFeeStructures((prev) => [response.data, ...prev]);

      // Update pagination count
      setPagination((prev) => ({
        ...prev,
        totalCount: prev.totalCount + 1,
      }));

      return response.data;
    } catch (err) {
      console.error("Error adding fee structure:", err);
      const errorMessage =
        err.response?.data?.detail ||
        err.response?.data?.non_field_errors?.[0] ||
        err.message ||
        "Failed to add fee structure";
      setError(errorMessage);
      throw err;
    }
  };

  const handleUpdateFeeStructure = async (id, structureData) => {
    try {
      const response = await api.put(
        `/api/fees/fee-structures/${id}/`,
        structureData
      );

      setFeeStructures((prev) =>
        prev.map((structure) =>
          structure.id === id ? response.data : structure
        )
      );

      return response.data;
    } catch (err) {
      console.error("Error updating fee structure:", err);
      const errorMessage =
        err.response?.data?.detail ||
        err.response?.data?.non_field_errors?.[0] ||
        err.message ||
        "Failed to update fee structure";
      setError(errorMessage);
      throw err;
    }
  };

  const handleDeleteFeeStructure = async (id) => {
    try {
      await api.delete(`/api/fees/fee-structures/${id}/`);

      setFeeStructures((prev) =>
        prev.filter((structure) => structure.id !== id)
      );

      // Update pagination count
      setPagination((prev) => ({
        ...prev,
        totalCount: prev.totalCount - 1,
      }));
    } catch (err) {
      console.error("Error deleting fee structure:", err);
      const errorMessage =
        err.response?.data?.detail ||
        err.message ||
        "Failed to delete fee structure";
      setError(errorMessage);
      throw err;
    }
  };

  const handlePageChange = (newPage) => {
    fetchFeeStructures(newPage);
  };

  const clearError = () => {
    setError(null);
  };

  if (loading && feeStructures.length === 0) {
    return <div className="loading-spinner">Loading fee settings...</div>;
  }

  return (
    <div className="fee-settings">
      <div className="settings-header">
        <h2>Fee Management Settings</h2>
        {error && (
          <div className="error-message">
            <span>{error}</span>
            <button onClick={clearError} className="error-close">
              ×
            </button>
          </div>
        )}
      </div>

      <div className="settings-tabs">
        <button
          className={activeTab === "structures" ? "active" : ""}
          onClick={() => setActiveTab("structures")}
        >
          Fee Structures ({pagination.totalCount})
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
          <>
            <FeeStructureSettings
              structures={feeStructures}
              onAdd={handleAddFeeStructure}
              onUpdate={handleUpdateFeeStructure}
              onDelete={handleDeleteFeeStructure}
              loading={loading}
              error={error}
              onClearError={clearError}
            />

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="pagination-controls">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={!pagination.hasPrevious || loading}
                  className="pagination-btn"
                >
                  Previous
                </button>

                <span className="pagination-info">
                  Page {pagination.page} of {pagination.totalPages}(
                  {pagination.totalCount} total structures)
                </span>

                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={!pagination.hasNext || loading}
                  className="pagination-btn"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <PaymentMethodSettings />
        )}
      </div>
    </div>
  );
};

export default FeeSettings;
