import React from "react";
import { useNavigate } from "react-router-dom";
import "./RoomPage.css";
import heroImage from "../assets/Mediacenter/room/luxrycomfort.PNG";
import featureImage1 from "../assets/Mediacenter/room/d1.PNG";
import featureImage2 from "../assets/Mediacenter/room/d2.PNG";

const DeluxeTwinRoomPage = () => {
  const navigate = useNavigate();
  const handleBookNow = () => {
    const navBtn = document.getElementById("bookNowButton");
    if (navBtn) {
      navBtn.click();
      return;
    }
    if (!localStorage.getItem("bookingUser")) {
      alert("Please Login to Book")
      return;
    }
    navigate("/book-now");
  };

  return (
    <div className="room-page-wrapper deluxe-twin-page">
      <div className="room-page-topbar">
        <span>Two Twin Beds</span>
        <span>City View</span>
        <span>Free Wifi</span>
        <span>2 People</span>
        <span>Rs: 14,000 + Tax / Night</span>
      </div>

      <div className="room-page-content">
        <div className="room-page-image">
          <img src={heroImage} alt="Deluxe Twin Room" />
        </div>

        <div className="room-page-copy">
          <p className="room-page-label">Deluxe Twin Room</p>
          <h1>Deluxe Twin Room - 2 people</h1>
          <p>
            Enjoy premium comfort in our Deluxe Twin Room with two twin beds, a spacious work desk, and a relaxing city view. This room is designed for guests who want a blend of comfort and convenience.
          </p>
          <p>
            Relax with complimentary Wi-Fi, thoughtful service, and modern amenities. The room offers a warm atmosphere and a convenient layout for both work and rest.
          </p>
          <button type="button" onClick={() => navigate("/rooms")}>Back to Rooms</button>
        </div>
      </div>

      <section className="room-page-features">
        <div className="room-page-features-list">
          <h2>Room features</h2>
          <ul>
            <li>Spacious Work Desk</li>
            <li>Fingerprint Lock</li>
            <li>Free Wi-Fi</li>
            <li>Prayer Mats</li>
            <li>Flat-screen Android TV</li>
            <li>Bathroom Includes all Amenities</li>
            <li>Bathtub</li>
            <li>Mini bar</li>
            <li>Slippers</li>
            <li>Water Bottle With Coffee & Tea Making Facility</li>
          </ul>
        </div>
        <div className="room-page-features-image">
          <img src={featureImage1} alt="Deluxe Twin Room detail 1" />
          <img src={featureImage2} alt="Deluxe Twin Room detail 2" />
        </div>
      </section>

      <section className="room-page-cta">
        <div style={{ textAlign: "center", margin: "28px 0" }}>
          <button
            type="button"
            className="book-btn"
            onClick={handleBookNow}
          >
            Book Now
          </button>
        </div>
      </section>
    </div>
  );
};

export default DeluxeTwinRoomPage;
