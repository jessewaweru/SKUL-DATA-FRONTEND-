import { Outlet, useNavigate, useParams, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { fetchParent } from "../../../../services/parentsApi";
import { useQuery } from "@tanstack/react-query";
import "../Parents/parents.css";

const ParentDetailWrapper = () => {
  const { parentId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    data: parent,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["parent", parentId],
    queryFn: () => fetchParent(parentId),
    enabled: !!parentId,
  });

  console.log("ParentDetailWrapper - parent data:", parent);
  console.log("ParentDetailWrapper - isLoading:", isLoading);

  // Default to profile tab if no sub-route
  useEffect(() => {
    if (location.pathname === `/dashboard/parents/${parentId}`) {
      navigate(`/dashboard/parents/${parentId}/profile`);
    }
  }, [location, navigate, parentId]);

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading parent details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>Error loading parent: {error.message}</p>
        <button onClick={() => navigate("/dashboard/parents")}>
          Back to Parents
        </button>
      </div>
    );
  }

  if (!parent) {
    return (
      <div className="error-container">
        <p>Parent not found</p>
        <button onClick={() => navigate("/dashboard/parents")}>
          Back to Parents
        </button>
      </div>
    );
  }

  // Transform data to match expected structure
  const transformedParent = {
    ...parent,
    user: {
      first_name: parent.first_name,
      last_name: parent.last_name,
      email: parent.email,
      last_login: parent.last_login,
    },
    children_count: parent.children?.length || 0,
  };

  return (
    <div className="parent-detail-wrapper">
      <div className="parent-header">
        <div className="header-content">
          <button
            className="back-button"
            onClick={() => navigate("/dashboard/parents")}
          >
            ← Back
          </button>
          <h2>
            {transformedParent.first_name} {transformedParent.last_name}
            <span className={`status-badge ${parent.status.toLowerCase()}`}>
              {parent.status}
            </span>
          </h2>
        </div>

        <div className="tabs">
          <button
            className={location.pathname.includes("profile") ? "active" : ""}
            onClick={() => navigate(`/dashboard/parents/${parentId}/profile`)}
          >
            Profile
          </button>
          <button
            className={location.pathname.includes("children") ? "active" : ""}
            onClick={() => navigate(`/dashboard/parents/${parentId}/children`)}
          >
            Children ({transformedParent.children_count})
          </button>
          <button
            className={location.pathname.includes("documents") ? "active" : ""}
            onClick={() => navigate(`/dashboard/parents/${parentId}/documents`)}
          >
            Documents
          </button>
          <button
            className={
              location.pathname.includes("notifications") ? "active" : ""
            }
            onClick={() =>
              navigate(`/dashboard/parents/${parentId}/notifications`)
            }
          >
            Notifications
          </button>
          <button
            className={location.pathname.includes("actions") ? "active" : ""}
            onClick={() => navigate(`/dashboard/parents/${parentId}/actions`)}
          >
            Actions
          </button>
        </div>
      </div>

      <Outlet context={{ parent: transformedParent }} />
    </div>
  );
};

export default ParentDetailWrapper;
