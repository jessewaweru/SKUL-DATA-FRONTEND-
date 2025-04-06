import { useEffect, useState, useRef } from "react";
import Navbar from "./Navbar/NavBar";
import Homepage from "../pages/HomePage";
import Hero from "./Hero/Hero";
import Footer from "./Footer/Footer";
import { skulDataContent } from "./HomePageContent/SkulDataContent";
import FeatureSection from "./HomePageContent/FeatureSection";
import SolutionSection from "./HomePageContent/SolutionSection";
import CTASection from "./HomePageContent/CTASection";

const MainLayout = () => {
  const [heroCount, setHeroCount] = useState(0);
  const [transitionStage, setTransitionStage] = useState("fadeIn");
  const intervalRef = useRef();

  // Ref just for the features section
  const featuresRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTransitionStage("fadeOut");
      setTimeout(() => {
        setHeroCount((prev) => (prev === 2 ? 0 : prev + 1));
        setTransitionStage("fadeIn");
      }, 500);
    }, 5000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const heroSections = [
    {
      title: "Revolutionize School Data Management",
      description:
        "Streamline your educational institution's data with our cutting-edge platform.",
    },
    {
      title: "Empower Teachers Through Smart Data",
      description:
        "Transform data into actionable insights for educators and administrators.",
    },
    {
      title: "Secure, Scalable, Simple",
      description:
        "End-to-end data management solutions tailored for educational institutions.",
    },
  ];

  // Handle manual dot clicks
  const handleDotClick = (index) => {
    setTransitionStage("fadeOut");
    setTimeout(() => {
      setHeroCount(index);
      setTransitionStage("fadeIn");
    }, 500);
  };

  return (
    <>
      <div>
        <Navbar />
      </div>
      <Homepage
        heroCount={heroCount}
        transitionStage={transitionStage}
        heroSections={heroSections}
        setHeroCount={setHeroCount}
        featuresRef={featuresRef}
      />
      <Hero
        heroSections={heroSections[heroCount]}
        heroCount={heroCount}
        setHeroCount={handleDotClick}
        transitionStage={transitionStage}
      />
      <div ref={featuresRef} className="content-sections">
        {skulDataContent.features.map((feature, index) => {
          return (
            <FeatureSection
              key={index}
              title={feature.title}
              description={feature.description}
              image={feature.image}
              //   isReversed={feature.isReversed}
              isReversed={index % 2 !== 0}
            />
          );
        })}
        <SolutionSection
          title={skulDataContent.solutions.title}
          description={skulDataContent.solutions.description}
          features={skulDataContent.solutions.features}
          image={skulDataContent.solutions.image}
        />
        <CTASection
          title={skulDataContent.cta.title}
          description={skulDataContent.cta.description}
          buttonText={skulDataContent.cta.buttonText}
          backgroundImage={skulDataContent.cta.backgroundImage}
        />
      </div>
      <Footer />
    </>
  );
};

export default MainLayout;
