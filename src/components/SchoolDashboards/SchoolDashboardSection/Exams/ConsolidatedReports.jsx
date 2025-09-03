import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../../../../hooks/useApi";

const ConsolidatedReports = () => {
  const { get } = useApi();
  const navigate = useNavigate();
  const [terms, setTerms] = useState([]);
  const [selectedTerm, setSelectedTerm] = useState("");
  const [consolidationRules, setConsolidationRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        const [termsRes, rulesRes] = await Promise.all([
          get("/exams/terms/"),
          get("/exams/consolidation-rules/"),
        ]);

        // Ensure we have arrays, fallback to empty arrays if not
        setTerms(Array.isArray(termsRes?.data) ? termsRes.data : []);
        setConsolidationRules(
          Array.isArray(rulesRes?.data) ? rulesRes.data : []
        );
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data. Please try again.");
        // Set fallback empty arrays
        setTerms([]);
        setConsolidationRules([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Calculate total weight safely
  const getTotalWeight = () => {
    if (!Array.isArray(consolidationRules)) return 0;
    return consolidationRules.reduce((sum, rule) => {
      const weight = typeof rule?.weight === "number" ? rule.weight : 0;
      return sum + weight;
    }, 0);
  };

  if (loading) return <div className="loading-spinner">Loading...</div>;

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">{error}</div>
        <button
          className="btn-primary"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="consolidated-reports-container">
      <div className="consolidated-header">
        <button
          className="btn-secondary"
          onClick={() => navigate("/dashboard/exams/reports")}
        >
          Back to Reports
        </button>
        <h2>Consolidated Term Reports</h2>
      </div>

      <div className="consolidated-controls">
        <div className="form-group">
          <label>Select Term</label>
          <select
            value={selectedTerm}
            onChange={(e) => setSelectedTerm(e.target.value)}
          >
            <option value="">Select a term</option>
            {terms.map((term) => (
              <option
                key={`${term.term}-${term.academic_year}`}
                value={`${term.term}-${term.academic_year}`}
              >
                {term.term} {term.academic_year}
              </option>
            ))}
          </select>
        </div>

        {selectedTerm && (
          <div className="consolidation-rules">
            <h3>Consolidation Rules</h3>
            {consolidationRules.length > 0 ? (
              <>
                <table>
                  <thead>
                    <tr>
                      <th>Exam Type</th>
                      <th>Weight (%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {consolidationRules.map((rule, index) => (
                      <tr key={rule?.exam_type || `rule-${index}`}>
                        <td>{rule?.exam_type || "Unknown"}</td>
                        <td>{rule?.weight || 0}%</td>
                      </tr>
                    ))}
                    <tr>
                      <td>
                        <strong>Total</strong>
                      </td>
                      <td>
                        <strong>{getTotalWeight()}%</strong>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <button className="btn-secondary">Edit Rules</button>
              </>
            ) : (
              <div className="no-data-message">
                No consolidation rules found. Please set up consolidation rules
                first.
              </div>
            )}
          </div>
        )}
      </div>

      {selectedTerm && consolidationRules.length > 0 && (
        <div className="consolidated-results">
          <h3>Consolidated Results</h3>
          <div className="results-actions">
            <button className="btn-primary">Generate All Reports</button>
            <button className="btn-secondary">Preview Report</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsolidatedReports;
