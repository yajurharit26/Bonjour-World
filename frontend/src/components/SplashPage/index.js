import React, { useState, useEffect } from "react";
import "./index.css";
import NavBar from "../NavBar/index.js";
// import Globe from "../Globe/Globe.js";
import image1 from "../../static/images/img1.png";
import image2 from "../../static/images/img2.png";
import image3 from "../../static/images/img3.png";
import { Icon } from "@iconify/react";

const SplashPage = () => {
  const changingLanguages = ["en", "ch", "sp", "fr", "ar"];
  const [currentLanguageIndex, setCurrentLanguageIndex] = useState(0);

  

  const handleScroll = () => {
    const userGuideSection = document.querySelector(".user-guide-section");

    if (userGuideSection) {
      userGuideSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentLanguageIndex(
        (prevIndex) => (prevIndex + 1) % changingLanguages.length
      );
    }, 4000);

    return () => clearInterval(intervalId);
  }, []);

  function displayCurrentLanguage() {
    const currentLanguage = changingLanguages[currentLanguageIndex];
    switch (currentLanguage) {
      case "en":
        return "Hello World";
      case "ch":
        return "你好";
      case "sp":
        return "Hola Mundo";
      case "fr":
        return "Bonjour le monde";
      case "ar":
        return "مرحباً بالعالم";
      default:
        return "Hello World";
    }
  }

  // function getRandomReview() {
  //   const randomIndex = Math.floor(Math.random() * reviews.length);
  //   return reviews[randomIndex];
  // }

  return (
    <>
      {/* <NavBar /> */}
      <div className="splash-page">
        <div className="content-container">
          <div className="currentlanguage">{displayCurrentLanguage()}</div>
          <div className="image-div">
            <img
              src={image2}
              className="image image1"
              alt=""
              style={{ animationDelay: "1s" }}
            />
            <img
              src={image1}
              className="image "
              alt=""
              style={{ animationDelay: "0.5s" }}
            />
            <img
              src={image3}
              className="image"
              alt=""
              style={{ animationDelay: "1.5s" }}
            />
          </div>
          <button className="down-arrow" onClick={handleScroll}>
            <Icon icon="bx:down-arrow-alt" className="down-arrow-icon" />
          </button>
          {/* <div className="review">🌍 "{getRandomReview().text}"</div> */}
        </div>
        <footer className="footer">Copyright &copy; 2023 Bonjour World</footer>
      </div>
    </>
  );
};

export default SplashPage;
