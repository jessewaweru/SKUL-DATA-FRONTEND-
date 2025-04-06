import "../HomePageContent/content.css";

const FeatureSection = ({ title, description, image, isReversed }) => {
  return (
    <section className={`feature-section ${isReversed ? "reversed" : ""}`}>
      <div className="feature-content">
        <h2>{title}</h2>
        <p>{description}</p>
        <button className="learn-more">Learn More</button>
      </div>
      <div className="feature-image">
        <img src={image} alt={title} />
      </div>
    </section>
  );
};

export default FeatureSection;
