import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { FaArrowLeft, FaEdit, FaRegTimesCircle, FaDollarSign, FaRegCalendarCheck } from "react-icons/fa"
import "./BookingDetails.css"
import api from "../../api"

const BookingDetails = () => {
  const navigate = useNavigate()
  const { id } = useParams()

  
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [internalNotes, setInternalNotes] = useState("")
  const [isEditingNotes, setIsEditingNotes] = useState(false)

  
  const fetchBookingDetails = async () => {
    try {
      setLoading(true)
      const res = await api.get(`/booking/${id}`)
      setBooking(res.data)
      setInternalNotes(res.data.internalNotes || "")
    } catch (err) {
      console.error("Error fetching booking profile from database:", err)
      alert("Could not load details for this booking resource.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      fetchBookingDetails()
    }
  }, [id])

  
  const updateBookingStatus = async (updatedFields) => {
    try {
      const res = await api.put(`/booking/${id}`, {
        ...booking,
        ...updatedFields
      })
      if (res.data.message === "Booking Updated" || res.status === 200) {
        setBooking(prev => ({ ...prev, ...updatedFields }))
        return true
      } else {
        alert("Server validation failed: " + res.data.message)
        return false
      }
    } catch (err) {
      console.error("Error executing operational workflow change:", err)
      alert("Network or database update error encountered.")
      return false
    }
  }

  
  const handleCancelBooking = () => {
    if (window.confirm("Are you sure you want to cancel this booking reservation?")) {
      updateBookingStatus({ status: "cancelled" })
    }
  }

  const handleProcessPayment = () => {
    updateBookingStatus({ paymentStatus: "paid", paidAmount: booking?.totalAmount || 0 })
  }

  const handleCheckIn = () => {
    updateBookingStatus({ status: "confirmed" }) // Maps directly to schema validation enum values
  }

  const handleSaveNotes = async () => {
    if (isEditingNotes) {
      const success = await updateBookingStatus({ internalNotes })
      if (success) setIsEditingNotes(false)
    } else {
      setIsEditingNotes(true)
    }
  }

  
  const calculateDurationAndRates = () => {
    if (!booking?.checkInDate || !booking?.checkOutDate) return { duration: 0, baseRate: 0 }

    const start = new Date(booking.checkInDate)
    const end = new Date(booking.checkOutDate)
    const diffTime = end.getTime() - start.getTime()
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    const duration = days > 0 ? days : 0

    
    const baseRate = duration > 0 ? Math.round((booking.totalAmount || 0) / duration) : booking.totalAmount || 0

    return { duration, baseRate }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  if (loading) {
    return <div style={{ padding: "100px 40px", textTransform: "uppercase", textAlign: "center", fontWeight: "bold", color: "#888" }}>Fetching active booking profile matrix...</div>
  }

  if (!booking) {
    return <div style={{ padding: "100px 40px", textAlign: "center", color: "#d9534f" }}>The requested booking record was not discovered within active data collections.</div>
  }

  const { duration, baseRate } = calculateDurationAndRates()
  const balanceRemaining = Math.max(0, (booking.totalAmount || 0) - (booking.paidAmount || 0))

  return (
    <div className="booking-page-container">
      <div className="booking-header">
        <div className="header-left">
          <button className="back-btn-ui" onClick={() => navigate("/admin/bookings")}>
            <FaArrowLeft /> Back
          </button>
          <div className="title-area">
            <h1>Booking #{booking._id?.substring(booking._id.length - 7).toUpperCase()}</h1>
            <p className="subtitle">{booking.guestName}</p>
          </div>
        </div>
        <div className="header-right">
          <button className="action-btn-white" onClick={() => navigate(`/admin/bookings/edit/${booking._id}`)}>
            <FaEdit /> Edit
          </button>
          {booking.status?.toLowerCase() !== "cancelled" && (
            <button className="action-btn-red" onClick={handleCancelBooking}>
              <FaRegTimesCircle /> Cancel Booking
            </button>
          )}
        </div>
      </div>

      <div className="booking-content-grid">
        <div className="info-column">

          
          <div className="detail-card">
            <h3 className="card-title">Booking Details</h3>
            <div className="data-grid-two-col">
              <div className="data-block">
                <span>Booking ID</span>
                <span className="value-bold" style={{ fontSize: "12px" }}>{booking._id}</span>
              </div>
              <div className="data-block">
                <span>Check-In</span>
                <span className="value-bold">{formatDate(booking.checkInDate)}</span>
              </div>
              <div className="data-block">
                <span>Check-Out</span>
                <span className="value-bold">{formatDate(booking.checkOutDate)}</span>
              </div>
              <div className="data-block">
                <span>Type</span>
                <div className="chip-container">
                  <span className={`purple-chip`}>
                    {booking.bookingType}
                  </span>
                </div>
              </div>
              <div className="data-block">
                <span>Room/Venue</span>
                <span className="value-bold">{booking.roomVenue.roomNo || booking.roomVenue.name || "None Allocated"}</span>
              </div>
              <div className="data-block">
                <span>Operational Duration</span>
                <span className="value-bold">
                  {duration} {booking.bookingType === "Room" ? "Nights" : "Days"}
                </span>
              </div>
            </div>
          </div>

          
          <div className="detail-card">
            <h3 className="card-title">Guest Information</h3>
            <div className="vertical-stack">
              <div className="data-block">
                <span>Full Name</span>
                <span className="value-bold">{booking.guestName}</span>
              </div>
              <div className="data-block">
                <span>Email Address</span>
                <span className="value-bold">{booking.email}</span>
              </div>
              <div className="data-block">
                <span>Contact Phone</span>
                <span className="value-bold">{booking.phone}</span>
              </div>
              {booking.address && (
                <div className="data-block">
                  <span>Physical Address</span>
                  <span className="value-bold">{booking.address}</span>
                </div>
              )}
              <div className="data-block">
                <span>Special Requests</span>
                <span className="value-bold">{booking.specialRequests || "No custom requests recorded."}</span>
              </div>
            </div>
          </div>

          
          <div className="detail-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 className="card-title">Internal Notes</h3>
              <button
                onClick={handleSaveNotes}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#007bff", fontWeight: "bold" }}
              >
                {isEditingNotes ? "Save Notes" : "Edit"}
              </button>
            </div>
            {isEditingNotes ? (
              <textarea
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc", marginTop: "10px", fontFamily: "inherit" }}
              />
            ) : (
              <p className="notes-para" style={{ fontStyle: internalNotes ? "normal" : "italic", color: internalNotes ? "inherit" : "#888" }}>
                {internalNotes || "No internal administrative remarks logged yet."}
              </p>
            )}
          </div>
        </div>

        
        <div className="sidebar-column">
          <div className="detail-card no-padding">
            <h3 className="card-title p-header">Status Metrics</h3>
            <div className="status-row">
              <span>Booking Status:</span>
              <span className={`pill-${(booking.status || "pending").toLowerCase()}`}>{booking.status}</span>
            </div>
            <div className="status-row">
              <span>Payment Status:</span>
              <span className={`pill-${(booking.paymentStatus || "pending").toLowerCase()}`}>{booking.paymentStatus}</span>
            </div>
          </div>

          <div className="detail-card no-padding mt-25">
            <h3 className="card-title p-header">Payment Details</h3>
            <div className="payment-body">
              <div className="pay-row">
                <span>Inferred Rate:</span>
                <strong>PKR {baseRate}/{booking.bookingType === "Room" ? "night" : "day"}</strong>
              </div>
              <div className="pay-row">
                <span>Duration Units:</span>
                <strong>{duration}</strong>
              </div>
              <hr className="divider-line" />
              <div className="pay-row total-row">
                <span>Total Amount:</span>
                <span>PKR {booking.totalAmount || 0}</span>
              </div>
              <div className="pay-row green-text">
                <span>Paid Amount:</span>
                <span>PKR {booking.paidAmount || 0}</span>
              </div>
              <div className="pay-row gold-text">
                <span>Balance Due:</span>
                <span>PKR {balanceRemaining}</span>
              </div>
              <hr className="divider-line" />
              <div className="pay-row">
                <span>Payment Method:</span>
                <p className="value-bold m-0" style={{ textTransform: "capitalize" }}>{booking.paymentMethod || "Unspecified"}</p>
              </div>
            </div>

            <div className="sidebar-actions">
              {booking.paymentStatus?.toLowerCase() !== "paid" && (
                <button className="btn-gold-fill" onClick={handleProcessPayment}>
                  <FaDollarSign /> Process Full Payment
                </button>
              )}
              {booking.status?.toLowerCase() === "pending" && (
                <button className="btn-white-outline" onClick={handleCheckIn}>
                  <FaRegCalendarCheck /> Confirm Reservation
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookingDetails