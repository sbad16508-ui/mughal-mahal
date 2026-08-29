import React, { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./LuxurySection.css";
import homep2 from "../../assets/Mediacenter/Home/homep2.PNG";

const luxuryFeatures = [
  {
    src: homep2,
    alt: "Mughal Mahal Interior",
  }
];

const LuxurySection = () => {

  useEffect(() => {
    const elements = document.querySelectorAll(".lux-animate");

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
          }
        });
      },
      { threshold: 0.25 }
    );

    elements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="luxury-section py-5">
      <div className="container">
        <div className="row align-items-center">

         
          <div className="col-md-6 mb-4 mb-md-0">
            {luxuryFeatures.map((image, index) => (
              <div
                key={index}
                className="lux-image lux-animate delay-1"
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="img-fluid rounded-4 shadow-lg"
                />
              </div>
            ))}
          </div>

          
          <div className="col-md-6 lux-text">
            <p className="lux-tag lux-animate">
              Luxury & Comfort
            </p>

            <h2 className="lux-title lux-animate delay-2">
              Our services and <br /> wonders of Mughal Mahal
            </h2>

            <p className="lux-description lux-animate delay-3">
              With the greatest pleasure, we are delighted to extend our hospitality to our
              Royal Guests. Mughal Mahal Hotel will surprise you with its central location,
              magnificent lobby, and the friendly, professional service you will experience.
              Every associate, whether a Housekeeper, Front Desk Officer, Waiter, or Engineer,
              will please you with kindness, smiles, and good service.
            </p>

            <a
              href="https://mughalmahal.pk/about/"
              className="btn lux-btn lux-animate delay-4"
            >
              View More
            </a>
          </div>

        </div>
      </div>
    </section>
  );
};

export default LuxurySection;
