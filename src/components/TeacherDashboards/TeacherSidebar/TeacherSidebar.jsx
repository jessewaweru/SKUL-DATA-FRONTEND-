import TeacherAccountToggle from "./TeacherAccountToggle";
import TeacherSearch from "./TeacherSearch";
import TeacherCategorySelect from "./TeacherCategorySelect";
import "../TeacherSidebar/teachersidebar.css";

const TeacherSidebar = () => {
  return (
    <div className="teacher-sidebar-scroll">
      <TeacherAccountToggle />
      <TeacherSearch />
      <TeacherCategorySelect />
    </div>
  );
};

export default TeacherSidebar;
