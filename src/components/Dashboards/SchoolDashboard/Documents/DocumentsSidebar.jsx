import { NavLink, useLocation } from "react-router-dom";
import {
  FiFileText,
  FiFolder,
  FiUpload,
  FiShare2,
  FiGrid,
} from "react-icons/fi";

const DocumentsSidebar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname.includes(path);
  };

  return (
    <div className="documents-sidebar">
      <nav>
        <ul>
          <li>
            <NavLink
              to="/dashboard/documents"
              className={
                isActive("/dashboard/documents") &&
                !isActive("/dashboard/documents/")
                  ? "active"
                  : ""
              }
              end
            >
              <FiFolder /> Overview
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/documents/uploads"
              className={isActive("/uploads") ? "active" : ""}
            >
              <FiUpload /> Uploads
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/documents/shared"
              className={isActive("/shared") ? "active" : ""}
            >
              <FiShare2 /> Shared
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/documents/categories"
              className={isActive("/categories") ? "active" : ""}
            >
              <FiGrid /> Categories
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/documents/templates"
              className={isActive("/templates") ? "active" : ""}
            >
              <FiFileText /> Templates
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default DocumentsSidebar;
