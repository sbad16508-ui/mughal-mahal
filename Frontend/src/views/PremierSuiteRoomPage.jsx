import React from "react"
import { useNavigate } from "react-router-dom"
import "./RoomPage.css"
import heroImage from "../assets/Mediacenter/room/d51.PNG"
import featureImage1 from "../assets/Mediacenter/room/a2.PNG"
import featureImage2 from "../assets/Mediacenter/room/a3.PNG"

const PremierSuiteRoomPage = () => {
  const navigate = useNavigate()
  const handleBookNow = () => {
    const navBtn = document.getElementById("bookNowButton")
    if (navBtn) {
      navBtn.click()
      return
    }
    if (!localStorage.getItem("bookingUser")) {
      alert("Please Login to Book")
      return
    }
    navigate("/book-now")
  }

  return (
    <div className="room-page-wrapper">
      <div className="room-page-topbar">
        <span>King Bed</span>
        <span>Garden View</span>
        <span>Free Wifi</span>
        <span>2 People</span>
        <span>Rs: 22,000 + Tax / Night</span>
      </div>

      <div className="room-page-content">
        <div className="room-page-image">
          <img src={heroImage} alt="Premier Suite" />
        </div>

        <div className="room-page-copy">
          <p className="room-page-label">Premier Suite</p>
          <h1>Premier Suite - 2 people</h1>
          <p>
            The Premier Suite provides an exceptional stay with deluxe furnishings, generous space, and elegant decor. It is designed for guests who want the finest accommodations.
          </p>
          <p>
            Enjoy spacious living, premium amenities, and attentive service. The suite is ideal for a luxurious and memorable hotel experience.
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
          <img src={featureImage1} alt="Premier Suite detail 1" />
          <img src={featureImage2} alt="Premier Suite detail 2" />
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
  )
}

export default PremierSuiteRoomPage
