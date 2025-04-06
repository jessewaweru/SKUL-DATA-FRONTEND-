import "../HomePageContent/content.css";

const CTASection = ({ title, description, buttonText, backgroundImage }) => {
  return (
    <section
      className="cta-section"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="cta-overlay"></div>
      <div className="cta-content">
        <h2>{title}</h2>
        <p>{description}</p>
        <button className="cta-button">{buttonText}</button>
      </div>
    </section>
  );
};

export default CTASection;
