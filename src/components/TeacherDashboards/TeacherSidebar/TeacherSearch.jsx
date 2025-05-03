import "../TeacherSidebar/teachersidebar.css";

const TeacherSearch = () => {
  return (
    <div className="teacher-search-container">
      <input
        type="text"
        placeholder="Search..."
        className="teacher-search-input"
      />
    </div>
  );
};

export default TeacherSearch;
