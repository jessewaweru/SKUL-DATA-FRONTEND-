import "../Navbar/navbar.css";

const Navbar = () => {
  return (
    <div className="nav">
      <div className="nav-logo">SKUL-DATA</div>
      <ul className="nav-menu">
        <li>Home</li>
        <li>Explore</li>
        <li>Solutions</li>
        <li>Pricing</li>
        <li className="nav-contact-button">Contact Us</li>
      </ul>
    </div>
  );
};

export default Navbar;
