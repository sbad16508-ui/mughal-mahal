import React, { useEffect } from "react";
import "./RoomShowcase.css";

export default function RoomShowcase() {
  useEffect(() => {
    const sections = document.querySelectorAll(".rs-animate");

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

    sections.forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const rooms = [
    {
      title: "Deluxe Twin Room",
      text: "Twins Bed, City View, Free Wifi, Luxury & Comfort.",
      image: "/src/assets/mediacenter/ItemsImages/01-3-scaled.jpg",
    },
    {
      title: "Luxury Suite",
      text: "Royal comfort with modern styling for premium guests.",
      image: "/src/assets/mediacenter/ItemsImages/01-3-scaled.jpg",
    },
    {
      title: "Executive Room",
      text: "Elegant space perfect for families & business travelers.",
      image: "/src/assets/mediacenter/ItemsImages/01-3-scaled.jpg",
    },
  ];

  return (
    <section className="room-section rs-animate">
      <div className="container py-5">
        
        <div className="text-center mb-5" data-aos="fade-up">
          <p className="room-subtitle">Our Rooms</p>
          <h2 className="room-title">Luxury Living Spaces</h2>
        </div>

        <div id="roomCarousel" className="carousel slide carousel-fade" data-bs-ride="carousel">
       
          <div className="carousel-indicators">
            {rooms.map((_, idx) => (
              <button
                key={idx}
                data-bs-target="#roomCarousel"
                data-bs-slide-to={idx}
                className={idx === 0 ? "active" : ""}
              ></button>
            ))}
          </div>

      
          <div className="carousel-inner rounded-4 shadow-lg">
            {rooms.map((room, index) => (
              <div className={`carousel-item ${index === 0 ? "active" : ""}`} key={index}>
                <div className="room-image-wrapper">
                  <img
                    src={room.image}
                    className="d-block w-100 room-img"
                    alt={room.title}
                  />
                </div>

                <div className="carousel-caption room-caption">
                  <h5 className="caption-title">{room.title}</h5>
                  <p className="caption-text">{room.text}</p>
                </div>
              </div>
            ))}
          </div>

          
          <button className="carousel-control-prev" type="button" data-bs-target="#roomCarousel" data-bs-slide="prev">
            <span className="carousel-control-prev-icon custom-control"></span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#roomCarousel" data-bs-slide="next">
            <span className="carousel-control-next-icon custom-control"></span>
          </button>
        </div>
      </div>
    </section>
  );
}
