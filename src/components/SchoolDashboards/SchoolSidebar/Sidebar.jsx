import AccountToggle from "./AccountToggle";
import CategorySelect from "./CategorySelect";
import Search from "./Search";
import SubscriptionPlan from "./SubscriptionPlan";
import "../SchoolSidebar/sidebar.css";

const Sidebar = () => {
  return (
    <>
      <div className="sidebar-scroll">
        <AccountToggle />
        <Search />
        <CategorySelect />
      </div>
      <SubscriptionPlan />
    </>
  );
};

export default Sidebar;
