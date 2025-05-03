// src/components/SchoolDashboard/Reports/GeneratedReports.jsx
import React, { useState, useEffect } from "react";
import {
  FiDownload,
  FiEye,
  FiShare2,
  FiFilter,
  FiRefreshCw,
  FiFilePlus,
  FiClock,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";
import { useApi } from "../../../../hooks/useApi";
import useUser from "../../../../hooks/useUser";
import ReportPreviewModal from "./ReportPreviewModal";
import GenerateReportModal from "./GenerateReportModal";
import ShareReportModal from "./ShareReportModal";
import "../Reports/reports.css";

const GeneratedReports = () => {
  const { user } = useUser();
  const api = useApi();
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showGenerator, setShowGenerator] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [filters, setFilters] = useState({
    report_type: "",
    status: "",
    date_from: "",
    date_to: "",
  });
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    fetchReports();
  }, [filters]);

  const fetchReports = async () => {
    setIsLoading(true);
    try {
      let url = "/api/reports/generated/";
      const params = new URLSearchParams();

      if (filters.report_type)
        params.append("report_type", filters.report_type);
      if (filters.status) params.append("status", filters.status);
      if (filters.date_from) params.append("date_from", filters.date_from);
      if (filters.date_to) params.append("date_to", filters.date_to);

      if (params.toString()) url += `?${params.toString()}`;

      const response = await api.get(url);
      setReports(response.data);
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (reportId, filename) => {
    try {
      const response = await api.get(
        `/api/reports/generated/${reportId}/download/`,
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading report:", error);
    }
  };

  const handlePreview = (report) => {
    setSelectedReport(report);
    setShowPreview(true);
  };

  const handleShare = (report) => {
    setSelectedReport(report);
    setShowShare(true);
  };

  const handleGenerateNew = () => {
    setShowGenerator(true);
  };

  const handleFilterChange = (filter, value) => {
    setFilters((prev) => ({ ...prev, [filter]: value }));
  };

  const handleStatusFilter = (status) => {
    setActiveFilter(status);
    setFilters((prev) => ({ ...prev, status: status === "all" ? "" : status }));
  };

  const filteredReports = reports.filter((report) => {
    if (user?.user_type === "parent") {
      return report.status === "PUBLISHED";
    }
    return true;
  });

  return (
    <div className="generated-reports-container">
      <div className="reports-header">
        <h2>
          {user?.user_type === "parent"
            ? "Student Reports"
            : "Generated Reports"}
        </h2>

        <div className="reports-actions">
          {user?.user_type !== "parent" && (
            <>
              <div className="filter-tabs">
                <button
                  className={activeFilter === "all" ? "active" : ""}
                  onClick={() => handleStatusFilter("all")}
                >
                  All
                </button>
                <button
                  className={activeFilter === "PUBLISHED" ? "active" : ""}
                  onClick={() => handleStatusFilter("PUBLISHED")}
                >
                  <FiCheckCircle /> Published
                </button>
                <button
                  className={activeFilter === "DRAFT" ? "active" : ""}
                  onClick={() => handleStatusFilter("DRAFT")}
                >
                  <FiClock /> Draft
                </button>
                {user?.user_type === "school_superuser" && (
                  <button
                    className={activeFilter === "ARCHIVED" ? "active" : ""}
                    onClick={() => handleStatusFilter("ARCHIVED")}
                  >
                    <FiXCircle /> Archived
                  </button>
                )}
              </div>

              <button className="btn-primary" onClick={handleGenerateNew}>
                <FiFilePlus /> Generate Report
              </button>
            </>
          )}
        </div>
      </div>

      <div className="filters-container">
        <div className="filter-group">
          <label>
            <FiFilter /> Report Type:
          </label>
          <select
            value={filters.report_type}
            onChange={(e) => handleFilterChange("report_type", e.target.value)}
          >
            <option value="">All Types</option>
            <option value="ACADEMIC">Academic</option>
            <option value="ATTENDANCE">Attendance</option>
            <option value="PAYROLL">Payroll</option>
            <option value="ENROLLMENT">Enrollment</option>
          </select>
        </div>

        <div className="filter-group">
          <label>From:</label>
          <input
            type="date"
            value={filters.date_from}
            onChange={(e) => handleFilterChange("date_from", e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label>To:</label>
          <input
            type="date"
            value={filters.date_to}
            onChange={(e) => handleFilterChange("date_to", e.target.value)}
          />
        </div>

        <button className="btn-secondary" onClick={fetchReports}>
          <FiRefreshCw /> Refresh
        </button>
      </div>

      {isLoading ? (
        <div className="loading-spinner">Loading reports...</div>
      ) : filteredReports.length === 0 ? (
        <div className="empty-state">
          <p>No reports found matching your criteria</p>
          {user?.user_type !== "parent" && (
            <button className="btn-primary" onClick={handleGenerateNew}>
              <FiFilePlus /> Generate Your First Report
            </button>
          )}
        </div>
      ) : (
        <div className="reports-table-container">
          <table className="reports-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Type</th>
                <th>Generated On</th>
                <th>Status</th>
                <th>Generated By</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((report) => (
                <tr key={report.id}>
                  <td>{report.title}</td>
                  <td
                    className={`type-${report.report_type.template_type.toLowerCase()}`}
                  >
                    {report.report_type.template_type}
                  </td>
                  <td>{new Date(report.generated_at).toLocaleDateString()}</td>
                  <td>
                    <span
                      className={`status-badge ${report.status.toLowerCase()}`}
                    >
                      {report.status}
                      {report.status === "PUBLISHED" && <FiCheckCircle />}
                      {report.status === "DRAFT" && <FiClock />}
                      {report.status === "ARCHIVED" && <FiXCircle />}
                    </span>
                  </td>
                  <td>{report.generated_by?.username || "System"}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-icon"
                        onClick={() => handlePreview(report)}
                        title="Preview"
                      >
                        <FiEye />
                      </button>
                      <button
                        className="btn-icon"
                        onClick={() =>
                          handleDownload(
                            report.id,
                            `${
                              report.title
                            }.${report.file_format.toLowerCase()}`
                          )
                        }
                        title="Download"
                      >
                        <FiDownload />
                      </button>
                      {user.user_type !== "parent" && (
                        <button
                          className="btn-icon"
                          onClick={() => handleShare(report)}
                          title="Share"
                        >
                          <FiShare2 />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showPreview && (
        <ReportPreviewModal
          report={selectedReport}
          onClose={() => setShowPreview(false)}
          onDownload={handleDownload}
        />
      )}

      {showGenerator && (
        <GenerateReportModal
          onClose={() => setShowGenerator(false)}
          onGenerate={fetchReports}
        />
      )}

      {showShare && (
        <ShareReportModal
          report={selectedReport}
          onClose={() => setShowShare(false)}
        />
      )}
    </div>
  );
};

export default GeneratedReports;
