import { useState } from "react";
import { FiFileText, FiDownload, FiEye, FiFilter } from "react-icons/fi";
import TabNavigation from "../../../common/TabNavigation";
import "../Teachers/teachers.css";

const TeacherReports = () => {
  const [activeTab, setActiveTab] = useState("submitted");
  const [filterOpen, setFilterOpen] = useState(false);

  const tabs = [
    { id: "submitted", label: "Submitted Reports" },
    { id: "about", label: "Reports About Teacher" },
  ];

  // Mock data - replace with API calls
  const submittedReports = [
    {
      id: 1,
      title: "Term 1 Academic Reports - Grade 5",
      type: "Academic",
      date: "2023-04-15",
      status: "Published",
      class: "Grade 5",
    },
    // ... more reports
  ];

  const aboutReports = [
    {
      id: 1,
      title: "Teacher Performance Evaluation - Q1 2023",
      type: "Evaluation",
      date: "2023-03-30",
      status: "Approved",
    },
    // ... more reports
  ];

  return (
    <div className="teacher-reports">
      <div className="reports-header">
        <h2>Teacher Reports</h2>
        <button
          className={`filter-button ${filterOpen ? "active" : ""}`}
          onClick={() => setFilterOpen(!filterOpen)}
        >
          <FiFilter /> Filters
        </button>
      </div>

      {filterOpen && (
        <div className="filter-panel">
          <div className="filter-group">
            <label>Report Type</label>
            <select>
              <option>All Types</option>
              <option>Academic</option>
              <option>Attendance</option>
              <option>Evaluation</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Date Range</label>
            <div className="date-range">
              <input type="date" />
              <span>to</span>
              <input type="date" />
            </div>
          </div>
          <div className="filter-group">
            <label>Status</label>
            <select>
              <option>All Statuses</option>
              <option>Draft</option>
              <option>Published</option>
              <option>Archived</option>
            </select>
          </div>
          <div className="filter-actions">
            <button className="apply-button">Apply Filters</button>
            <button className="reset-button">Reset</button>
          </div>
        </div>
      )}

      <TabNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div className="reports-content">
        {activeTab === "submitted" && (
          <div className="submitted-reports">
            {submittedReports.length === 0 ? (
              <div className="empty-state">
                <FiFileText className="empty-icon" />
                <p>No reports submitted yet</p>
              </div>
            ) : (
              <table className="reports-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Type</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Class</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {submittedReports.map((report) => (
                    <tr key={report.id}>
                      <td>{report.title}</td>
                      <td>{report.type}</td>
                      <td>{report.date}</td>
                      <td>
                        <span
                          className={`status-badge ${report.status.toLowerCase()}`}
                        >
                          {report.status}
                        </span>
                      </td>
                      <td>{report.class}</td>
                      <td>
                        <div className="report-actions">
                          <button className="icon-button" title="View">
                            <FiEye />
                          </button>
                          <button className="icon-button" title="Download">
                            <FiDownload />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === "about" && (
          <div className="about-reports">
            {aboutReports.length === 0 ? (
              <div className="empty-state">
                <FiFileText className="empty-icon" />
                <p>No reports about this teacher</p>
              </div>
            ) : (
              <table className="reports-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Type</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {aboutReports.map((report) => (
                    <tr key={report.id}>
                      <td>{report.title}</td>
                      <td>{report.type}</td>
                      <td>{report.date}</td>
                      <td>
                        <span
                          className={`status-badge ${report.status.toLowerCase()}`}
                        >
                          {report.status}
                        </span>
                      </td>
                      <td>
                        <div className="report-actions">
                          <button className="icon-button" title="View">
                            <FiEye />
                          </button>
                          <button className="icon-button" title="Download">
                            <FiDownload />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherReports;
