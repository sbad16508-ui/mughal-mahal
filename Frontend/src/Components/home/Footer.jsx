import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Footer.css";
import logo from "../../assets/Mediacenter/ItemsImages/logo.png";

const Footer = () => {
  return (
    <footer className="mm-footer py-5">
      <Container>
        <Row>
          <Col md={3} className="mb-4">
            <h5 className="footer-heading">Explore</h5>
            <ul className="footer-list">
              <li><a href="/">Home</a></li>
              <li><a href="/rooms">Our Rooms</a></li>
              <li><a href="/about">About</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </Col>

          <Col md={3} className="mb-4">
            <h5 className="footer-heading">Social Media</h5>
            <ul className="footer-list">
              <li>
                <a href="https://www.facebook.com/MughalMahalHotel" target="_blank" rel="noopener noreferrer">
                  Facebook
                </a>
              </li>
              <li>
                <a href="https://twitter.com/Mughal_Mahal" target="_blank" rel="noopener noreferrer">
                  Twitter
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/mughal_mahal_hotel/" target="_blank" rel="noopener noreferrer">
                  Instagram
                </a>
              </li>
              <li>
                <a href="https://www.youtube.com/channel/UCPI-ASTsDeMXs-l9QPofheA" target="_blank" rel="noopener noreferrer">
                  YouTube
                </a>
              </li>
            </ul>
          </Col>

          <Col md={3} className="mb-4">
            <h5 className="footer-heading">Reach Us</h5>
            <ul className="footer-list">
              <li>Main GT Road, Chan Da Qila, Gujranwala, Pakistan</li>
              <li>055-4299107</li>
              <li>+92 322 7799 006</li>
              <li>info@mughalmahal.pk</li>
            </ul>
          </Col>

          <Col md={3} className="mb-4 footer-logo-col">
            <div className="footer-logo">
              <img src={logo} alt="Mughal Mahal Logo" />
            </div>
          </Col>
        </Row>

        <div className="footer-divider my-4"></div>

        <Row className="footer-bottom text-center">
          <Col md={6} className="mb-2">
            <p className="footer-text mb-0">
              © 2024 Mughal Mahal / Powered by CH-MHS
            </p>
          </Col>
          <Col md={6}>
            <p className="footer-links mb-0">
              <a href="/terms">Terms</a> &nbsp; &nbsp;
              <a href="/privacy-policy">Privacy Policy</a> &nbsp; &nbsp;
              <a href="/cookie-policy">Cookie Policy</a>
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
