import React, { useEffect } from "react";
import { Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import AOS from "aos";
import "aos/dist/aos.css";
import "./NewsletterSection.css";

const NewsletterSection = () => {
  useEffect(() => {
    AOS.init({ duration: 1200, once: true });
  }, []);

  return (
    <section className="newsletter-wrapper py-5" data-aos="fade-up">
      <Container className="text-center">
        <h6 className="newsletter-subtitle" data-aos="fade-down" data-aos-delay="200">
          Get the Latest Offers
        </h6>
        <h2 className="newsletter-title" data-aos="fade-down" data-aos-delay="400">
          Follow us on Facebook
        </h2>
        <p className="newsletter-description" data-aos="fade-down" data-aos-delay="600">
          Keep up with our latest updates and offers on our Facebook page.
        </p>

        <div className="facebook-preview mx-auto mt-4" data-aos="zoom-in" data-aos-delay="800">
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
      </Container>
    </section>
  );
};

export default NewsletterSection;
