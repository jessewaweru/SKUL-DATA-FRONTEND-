import { Outlet, useNavigate, useParams, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { fetchParent } from "../../../../services/parentsApi";
import { useQuery } from "@tanstack/react-query";
import "../Parents/parents.css";

const ParentDetailWrapper = () => {
  const { parentId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const { data: parent } = useQuery({
    queryKey: ["parent", parentId],
    queryFn: () => fetchParent(parentId),
    enabled: !!parentId, // prevents query from running if parentId is undefined
  });

  // Default to profile tab if no sub-route
  useEffect(() => {
    if (location.pathname === `/dashboard/parents/${parentId}`) {
      navigate(`/dashboard/parents/${parentId}/profile`);
    }
  }, [location, navigate, parentId]);

  return (
    <div className="parent-detail-wrapper">
      <div className="parent-header">
        <h2>
          {parent?.user.first_name} {parent?.user.last_name}
          <span className={`status-badge ${parent?.status.toLowerCase()}`}>
            {parent?.status}
          </span>
        </h2>

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
            Children ({parent?.children_count})
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

      <Outlet context={{ parent }} />
    </div>
  );
};

export default ParentDetailWrapper;
