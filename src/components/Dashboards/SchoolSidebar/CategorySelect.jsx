import {
  FiHome,
  FiUsers,
  FiPaperclip,
  FiLink,
  FiDollarSign,
} from "react-icons/fi";

const CategorySelect = () => {
  return (
    <div className="nav-list">
      <Route Icon={FiHome} selected={true} title="Dashboard" />
      <Route Icon={FiUsers} selected={false} title="Team" />
      <Route Icon={FiPaperclip} selected={false} title="Invoices" />
      <Route Icon={FiLink} selected={false} title="Integrations" />
      <Route Icon={FiDollarSign} selected={false} title="Finance" />
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
