// src/components/SchoolDashboard/Reports/ReportScheduler.jsx
import React, { useState, useEffect } from "react";
import { FiPlus, FiTrash2, FiEdit2, FiClock } from "react-icons/fi";
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [schedulesRes, templatesRes] = await Promise.all([
          api.get("/api/reports/schedules/"),
          api.get("/api/reports/templates/"),
        ]);
        setSchedules(schedulesRes.data);
        setTemplates(templatesRes.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

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
    <div className="scheduler-container">
      <div className="scheduler-header">
        <h2>Scheduled Reports</h2>
        <button className="btn-primary" onClick={handleCreateNew}>
          <FiPlus /> New Schedule
        </button>
      </div>

      {isLoading ? (
        <div className="loading-spinner">Loading schedules...</div>
      ) : schedules.length === 0 ? (
        <div className="empty-state">
          <p>No scheduled reports found</p>
          <button className="btn-primary" onClick={handleCreateNew}>
            <FiPlus /> Create Your First Schedule
          </button>
        </div>
      ) : (
        <div className="schedules-table-container">
          <table className="schedules-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Report Template</th>
                <th>Frequency</th>
                <th>Next Run</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {schedules.map((schedule) => (
                <tr key={schedule.id}>
                  <td>{schedule.name}</td>
                  <td>{schedule.report_template.name}</td>
                  <td>
                    {getFrequencyLabel(
                      schedule.frequency,
                      schedule.custom_cron
                    )}
                  </td>
                  <td>
                    {schedule.next_run
                      ? new Date(schedule.next_run).toLocaleString()
                      : "N/A"}
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
