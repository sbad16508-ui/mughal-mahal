import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaWifi,
  FaCoffee,
  FaBriefcase,
  FaSnowflake,
  FaTv,
} from "react-icons/fa";
import con1 from "../../assets/Mediacenter/room/con1.PNG";
import ConferenceBookingModal from "../home/ConferenceBookingModal";
import LoginModal from "../LoginModal";
import "./ConferenceRoom.css";

const ConferenceRoomComponent = () => {
  const [showQueryModal, setShowQueryModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const profileRaw = localStorage.getItem('bookingUserProfile');
    try {
      setProfile(profileRaw ? JSON.parse(profileRaw) : null);
    } catch {
      setProfile(null);
    }
  }, []);

  const openQuery = () => {
    // Allow opening the query modal without requiring login
    const profileRaw = localStorage.getItem('bookingUserProfile');
    try {
      setProfile(profileRaw ? JSON.parse(profileRaw) : null);
    } catch {
      setProfile(null);
    }
    setShowQueryModal(true);
  };

  return (
    <div className="conference-wrapper">

      
      <section
        className="conference-hero"
        style={{ backgroundImage: `url(${con1})` }}
      >
        <div className="hero-overlay"></div>
        <motion.div
          className="conference-hero-content"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1>Meeting & Conference Room</h1>
          <p>Where business meets elegance</p>
        </motion.div>
      </section>


     
      <section className="conference-details">
        <div className="details-grid">

          
          <motion.div
            className="details-left"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2>Facilities</h2>
            <ul>
              <li><FaWifi /> High-Speed Wi-Fi</li>
              <li><FaCoffee /> Refreshments</li>
              <li><FaBriefcase /> Executive Environment</li>
              <li><FaSnowflake /> Fully Air Conditioned</li>
              <li><FaTv /> Multimedia Setup</li>
            </ul>
          </motion.div>

         
          <motion.div
            className="details-right"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <img
              src={con1}
              alt="Conference Room"
            />
          </motion.div>

        </div>
      </section>

      <section className="conference-query">
        <div className="conference-query-box">
          <h2>Conference Booking Inquiry</h2>
          <p>
            Have a meeting or event in mind? Send us a quick inquiry and our team will help you plan a tailored conference experience.
          </p>
          <button type="button" className="conference-query-btn" onClick={openQuery}>
            Query Now
          </button>
        </div>
      </section>

      <ConferenceBookingModal
        show={showQueryModal}
        onClose={() => setShowQueryModal(false)}
      />
      <LoginModal show={showLoginModal} onClose={() => setShowLoginModal(false)} onLogin={() => { setShowLoginModal(false); setShowQueryModal(true); }} />

      <section className="conference-newsletter">
        <motion.div
          className="newsletter-box"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2>Get the Latest Offers</h2>
          <p>Follow us on Facebook for the latest conference updates and offers.</p>

          <div className="facebook-card conference-facebook-card">
            <div className="facebook-header d-flex align-items-center justify-content-between px-4 py-3">
              <div className="facebook-brand">
                <span className="facebook-icon">f</span>
                <div>
                  <h3>Mughal Mahal</h3>
                </div>
              </div>
              <a
                href="https://www.facebook.com/MughalMahal"
                target="_blank"
                rel="noopener noreferrer"
                className="facebook-follow-btn"
              >
                Follow
              </a>
            </div>

            <div className="facebook-body px-4 py-3">
              <p className="facebook-post-text">
                Follow our Facebook page for the latest updates and offers.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

    </div>
  );
};

export default ConferenceRoomComponent;
