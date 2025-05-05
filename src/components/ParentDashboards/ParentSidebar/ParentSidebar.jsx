import "../ParentSidebar/parentsidebar.css";
import ParentAccountToggle from "./ParentAccountToggle";
import ParentSearch from "./ParentSearch";
import ParentCategorySelect from "./ParentCategorySelect";

const ParentSidebar = () => {
  return (
    <div className="parent-sidebar-scroll">
      <ParentAccountToggle />
      <ParentSearch />
      <ParentCategorySelect />
    </div>
  );
};

export default ParentSidebar;
