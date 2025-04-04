import "../styles/index.css";
import image1 from "../assets/image1.jpg";
import image2 from "../assets/image2.jpg";
import image3 from "../assets/image3.jpg";

const Homepage = ({ heroCount, transitionStage }) => {
  const images = [image1, image2, image3];

  return (
    <img
      //   key={key}
      src={images[heroCount]}
      className={`background ${transitionStage}`}
      alt={`Slide ${heroCount + 1}`}
    />
  );
};

export default Homepage;
