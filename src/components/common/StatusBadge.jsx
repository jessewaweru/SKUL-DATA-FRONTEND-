// const StatusBadge = ({ status }) => {
//   const statusConfig = {
//     ACTIVE: {
//       color: "green",
//       text: "Active",
//     },
//     ON_LEAVE: {
//       color: "orange",
//       text: "On Leave",
//     },
//     SUSPENDED: {
//       color: "red",
//       text: "Suspended",
//     },
//     TERMINATED: {
//       color: "gray",
//       text: "Terminated",
//     },
//   };

//   const config = statusConfig[status] || { color: "gray", text: status };

//   return <span className={`status-badge ${config.color}`}>{config.text}</span>;
// };

// export default StatusBadge;

const StatusBadge = ({ status }) => {
  const statusConfig = {
    ACTIVE: {
      color: "green",
      text: "Active",
    },
    ON_LEAVE: {
      color: "orange",
      text: "On Leave",
    },
    SUSPENDED: {
      color: "red",
      text: "Suspended",
    },
    TERMINATED: {
      color: "gray",
      text: "Terminated",
    },
  };

  const config = statusConfig[status] || { color: "gray", text: status };

  return <span className={`status-badge ${config.color}`}>{config.text}</span>;
};

export default StatusBadge;
