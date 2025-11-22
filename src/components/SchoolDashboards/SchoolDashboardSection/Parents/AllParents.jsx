import { useQuery } from "@tanstack/react-query";
import { FiSearch, FiFilter, FiDownload } from "react-icons/fi";
import ParentTable from "./ParentTable";
import { fetchParents } from "../../../../services/parentsApi";
import { useState } from "react";
import useUser from "../../../../hooks/useUser"; // Add this import
import "../Parents/parents.css";

const AllParents = () => {
  const { schoolId } = useUser(); // Add this line
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    hasChildren: "",
    lastLogin: "",
  });

  const { data: parents, isLoading } = useQuery({
    queryKey: ["allParents", schoolId, searchTerm, filters],
    queryFn: () => fetchParents(schoolId, { search: searchTerm, ...filters }),
    enabled: !!schoolId,
  });

  const exportToCSV = () => {
    console.log("Exporting parents data to CSV");
  };

  return (
    <div className="all-parents">
      <div className="controls-header">
        <h2>All Parents</h2>
        <div className="controls-group">
          <div className="search-box">
            <FiSearch />
            <input
              type="text"
              placeholder="Search parents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="export-btn" onClick={exportToCSV}>
            <FiDownload /> Export
          </button>
        </div>
      </div>

      <div className="filters-row">
        <div className="filter-group">
          <label>
            <FiFilter /> Status:
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
            >
              <option value="">All</option>
              <option value="ACTIVE">Active</option>
              <option value="PENDING">Pending</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </label>
        </div>

        <div className="filter-group">
          <label>
            <FiFilter /> Children:
            <select
              value={filters.hasChildren}
              onChange={(e) =>
                setFilters({ ...filters, hasChildren: e.target.value })
              }
            >
              <option value="">Any</option>
              <option value="HAS_CHILDREN">Has Children</option>
              <option value="NO_CHILDREN">No Children</option>
            </select>
          </label>
        </div>

        <div className="filter-group">
          <label>
            <FiFilter /> Last Login:
            <select
              value={filters.lastLogin}
              onChange={(e) =>
                setFilters({ ...filters, lastLogin: e.target.value })
              }
            >
              <option value="">Any Time</option>
              <option value="LAST_7_DAYS">Last 7 Days</option>
              <option value="LAST_30_DAYS">Last 30 Days</option>
              <option value="OVER_30_DAYS">Over 30 Days Ago</option>
            </select>
          </label>
        </div>
      </div>

      <ParentTable parents={parents} isLoading={isLoading} variant="detailed" />
    </div>
  );
};

export default AllParents;
