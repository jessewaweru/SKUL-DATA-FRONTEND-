import { useQuery } from "@tanstack/react-query";
import { FiSearch, FiFilter, FiDownload } from "react-icons/fi";
import ParentTable from "./ParentTable";
import { fetchParents } from "../../../../services/parentsApi";
import { useState } from "react";
import "../Parents/parents.css";
import useUser from "../../../../hooks/useUser";

const AllParents = () => {
  const { schoolId } = useUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    hasChildren: "",
    lastLogin: "",
  });

  // const { data: parents, isLoading } = useQuery(
  //   ["allParents", { search: searchTerm, ...filters }],
  //   fetchParents
  // );

  const { data: parents, isLoading } = useQuery(
    ["allParents", schoolId, { search: searchTerm }],
    () => fetchParents(schoolId, { search: searchTerm })
  );

  const exportToCSV = () => {
    // Implementation for CSV export would go here
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

// import { useQuery } from "@tanstack/react-query";
// import { FiSearch, FiFilter, FiDownload, FiRefreshCw } from "react-icons/fi";
// import ParentTable from "./ParentTable";
// import { fetchParents } from "../../../../services/parentsApi";
// import { useState } from "react";
// import "../Parents/parents.css";
// import useUser from "../../../../hooks/useUser";

// const AllParents = () => {
//   const { schoolId, user } = useUser();
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filters, setFilters] = useState({
//     status: "",
//     hasChildren: "",
//     lastLogin: "",
//   });

//   // Build query parameters
//   const queryParams = {
//     ...(searchTerm && { search: searchTerm }),
//     ...(filters.status && { status: filters.status }),
//     ...(filters.hasChildren === "HAS_CHILDREN" && { has_children: true }),
//     ...(filters.hasChildren === "NO_CHILDREN" && { has_children: false }),
//     ...(filters.lastLogin && { last_login_filter: filters.lastLogin }),
//   };

//   const {
//     data: parentsResponse,
//     isLoading,
//     error,
//     refetch,
//     isRefetching,
//   } = useQuery({
//     queryKey: ["allParents", schoolId, queryParams],
//     queryFn: () => fetchParents(queryParams),
//     enabled: !!schoolId && !!user, // Only run if we have schoolId and authenticated user
//     staleTime: 30 * 1000, // 30 seconds
//     cacheTime: 5 * 60 * 1000, // 5 minutes
//     retry: (failureCount, error) => {
//       // Don't retry on authentication errors
//       if (error?.response?.status === 401 || error?.response?.status === 403) {
//         return false;
//       }
//       return failureCount < 2;
//     },
//   });

//   // Extract parents data - handle both paginated and non-paginated responses
//   const parents = parentsResponse?.results || parentsResponse || [];
//   const totalCount = parentsResponse?.count || parents?.length || 0;
//   const isFallback = parentsResponse?.fallback || false;

//   const exportToCSV = () => {
//     if (!parents || parents.length === 0) {
//       alert("No parent data to export");
//       return;
//     }

//     const csvData = parents.map((parent) => ({
//       Name: `${parent.first_name} ${parent.last_name}`,
//       Email: parent.email,
//       Phone: parent.phone_number || "N/A",
//       Status: parent.status,
//       Children: parent.children_count || parent.children?.length || 0,
//       "Last Login": parent.last_login
//         ? new Date(parent.last_login).toLocaleDateString()
//         : "Never",
//     }));

//     const csvContent = [
//       Object.keys(csvData[0]).join(","),
//       ...csvData.map((row) => Object.values(row).join(",")),
//     ].join("\n");

//     const blob = new Blob([csvContent], { type: "text/csv" });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `parents-export-${new Date().toISOString().split("T")[0]}.csv`;
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//     window.URL.revokeObjectURL(url);
//   };

//   // Handle loading state
//   if (isLoading) {
//     return (
//       <div className="all-parents">
//         <div className="loading-state">
//           <div className="loading-spinner"></div>
//           <p>Loading parents data...</p>
//         </div>
//       </div>
//     );
//   }

//   // Handle error state
//   if (error) {
//     return (
//       <div className="all-parents">
//         <div className="error-state">
//           <h3>Error Loading Parents</h3>
//           <p className="error-message">
//             {error?.response?.status === 401
//               ? "You are not authorized to view this data. Please login again."
//               : error?.response?.status === 403
//               ? "You don't have permission to view parents data."
//               : error?.message || "Failed to load parents data"}
//           </p>
//           <div className="error-actions">
//             <button onClick={() => refetch()} className="retry-btn">
//               <FiRefreshCw /> Try Again
//             </button>
//             {error?.response?.status === 401 && (
//               <button
//                 onClick={() => window.location.reload()}
//                 className="refresh-btn"
//               >
//                 Refresh Page
//               </button>
//             )}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="all-parents">
//       {/* Header with controls */}
//       <div className="controls-header">
//         <div className="header-info">
//           <h2>All Parents ({totalCount})</h2>
//           {isFallback && (
//             <span className="fallback-notice">
//               ⚠️ Using fallback data source
//             </span>
//           )}
//         </div>
//         <div className="controls-group">
//           <div className="search-box">
//             <FiSearch />
//             <input
//               type="text"
//               placeholder="Search parents..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>
//           <button
//             className="export-btn"
//             onClick={exportToCSV}
//             disabled={!parents || parents.length === 0}
//           >
//             <FiDownload /> Export CSV
//           </button>
//           <button
//             className="refresh-btn"
//             onClick={() => refetch()}
//             disabled={isRefetching}
//           >
//             <FiRefreshCw className={isRefetching ? "spinning" : ""} />
//             {isRefetching ? "Refreshing..." : "Refresh"}
//           </button>
//         </div>
//       </div>

//       {/* Filters */}
//       <div className="filters-row">
//         <div className="filter-group">
//           <label>
//             <FiFilter /> Status:
//             <select
//               value={filters.status}
//               onChange={(e) =>
//                 setFilters({ ...filters, status: e.target.value })
//               }
//             >
//               <option value="">All Statuses</option>
//               <option value="ACTIVE">Active</option>
//               <option value="PENDING">Pending</option>
//               <option value="INACTIVE">Inactive</option>
//               <option value="SUSPENDED">Suspended</option>
//             </select>
//           </label>
//         </div>

//         <div className="filter-group">
//           <label>
//             <FiFilter /> Children:
//             <select
//               value={filters.hasChildren}
//               onChange={(e) =>
//                 setFilters({ ...filters, hasChildren: e.target.value })
//               }
//             >
//               <option value="">Any</option>
//               <option value="HAS_CHILDREN">Has Children</option>
//               <option value="NO_CHILDREN">No Children</option>
//             </select>
//           </label>
//         </div>

//         <div className="filter-group">
//           <label>
//             <FiFilter /> Last Login:
//             <select
//               value={filters.lastLogin}
//               onChange={(e) =>
//                 setFilters({ ...filters, lastLogin: e.target.value })
//               }
//             >
//               <option value="">Any Time</option>
//               <option value="LAST_7_DAYS">Last 7 Days</option>
//               <option value="LAST_30_DAYS">Last 30 Days</option>
//               <option value="OVER_30_DAYS">Over 30 Days Ago</option>
//               <option value="NEVER">Never Logged In</option>
//             </select>
//           </label>
//         </div>

//         {/* Clear filters button */}
//         <div className="filter-group">
//           <button
//             className="clear-filters-btn"
//             onClick={() => {
//               setSearchTerm("");
//               setFilters({
//                 status: "",
//                 hasChildren: "",
//                 lastLogin: "",
//               });
//             }}
//             disabled={
//               !searchTerm &&
//               !filters.status &&
//               !filters.hasChildren &&
//               !filters.lastLogin
//             }
//           >
//             Clear Filters
//           </button>
//         </div>
//       </div>

//       {/* Data display */}
//       {!parents || parents.length === 0 ? (
//         <div className="empty-state">
//           <div className="empty-content">
//             <h3>No Parents Found</h3>
//             <p>
//               {searchTerm || Object.values(filters).some((f) => f)
//                 ? "No parents match your current filters."
//                 : "No parents have been added to this school yet."}
//             </p>
//             {(searchTerm || Object.values(filters).some((f) => f)) && (
//               <button
//                 onClick={() => {
//                   setSearchTerm("");
//                   setFilters({
//                     status: "",
//                     hasChildren: "",
//                     lastLogin: "",
//                   });
//                 }}
//                 className="clear-filters-btn"
//               >
//                 Clear All Filters
//               </button>
//             )}
//           </div>
//         </div>
//       ) : (
//         <ParentTable
//           parents={parents}
//           isLoading={isLoading || isRefetching}
//           variant="detailed"
//         />
//       )}

//       {/* Development debug information */}
//       {import.meta.env.MODE === "development" && (
//         <div className="debug-info">
//           <details>
//             <summary>Debug Information</summary>
//             <div className="debug-content">
//               <strong>Authentication:</strong>
//               <br />
//               User ID: {user?.id || "Not loaded"}
//               <br />
//               User Type: {user?.user_type || "Unknown"}
//               <br />
//               School ID: {schoolId || "Not available"}
//               <br />
//               <br />
//               <strong>API Response:</strong>
//               <br />
//               Response Type: {typeof parentsResponse}
//               <br />
//               Has Results: {!!parentsResponse?.results}
//               <br />
//               Results Count: {parents?.length || 0}
//               <br />
//               Total Count: {totalCount}
//               <br />
//               Is Fallback: {isFallback ? "Yes" : "No"}
//               <br />
//               <br />
//               <strong>Query Parameters:</strong>
//               <br />
//               {JSON.stringify(queryParams, null, 2)}
//               <br />
//               <br />
//               <strong>Sample Parent Data:</strong>
//               <br />
//               {parents?.[0] && <pre>{JSON.stringify(parents[0], null, 2)}</pre>}
//             </div>
//           </details>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AllParents;
