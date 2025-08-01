import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiPlus, FiUpload } from "react-icons/fi";

import ParentTable from "./ParentTable";
import { fetchParents } from "../../../../services/parentsApi";
import "../Parents/parents.css";

const ParentsOverview = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    childrenCount: "",
  });

  const navigate = useNavigate();

  const { data: parents, isLoading } = useQuery({
    queryKey: ["parents", { search: searchTerm, ...filters }],
    queryFn: () => fetchParents({ search: searchTerm, ...filters }),
  });

  return (
    <div className="parents-overview">
      <div className="parents-header">
        <h2>Parents Management</h2>

        <div className="parents-actions">
          <div className="search-filter">
            <FiSearch />
            <input
              type="text"
              placeholder="Search parents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="action-buttons">
            <button
              className="create-button"
              onClick={() => navigate("/dashboard/parents/create")}
            >
              <FiPlus /> New Parent
            </button>

            <button
              className="create-button secondary"
              onClick={() => navigate("/dashboard/parents/bulk-import")}
            >
              <FiUpload /> Bulk Import
            </button>
          </div>
        </div>
      </div>

      <div className="filters-row">
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="PENDING">Pending</option>
          <option value="INACTIVE">Inactive</option>
        </select>

        <select
          value={filters.childrenCount}
          onChange={(e) =>
            setFilters({ ...filters, childrenCount: e.target.value })
          }
        >
          <option value="">Any Children Count</option>
          <option value="1">1 Child</option>
          <option value="2">2 Children</option>
          <option value="3+">3+ Children</option>
        </select>
      </div>

      <ParentTable parents={parents} isLoading={isLoading} />
    </div>
  );
};

export default ParentsOverview;
