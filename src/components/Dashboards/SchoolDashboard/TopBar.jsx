import { FiCalendar } from "react-icons/fi";
// import { useState } from "react";

const TopBar = () => {
  return (
    <div className="topbar">
      <div className="topbar-content">
        <div className="greeting-container">
          <span className="greeting-text">🚀 Good morning</span>
          <span className="date-text">Tuesday, Aug 8th 2023</span>
        </div>

        <button className="calendar-button">
          <FiCalendar />
          <span>Prev 6 Months</span>
        </button>
      </div>
    </div>
  );
};
export default TopBar;

// const TopBar = () => {
//   const [currentDate, setCurrentDate] = useState(new Date());

//   const formatDate = (date) => {
//     return date.toLocaleDateString("en-US", {
//       weekday: "long",
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//     });
//   };

//   return (
//     <div className="topbar">
//       <div className="topbar-content">
//         <div className="greeting-container">
//           <span className="greeting-text">🚀 Good morning</span>
//           <span className="date-text">{formatDate(currentDate)}</span>
//         </div>

//         <button className="calendar-button">
//           <FiCalendar />
//           <span>Prev 6 Months</span>
//         </button>
//       </div>
//     </div>
//   );
// };

// export default TopBar;
