import React from "react"
import { useNavigate } from "react-router-dom"
import "./RoomPage.css"
import heroImage from "../assets/Mediacenter/room/a1.PNG"
import featureImage1 from "../assets/Mediacenter/room/d52.PNG"
import featureImage2 from "../assets/Mediacenter/room/bt1.PNG"

const ExecutiveRoom2PeoplePage = () => {
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
        <span>City View</span>
        <span>Free Wifi</span>
        <span>2 People</span>
        <span>Rs: 16,000 + Tax / Night</span>
      </div>

      <div className="room-page-content">
        <div className="room-page-image">
          <img src={heroImage} alt="Executive Room" />
        </div>

        <div className="room-page-copy">
          <p className="room-page-label">Executive Room</p>
          <h1>Executive Room - 2 people</h1>
          <p>
            The Executive Room brings premium comfort with a king bed, city or garden view, and a refined working area. Ideal for business travelers and couples looking for a serene stay.
          </p>
          <p>
            Enjoy thoughtful amenities, thoughtful service, and a calm atmosphere designed for both rest and productivity. This room is designed to deliver exceptional quality and refined hospitality.
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
          <img src={featureImage1} alt="Executive Room detail 1" />
          <img src={featureImage2} alt="Executive Room detail 2" />
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

export default ExecutiveRoom2PeoplePage
