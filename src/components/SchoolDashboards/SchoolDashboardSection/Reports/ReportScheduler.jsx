import React, { useState, useEffect } from "react";
import { FiPlus, FiTrash2, FiEdit2, FiFilter } from "react-icons/fi";
import { useApi } from "../../../../hooks/useApi";
import ScheduleEditorModal from "./ScheduleEditorModal";
import "../Reports/reports.css";

const ReportScheduler = () => {
  const api = useApi();
  const [schedules, setSchedules] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [filters, setFilters] = useState({
    status: "all",
    frequency: "all",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [schedulesRes, templatesRes] = await Promise.all([
          api.get("/api/reports/schedules/"),
          api.get("/api/reports/templates/"),
        ]);

        const schedulesData = Array.isArray(schedulesRes.data)
          ? schedulesRes.data
          : schedulesRes.data.results || schedulesRes.data.data || [];
        const templatesData = Array.isArray(templatesRes.data)
          ? templatesRes.data
          : templatesRes.data.results || templatesRes.data.data || [];

        setSchedules(schedulesData);
        setTemplates(templatesData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredSchedules = schedules.filter((schedule) => {
    return (
      (filters.status === "all" ||
        (filters.status === "active" && schedule.is_active) ||
        (filters.status === "inactive" && !schedule.is_active)) &&
      (filters.frequency === "all" || schedule.frequency === filters.frequency)
    );
  });

  const handleDelete = async (scheduleId) => {
    if (window.confirm("Are you sure you want to delete this schedule?")) {
      try {
        await api.delete(`/api/reports/schedules/${scheduleId}/`);
        setSchedules(schedules.filter((s) => s.id !== scheduleId));
      } catch (error) {
        console.error("Error deleting schedule:", error);
      }
    }
  };

  const handleEdit = (schedule) => {
    setSelectedSchedule(schedule);
    setShowEditor(true);
  };

  const handleCreateNew = () => {
    setSelectedSchedule(null);
    setShowEditor(true);
  };

  const handleSaveSchedule = (savedSchedule) => {
    if (selectedSchedule) {
      setSchedules(
        schedules.map((s) => (s.id === savedSchedule.id ? savedSchedule : s))
      );
    } else {
      setSchedules([...schedules, savedSchedule]);
    }
    setShowEditor(false);
  };

  const getFrequencyLabel = (frequency, customCron) => {
    if (frequency === "CUSTOM") return customCron || "Custom";
    return {
      DAILY: "Daily",
      WEEKLY: "Weekly",
      MONTHLY: "Monthly",
      TERMLY: "Termly",
      YEARLY: "Yearly",
    }[frequency];
  };

  return (
    <div className="scheduler-vertical-container">
      {/* Header Section */}
      <div className="scheduler-header">
        <div className="header-content">
          <h2>Scheduled Reports</h2>
          <p className="subtitle">
            Manage automated report generation schedules
          </p>
        </div>
        <div className="header-actions">
          <button className="btn-primary" onClick={handleCreateNew}>
            <FiPlus /> New Schedule
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="scheduler-content">
        {/* Filters Section */}
        <div className="filters-section">
          <div className="filter-group">
            <label>
              <FiFilter /> Status:
            </label>
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Frequency:</label>
            <select
              value={filters.frequency}
              onChange={(e) =>
                setFilters({ ...filters, frequency: e.target.value })
              }
            >
              <option value="all">All Frequencies</option>
              <option value="DAILY">Daily</option>
              <option value="WEEKLY">Weekly</option>
              <option value="MONTHLY">Monthly</option>
              <option value="TERMLY">Termly</option>
              <option value="YEARLY">Yearly</option>
              <option value="CUSTOM">Custom</option>
            </select>
          </div>
        </div>

        {/* Table Section */}
        {isLoading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading schedules...</p>
          </div>
        ) : filteredSchedules.length === 0 ? (
          <div className="empty-state">
            <p>No scheduled reports found matching your criteria</p>
            <button className="btn-primary" onClick={handleCreateNew}>
              <FiPlus /> Create New Schedule
            </button>
          </div>
        ) : (
          <div className="table-container">
            <table className="schedules-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Report Template</th>
                  <th>Frequency</th>
                  <th>Next Run</th>
                  <th>Recipients</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSchedules.map((schedule) => (
                  <tr key={schedule.id}>
                    <td className="schedule-name">
                      <strong>{schedule.name}</strong>
                      {schedule.description && (
                        <div className="schedule-description">
                          {schedule.description}
                        </div>
                      )}
                    </td>
                    <td>{schedule.report_template?.name || "Unknown"}</td>
                    <td>
                      <div className="frequency-badge">
                        {schedule.frequency === "CUSTOM"
                          ? schedule.custom_cron || "Custom"
                          : schedule.frequency}
                      </div>
                    </td>
                    <td>
                      {schedule.next_run
                        ? new Date(schedule.next_run).toLocaleString()
                        : "Not scheduled"}
                    </td>
                    <td>
                      {schedule.email_recipients
                        ? schedule.email_recipients.split(",").length +
                          " recipients"
                        : "None"}
                    </td>
                    <td>
                      <span
                        className={`status-badge ${
                          schedule.is_active ? "active" : "inactive"
                        }`}
                      >
                        {schedule.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-icon"
                          onClick={() => handleEdit(schedule)}
                          title="Edit"
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          className="btn-icon danger"
                          onClick={() => handleDelete(schedule.id)}
                          title="Delete"
                        >
                          <FiTrash2 />
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

      {/* Modal */}
      {showEditor && (
        <ScheduleEditorModal
          schedule={selectedSchedule}
          templates={templates}
          onSave={handleSaveSchedule}
          onClose={() => setShowEditor(false)}
        />
      )}
    </div>
  );
};

export default ReportScheduler;
