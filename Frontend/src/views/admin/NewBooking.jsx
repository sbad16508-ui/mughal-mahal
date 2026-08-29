import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { FaArrowLeft, FaSave } from "react-icons/fa"
import "./NewBooking.css"
import api from "../../api"

const NewBooking = () => {
  const navigate = useNavigate()

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

  useEffect(() => {
    const fetchVenues = async () => {
      if (!bookingType) {
        setVenues([])
        return
      }
      try {

        const endpoint = `/${bookingType.toLowerCase()}s`
        const res = await api.get(endpoint)

        const data = Array.isArray(res.data) ? res.data : res.data.rooms || res.data.data || []
        setVenues(data)
      } catch (err) {
        console.error("Error loading resources for type:", bookingType, err)
        setVenues([])
      }
    }

    setRoomVenue("")
    setSelectedVenuePrice(0)
    fetchVenues()
  }, [bookingType])

  useEffect(() => {
    if (!checkInDate || !checkOutDate) {
      setCalculatedDuration(0)
      setTotalAmount(0)
      return
    }

    const start = new Date(checkInDate)
    const end = new Date(checkOutDate)
    const timeDiff = end.getTime() - start.getTime()


    const totalDays = Math.ceil(timeDiff / (1000 * 3600 * 24))
    const finalDuration = totalDays > 0 ? totalDays : 0

    setCalculatedDuration(finalDuration)
    setTotalAmount(finalDuration * selectedVenuePrice)
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
      const res = await api.post("/booking", {
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
        status,
        duration: calculatedDuration
      })

      if (res.data.message === "Booking Created") {
        navigate("/admin/bookings")
      } else {
        alert("Error creating booking: " + (res.data.message || "Unknown error"))
      }
    } catch (err) {
      console.error(err)
      alert("Network or Server error processing this transaction request.")
    }
  }

  return (
    <div className="new-booking-container">
      <div className="new-booking-header">
        <button type="button" className="btn-back" onClick={() => navigate("/admin/bookings")}>
          <FaArrowLeft /> Back
        </button>
        <div className="header-text">
          <h1>New Booking</h1>
          <p>Create a new booking</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="booking-form-grid">
          <div className="form-left-col">


            <div className="form-card">
              <h3>Guest Information</h3>
              <div className="form-group full-width">
                <input
                  type="text"
                  placeholder="Guest Full Name *"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <input
                    type="email"
                    placeholder="Email Address *"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Phone Number *"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="form-group full-width">
                <input
                  type="text"
                  placeholder="Street Address, City, State"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
            </div>


            <div className="form-card">
              <h3>Booking Details</h3>
              <div className="form-row">
                <div className="form-group">
                  <select
                    value={bookingType}
                    onChange={(e) => setBookingType(e.target.value)}
                    required
                  >
                    <option value="">Select Booking Type *</option>
                    <option value="Room">Room</option>
                    <option value="Banquet">Banquet</option>
                    <option value="Conference">Conference</option>
                  </select>
                </div>
                <div className="form-group">
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

                        {v.roomNo || v.name || v.title || v._id} (${v.price || v.rate}/item)
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <input
                    type="date"
                    placeholder="Check-In Date *"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="date"
                    placeholder="Check-Out Date *"
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="form-group full-width">
                <textarea
                  placeholder="Special Requests (e.g., Late checkout, dietary setups, etc.)"
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                ></textarea>
              </div>
            </div>

            <div className="form-card">
              <h3>Payment Information</h3>
              <div className="form-row">
                <div className="form-group">
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    required
                  >
                    <option value="">Select Payment Method *</option>
                    <option value="cash">Cash</option>
                    <option value="card">Credit Card</option>
                  </select>
                </div>
                <div className="form-group">
                  <select
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value)}
                    required
                  >
                    <option value="">Select Payment Status *</option>
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <input
                    type="number"
                    placeholder="Total Amount ($) *"
                    value={totalAmount}
                    onChange={(e) => setTotalAmount(Number(e.target.value))}
                    required
                  />
                </div>
                <div className="form-group">
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
              <h3>Internal Notes</h3>
              <div className="form-group full-width">
                <textarea
                  placeholder="Add any internal administrative remarks about this booking..."
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                ></textarea>
              </div>
            </div>
          </div>

          <div className="form-right-col">
            <div className="form-card">
              <h3>Booking Status</h3>
              <div className="form-group full-width">
                <select
                  className="status-select-box"
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

            <div className="form-card summary-card">
              <h3>Summary</h3>
              <div className="summary-row">
                <span>Base Rate:</span>
                <strong>${selectedVenuePrice} / unit</strong>
              </div>
              <div className="summary-row">
                <span>
                  {bookingType === "room" ? "Number of Nights:" : "Number of Days:"}
                </span>
                <strong>{calculatedDuration}</strong>
              </div>
              <div className="summary-divider"></div>
              <div className="summary-row total-row">
                <span>Total:</span>
                <span className="gold-text">${totalAmount}</span>
              </div>
            </div>

            <button type="submit" className="btn-create-booking">
              <FaSave /> Create Booking
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default NewBooking