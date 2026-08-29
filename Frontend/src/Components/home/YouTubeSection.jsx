import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "./YouTubeSection.css";

const YouTubeSection = () => {
  useEffect(() => {
    AOS.init({
      duration: 1200,
      once: true,
    });
  }, []);

  return (
    <section className="youtube-section">
      <div className="youtube-content" data-aos="fade-up">
        <h2 data-aos="fade-down" data-aos-delay="200">Our Luxury Dining Experience</h2>
        <p data-aos="fade-down" data-aos-delay="400">
          Watch our exclusive video to explore the magical food and unique themes
          of Mughal Mahal. Discover a culinary journey unlike any other.
        </p>

        <div className="video-wrapper" data-aos="zoom-in" data-aos-delay="600">
          <iframe
            src="https://www.youtube.com/embed/WLhhN3ScohM?controls=1&rel=0&playsinline=1&modestbranding=1&autoplay=0"
            title="Mughal Mahal Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
          <div className="video-overlay">
            <i className="bi bi-play-circle-fill"></i>
          </div>
        </div>
      </div>
    </section>
  );
};

export default YouTubeSection;
