import React, { useEffect } from "react";
import { Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import AOS from "aos";
import "aos/dist/aos.css";
import "./MapSection.css";

const MapSection = () => {
  useEffect(() => {
    AOS.init({
      duration: 1200,
      once: true,
    });
  }, []);

  return (
    <section className="map-wrapper py-5" data-aos="fade-up">
      <Container className="text-center">
        <h2 className="map-title" data-aos="fade-down" data-aos-delay="200">
          Visit Mughal Mahal
        </h2>
        <p className="map-subtitle" data-aos="fade-down" data-aos-delay="400">
          Experience our signature hospitality and royal dining atmosphere at our location.
        </p>

        <div className="map-outer" data-aos="zoom-in" data-aos-delay="600">
          <iframe
            title="Mughal Mahal Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3380.350760616606!2d74.20124609999999!3d32.0868045!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391f2ab0db205e03%3A0xd5edbd6ccd3e91b7!2sMughal%20Mahal%20Hotel!5e0!3m2!1sen!2s!4v1782740187047!5m2!1sen!2s"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            style={{ border: 0, width: '100%', height: '100%' }}
          />
        </div>
      </Container>
    </section>
  );
};

export default MapSection;
