import "../TeacherSidebar/teachersidebar.css";

const TeacherAccountToggle = () => {
  return (
    <div className="teacher-account-section">
      <button className="teacher-account-button">
        <img
          src="https://api.dicebear.com/9.x/personas/svg"
          alt="teacher avatar"
          className="teacher-avatar"
        />
        <div className="teacher-user-info">
          <span className="teacher-username">John Doe</span>
          <span className="teacher-email">johndoe@peponischool.com</span>
        </div>
      </button>
    </div>
  );
};

export default TeacherAccountToggle;
