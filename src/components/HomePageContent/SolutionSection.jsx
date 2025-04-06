import "../HomePageContent/content.css";

const SolutionSection = ({ title, description, features, image }) => {
  return (
    <section className="solutions-section">
      <div className="solutions-content">
        <h2>{title}</h2>
        <p>{description}</p>
        <ul>
          {features.map((feature, index) => {
            <li key={index}>{feature}</li>;
          })}
        </ul>
      </div>
      <div className="solutions-image">
        <img src={image} alt={title} />
      </div>
    </section>
  );
};

export default SolutionSection;
