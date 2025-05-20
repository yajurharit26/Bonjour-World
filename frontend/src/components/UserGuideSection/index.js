import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import "./index.css";
import { Icon } from "@iconify/react";

const Instruction = ({ children, index, colorClass }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
  });

  return (
    <div
      className={`instruction ${inView ? "slide-in" : ""} ${
        index % 2 === 0 ? "slide-left" : "slide-right"
      }`}
      ref={ref}
    >
      <div className={colorClass}>
        {children}
      </div>
    </div>
  );
};

const UserGuideSection = () => {
  useEffect(() => {
    const backToTop = document.querySelector(".back-to-top");
    const splashPage = document.querySelector(".splash-page");

    backToTop.addEventListener("click", function () {
      // scroll to splash page 
      splashPage.scrollIntoView({ behavior: "smooth" });
    });

    // clean up event listener on component unmount
    return () => {
      backToTop.removeEventListener("click", function () {
        splashPage.scrollIntoView({ behavior: "smooth" });
      });
    };
  }, []);

  return (
    <>
      <button className="back-to-top">
        <Icon icon="bx:up-arrow-alt" className="back-to-top-icon" />
      </button>
      <div className="user-guide-section">
        <p>
          Welcome to Bonjour World, your gateway to language exchange and
          cultural understanding. Follow these steps to get started:
        </p>

        <Instruction index={0} colorClass="auth">
          <div className="instruction-div">
            <h3 style={{ marginBottom: "15px" }}> 1. Sign Up or Log In</h3>
            <p>
              Create a secure account or log in to start your language learning
              journey.
            </p>
            <div className="instruction-sign-up-div"></div>
          </div>
        </Instruction>

        <Instruction index={1} colorClass="event">
          <div className="instruction-div">
            <h3 style={{ marginBottom: "15px" }}>2. Explore Language Exchange Events</h3>
            <p>
              Use the interactive maps powered by Google Maps to discover
              language exchange events near you.
            </p>
            <div className="instruction-event-div"></div>
          </div>
        </Instruction>

        <Instruction index={2} colorClass="host-or-join">
          <div className="instruction-div">
            <h3 style={{ marginBottom: "15px" }}>3. Host or Join Events</h3>
            <p>
              Host your own language exchange events or join existing ones.
              Manage events with ease using our intuitive event management
              system.
            </p>
            <div className="instruction-host-div"></div>
          </div>
        </Instruction>

        <Instruction index={3} colorClass="customize-profile">
          <div className="instruction-div">
            <h3 style={{ marginBottom: "15px" }}>4. Customize Your Profile</h3>
            <p>
              Personalize your user profile with information, preferences, and
              track your language learning progress and event history.
            </p>
            <div className="instruction-profile-div"></div>
          </div>
        </Instruction>
        <p>Get ready to embark on a linguistic adventure with Bonjour World!</p>
      </div>
    </>
  );
};

export default UserGuideSection;