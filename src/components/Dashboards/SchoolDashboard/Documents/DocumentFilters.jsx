import React from "react";
import { FiFilter, FiX } from "react-icons/fi";
import { useState } from "react";
import "../Documents/documents.css";

const DocumentFilters = ({
  filterValues,
  setFilterValues,
  categories,
  classes,
}) => {
  const [filtersOpen, setFiltersOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilterValues((prev) => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilterValues({
      category: "",
      school: "",
      related_class: "",
      is_public: "",
      search: "",
    });
  };

  const hasActiveFilters = Object.values(filterValues).some(
    (val) => val !== ""
  );

  return (
    <div className="document-filters">
      <button
        className={`filter-toggle ${hasActiveFilters ? "active" : ""}`}
        onClick={() => setFiltersOpen(!filtersOpen)}
      >
        <FiFilter /> Filters{" "}
        {hasActiveFilters && <span className="badge"></span>}
      </button>

      <div className="search-box">
        <input
          type="text"
          name="search"
          placeholder="Search documents..."
          value={filterValues.search}
          onChange={handleChange}
        />
      </div>

      {filtersOpen && (
        <div className="filter-panel">
          <div className="filter-group">
            <label>Category</label>
            <select
              name="category"
              value={filterValues.category}
              onChange={handleChange}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {classes.length > 0 && (
            <div className="filter-group">
              <label>Class</label>
              <select
                name="related_class"
                value={filterValues.related_class}
                onChange={handleChange}
              >
                <option value="">All Classes</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="filter-group">
            <label>Visibility</label>
            <select
              name="is_public"
              value={filterValues.is_public}
              onChange={handleChange}
            >
              <option value="">All</option>
              <option value="true">Public</option>
              <option value="false">Private</option>
            </select>
          </div>

          {hasActiveFilters && (
            <button className="clear-filters" onClick={clearFilters}>
              <FiX /> Clear Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default DocumentFilters;
