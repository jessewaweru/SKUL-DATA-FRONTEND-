import Footer from "../../components/Footer/Footer";
import Navbar from "../../components/Navbar/NavBar";
import "../Pricing/pricing.css";
import {
  FaCheck,
  FaSchool,
  FaChalkboardTeacher,
  FaUserShield,
  FaFileUpload,
  FaChartLine,
  FaServer,
  FaMobileAlt,
} from "react-icons/fa";

const Pricing = () => {
  return (
    <>
      <Navbar />
      <div className="pricing-page">
        {/* Hero Section */}
        <section className="pricing-hero">
          <div className="pricing-hero-container">
            <h1>Simple, Transparent pricing catered to all schools</h1>
            <p className="subheading">
              Start with a free trial, then choose a plan as you grow. All plans
              include our core school management features.
            </p>
          </div>
        </section>

        {/* Pricing Toggle */}
        <div className="pricing-toggle">
          <span>Bill Monthly</span>
          <label className="switch">
            <input type="checkbox" />
            <span className="slider round"></span>
          </label>
          <span>
            Bill Annually <span className="discount-badge">(Save 20%)</span>
          </span>
        </div>

        {/* Pricing Plans */}
        <div className="pricing-plans">
          {/* Basic Plan */}
          <div className="pricing-card">
            <div className="plan-header">
              <h3>Basic</h3>
              <div className="price">
                <span className="amount">Ksh2500</span>
                <span className="period">/month</span>
              </div>
              <p className="plan-description">
                For small schools getting started with digital data management
              </p>
              <button className="plan-button">Start with Basic</button>
            </div>
            <div className="plan-features">
              <h4>Key Features</h4>
              <ul>
                <li>
                  <FaCheck className="feature-check" /> Up to 300 students
                </li>
                <li>
                  <FaCheck className="feature-check" /> 10 teacher accounts
                </li>
                <li>
                  <FaCheck className="feature-check" /> Core academic records
                </li>
                <li>
                  <FaCheck className="feature-check" /> Basic reporting
                </li>
                <li>
                  <FaCheck className="feature-check" /> Email support
                </li>
              </ul>
            </div>
          </div>

          {/* Standard Plan (Recommended) */}
          <div className="pricing-card featured">
            <div className="popular-badge">Most Popular</div>
            <div className="plan-header">
              <h3>Standard</h3>
              <div className="price">
                <span className="amount">Ksh8500</span>
                <span className="period">/month</span>
              </div>
              <p className="plan-description">
                For growing schools needing more advanced features
              </p>
              <button className="plan-button featured-button">
                Start with Standard
              </button>
            </div>
            <div className="plan-features">
              <h4>Everything in Basic, plus:</h4>
              <ul>
                <li>
                  <FaCheck className="feature-check" /> Up to 1,000 students
                </li>
                <li>
                  <FaCheck className="feature-check" /> 30 teacher accounts
                </li>
                <li>
                  <FaCheck className="feature-check" /> Advanced reporting &
                  analytics
                </li>
                <li>
                  <FaCheck className="feature-check" /> Document management
                  system
                </li>
                <li>
                  <FaCheck className="feature-check" /> Priority email & chat
                  support
                </li>
                <li>
                  <FaCheck className="feature-check" /> Parent engagement portal
                </li>
              </ul>
            </div>
          </div>

          {/* Advanced Plan */}
          <div className="pricing-card">
            <div className="plan-header">
              <h3>Advanced</h3>
              <div className="price">
                <span className="amount">Ksh15000</span>
                <span className="period">/month</span>
              </div>
              <p className="plan-description">
                For large institutions with complex needs
              </p>
              <button className="plan-button">Start with Advanced</button>
            </div>
            <div className="plan-features">
              <h4>Everything in Standard, plus:</h4>
              <ul>
                <li>
                  <FaCheck className="feature-check" /> Unlimited students
                </li>
                <li>
                  <FaCheck className="feature-check" /> Unlimited teacher
                  accounts
                </li>
                <li>
                  <FaCheck className="feature-check" /> Custom reporting & API
                  access
                </li>
                <li>
                  <FaCheck className="feature-check" /> Advanced document
                  scanning
                </li>
                <li>
                  <FaCheck className="feature-check" /> 24/7 phone support
                </li>
                <li>
                  <FaCheck className="feature-check" /> Dedicated account
                  manager
                </li>
                <li>
                  <FaCheck className="feature-check" /> On-premise deployment
                  option
                </li>
              </ul>
            </div>
          </div>
        </div>
        {/* Feature Comparison */}
        <section className="feature-comparison">
          <div className="section-container">
            <h2 className="comparison-title">Compare all Skul-Data features</h2>
            <div className="comparison-table">
              <div className="comparison-row header">
                <div className="comparison-feature">Features</div>
                <div className="comparison-plan">Basic</div>
                <div className="comparison-plan">Standard</div>
                <div className="comparison-plan">Advanced</div>
              </div>

              <div className="comparison-row">
                <div className="comparison-feature">
                  <FaSchool className="feature-icon" />
                  Student capacity
                </div>
                <div className="comparison-plan">Up to 300</div>
                <div className="comparison-plan">Up to 1,000</div>
                <div className="comparison-plan">Unlimited</div>
              </div>

              <div className="comparison-row">
                <div className="comparison-feature">
                  <FaChalkboardTeacher className="feature-icon" />
                  Teacher accounts
                </div>
                <div className="comparison-plan">10</div>
                <div className="comparison-plan">30</div>
                <div className="comparison-plan">Unlimited</div>
              </div>

              <div className="comparison-row">
                <div className="comparison-feature">
                  <FaUserShield className="feature-icon" />
                  Admin accounts
                </div>
                <div className="comparison-plan">1</div>
                <div className="comparison-plan">3</div>
                <div className="comparison-plan">10</div>
              </div>

              <div className="comparison-row">
                <div className="comparison-feature">
                  <FaFileUpload className="feature-icon" />
                  Document management
                </div>
                <div className="comparison-plan">
                  <FaCheck />
                </div>
                <div className="comparison-plan">
                  <FaCheck />
                </div>
                <div className="comparison-plan">
                  <FaCheck />
                </div>
              </div>

              <div className="comparison-row">
                <div className="comparison-feature">
                  <FaChartLine className="feature-icon" />
                  Advanced analytics
                </div>
                <div className="comparison-plan">-</div>
                <div className="comparison-plan">
                  <FaCheck />
                </div>
                <div className="comparison-plan">
                  <FaCheck />
                </div>
              </div>

              <div className="comparison-row">
                <div className="comparison-feature">
                  <FaServer className="feature-icon" />
                  On-premise option
                </div>
                <div className="comparison-plan">-</div>
                <div className="comparison-plan">-</div>
                <div className="comparison-plan">
                  <FaCheck />
                </div>
              </div>

              <div className="comparison-row">
                <div className="comparison-feature">
                  <FaMobileAlt className="feature-icon" />
                  Mobile parent portal
                </div>
                <div className="comparison-plan">-</div>
                <div className="comparison-plan">
                  <FaCheck />
                </div>
                <div className="comparison-plan">
                  <FaCheck />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="pricing-cta">
          <div className="cta-container">
            <h2>Still have questions?</h2>
            <p>
              Our team is ready to help you choose the right plan for your
              school's needs.
            </p>
            <div className="cta-buttons">
              <button className="primary-btn">Chat with Support</button>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default Pricing;
