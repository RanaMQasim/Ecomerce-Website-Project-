import React, { useEffect, useState } from "react";
import "./Hero.css";
import hand_icon from "../Assets/hand_icon.png";
import arrow_icon from "../Assets/arrow_icon.png";
import hero_image from "../Assets/hero_image.png";

const Hero = () => {
  const [heroData, setHeroData] = useState({
    title: "NEW ARRIVALS ONLY",
    subtitle: ["New", "Collections", "For Everyone"],
    buttonText: "Latest Collection",
    image: hero_image,
  });
  return (
    <section className="hero">
      <div className="hero-left">
        <h2>{heroData.title}</h2>

        <div className="hero-hand-icon">
          <img src={hand_icon} alt="hand waving icon" />
          {heroData.subtitle.map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>

        <button className="hero-latest-btn">
          <span>{heroData.buttonText}</span>
          <img src={arrow_icon} alt="arrow icon" />
        </button>
      </div>

      <div className="hero-right">
        <img src={heroData.image} alt="hero banner" />
      </div>
    </section>
  );
};

export default Hero;
