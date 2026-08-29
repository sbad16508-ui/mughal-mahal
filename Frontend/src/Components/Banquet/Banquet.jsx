import React, { useState } from "react";
import { motion } from "framer-motion";
import "./Banquet.css";
import BanquetQueryModal from "./BanquetQueryModal";
import LoginModal from "../LoginModal";
import ban2 from "../../assets/Mediacenter/room/ban2.PNG";
import ba1 from "../../assets/Mediacenter/room/ba1.PNG";
import ba2 from "../../assets/Mediacenter/room/ba2.PNG";
import ba3 from "../../assets/Mediacenter/room/ba3.PNG";
import ba4 from "../../assets/Mediacenter/room/ba4.PNG";
import ba5 from "../../assets/Mediacenter/room/ba5.PNG";
import ha1 from "../../assets/Mediacenter/room/ha1.PNG";

const sliderData = [
  { title: "Elegant Ballroom", image: ba2 },
  { title: "Premium Event Lounge", image: ba3 },
  { title: "Grand Banquet Space", image: ba4 },
  { title: "Luxury Wedding Hall", image: ba5 },
];

const Banquet = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showQueryModal, setShowQueryModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [profile, setProfile] = useState(null);

  const handlePrev = () => {
    setActiveIndex((current) => (current - 1 + sliderData.length) % sliderData.length);
  };

  const handleNext = () => {
    setActiveIndex((current) => (current + 1) % sliderData.length);
  };

  const openQuery = () => {
    const username = localStorage.getItem("bookingUser");
    const profileRaw = localStorage.getItem("bookingUserProfile");
    if (!username) {
      setShowLoginModal(true);
      return;
    }
    try {
      setProfile(profileRaw ? JSON.parse(profileRaw) : null);
    } catch {
      setProfile(null);
    }
    setShowQueryModal(true);
  };

  const handleLoginSuccess = () => {
    const profileRaw = localStorage.getItem("bookingUserProfile");
    try {
      setProfile(profileRaw ? JSON.parse(profileRaw) : null);
    } catch {
      setProfile(null);
    }
    setShowLoginModal(false);
    setShowQueryModal(true);
  };

  return (
    <div className="banquet-wrapper">
      
      <section className="banquet-hero" style={{ backgroundImage: `url(${ban2})` }}>
        <div className="hero-overlay"></div>
        <motion.div
          className="banquet-hero-content"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1>Banquet</h1>
          <p>Truly the Wondrous place for the Wedding Dreamers</p>
        </motion.div>
      </section>

      <section className="banquet-slider-section">
        <div className="slider-header">
          <h2>Sheesh Mahal Venues</h2>
          <p>Sheesh Mahal, Truly the Wondrous place for the Wedding Dreamers. From the right setting to the right menu, we can help with every detail of your event.</p>
          <p>Every corner of Sheesh Mahal is purely depicting the Great Mughal architectural era. From top to bottom you will be mesmerized with the beauty of our Sheesh Mahal. You will surely love every sight of our marvelous creation. Introducing fine dining concept for making your weddings more elegant. Gold plated crockery for giving a exceptional wedding experience. Every single detail representing Mughal Mahal Hotel’s perfection. The best venue for your wedding reception.</p>
        </div>

        <div className="slider-feature-image">
          <img src={ba1} alt="Banquet feature" />
        </div>

        <div className="slider-wrapper">
          <button className="slider-control prev" onClick={handlePrev}>&lt;</button>

          <motion.div
            key={activeIndex}
            className="slider-item"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.5 }}
          >
            <img src={sliderData[activeIndex].image} alt={sliderData[activeIndex].title} />
          </motion.div>

          <button className="slider-control next" onClick={handleNext}>&gt;</button>
        </div>
      </section>

      <section className="banquet-slider-section">
        <div className="slider-header">
          <h2>HUSNAIN HALL Venues</h2>
          <p>Your big day is special to us, too. We can provide the ideal atmosphere and service for your wedding ceremony, reception and more.</p>
          <p>It is said that marriages are made in heaven. But we arrange them on earth. Catching ourselves using the old cliché – “soul mate”. Avenue that makes it magical, and all the smallest details that make it yours alone.</p>
          <p>A comprehensive Wedding Packages at the Husnain Hall includes a fine collection of Pakistani cuisine, royal stage set-up and floral arrangements, a wide selection of exquisite linen to complement the evening’s theme, and complimentary wedding benefits for the couple.</p>
        </div>

        <div className="slider-feature-image">
          <img src={ha1} alt="Husnain Hall feature" />
        </div>

        <div className="slider-wrapper">
          <button className="slider-control prev" onClick={handlePrev}>&lt;</button>

          <motion.div
            key={`duplicate-${activeIndex}`}
            className="slider-item"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.5 }}
          >
            <img src={sliderData[activeIndex].image} alt={sliderData[activeIndex].title} />
          </motion.div>

          <button className="slider-control next" onClick={handleNext}>&gt;</button>
        </div>
      </section>

      <section className="banquet-query-section">
        <div className="banquet-query-wrap">
          <button className="banquet-query-btn" onClick={openQuery}>Query Now</button>
        </div>
      </section>

      <BanquetQueryModal
        show={showQueryModal}
        onClose={() => setShowQueryModal(false)}
        prefill={profile}
      />
      <LoginModal show={showLoginModal} onClose={() => setShowLoginModal(false)} onLogin={handleLoginSuccess} />
    </div>
  );
};

export default Banquet;
