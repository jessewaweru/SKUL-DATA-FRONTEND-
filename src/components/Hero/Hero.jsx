import "../Hero/hero.css";
import arrowRight from "../../assets/arrow-right.png";

const Hero = ({ heroSections, heroCount, setHeroCount, transitionStage }) => {
  return (
    <div className="hero">
      <div className={`hero-text ${transitionStage}`}>
        <p>{heroSections.title}</p>
        <p>{heroSections.description}</p>
      </div>
      <div className={`hero-explore ${transitionStage}`}>
        <p>Explore our features</p>
        <img src={arrowRight} alt="arrow button" />
      </div>
      <div className="hero-dot-play">
        <ul className="hero-dots">
          {[0, 1, 2].map((index) => (
            <li
              key={index}
              onClick={() => setHeroCount(index)}
              className={heroCount === index ? "hero-dot purple" : "hero-dot"}
            ></li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Hero;
