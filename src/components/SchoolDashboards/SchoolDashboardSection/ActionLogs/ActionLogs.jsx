import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiFilter, FiDownload, FiSearch, FiCalendar } from "react-icons/fi";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import ActionLogsTable from "./ActionLogsTable";
import ActionLogDetailsModal from "./ActionLogDetailsModal";
import { format } from "date-fns";

const ActionLogs = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 20,
    totalCount: 0,
  });
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    model: "",
    user: "",
    dateRange: {
      startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
      endDate: new Date(),
      key: "selection",
    },
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    categories: [],
    models: [],
  });

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  useEffect(() => {
    fetchActionLogs();
  }, [filters, pagination.page, location.pathname]);

  const fetchFilterOptions = async () => {
    try {
      const [categoriesRes, modelsRes] = await Promise.all([
        fetch("/api/action-logs/category_options/"),
        fetch("/api/action-logs/model_options/"),
      ]);

      const categories = await categoriesRes.json();
      const models = await modelsRes.json();

      setFilterOptions({
        categories: categories.map((c) => ({ value: c[0], label: c[1] })),
        models: models.map((m) => ({ value: m.value, label: m.label })),
      });
    } catch (error) {
      console.error("Error fetching filter options:", error);
    }
  };

  const fetchActionLogs = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: pagination.page,
        page_size: pagination.pageSize,
        search: filters.search,
        category: filters.category,
        content_type__model: filters.model,
        user_tag: filters.user,
        timestamp__gte: format(filters.dateRange.startDate, "yyyy-MM-dd"),
        timestamp__lte: format(filters.dateRange.endDate, "yyyy-MM-dd"),
      });

      // Add path-based filter if on a sub-route
      if (location.pathname.includes("/users")) {
        queryParams.set("content_type__model", "user");
      } else if (location.pathname.includes("/documents")) {
        queryParams.set("content_type__model", "document");
      } else if (location.pathname.includes("/system")) {
        queryParams.set("category", "SYSTEM");
      }

      const response = await fetch(`/api/action-logs/?${queryParams}`);
      const data = await response.json();

      setLogs(data.results);
      setPagination((prev) => ({
        ...prev,
        totalCount: data.count,
      }));
    } catch (error) {
      console.error("Error fetching action logs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateRangeChange = (ranges) => {
    setFilters((prev) => ({
      ...prev,
      dateRange: ranges.selection,
    }));
    setShowDatePicker(false);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handleRowClick = (log) => {
    setSelectedLog(log);
    setShowModal(true);
  };

  const exportToCSV = async () => {
    try {
      const queryParams = new URLSearchParams({
        ...filters,
        timestamp__gte: format(filters.dateRange.startDate, "yyyy-MM-dd"),
        timestamp__lte: format(filters.dateRange.endDate, "yyyy-MM-dd"),
        export: "csv",
      });

      const response = await fetch(`/api/action-logs/?${queryParams}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `action_logs_${format(new Date(), "yyyyMMdd_HHmmss")}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error("Error exporting logs:", error);
    }
  };

  return (
    <div className="action-logs-container">
      <div className="action-logs-header">
        <h2>
          {location.pathname.includes("/users") && "User Activities"}
          {location.pathname.includes("/documents") && "Document Changes"}
          {location.pathname.includes("/system") && "System Events"}
          {!location.pathname.includes("/users") &&
            !location.pathname.includes("/documents") &&
            !location.pathname.includes("/system") &&
            "All Activities"}
        </h2>

        <div className="action-logs-actions">
          <button
            className="filter-button"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FiFilter /> Filters
          </button>

          <button className="export-button" onClick={exportToCSV}>
            <FiDownload /> Export
          </button>
        </div>
      </div>

      <div className={`filters-panel ${showFilters ? "visible" : ""}`}>
        <div className="filter-group">
          <div className="filter-input">
            <FiSearch className="search-icon" />
            <input
              type="text"
              name="search"
              placeholder="Search actions..."
              value={filters.search}
              onChange={handleFilterChange}
            />
          </div>
        </div>

        <div className="filter-group">
          <label>Date Range</label>
          <div
            className="date-range-input"
            onClick={() => setShowDatePicker(!showDatePicker)}
          >
            <FiCalendar />
            <span>
              {format(filters.dateRange.startDate, "MMM d, yyyy")} -{" "}
              {format(filters.dateRange.endDate, "MMM d, yyyy")}
            </span>
          </div>
          {showDatePicker && (
            <div className="date-range-picker">
              <DateRangePicker
                ranges={[filters.dateRange]}
                onChange={handleDateRangeChange}
                staticRanges={[]}
                inputRanges={[]}
              />
            </div>
          )}
        </div>

        <div className="filter-group">
          <label>Action Type</label>
          <select
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
          >
            <option value="">All Types</option>
            {filterOptions.categories.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Affected Model</label>
          <select
            name="model"
            value={filters.model}
            onChange={handleFilterChange}
          >
            <option value="">All Models</option>
            {filterOptions.models.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>User Tag</label>
          <input
            type="text"
            name="user"
            placeholder="Filter by user tag..."
            value={filters.user}
            onChange={handleFilterChange}
          />
        </div>
      </div>

      <ActionLogsTable
        logs={logs}
        loading={loading}
        onRowClick={handleRowClick}
        pagination={pagination}
        onPageChange={handlePageChange}
      />

      {showModal && selectedLog && (
        <ActionLogDetailsModal
          log={selectedLog}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default ActionLogs;
