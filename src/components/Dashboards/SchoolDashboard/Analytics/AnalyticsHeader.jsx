import { useLocation } from "react-router-dom";
import { FiChevronRight } from "react-icons/fi";
import "../Analytics/analytics.css";

const AnalyticsHeader = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter(Boolean);

  // Get the current analytics section (teachers, students, etc.)
  const currentSection = pathSegments.length > 2 ? pathSegments[2] : "overview";

  const getSectionTitle = (section) => {
    switch (section) {
      case "teachers":
        return "Teachers Analytics";
      case "students":
        return "Students Analytics";
      case "classes":
        return "Classes Analytics";
      case "documents":
        return "Documents Analytics";
      case "reports":
        return "Reports Analytics";
      case "parents":
        return "Parents Analytics";
      case "school-wide":
        return "School Wide Analytics";
      case "builder":
        return "Custom Analytics Builder";
      default:
        return "Analytics Overview";
    }
  };

  return (
    <div className="analytics-header">
      <h2 className="analytics-title">
        <span className="analytics-breadcrumb">
          Dashboard <FiChevronRight /> Analytics
          {currentSection !== "overview" && (
            <>
              <FiChevronRight /> {getSectionTitle(currentSection)}
            </>
          )}
        </span>
      </h2>
      <div className="analytics-toolbar">
        <DateRangePicker />
        <ExportButton />
      </div>
    </div>
  );
};

const DateRangePicker = () => {
  return (
    <div className="date-range-picker">
      <select className="date-range-select">
        <option value="today">Today</option>
        <option value="week">This Week</option>
        <option value="month" selected>
          This Month
        </option>
        <option value="term">This Term</option>
        <option value="custom">Custom Range</option>
      </select>
    </div>
  );
};

const ExportButton = () => {
  return (
    <button className="export-button">
      Export <FiChevronRight />
    </button>
  );
};

export default AnalyticsHeader;
