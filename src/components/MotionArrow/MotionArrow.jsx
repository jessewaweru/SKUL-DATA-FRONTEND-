// import { useEffect } from "react";
import "../MotionArrow/motionarrow.css";

const MotionArrow = ({ targetFeaturesRef }) => {
  const scrollToFeatures = () => {
    if (targetFeaturesRef && targetFeaturesRef.current) {
      return targetFeaturesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <div className="down-arrow-container">
      <div
        className="down-arrow"
        onClick={scrollToFeatures}
        aria-label="scroll to features"
      >
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7 10L12 15L17 10"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className="section-indicator">
        <span>How do we do it?</span>
        {/* <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7 10L12 15L17 10"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg> */}
      </div>
    </div>
  );
};

export default MotionArrow;
