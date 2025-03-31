import { useEffect, useState, useRef } from "react";
import Navbar from "./NavBar";
import Homepage from "../pages/HomePage";
import Hero from "./Hero";

const MainLayout = () => {
  const [heroCount, setHeroCount] = useState(0);
  const [transitionStage, setTransitionStage] = useState("fadeIn");
  const intervalRef = useRef();

  //   useEffect(() => {
  //     const interval = setInterval(() => {
  //       console.log("Interval triggered at", new Date().toLocaleTimeString());
  //       setHeroCount((prev) => (prev === 2 ? 0 : prev + 1));
  //     }, 5000);
  //     return () => {
  //       clearInterval(interval);
  //     };
  //   }, []);

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
      <Navbar />
      <Homepage heroCount={heroCount} transitionStage={transitionStage} />
      <Hero
        heroSections={heroSections[heroCount]}
        heroCount={heroCount}
        setHeroCount={handleDotClick}
        transitionStage={transitionStage}
      />
    </>
  );
};

export default MainLayout;
