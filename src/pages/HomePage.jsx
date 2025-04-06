import "../styles/index.css";
import image1 from "../assets/image1.jpg";
import image2 from "../assets/image2.jpg";
import image3 from "../assets/image3.jpg";
import Hero from "../components/Hero/Hero";
import MotionArrow from "../components/MotionArrow/MotionArrow";

const Homepage = ({
  heroCount,
  transitionStage,
  heroSections,
  setHeroCount,
  featuresRef,
}) => {
  const images = [image1, image2, image3];

  return (
    <div className="homepage-wrapper">
      <div className="hero-container">
        <div className="hero-background">
          <img
            src={images[heroCount]}
            alt="Hero background"
            className={`hero-background ${transitionStage}`}
          />
        </div>

        <Hero
          heroSections={heroSections[heroCount]}
          heroCount={heroCount}
          setHeroCount={setHeroCount}
          transitionStage={transitionStage}
        />

        {/* Down arrow that only points to features section */}
        <MotionArrow targetFeaturesRef={featuresRef} />
      </div>
    </div>
  );
};

export default Homepage;
