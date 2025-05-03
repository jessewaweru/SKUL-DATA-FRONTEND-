import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  FiFileText,
  FiDownload,
  FiShare2,
  FiCalendar,
  FiEye,
} from "react-icons/fi";
import { useQuery } from "@tanstack/react-query";
import {
  fetchParent,
  fetchParentDocuments,
} from "../../../../services/parentsApi";
import "../Parents/parents.css";

const ParentReportsAccess = () => {
  const { parentId } = useParams();
  const [activeTab, setActiveTab] = useState("reports"); // reports or documents
  const [filter, setFilter] = useState("all"); // all, academic, attendance, other

  const { data: parent } = useQuery(["parent", parentId], () =>
    fetchParent(parentId)
  );
  const { data: documents } = useQuery(["parentDocuments", parentId], () =>
    fetchParentDocuments(parentId)
  );

  const filteredReports = documents?.filter((doc) => {
    if (filter === "all") return true;
    if (filter === "academic")
      return doc.title.includes("Report") || doc.title.includes("Academic");
    if (filter === "attendance") return doc.title.includes("Attendance");
    return true;
  });

  return (
    <div className="parent-reports-access">
      <div className="reports-header">
        <h3>Reports & Document Access</h3>
        <div className="parent-info">
          For: {parent?.user.first_name} {parent?.user.last_name}
          <span className="children-count">
            {parent?.children_count}{" "}
            {parent?.children_count === 1 ? "child" : "children"}
          </span>
        </div>
      </div>

      <div className="tabs-container">
        <div className="tabs">
          <button
            className={activeTab === "reports" ? "active" : ""}
            onClick={() => setActiveTab("reports")}
          >
            Academic Reports
          </button>
          <button
            className={activeTab === "documents" ? "active" : ""}
            onClick={() => setActiveTab("documents")}
          >
            Shared Documents
          </button>
        </div>

        <div className="filter-controls">
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Types</option>
            <option value="academic">Academic Reports</option>
            <option value="attendance">Attendance Records</option>
            <option value="other">Other Documents</option>
          </select>
        </div>
      </div>

      {activeTab === "reports" ? (
        <div className="reports-grid">
          {filteredReports
            ?.filter((d) => d.document_type === "REPORT_CARD")
            .map((report) => (
              <div key={report.id} className="report-card">
                <div className="report-header">
                  <FiFileText className="report-icon" />
                  <div className="report-meta">
                    <h4>{report.title}</h4>
                    <span className="report-date">
                      <FiCalendar />{" "}
                      {new Date(report.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="report-actions">
                  <button className="view-btn">
                    <FiEye /> View
                  </button>
                  <button className="download-btn">
                    <FiDownload /> Download
                  </button>
                  <button className="share-btn">
                    <FiShare2 /> Share
                  </button>
                </div>
                {report.related_student && (
                  <div className="report-student">
                    For: {report.related_student.first_name}{" "}
                    {report.related_student.last_name}
                  </div>
                )}
              </div>
            ))}
        </div>
      ) : (
        <div className="documents-table">
          <table>
            <thead>
              <tr>
                <th>Document</th>
                <th>Type</th>
                <th>Shared On</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports?.map((doc) => (
                <tr key={doc.id}>
                  <td>
                    <FiFileText /> {doc.title}
                  </td>
                  <td>
                    <span
                      className={`doc-type ${doc.document_type.toLowerCase()}`}
                    >
                      {doc.document_type.replace("_", " ")}
                    </span>
                  </td>
                  <td>{new Date(doc.created_at).toLocaleDateString()}</td>
                  <td>
                    <div className="doc-actions">
                      <button title="View">
                        <FiEye />
                      </button>
                      <button title="Download">
                        <FiDownload />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ParentReportsAccess;
