// import { FiEdit2, FiEye, FiMoreVertical } from "react-icons/fi";
// import { Link } from "react-router-dom";
// import StatusBadge from "../../../common/StatusBadge";

// const TeacherTable = ({ teachers, loading }) => {
//   const columns = [
//     { header: "Name", accessor: "full_name" },
//     { header: "Email", accessor: "email" },
//     { header: "Phone", accessor: "phone_number" },
//     { header: "Status", accessor: "status" },
//     { header: "Subjects", accessor: "subjects_taught" },
//     { header: "Classes", accessor: "assigned_classes_ids" },
//     { header: "Join Date", accessor: "hire_date" },
//     { header: "Last Login", accessor: "last_login" },
//     { header: "Actions", accessor: "actions" },
//   ];

//   const formatDate = (dateString) => {
//     if (!dateString) return "-";
//     const date = new Date(dateString);
//     return date.toLocaleDateString();
//   };

//   const formatDateTime = (dateString) => {
//     if (!dateString) return "-";
//     const date = new Date(dateString);
//     return date.toLocaleString();
//   };

//   const formatSubjects = (subjects) => {
//     if (!subjects || subjects.length === 0) return "-";
//     return subjects.map((s) => s.name).join(", ");
//   };

//   const formatClasses = (classes) => {
//     if (!classes || classes.length === 0) return "-";
//     return classes.map((c) => c.name).join(", ");
//   };

//   if (loading) {
//     return <div className="loading-spinner">Loading teachers...</div>;
//   }

//   return (
//     <div className="table-container">
//       <table className="data-table">
//         <thead>
//           <tr className="table-head-row">
//             {columns.map((column) => (
//               <th key={column.accessor} className="table-head-cell">
//                 {column.header}
//               </th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {teachers.map((teacher) => (
//             <tr key={teacher.id} className="table-row">
//               <td className="table-cell">
//                 <Link
//                   to={`/dashboard/teachers/profiles/${teacher.id}`}
//                   className="link"
//                 >
//                   {teacher.first_name} {teacher.last_name}
//                 </Link>
//               </td>
//               <td className="table-cell">{teacher.email}</td>
//               <td className="table-cell">{teacher.phone_number || "-"}</td>
//               <td className="table-cell">
//                 <StatusBadge status={teacher.status} />
//               </td>
//               <td className="table-cell">
//                 {formatSubjects(teacher.subjects_taught)}
//               </td>
//               <td className="table-cell">
//                 {formatClasses(teacher.assigned_classes_ids)}
//               </td>
//               <td className="table-cell">{formatDate(teacher.hire_date)}</td>
//               <td className="table-cell">
//                 {formatDateTime(teacher.last_login)}
//               </td>
//               <td className="table-cell">
//                 <div className="action-buttons">
//                   <Link
//                     to={`/dashboard/teachers/profiles/${teacher.id}`}
//                     className="icon-button"
//                     title="View"
//                   >
//                     <FiEye />
//                   </Link>
//                   <Link
//                     to={`/dashboard/teachers/profiles/${teacher.id}/edit`}
//                     className="icon-button"
//                     title="Edit"
//                   >
//                     <FiEdit2 />
//                   </Link>
//                   <button className="icon-button" title="More">
//                     <FiMoreVertical />
//                   </button>
//                 </div>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default TeacherTable;

import { Link } from "react-router-dom";
import StatusBadge from "../../../common/StatusBadge";
import "../Teachers/teachers.css";

const TeacherTable = ({ teachers = [], loading }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch {
      return "-";
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch {
      return "-";
    }
  };

  const formatSubjects = (subjects) => {
    if (!subjects || subjects.length === 0) return "-";
    return subjects.join(", ");
  };

  const formatClasses = (classes) => {
    if (!classes || classes.length === 0) return "-";
    return classes.map((c) => c.name).join(", ");
  };

  if (loading) {
    return <div className="loading-spinner">Loading teachers...</div>;
  }

  if (teachers.length === 0) {
    return <div className="no-teachers">No teachers found for this school</div>;
  }

  return (
    <div className="teacher-table-container">
      <table className="teachers-table">
        <thead>
          <tr>
            <th className="name-column">Name</th>
            <th className="email-column">Email</th>
            <th className="phone-column">Phone</th>
            <th className="status-column">Status</th>
            <th className="subjects-column">Subjects</th>
            <th className="classes-column">Classes</th>
            <th className="join-date-column">Join Date</th>
            <th className="login-column">Last Login</th>
            <th className="actions-column">Actions</th>
          </tr>
        </thead>
        <tbody>
          {teachers.map((teacher) => (
            <tr key={teacher.id}>
              <td className="name-cell">
                <Link
                  to={`/dashboard/teachers/profiles/${teacher.id}`}
                  className="teacher-name-link"
                >
                  {teacher.full_name || "-"}
                </Link>
              </td>
              <td className="email-cell">{teacher.email || "-"}</td>
              <td className="phone-cell">{teacher.phone_number || "-"}</td>
              <td className="status-cell">
                <StatusBadge status={teacher.status || "UNKNOWN"} />
              </td>
              <td className="subjects-cell">
                {formatSubjects(teacher.subjects_taught)}
              </td>
              <td className="classes-cell">
                {formatClasses(teacher.assigned_classes)}
              </td>
              <td className="join-date-cell">
                {formatDate(teacher.hire_date)}
              </td>
              <td className="login-cell">
                {formatDateTime(teacher.last_login)}
              </td>
              <td className="teacher-table-actions-cell">
                <div className="action-buttons-wrapper">
                  <div className="teacher-table-action-buttons">
                    <Link
                      to={`/dashboard/teachers/profiles/${teacher.id}`}
                      className="view-button"
                    >
                      View
                    </Link>
                    <Link
                      to={`/dashboard/teachers/profiles/${teacher.id}/edit`}
                      className="edit-button"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TeacherTable;
