import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  FiSearch,
  FiPlus,
  FiUpload,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

import ParentTable from "./ParentTable";
import { fetchParents } from "../../../../services/parentsApi";
import useUser from "../../../../hooks/useUser";
import "../Parents/parents.css";

const ParentsOverview = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    childrenCount: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20; // Adjust as needed

  const navigate = useNavigate();
  const { schoolId } = useUser();

  const { data: parents, isLoading } = useQuery({
    queryKey: ["parents", schoolId, searchTerm, filters],
    queryFn: () => fetchParents(schoolId, { search: searchTerm, ...filters }),
    enabled: !!schoolId,
  });

  // Filter parents based on search and filters
  const filteredParents =
    parents?.filter((parent) => {
      const matchesSearch =
        !searchTerm ||
        `${parent.first_name} ${parent.last_name}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        parent.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = !filters.status || parent.status === filters.status;

      const childrenCount = parent.children?.length || 0;
      let matchesChildren = true;
      if (filters.childrenCount === "1") matchesChildren = childrenCount === 1;
      else if (filters.childrenCount === "2")
        matchesChildren = childrenCount === 2;
      else if (filters.childrenCount === "3+")
        matchesChildren = childrenCount >= 3;

      return matchesSearch && matchesStatus && matchesChildren;
    }) || [];

  // Pagination calculations
  const totalPages = Math.ceil(filteredParents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedParents = filteredParents.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  return (
    <div className="parents-overview">
      <div className="parents-header">
        <div className="header-title">
          <h2>Parents Management</h2>
          <span className="total-count">
            {filteredParents.length}{" "}
            {filteredParents.length === 1 ? "parent" : "parents"}
          </span>
        </div>

        <div className="parents-actions">
          <div className="search-filter">
            <FiSearch />
            <input
              type="text"
              placeholder="Search parents..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
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
          onChange={(e) =>
            handleFilterChange({ ...filters, status: e.target.value })
          }
        >
          <option value="">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="PENDING">Pending</option>
          <option value="INACTIVE">Inactive</option>
        </select>

        <select
          value={filters.childrenCount}
          onChange={(e) =>
            handleFilterChange({ ...filters, childrenCount: e.target.value })
          }
        >
          <option value="">Any Children Count</option>
          <option value="1">1 Child</option>
          <option value="2">2 Children</option>
          <option value="3+">3+ Children</option>
        </select>
      </div>

      {!schoolId ? (
        <div className="loading-container">Loading school information...</div>
      ) : (
        <>
          <ParentTable parents={paginatedParents} isLoading={isLoading} />

          {totalPages > 1 && (
            <div className="pagination-controls">
              <button
                className="pagination-btn"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <FiChevronLeft /> Previous
              </button>

              <div className="pagination-info">
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <span className="range-info">
                  Showing {startIndex + 1}-
                  {Math.min(endIndex, filteredParents.length)} of{" "}
                  {filteredParents.length}
                </span>
              </div>

              <button
                className="pagination-btn"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
              >
                Next <FiChevronRight />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ParentsOverview;
