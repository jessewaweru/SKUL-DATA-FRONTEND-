import { useState } from "react";
import "../ParentSidebar/parentsidebar.css";
import { FiSearch, FiCommand } from "react-icons/fi";

const ParentSearch = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="parent-search-container">
        <FiSearch className="parent-search-icon" />
        <input
          onFocus={(e) => {
            e.target.blur();
            setOpen(true);
          }}
          type="text"
          placeholder="Search school activities"
          className="parent-search-input"
        />
        <span className="parent-shortcut-badge">
          <FiCommand />K
        </span>
      </div>
    </>
  );
};

export default ParentSearch;
