import "./About.css";
import { useEffect } from "react";

export default function About() {
  useEffect(() => {
    const elements = document.querySelectorAll(".about-animate");

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
          }
        });
      },
      { threshold: 0.2 }
    );

    elements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="about-section py-5">
      <div className="container">
        <div className="about-header text-center mb-5">
          <p className="about-subtitle about-animate">Royal & Unique</p>

          <h2 className="about-title about-animate delay-1">
            The Signature Services and
            <br /> Wonders of Mughals
          </h2>

          <p className="about-description about-animate delay-2">
            Our accommodations and dining are designed for unforgettable stays,
            celebrations, and elegant gatherings in the heart of Gujranwala.
          </p>

          <div className="about-divider about-animate delay-3"></div>
        </div>

        <div className="row justify-content-center">
          <div className="col-xl-10">
            <div className="about-card about-animate delay-4">
              <div className="about-card-grid">
                <div className="about-card-text">
                  <p>
                    At Mughal Mahal, we blend timeless Mughal hospitality with modern luxury.
                    Every guest is welcomed with warmth, refined service, and thoughtful details.
                    From lavish rooms to exquisite dining experiences, our goal is to make every
                    moment feel royal.
                  </p>
                  <p>
                    Our vision is to become an iconic hotel that represents the hospitality of
                    Pakistan across borders. Our mission is to ensure everyone <strong>“Experience Royalty”</strong>
                    beyond their expectations.
                  </p>
                </div>

                <div className="about-card-highlights">
                  <div className="about-highlight">
                    <h3>Our Vision</h3>
                    <p>
                      To be recognized as a premier luxury destination known for supreme
                      comfort, rich culture, and exceptional service.
                    </p>
                  </div>
                  <div className="about-highlight">
                    <h3>Our Mission</h3>
                    <p>
                      To deliver memorable stays with royal hospitality, delicious cuisine,
                      and a welcoming atmosphere for every guest.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
