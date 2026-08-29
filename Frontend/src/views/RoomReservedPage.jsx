import React from "react"
import { useParams, useNavigate } from "react-router-dom"
import "./RoomPage.css"
import heroImage from "../assets/Mediacenter/room/by1.PNG"
import featureImage1 from "../assets/Mediacenter/room/d1.PNG"
import featureImage2 from "../assets/Mediacenter/room/d2.PNG"

const RoomReservedPage = () => {
  const { slug } = useParams()
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

  const roomName = slug ? slug.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase()) : "Reserved Room"

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
          <img src={heroImage} alt={roomName} />
        </div>

        <div className="room-page-copy">
          <p className="room-page-label">Luxury & Comfort</p>
          <h1>{roomName}</h1>
          <p>
            With the greatest pleasure, we are delighted to extend our hospitality to our Royal Guests. Mughal Mahal Hotel will surprise you with its central location, magnificent lobby, and the friendly, professional service you will experience.
          </p>
          <p>
            Every associate, whether a Housekeeper, Front Desk Officer, Waiter or Engineer will please you with kindness, smiles and good service. The hotel is dedicated to you, our guest, by demonstrating our policy of 100% Guest Satisfaction and consistently improving our services and amenities.
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
          <img src={featureImage1} alt={`${roomName} detail 1`} />
          <img src={featureImage2} alt={`${roomName} detail 2`} />
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

export default RoomReservedPage
