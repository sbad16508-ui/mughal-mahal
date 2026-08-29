import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../views/RoomPage.css";
import "./Redbox.css";
import "../home/RedboxOrderModal.css";
import redbox2 from "../../assets/Mediacenter/room/redbox2.PNG";
import rmenu1 from "../../assets/Mediacenter/room/rmenu1.PNG";
import rmenu2 from "../../assets/Mediacenter/room/rmenu2.PNG";
import rmenu3 from "../../assets/Mediacenter/room/rmenu3.PNG";
import rmenu4 from "../../assets/Mediacenter/room/rmenu4.PNG";
import rmenu5 from "../../assets/Mediacenter/room/rmenu5.PNG";
import rmenu6 from "../../assets/Mediacenter/room/rmenu6.PNG";
import rmenu7 from "../../assets/Mediacenter/room/rmenu7.PNG";
import rmenu8 from "../../assets/Mediacenter/room/rmenu8.PNG";
import RedboxOrderModal from "../home/RedboxOrderModal";

const RedBox = () => {
  const navigate = useNavigate();
  const roomName = "Redbox Café";
  const [profile, setProfile] = useState(null)

  const sliderImages = [
    rmenu1,
    rmenu2,
    rmenu3,
    rmenu4,
    rmenu5,
    rmenu6,
    rmenu7,
    rmenu8,
  ];

  useEffect(() => {
    const profileRaw = localStorage.getItem('bookingUserProfile')
    try { setProfile(profileRaw ? JSON.parse(profileRaw) : null) } catch { setProfile(null) }
  }, [])

  return (
    <div className="room-page-wrapper redbox-page-wrapper">
      <div className="room-page-topbar">
        <span>Indoor Seating</span>
        <span>Fresh Juices</span>
        <span>Café Snacks</span>
        <span>Free Wi-Fi</span>
      </div>

      <div className="room-page-content">
        <div className="room-page-image">
          <img src={redbox2} alt={roomName} />
        </div>

        <div className="room-page-copy">
          <p className="room-page-label">Redbox Café</p>
          <h1>{roomName}</h1>
          <p>
            Redbox Café offers a fresh and contemporary lobby experience with a
            vibrant menu of juices, coffees, pastries, sandwiches, and desserts.
            Our beverage selection and relaxed indoor seating are perfect for
            guests looking to unwind or connect while enjoying free Wi-Fi.
          </p>
          <button type="button" onClick={() => navigate("/")}>Back to Home</button>
        </div>
      </div>

      <section className="menu-slider-section">
        <h2 className="room-page-label">Menu Gallery</h2>
        <div
          id="redboxMenuCarousel"
          className="carousel slide"
          data-bs-ride="carousel"
        >
          <div className="carousel-inner">
            {sliderImages.map((image, index) => (
              <div
                key={index}
                className={`carousel-item ${index === 0 ? "active" : ""}`}
              >
                <img
                  src={image}
                  className="d-block w-100 menu-slide-img"
                  alt={`Redbox menu ${index + 1}`}
                />
              </div>
            ))}
          </div>
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#redboxMenuCarousel"
            data-bs-slide="next"
            aria-label="Move carousel left"
          >
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#redboxMenuCarousel"
            data-bs-slide="prev"
            aria-label="Move carousel right"
          >
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
          </button>
        </div>
      </section>

      <section
        className="redbox-order-section"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          width: '100%',
          gap: '30px',
          marginTop: '40px',
          padding: '30px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '24px',
          boxSizing: 'border-box'
        }}
      >
        <div
          className="redbox-order-actions-wrapper"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
            maxWidth: '720px',
            width: '100%',
            margin: '0 auto 30px',
            textAlign: 'center',
            boxSizing: 'border-box'
          }}
        >
          <p>Fill the order form below for your selected Redbox item and timing.</p>
        </div>
        <RedboxOrderModal prefill={profile} />
      </section>
    </div>
  );
};

export default RedBox;
