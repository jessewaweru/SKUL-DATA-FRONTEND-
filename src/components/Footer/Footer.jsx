import "../Footer/footer.css";
import logo from "../../assets/Skul-Datalogo.svg";

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-content">
        <div className="footer-section">
          <div className="footer-logo-img">
            <img src={logo} alt="Skul-Data Logo" />
            {/* <p>Revolutionizing school's data architecture since 2025</p> */}
          </div>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li>
              <a href="#">Home</a>
            </li>
            <li>
              <a href="#">Features</a>
            </li>
            <li>
              <a href="#">Pricing</a>
            </li>
            <li>
              <a href="#">Contact</a>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Solutions</h4>
          <ul>
            <li>
              <a href="#">For Schools</a>
            </li>
            <li>
              <a href="#">For Teachers</a>
            </li>
            <li>
              <a href="#">For Parents</a>
            </li>
            <li>
              <a href="#">For Administrators</a>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>About</h4>
          <ul>
            <li>
              <a href="#">FAQ</a>
            </li>
            <li>
              <a href="#">Privacy Policy</a>
            </li>
            <li>
              <a href="#">Terms of Service</a>
            </li>
            <li>
              <a href="#">GDPR Compliance</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Skul-Data. All rights reserved.</p>
        <div className="social-icons">
          <a href="#">
            <i className="fab fa-square-x-twitter"></i>
          </a>
          <a href="#">
            <i className="fab fa-facebook"></i>
          </a>
          <a href="#">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="#">
            <i className="fab fa-linkedin"></i>
          </a>
          <a href="#">
            <i className="fab fa-tiktok"></i>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
