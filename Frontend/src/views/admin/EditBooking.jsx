import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { FaArrowLeft, FaSave } from "react-icons/fa"
import "./EditBooking.css"
import api from "../../api"

const EditBooking = () => {
  const navigate = useNavigate()
  const { id } = useParams()

  // Main Form States
  const [guestName, setGuestName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [bookingType, setBookingType] = useState("")
  const [roomVenue, setRoomVenue] = useState("")
  const [checkInDate, setCheckInDate] = useState("")
  const [checkOutDate, setCheckOutDate] = useState("")
  const [specialRequests, setSpecialRequests] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")
  const [paymentStatus, setPaymentStatus] = useState("")
  const [totalAmount, setTotalAmount] = useState(0)
  const [paidAmount, setPaidAmount] = useState("")
  const [internalNotes, setInternalNotes] = useState("")
  const [status, setStatus] = useState("confirmed")

  
  const [venues, setVenues] = useState([])
  const [selectedVenuePrice, setSelectedVenuePrice] = useState(0)
  const [calculatedDuration, setCalculatedDuration] = useState(0)
  const [loading, setLoading] = useState(true)

  
  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        setLoading(true)
        const res = await api.get(`/booking/${id}`)
        const b = res.data

        if (b) {
          setGuestName(b.guestName || "")
          setEmail(b.email || "")
          setPhone(b.phone || "")
          setAddress(b.address || "")
          setBookingType(b.bookingType || "")
          setRoomVenue(b.roomVenue || "")
          setCheckInDate(b.checkInDate ? b.checkInDate.split("T")[0] : "")
          setCheckOutDate(b.checkOutDate ? b.checkOutDate.split("T")[0] : "")
          setSpecialRequests(b.specialRequests || "")
          setPaymentMethod(b.paymentMethod || "")
          setPaymentStatus(b.paymentStatus || "")
          setTotalAmount(b.totalAmount || 0)
          setPaidAmount(b.paidAmount || "")
          setInternalNotes(b.internalNotes || "")
          setStatus(b.status || "confirmed")
        }
      } catch (err) {
        console.error("Error retrieving target record payload:", err)
        alert("Failed to read booking data from the remote server database.")
      } finally {
        setLoading(false)
      }
    }
    if (id) fetchBookingData()
  }, [id])

  
  useEffect(() => {
    const fetchVenues = async () => {
      if (!bookingType) {
        setVenues([])
        return
      }
      try {
        const endpoint = bookingType === "room" ? "/rooms" : `/${bookingType}`
        const res = await api.get(endpoint)
        const data = Array.isArray(res.data) ? res.data : res.data.rooms || res.data.data || []
        setVenues(data)

        
        const match = data.find(v => (v._id === roomVenue || v.roomNo === roomVenue))
        if (match) {
          setSelectedVenuePrice(match.price || match.rate || 0)
        }
      } catch (err) {
        console.error("Error loading resources for active dynamic lists:", err)
      }
    }
    fetchVenues()
  }, [bookingType, roomVenue])

  
  useEffect(() => {
    if (!checkInDate || !checkOutDate) {
      setCalculatedDuration(0)
      return
    }

    const start = new Date(checkInDate)
    const end = new Date(checkOutDate)
    const timeDiff = end.getTime() - start.getTime()

    const totalDays = Math.ceil(timeDiff / (1000 * 3600 * 24))
    const finalDuration = totalDays > 0 ? totalDays : 0

    setCalculatedDuration(finalDuration)
    if (selectedVenuePrice > 0) {
      setTotalAmount(finalDuration * selectedVenuePrice)
    }
  }, [checkInDate, checkOutDate, selectedVenuePrice])

  const handleVenueChange = (e) => {
    const targetId = e.target.value
    setRoomVenue(targetId)

    const venueObject = venues.find(v => (v._id === targetId || v.roomNo === targetId))
    if (venueObject) {
      setSelectedVenuePrice(venueObject.price || venueObject.rate || 0)
    } else {
      setSelectedVenuePrice(0)
    }
  }

  
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await api.put(`/booking/${id}`, {
        guestName,
        email,
        phone,
        address,
        bookingType,
        roomVenue,
        checkInDate,
        checkOutDate,
        specialRequests,
        paymentMethod,
        paymentStatus,
        totalAmount,
        paidAmount,
        internalNotes,
        status
      })

      if (res.data.message === "Booking Updated" || res.status === 200) {
        navigate("/admin/bookings")
      } else {
        alert("Server failed to commit file updates: " + res.data.message)
      }
    } catch (err) {
      console.error("Database update exception handled:", err)
      alert("Network or database update error encountered.")
    }
  }

  if (loading) {
    return <div style={{ padding: "100px 40px", textTransform: "uppercase", textAlign: "center", fontWeight: "bold", color: "#888" }}>Syncing live configuration metadata parameters...</div>
  }

  return (
    <div className="edit-page-container">
      <div className="edit-header">
        <div className="header-left">
          <button className="back-btn-ui" onClick={() => navigate("/admin/bookings")}>
            <FaArrowLeft /> Back
          </button>
          <div className="title-area">
            <h1>Edit Booking ({id?.substring(id.length - 7).toUpperCase()})</h1>
            <p className="subtitle">Update booking information data maps</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="edit-grid-layout">
          <div className="form-column">

            
            <div className="form-card">
              <h3 className="card-title">Guest Information</h3>
              <div className="input-grid">
                <div className="input-group full-width">
                  <input
                    type="text"
                    placeholder="Guest Full Name *"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    required
                  />
                </div>
                <div className="input-group">
                  <input
                    type="email"
                    placeholder="Email Address *"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="input-group">
                  <input
                    type="text"
                    placeholder="Phone Number *"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
                <div className="input-group full-width">
                  <input
                    type="text"
                    placeholder="Street Address, City, State"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
              </div>
            </div>

            
            <div className="form-card">
              <h3 className="card-title">Booking Details</h3>
              <div className="input-grid">
                <div className="input-group">
                  <select
                    value={bookingType}
                    onChange={(e) => {
                      setBookingType(e.target.value)
                      setRoomVenue("")
                      setSelectedVenuePrice(0)
                    }}
                    required
                  >
                    <option value="">Select Booking Type *</option>
                    <option value="room">Room</option>
                    <option value="banquet">Banquet</option>
                    <option value="conference">Conference</option>
                  </select>
                </div>
                <div className="input-group">
                  <select
                    value={roomVenue}
                    onChange={handleVenueChange}
                    disabled={!bookingType}
                    required
                  >
                    <option value="">
                      {!bookingType
                        ? "Select Booking Type First *"
                        : `Select ${bookingType.charAt(0).toUpperCase() + bookingType.slice(1)} *`}
                    </option>
                    {venues.map((v) => (
                      <option key={v._id} value={v._id}>
                        {v.roomNo || v.name || v.title || v._id} (${v.price || v.rate}/unit)
                      </option>
                    ))}
                  </select>
                </div>
                <div className="input-group">
                  <input
                    type="date"
                    placeholder="Check-In Date *"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    required
                  />
                </div>
                <div className="input-group">
                  <input
                    type="date"
                    placeholder="Check-Out Date *"
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    required
                  />
                </div>
                <div className="input-group full-width">
                  <textarea
                    placeholder="Special Requests (e.g., Late checkout, specific menu requirements, etc.)"
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                  ></textarea>
                </div>
              </div>
            </div>

           
            <div className="form-card">
              <h3 className="card-title">Payment Information</h3>
              <div className="input-grid">
                <div className="input-group">
                  <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} required>
                    <option value="">Select Payment Method *</option>
                    <option value="cash">Cash</option>
                    <option value="card">Credit Card</option>
                  </select>
                </div>
                <div className="input-group">
                  <select value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)} required>
                    <option value="">Select Payment Status *</option>
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
                <div className="input-group">
                  <input
                    type="number"
                    placeholder="Total Amount ($) *"
                    value={totalAmount}
                    onChange={(e) => setTotalAmount(Number(e.target.value))}
                    required
                  />
                </div>
                <div className="input-group">
                  <input
                    type="number"
                    placeholder="Paid Amount ($)"
                    value={paidAmount}
                    onChange={(e) => setPaidAmount(e.target.value)}
                  />
                </div>
              </div>
            </div>

           
            <div className="form-card">
              <h3 className="card-title">Internal Notes</h3>
              <textarea
                className="notes-area"
                placeholder="Add any internal administrative remarks about this booking..."
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
              ></textarea>
            </div>
          </div>

          <div className="sidebar-column">
            
            <div className="summary-card">
              <h3 className="card-title p-header">Booking Status</h3>
              <div className="sidebar-body">
                <select
                  className="status-select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  required
                >
                  <option value="confirmed">Confirmed</option>
                  <option value="pending">Pending</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            
            <div className="summary-card mt-25">
              <h3 className="card-title p-header">Summary</h3>
              <div className="sidebar-body">
                <div className="sum-row">
                  <span>Base Rate:</span>
                  <strong>${selectedVenuePrice}</strong>
                </div>
                <div className="sum-row">
                  <span>{bookingType === "room" ? "Nights:" : "Days:"}</span>
                  <strong>{calculatedDuration}</strong>
                </div>
                <div className="sum-row total-gold">
                  <span>Total:</span>
                  <strong>${totalAmount}</strong>
                </div>
              </div>
            </div>

            
            <div className="sidebar-actions">
              <button type="submit" className="gold-btn-full">
                <FaSave /> Update Booking
              </button>
              <button type="button" className="cancel-btn-outline" onClick={() => navigate("/admin/bookings")}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default EditBooking