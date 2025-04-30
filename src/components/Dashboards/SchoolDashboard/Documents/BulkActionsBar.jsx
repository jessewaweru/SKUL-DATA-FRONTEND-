import React from "react";
import { FiDownload, FiTrash2, FiX } from "react-icons/fi";
import "../Documents/documents.css";

const BulkActionsBar = ({ count, onDelete, onDownload, onClear }) => {
  return (
    <div className="bulk-actions-bar">
      <div className="selected-count">
        {count} {count === 1 ? "document" : "documents"} selected
      </div>
      <div className="actions">
        <button onClick={onDownload} className="btn-icon">
          <FiDownload /> Download
        </button>
        <button onClick={onDelete} className="btn-icon danger">
          <FiTrash2 /> Delete
        </button>
        <button onClick={onClear} className="btn-icon">
          <FiX /> Clear
        </button>
      </div>
    </div>
  );
};

export default BulkActionsBar;
