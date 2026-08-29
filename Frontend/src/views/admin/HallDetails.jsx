import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { FaArrowLeft, FaEdit, FaUsers, FaVideo } from "react-icons/fa"
import "./HallDetails.css"
import api from "../../api"

const HallDetails = () => {
  const navigate = useNavigate()
  const { id } = useParams()

  const [hallData, setHallData] = useState(null)
  const [upcomingBookings, setUpcomingBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHallDetailsAndSchedules = async () => {
      try {
        setLoading(true)

        const hallRes = await api.get(`/conference/room/${id}`)
        setHallData(hallRes.data)

        const bookingsRes = await api.get("/conferences")

        const filteredSchedules = bookingsRes.data.filter((booking) => {
          const bookingHallId = typeof booking.conferenceHallId === "object" && booking.conferenceHallId !== null
            ? booking.conferenceHallId._id
            : booking.conferenceHallId
          return bookingHallId === id
        })
        setUpcomingBookings(filteredSchedules)

      } catch (err) {
        console.error("Failed specific hall detail data profile:", err)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchHallDetailsAndSchedules()
    }
  }, [id])

  if (loading) {
    return (
      <div style={{ padding: "120px", textTransform: "uppercase", letterSpacing: "1px", textAlign: "center", color: "#666", fontWeight: "bold" }}>
        Syncing conference hall profile metrics...
      </div>
    )
  }

  if (!hallData) {
    return (
      <div style={{ padding: "40px", textAlign: "center", fontSize: "1.2rem", color: "#d32f2f", fontWeight: "bold" }}>
        Error: Conference Hall not found.
      </div>
    )
  }

  const hallPriceLabel = hallData.price || hallData.rate || 0
  const amenities = Array.isArray(hallData.tags) ? hallData.tags : (hallData.amenities || ["WiFi", "Projector"])

  return (
    <div className="hall-details-container">
      <div className="hall-details-header">
        <div className="header-left">
          <button type="button" className="back-btn-sq" onClick={() => navigate("/admin/conference")}>
            <FaArrowLeft /> Back
          </button>
          <div className="title-section">
            <h1>{hallData.name}</h1>
            <span>ID: {hallData._id?.substring(hallData._id.length - 6).toUpperCase()}</span>
          </div>
        </div>
        <button
          type="button"
          className="btn-edit-hall"
          onClick={() => navigate(`/admin/conference/edit/${hallData._id}`)}
        >
          <FaEdit /> Edit Hall
        </button>
      </div>

      <div className="hall-grid-layout">
        <div className="hall-main-info">

          <div className="hall-card image-placeholder-card">
            <div className="placeholder-content">
              <FaVideo className="placeholder-icon" />
              <h3>{hallData.name}</h3>
            </div>
          </div>

          <div className="hall-card">
            <h3>Amenities</h3>
            <div className="amenities-grid">
              {amenities.map((item, index) => (
                <div key={index} className="amenity-item">
                  <span className="dot"></span> {item}
                </div>
              ))}
            </div>
          </div>

          <div className="hall-card">
            <h3>Upcoming Bookings</h3>
            <div className="booking-list">
              {upcomingBookings.map((booking, index) => {
                const displayDate = booking.eventDate
                  ? new Date(booking.eventDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                  : "N/A"

                const dynamicDuration = booking.startTime && booking.endTime
                  ? `${booking.startTime} - ${booking.endTime}`
                  : "Full Day"

                return (
                  <div key={index} className="booking-item" style={{ cursor: "pointer" }} onClick={() => navigate(`/admin/conference/details/${booking._id}`)}>
                    <div className="booking-info">
                      <h4>{booking.organizationName}</h4>
                      <p>{displayDate} • {dynamicDuration}</p>
                    </div>
                    <span className={`status-badge ${(booking.status || "pending").toLowerCase().replace(" ", "-")}`}>
                      {booking.status || "Pending"}
                    </span>
                  </div>
                )
              })}

              {upcomingBookings.length === 0 && (
                <div style={{ padding: "20px 0", color: "#aaa", fontSize: "0.95rem" }}>
                  No upcoming reservations matching this room.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="hall-sidebar">
          <div className="hall-card">
            <h3>Hall Details</h3>
            <div className="detail-row">
              <span className="value bold">{hallData._id}</span>
            </div>
            <div className="detail-row">
              <span className="value"><FaUsers /> {hallData.capacity || 0} Seats</span>
            </div>
            <div className="detail-row">
              <span className="value bold">{hallData.layout || "Standard Style"}</span>
            </div>
          </div>

          <div className="hall-card">
            <h3>Pricing</h3>
            <div className="price-block">
              <h2 className="price-main">PKR {Number(hallPriceLabel).toLocaleString()}/day</h2>
            </div>
            <div className="status-row">
              <span className={`status-pill ${(hallData.status || "available").toLowerCase()}`}>
                {hallData.status || "Available"}
              </span>
            </div>
          </div>

          <button
            type="button"
            className="btn-book-hall"
            onClick={() => navigate("/admin/conference/add")}
          >
            Book This Hall
          </button>
        </div>
      </div>
    </div>
  )
}

export default HallDetails