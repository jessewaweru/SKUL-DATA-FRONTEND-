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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [termsRes, rulesRes] = await Promise.all([
          get("/exams/terms/"),
          get("/exams/consolidation-rules/"),
        ]);

        setTerms(termsRes.data);
        setConsolidationRules(rulesRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="loading-spinner">Loading...</div>;

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
            <table>
              <thead>
                <tr>
                  <th>Exam Type</th>
                  <th>Weight (%)</th>
                </tr>
              </thead>
              <tbody>
                {consolidationRules.map((rule) => (
                  <tr key={rule.exam_type}>
                    <td>{rule.exam_type}</td>
                    <td>{rule.weight}%</td>
                  </tr>
                ))}
                <tr>
                  <td>
                    <strong>Total</strong>
                  </td>
                  <td>
                    {consolidationRules.reduce(
                      (sum, rule) => sum + rule.weight,
                      0
                    )}
                    %
                  </td>
                </tr>
              </tbody>
            </table>

            <button className="btn-secondary">Edit Rules</button>
          </div>
        )}
      </div>

      {selectedTerm && (
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
