import React, { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import "./RoomPage.css"
import heroImage from "../assets/Mediacenter/room/by1.PNG"
import featureImage1 from "../assets/Mediacenter/room/by10.PNG"
import featureImage2 from "../assets/Mediacenter/room/by109.PNG"

const ExecutiveSuiteRoomPage = () => {
  const navigate = useNavigate()
  const [bookingData, setBookingData] = useState({
    checkIn: "",
    checkOut: "",
    adults: "1",
    paymentMethod: "Pay in Office",
  })
  const [bookingResult, setBookingResult] = useState(null)

  const rate = 20000
  const nights = useMemo(() => {
    if (!bookingData.checkIn || !bookingData.checkOut) return 0
    const start = new Date(bookingData.checkIn)
    const end = new Date(bookingData.checkOut)
    const diff = Math.floor((end - start) / (1000 * 60 * 60 * 24))
    return diff > 0 ? diff : 0
  }, [bookingData.checkIn, bookingData.checkOut])

  const subtotal = nights * rate
  const gstAmount = Math.round(subtotal * 0.05)
  const totalAmount = subtotal + gstAmount
  const isAvailable = bookingData.checkIn && bookingData.checkOut && nights > 0

  const handleBookingChange = (e) => {
    const { name, value } = e.target
    setBookingData((prev) => ({ ...prev, [name]: value }))
  }

  const handleBookingSubmit = (e) => {
    e.preventDefault()
    if (!isAvailable) return
    setBookingResult({
      checkIn: bookingData.checkIn,
      checkOut: bookingData.checkOut,
      nights,
      adults: bookingData.adults,
      paymentMethod: bookingData.paymentMethod,
      subtotal,
      gstAmount,
      totalAmount,
    })
  }

  return (
    <div className="room-page-wrapper">
      <div className="room-page-topbar">
        <span>King Bed</span>
        <span>Garden View</span>
        <span>Free Wifi</span>
        <span>2 People</span>
        <span>Rs: 20,000 + Tax / Night</span>
      </div>

      <div className="room-page-content">
        <div className="room-page-image">
          <img src={heroImage} alt="Executive Suite" />
        </div>

        <div className="room-page-copy">
          <p className="room-page-label">Executive Suite</p>
          <h1>Executive Suite - 2 people</h1>
          <p>
            The Executive Suite offers extra space, luxurious furnishings, and a comfortable living area. Perfect for guests who want a premium stay with sophisticated amenities.
          </p>
          <p>
            Enjoy a quiet retreat, excellent service, and beautiful views. The suite is tailored for guests who appreciate space, comfort, and elegance.
          </p>
          <button type="button" onClick={() => navigate("/rooms")}>Back to Rooms</button>

          <div className="room-booking-section">
            <h2>Check availability</h2>
            <form className="room-booking-form" onSubmit={handleBookingSubmit}>
              <div className="room-booking-row">
                <label>Check-in Date</label>
                <input
                  type="date"
                  name="checkIn"
                  value={bookingData.checkIn}
                  onChange={handleBookingChange}
                />
              </div>
              <div className="room-booking-row">
                <label>Check-out Date</label>
                <input
                  type="date"
                  name="checkOut"
                  value={bookingData.checkOut}
                  onChange={handleBookingChange}
                />
              </div>
              <div className="room-booking-row">
                <label>Adults</label>
                <input
                  type="number"
                  min="1"
                  name="adults"
                  value={bookingData.adults}
                  onChange={handleBookingChange}
                />
              </div>
              <div className="room-booking-row">
                <label>Payment Method</label>
                <select
                  name="paymentMethod"
                  value={bookingData.paymentMethod}
                  onChange={handleBookingChange}
                >
                  <option value="Pay in Office">Pay in Office</option>
                  <option value="Card Payment">Card Payment</option>
                </select>
              </div>

              <div className="room-booking-availability">
                {bookingData.checkIn && bookingData.checkOut ? (
                  nights > 0 ? (
                    <div className="available-box">Available for {nights} night(s)</div>
                  ) : (
                    <div className="unavailable-box">Please choose a later check-out date.</div>
                  )
                ) : (
                  <div className="unavailable-box">Select check-in and check-out dates to check availability.</div>
                )}
              </div>

              <div className="room-booking-total">
                <p>Rate per night: Rs. {rate}</p>
                <p>Subtotal: Rs. {subtotal}</p>
                <p>GST (5%): Rs. {gstAmount}</p>
                <p className="total-amount">Total: Rs. {totalAmount}</p>
              </div>

              <button type="submit" className="room-booking-submit" disabled={!isAvailable}>
                Book with total
              </button>
            </form>

            {bookingResult && (
              <div className="room-booking-confirmation">
                <h3>Booking details</h3>
                <p>Check-in: {bookingResult.checkIn}</p>
                <p>Check-out: {bookingResult.checkOut}</p>
                <p>Guests: {bookingResult.adults}</p>
                <p>Nights: {bookingResult.nights}</p>
                <p>Payment: {bookingResult.paymentMethod}</p>
                <p>Subtotal: Rs. {bookingResult.subtotal}</p>
                <p>GST (5%): Rs. {bookingResult.gstAmount}</p>
                <p className="total-amount">Total paid: Rs. {bookingResult.totalAmount}</p>
              </div>
            )}
          </div>
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
          <img src={featureImage1} alt="Executive Suite detail 1" />
          <img src={featureImage2} alt="Executive Suite detail 2" />
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

export default ExecutiveSuiteRoomPage
