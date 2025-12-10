import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../../../../hooks/useApi";
import ReportPreviewModal from "./ReportPreviewModal";
import "../Reports/reports.css";

const ReportsOverview = () => {
  const api = useApi();
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get("/users/me/");
        setUserData(response.data);
      } catch (err) {
        console.error("Failed to fetch user data:", err);
        setError("Failed to verify user session");
        setLoading(false);
      }
    };

    fetchUserData();
  }, [api]);

  useEffect(() => {
    if (!userData) return;

    const fetchReports = async () => {
      try {
        setLoading(true);
        const response = await api.get("/reports/generated/");
        const reportsData = response.data.results || response.data;
        setReports(Array.isArray(reportsData) ? reportsData : []);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch reports:", err);
        if (err.response?.status === 401) {
          setError("Your session has expired. Please log in again.");
        } else {
          setError("Failed to load reports. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [api, userData]);

  const handlePreview = (report, e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setSelectedReport(report);
    setShowPreview(true);
  };

  const handleDownload = async (report, e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }

    if (!report || !report.file) {
      alert("Report file not available");
      return;
    }

    try {
      // Use the file URL directly if it's a full URL
      if (report.file.startsWith("http")) {
        window.open(report.file, "_blank");
        return;
      }

      // Otherwise, fetch through API
      const response = await api.get(
        `/reports/generated/${report.id}/download/`,
        {
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], {
        type:
          report.file_format === "PDF"
            ? "application/pdf"
            : "application/vnd.ms-excel",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      const filename =
        report.file.split("/").pop() ||
        `${report.title}.${report.file_format.toLowerCase()}`;
      link.setAttribute("download", filename);

      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading report:", error);
      alert("Failed to download report. Please try again.");
    }
  };

  const isAdmin = userData?.user_type === "school_admin";
  const isTeacher = userData?.user_type === "teacher";
  const isParent = userData?.user_type === "parent";

  const reportCards = [
    {
      title: "Generated Reports",
      description: "View all previously generated reports",
      path: "generated",
      icon: "📋",
      visible: true,
      count: reports.length,
    },
    // ✅ ADD THIS NEW CARD - Should be near the top for easy access
    {
      title: "Upload Performance",
      description: "Upload student academic performance data via CSV",
      path: "upload-performance",
      icon: "📤",
      visible: isAdmin || isTeacher, // Only for teachers and admins
      badge: "New",
    },
    {
      title: "Report Templates",
      description: "Manage report templates and designs",
      path: "templates",
      icon: "📐",
      visible: isAdmin,
    },
    {
      title: "Scheduled Reports",
      description: "Setup and manage automated report generation",
      path: "schedules",
      icon: "⏰",
      visible: isAdmin || isTeacher,
    },
    {
      title: "Report Builder",
      description: "Create custom report templates",
      path: "builder",
      icon: "🛠️",
      visible: isAdmin,
    },
    {
      title: "Report Analytics",
      description: "View usage statistics and metrics",
      path: "analytics",
      icon: "📊",
      visible: isAdmin,
    },
    {
      title: "My Requests",
      description: "View your requested student reports",
      path: "term-requests",
      icon: "🙋",
      visible: isParent,
    },
  ].filter((card) => card.visible);

  if (loading) {
    return (
      <div className="reports-page-container">
        <div className="reports-overview">
          <h2>Reports Dashboard</h2>
          <p className="subtitle">Loading reports data...</p>
          <div className="loading-spinner">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="reports-page-container">
        <div className="reports-overview">
          <h2>Reports Dashboard</h2>
          <p className="subtitle error">{error}</p>
          {error.includes("log in") && (
            <button className="btn-primary" onClick={() => navigate("/login")}>
              Go to Login
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="reports-page-container">
      <div className="reports-overview">
        <h2>Reports Dashboard</h2>
        <p className="subtitle">Manage and generate various school reports</p>

        <div className="report-cards-grid">
          {reportCards.map((card) => (
            <div
              key={card.title}
              className="report-card"
              onClick={() => navigate(`/dashboard/reports/${card.path}`)}
            >
              <div className="card-icon">{card.icon}</div>
              <h3>
                {card.title}
                {card.badge && <span className="badge-new">{card.badge}</span>}
              </h3>
              <p>{card.description}</p>
              {card.count !== undefined && (
                <div className="report-count">{card.count} reports</div>
              )}
            </div>
          ))}
        </div>

        {(isAdmin || isTeacher) && (
          <div className="generated-reports-container">
            <div className="reports-header">
              <h3>Recent Reports</h3>
              <div className="reports-actions">
                <div className="filter-tabs">
                  <button className="active">All</button>
                  <button>Published</button>
                  <button>Drafts</button>
                </div>
              </div>
            </div>

            {reports.length > 0 ? (
              <div className="reports-table-container">
                <table className="reports-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Type</th>
                      <th>Status</th>
                      <th>Generated</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.map((report) => (
                      <tr key={report.id}>
                        <td className="report-title">
                          <strong>{report.title}</strong>
                          {report.related_students?.length > 0 && (
                            <span className="report-students">
                              {report.related_students.length} student(s)
                            </span>
                          )}
                        </td>
                        <td>
                          <span
                            className={`type-${
                              report.report_type?.template_type?.toLowerCase() ||
                              "unknown"
                            }`}
                          >
                            {report.report_type?.template_type || "Unknown"}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`status-badge ${
                              report.status?.toLowerCase() || ""
                            }`}
                          >
                            {report.status}
                          </span>
                        </td>
                        <td>
                          {new Date(report.generated_at).toLocaleDateString()}
                          {report.generated_by && (
                            <div className="report-author">
                              by {report.generated_by.first_name}{" "}
                              {report.generated_by.last_name}
                            </div>
                          )}
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="btn-icon"
                              title="View"
                              onClick={(e) => handlePreview(report, e)}
                            >
                              👁️
                            </button>
                            <button
                              className="btn-icon"
                              title="Download"
                              onClick={(e) => handleDownload(report, e)}
                            >
                              ⬇️
                            </button>
                            {isAdmin && (
                              <button
                                className="btn-icon danger"
                                title="Delete"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Add delete functionality
                                }}
                              >
                                🗑️
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <p>No reports available</p>
                <button
                  className="btn-primary"
                  onClick={() => navigate("/dashboard/reports/builder")}
                >
                  Create New Report
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {showPreview && selectedReport && (
        <ReportPreviewModal
          report={selectedReport}
          onClose={() => {
            setShowPreview(false);
            setSelectedReport(null);
          }}
          onDownload={handleDownload}
        />
      )}
    </div>
  );
};

export default ReportsOverview;
