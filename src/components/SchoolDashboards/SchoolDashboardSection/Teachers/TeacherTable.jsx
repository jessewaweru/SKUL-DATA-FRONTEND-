import { FiEdit2, FiEye, FiMoreVertical } from "react-icons/fi";
import { Link } from "react-router-dom";
import StatusBadge from "../../../common/StatusBadge";

const TeacherTable = ({ teachers, loading }) => {
  const columns = [
    { header: "Name", accessor: "full_name" },
    { header: "Email", accessor: "email" },
    { header: "Phone", accessor: "phone_number" },
    { header: "Status", accessor: "status" },
    { header: "Subjects", accessor: "subjects_taught" },
    { header: "Classes", accessor: "assigned_classes_ids" },
    { header: "Join Date", accessor: "hire_date" },
    { header: "Last Login", accessor: "last_login" },
    { header: "Actions", accessor: "actions" },
  ];

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const formatSubjects = (subjects) => {
    if (!subjects || subjects.length === 0) return "-";
    return (
      subjects
        .slice(0, 2)
        .map((s) => s.name)
        .join(", ") + (subjects.length > 2 ? ` +${subjects.length - 2}` : "")
    );
  };

  const formatClasses = (classIds) => {
    if (!classIds || classIds.length === 0) return "-";
    return `${classIds.length} classes`;
  };

  if (loading) {
    return <div className="loading-spinner">Loading teachers...</div>;
  }

  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr className="table-head-row">
            {columns.map((column) => (
              <th key={column.accessor} className="table-head-cell">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {teachers.map((teacher) => (
            <tr key={teacher.id} className="table-row">
              <td className="table-cell">
                <Link
                  to={`/dashboard/teachers/profiles/${teacher.id}`}
                  className="link"
                >
                  {teacher.first_name} {teacher.last_name}
                </Link>
              </td>
              <td className="table-cell">{teacher.email}</td>
              <td className="table-cell">{teacher.phone_number || "-"}</td>
              <td className="table-cell">
                <StatusBadge status={teacher.status} />
              </td>
              <td className="table-cell">
                {formatSubjects(teacher.subjects_taught)}
              </td>
              <td className="table-cell">
                {formatClasses(teacher.assigned_classes_ids)}
              </td>
              <td className="table-cell">{formatDate(teacher.hire_date)}</td>
              <td className="table-cell">
                {formatDateTime(teacher.last_login)}
              </td>
              <td className="table-cell">
                <div className="action-buttons">
                  <Link
                    to={`/dashboard/teachers/profiles/${teacher.id}`}
                    className="icon-button"
                    title="View"
                  >
                    <FiEye />
                  </Link>
                  <Link
                    to={`/dashboard/teachers/profiles/${teacher.id}/edit`}
                    className="icon-button"
                    title="Edit"
                  >
                    <FiEdit2 />
                  </Link>
                  <button className="icon-button" title="More">
                    <FiMoreVertical />
                  </button>
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
