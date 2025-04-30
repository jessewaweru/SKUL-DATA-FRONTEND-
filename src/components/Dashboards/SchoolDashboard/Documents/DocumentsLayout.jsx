import { Outlet } from "react-router-dom";
import DocumentsSidebar from "./DocumentsSidebar";

const DocumentsLayout = () => {
  return (
    <div className="documents-layout">
      <DocumentsSidebar />
      <div className="documents-content">
        <Outlet />
      </div>
    </div>
  );
};

export default DocumentsLayout;
