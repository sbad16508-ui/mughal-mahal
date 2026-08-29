import React, { useEffect } from "react";
import { Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import AOS from "aos";
import "aos/dist/aos.css";
import "./LuxuryBanner.css";
import homep1 from "../../assets/Mediacenter/Home/homep1.PNG";

const LuxuryBanner = () => {
  useEffect(() => {
    AOS.init({
      duration: 1200,
      once: true, // animation only once
    });
  }, []);

  const bannerImage = homep1;

  return (
    <section className="luxury-banner-section">
      <div
        className="banner-image"
        style={{ backgroundImage: `url(${bannerImage})` }}
        data-aos="fade-up"
      >
        <Container className="banner-content text-center">
          <h1 data-aos="fade-down" data-aos-delay="200">
            Experience Luxury Like Never Before
          </h1>
          <p data-aos="fade-down" data-aos-delay="400">
            Discover the finest designs, elegance, and comfort with our curated offerings.
          </p>
        </Container>
      </div>
    </section>
  );
};

export default LuxuryBanner;
