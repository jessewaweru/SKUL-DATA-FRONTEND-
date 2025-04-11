import {
  FiHome,
  FiUsers,
  FiFileText,
  FiPieChart,
  FiBookOpen,
  FiUser,
  FiUserPlus,
  FiGrid,
  FiBarChart2,
  FiCalendar,
} from "react-icons/fi";

const CategorySelect = () => {
  return (
    <div className="nav-list">
      <Route Icon={FiHome} selected={true} title="Dashboard" />
      <Route Icon={FiUsers} selected={false} title="Users" />
      <Route Icon={FiFileText} selected={false} title="Documents" />
      <Route Icon={FiPieChart} selected={false} title="Reports" />
      <Route Icon={FiBookOpen} selected={false} title="Teachers" />
      <Route Icon={FiUser} selected={false} title="Parents" />
      <Route Icon={FiUserPlus} selected={false} title="Students" />
      <Route Icon={FiGrid} selected={false} title="Classes" />
      <Route Icon={FiBarChart2} selected={false} title="Analytics" />
      <Route Icon={FiCalendar} selected={false} title="Calender" />
    </div>
  );
};

export default CategorySelect;

const Route = ({ Icon, selected, title }) => {
  return (
    <button
      className={`nav-item ${
        selected ? "nav-item-selected" : "nav-item-default"
      }`}
    >
      {Icon && <Icon className={selected ? "icon-selected" : ""} />}
      <span>{title}</span>
    </button>
  );
};
