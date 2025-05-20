import React, { useEffect, useState } from "react";
import Eltion from "../../static/images/u1.jpg";
import Yuri from "../../static/images/u2.jpg";
import Claudia from "../../static/images/u3.jpg";
import Jason from "../Images/TeamImgs/Jason.jpeg";
import "./index.css";
import Globe from "../Globe/Globe";
import NavBar from "../NavBar";
import '@fortawesome/fontawesome-free/css/all.min.css';


const teamMembers = [
  {
    name: "Aarya",
    role: "Team Lead",
    github: "https://github.com/EltionBehrami",
    linkedin: "https://www.linkedin.com/in/eltion-behrami-5b9367271/",
  },
  {
    name: "Aaditi",
    role: "Backend Lead",
    github: "https://github.com/yuris1234",
    linkedin: "https://www.linkedin.com/in/yuri-sugihara/",
  },
  {
    name: "Aaryyan",
    role: "Frontend Lead",
    github: "https://github.com/claudiaaziz",
    linkedin: "https://www.linkedin.com/in/claudiaaziz/",
  },
  // {
  //   name: "",
  //   role: "Flex Lead",
  //   github: "https://github.com/Helionster",
  //   linkedin: "https://www.linkedin.com/in/jason-zhang-344777184/",
  // },
];

const AboutUs = () => {
  const changingLanguages = ["en", "ch", "sp", "fr", "ar"];
  const [currentLanguageIndex, setCurrentLanguageIndex] = useState(0);
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentLanguageIndex(
        (prevIndex) => (prevIndex + 1) % changingLanguages.length
      );
    }, 4000);

    return () => clearInterval(intervalId);
  }, []);

  function displayMeetTheTeam() {
    const currentLanguage = changingLanguages[currentLanguageIndex];
    switch (currentLanguage) {
      case "en":
        return "Meet The Team";
      case "ch":
        return "团队见面";
      case "sp":
        return "Conoce al Equipo";
      case "fr":
        return "Rencontrez l'Équipe";
      case "ar":
        return "تعرف على الفريق";
      default:
        return "Meet The Team";
    }
  }

  return (
    <>
      {/* <NavBar /> */}
      <div className="about-us-container">
        <div className="display-meet-the-team">{displayMeetTheTeam()}</div>

        <div className="team-members-container">
          {teamMembers.map((member, index) => (
            <div key={index} className="team-member">
              <img className="team-member-img"
                src={
                  member.name === "Aarya"
                    ?  Eltion
                    : member.name === "Aaditi"
                    ?  Yuri
                    : member.name === "Aaryyan"
                    ? Claudia
                    : Jason
                }
                alt={`${member.name} - ${member.role}`}
              />
              <div className="member-details">
                <p>{`${member.name}`}</p>
                <p>{`${member.role}`}</p>
                <div className="social-links">
                  <a href={member.github} target="_blank" rel="noopener noreferrer">
                    <i className="fab fa-github"></i>
                  </a>
                  <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
                    <i className="fab fa-linkedin"></i>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default AboutUs;