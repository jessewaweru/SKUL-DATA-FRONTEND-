// components/common/TabNavigation.jsx
import { Link } from "react-router-dom";

const TabNavigation = ({ tabs, activeTab, onTabChange, basePath = "" }) => {
  return (
    <div className="tab-navigation">
      {tabs.map((tab) => (
        <Link
          key={tab.id}
          to={`${basePath}/${tab.id}`}
          className={`tab ${activeTab === tab.id ? "active" : ""}`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
};

export default TabNavigation;
