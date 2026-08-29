import React from "react"
import { useParams, useNavigate } from "react-router-dom"
import roomCards from "../data/roomData"
import "./RoomDetail.css"

const RoomDetail = () => {
  const { id } = useParams()
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

  const room = roomCards.find(item => item.id === id)

  if (!room) {
    return (
      <div className="room-detail-page">
        <p>Room not found.</p>
        <button type="button" onClick={() => navigate("/rooms")}>Back to Rooms</button>
      </div>
    )
  }

  return (
    <div className="room-detail-page">
      <div className="room-detail-hero">
        <div className="room-detail-image">
          <img src={room.image} alt={room.title} />
        </div>
        <div className="room-detail-copy">
          <p className="detail-small">Luxury & Comfort</p>
          <h1>{room.title}</h1>
          <p>{room.description}</p>
          <div className="room-detail-meta">
            <span>{room.price}</span>
            <button type="button" onClick={() => navigate("/rooms")}>Back to Rooms</button>
          </div>
        </div>
      </div>
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

export default RoomDetail
