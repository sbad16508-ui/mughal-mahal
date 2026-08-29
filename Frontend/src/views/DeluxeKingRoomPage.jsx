import React from "react"
import { useNavigate } from "react-router-dom"
import "./RoomPage.css"
import heroImage from "../assets/Mediacenter/room/dd2.PNG"
import featureImage1 from "../assets/Mediacenter/room/dd3.PNG"
import featureImage2 from "../assets/Mediacenter/room/dd4.PNG"

const DeluxeKingRoomPage = () => {
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
        <span>Rs: 16,000 + Tax / Night</span>
      </div>

      <div className="room-page-content">
        <div className="room-page-image">
          <img src={heroImage} alt="Deluxe King Room" />
        </div>

        <div className="room-page-copy">
          <p className="room-page-label">Deluxe King Room</p>
          <h1>Deluxe King Room - 2 people</h1>
          <p>
            Relax in our Deluxe King Room with a comfortable king bed, garden view, and spacious desk area. This room offers elegant design and premium amenities for a memorable stay.
          </p>
          <p>
            Enjoy attentive service, fast Wi-Fi, and a peaceful atmosphere. The Deluxe King Room is perfect for couples and guests who want extra space and comfort.
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
          <img src={featureImage1} alt="Deluxe King Room detail 1" />
          <img src={featureImage2} alt="Deluxe King Room detail 2" />
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

export default DeluxeKingRoomPage
