import { useState, useEffect } from "react";
import { useApi } from "../../../../hooks/useApi";
import CreateGradingSystem from "../../../common/ExamManagement/CreateGradingSystem";
import GradingSystemCard from "../../../common/ExamManagement/GradingSystemCard";

const GradingSystemsManagement = () => {
  const { get, post, delete: deleteApi } = useApi();
  const [gradingSystems, setGradingSystems] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGradingSystems();
  }, []);

  const fetchGradingSystems = async () => {
    try {
      const response = await get("/exams/grading-systems/");
      console.log("Full API Response:", response); // Check the exact structure

      // If the data is nested (e.g., response.data.results)
      const systems = Array.isArray(response.data?.results)
        ? response.data.results
        : Array.isArray(response.data)
        ? response.data
        : [];

      setGradingSystems(systems);
    } catch (error) {
      console.error("Error fetching grading systems:", error);
      setGradingSystems([]); // Fallback in case of error
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (newSystem) => {
    try {
      const response = await post("/exams/grading-systems/", newSystem);
      setGradingSystems((prev) => [...prev, response.data]);
      setShowCreateForm(false);
    } catch (error) {
      console.error("Error creating grading system:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteApi(`/exams/grading-systems/${id}/`);
      setGradingSystems((prev) => prev.filter((sys) => sys.id !== id));
    } catch (error) {
      console.error("Error deleting grading system:", error);
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await post(`/exams/grading-systems/${id}/set_default/`);
      setGradingSystems((prev) =>
        prev.map((sys) => ({
          ...sys,
          is_default: sys.id === id,
        }))
      );
    } catch (error) {
      console.error("Error setting default grading system:", error);
    }
  };

  if (loading) return <div className="loading-spinner">Loading...</div>;

  return (
    <div className="grading-systems-container">
      <div className="grading-systems-header">
        <h2>Grading Systems Management</h2>
        <button className="btn-primary" onClick={() => setShowCreateForm(true)}>
          Create New System
        </button>
      </div>

      {showCreateForm && (
        <CreateGradingSystem
          onCreate={handleCreate}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      <div className="grading-systems-list">
        {gradingSystems.length === 0 ? (
          <p>No grading systems found. Create one to get started.</p>
        ) : (
          gradingSystems.map((system) => (
            <GradingSystemCard
              key={system.id}
              system={system}
              onDelete={handleDelete}
              onSetDefault={handleSetDefault}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default GradingSystemsManagement;
