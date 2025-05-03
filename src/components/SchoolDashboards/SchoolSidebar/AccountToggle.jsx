import { FiChevronDown, FiChevronUp } from "react-icons/fi";

const AccountToggle = () => {
  return (
    <div className="account-section">
      <button className="account-button">
        <img
          src="https://api.dicebear.com/9.x/notionists/svg"
          alt="avatar"
          className="avatar"
        />
        <div className="user-info">
          <span className="username">Peponi School</span>
          <span className="email">peponi@gmail.com</span>
        </div>

        <FiChevronDown className="chevron-down" />
        <FiChevronUp className="chevron-up" />
      </button>
    </div>
  );
};

export default AccountToggle;
