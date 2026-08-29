import React, { useEffect } from "react";
import "./About.css";
import naeemImage from "../../assets/Mediacenter/About/Naeem Asif Mughal.PNG";
import ranaImage from "../../assets/Mediacenter/About/Rana Haseeb Khan.PNG";
import shahzadaImage from "../../assets/Mediacenter/About/MR. SHAHZADA KHALID.PNG";
import aliImage from "../../assets/Mediacenter/About/MR. ALI ASIF.PNG";
import room1 from "../../assets/Mediacenter/About/room1.PNG";
import room2 from "../../assets/Mediacenter/About/room2.PNG";
import aboutBackground from "../../assets/Mediacenter/About/background.PNG";

export default function About() {
  useEffect(() => {
    const elements = document.querySelectorAll(".reveal");
    elements.forEach((el) => el.classList.add("active"));
  }, []);

  return (
    <div className="about-page">
      
      <section className="about-hero-main" style={{ backgroundImage: `url(${aboutBackground})` }}>
        <div className="hero-overlay"></div>

        <div className="about-hero-content">
          <div className="container">
            <h1 className="about-hero-center-title">Experience Royalty</h1>
          </div>
        </div>
      </section>

      <section className="about-hero">
        <div className="container reveal fade-up">
          <h1>
            All the services offered by a boutique hotel in Gujranwala with the
            experience of a luxury hotel.
          </h1>

          <div className="about-hero-grid">
            <div className="about-text reveal slide-left">
              <p>
                Mughal Mehal Hotel blends timeless Mughal elegance with
                contemporary comfort. Each space is carefully curated to deliver
                an atmosphere of refinement, privacy, and royal hospitality.
              </p>
              <p>
                From thoughtfully designed rooms to exceptional dining and
                personalized service, every detail reflects our commitment to
                excellence.
              </p>
            </div>

            <div className="about-images reveal slide-right about-room-images">
              <img
                src={room1}
                alt="Room 1"
              />
              <img
                src={room2}
                alt="Room 2"
              />
            </div>
          </div>
        </div>
      </section>

     
      <section className="about-people">
        <div className="container">
          <div className="people-grid">
            <div className="people-text reveal slide-left">
              <h2>The People Behind the Royal Experience</h2>
              <p>
                True luxury lies in human connection. Our team is driven by
                passion, dedication, and an unwavering commitment to deliver
                exceptional hospitality.
              </p>
            </div>

            <div className="people-images reveal slide-right">
                    <div className="person">
                      <img
                        src={naeemImage}
                        alt="Naeem Asif Mughal"
                      />
                      <h5 style={{ marginTop: 5 }}>Naeem Asif Mughal</h5>
                      <span>Chairman</span>
                    </div>
                    <div className="person">
                      <img
                        src={ranaImage}
                        alt="Rana Haseeb Khan"
                      />
                      <h5 style={{ marginTop: 5 }}>Rana Haseeb Khan</h5>
                      <span>Managing Director</span>
                    </div>
            </div>
          </div>
        </div>
      </section>

      
      <section className="about-management">
        <div className="container reveal fade-up">
          <h2>Our Leadership</h2>

          <div className="management-grid">
            <div className="manager reveal slide-left">
              <img
                src={shahzadaImage}
                alt="MR. SHAHZADA KHALID"
              />
              <h4>Director Operations</h4>
              <h5>MR. SHAHZADA KHALID</h5>
              <p>
                <span style={{ display: "block", marginBottom: 5 }}>
                  +92 322 7799011
                </span>
                <span style={{ display: "block", marginBottom: 5 }}>
                  shahzadakhalid@mughalmahal.pk
                </span>
                Oversees every aspect of guest experience, ensuring seamless
                service and operational excellence across the hotel.
              </p>
            </div>

            <div className="manager reveal slide-right">
              <img
                src={aliImage}
                alt="MR. ALI ASIF"
              />
              <h4>Director Marketing</h4>
              <h5>MR. ALI ASIF</h5>
              <p>
                <span style={{ display: "block", marginBottom: 5 }}>
                  +92 322 7799011
                </span>
                <span style={{ display: "block", marginBottom: 5 }}>
                  shahzadakhalid@mughalmahal.pk
                </span>
                Shapes the brand identity of Mughal Mehal Hotel, connecting
                timeless heritage with modern luxury hospitality.
              </p>
            </div>
          </div>
        </div>
      </section>

      
      <section className="about-closing">
        <div className="container reveal fade-up">
          <h2>Experience Royalty</h2>
          <p>
            Mughal Mehal Hotel is not just a place to stay — it is a destination
            where elegance, comfort, and tradition unite to create unforgettable
            experiences.
          </p>
        </div>
      </section>
    </div>
  );
}
