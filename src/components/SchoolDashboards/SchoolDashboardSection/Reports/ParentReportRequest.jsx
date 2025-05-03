// src/components/SchoolDashboard/Reports/ParentReportRequest.jsx
import React, { useState, useEffect } from "react";
import { FiPlus, FiClock, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { useApi } from "../../../../hooks/useApi";
import useUser from "../../../../hooks/useUser";
import "../Reports/reports.css";

const ParentReportRequest = () => {
  const { user } = useUser();
  const api = useApi();
  const [requests, setRequests] = useState([]);
  const [children, setChildren] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [formData, setFormData] = useState({
    student: "",
    term: "Term 1",
    school_year: new Date().getFullYear(),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [requestsRes, childrenRes] = await Promise.all([
          api.get("/api/reports/term-requests/"),
          api.get("/api/students/my-children/"),
        ]);
        setRequests(requestsRes.data);
        setChildren(childrenRes.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/api/reports/term-requests/", formData);
      setRequests([...requests, response.data]);
      setShowRequestForm(false);
      setFormData({
        student: "",
        term: "Term 1",
        school_year: new Date().getFullYear(),
      });
    } catch (error) {
      console.error("Error creating request:", error);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "COMPLETED":
        return <FiCheckCircle className="completed" />;
      case "PENDING":
        return <FiClock className="pending" />;
      case "FAILED":
        return <FiXCircle className="failed" />;
      default:
        return null;
    }
  };

  return (
    <div className="parent-report-requests">
      <div className="requests-header">
        <h2>Report Requests</h2>
        <button
          className="btn-primary"
          onClick={() => setShowRequestForm(true)}
        >
          <FiPlus /> New Request
        </button>
      </div>

      {isLoading ? (
        <div className="loading-spinner">Loading requests...</div>
      ) : (
        <>
          {requests.length === 0 ? (
            <div className="empty-state">
              <p>You haven't requested any reports yet</p>
              <button
                className="btn-primary"
                onClick={() => setShowRequestForm(true)}
              >
                <FiPlus /> Request a Report
              </button>
            </div>
          ) : (
            <div className="requests-table-container">
              <table className="requests-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Term</th>
                    <th>Year</th>
                    <th>Requested On</th>
                    <th>Status</th>
                    <th>Report</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((request) => (
                    <tr key={request.id}>
                      <td>
                        {children.find((c) => c.id === request.student)
                          ?.full_name || "N/A"}
                      </td>
                      <td>{request.term}</td>
                      <td>{request.school_year}</td>
                      <td>
                        {new Date(request.requested_at).toLocaleDateString()}
                      </td>
                      <td>
                        <span
                          className={`status-badge ${request.status.toLowerCase()}`}
                        >
                          {getStatusIcon(request.status)}
                          {request.status}
                        </span>
                      </td>
                      <td>
                        {request.generated_report ? (
                          <a
                            href={request.generated_report.file}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-link"
                          >
                            View Report
                          </a>
                        ) : (
                          <span className="muted">Not generated yet</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {showRequestForm && (
        <div className="modal-overlay">
          <div className="request-form-modal">
            <div className="modal-header">
              <h2>Request Student Report</h2>
              <button
                className="btn-icon"
                onClick={() => setShowRequestForm(false)}
              >
                <FiX />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Student</label>
                <select
                  name="student"
                  value={formData.student}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      student: e.target.value,
                    }))
                  }
                  required
                >
                  <option value="">Select your child</option>
                  {children.map((child) => (
                    <option key={child.id} value={child.id}>
                      {child.full_name} (
                      {child.school_class?.name || "No class"})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Term</label>
                <select
                  name="term"
                  value={formData.term}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, term: e.target.value }))
                  }
                  required
                >
                  <option value="Term 1">Term 1</option>
                  <option value="Term 2">Term 2</option>
                  <option value="Term 3">Term 3</option>
                  <option value="Mid-Term">Mid-Term</option>
                  <option value="Full Year">Full Year</option>
                </select>
              </div>

              <div className="form-group">
                <label>School Year</label>
                <input
                  type="number"
                  name="school_year"
                  value={formData.school_year}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      school_year: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowRequestForm(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={!formData.student}
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParentReportRequest;
