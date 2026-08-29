import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { FaArrowLeft, FaSave } from "react-icons/fa"
import "./AddEvent.css"
import api from "../../api" // Connected your Axios instance

const AddEvent = () => {
  const navigate = useNavigate()

  
  const [banquetHalls, setBanquetHalls] = useState([])
  const [loadingAssets, setLoadingAssets] = useState(true)

  
  const [eventName, setEventName] = useState("")
  const [eventType, setEventType] = useState("")
  const [banquetHall, setBanquetHall] = useState("") // Holds selected Hall ID
  const [eventDate, setEventDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [expectedGuests, setExpectedGuests] = useState("")

  
  const [contactPerson, setContactPerson] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")

  
  const [hallRental, setHallRental] = useState("")
  const [catering, setCatering] = useState("")
  const [decoration, setDecoration] = useState("")
  const [paidAmount, setPaidAmount] = useState("")

  const [specialRequests, setSpecialRequests] = useState("")
  const [internalNotes, setInternalNotes] = useState("")
  const [status, setStatus] = useState("pending")

  
  useEffect(() => {
    const loadBanquets = async () => {
      try {
        setLoadingAssets(true)
        const res = await api.get("/banquets")
        setBanquetHalls(res.data)
      } catch (err) {
        console.error("Failed downloading banquet halls:", err)
      } finally {
        setLoadingAssets(false)
      }
    }
    loadBanquets()
  }, [])

  // Automated Pricing Calculator Logic
  const calculatedTotal = Number(hallRental || 0) + Number(catering || 0) + Number(decoration || 0)
  const calculatedBalance = calculatedTotal - Number(paidAmount || 0)

  // Pre-fill base asset pricing when a hall is selected
  const handleHallChange = (e) => {
    const selectedId = e.target.value
    setBanquetHall(selectedId)

    const matchedAsset = banquetHalls.find(h => h._id === selectedId)
    if (matchedAsset) {
      setHallRental(matchedAsset.price || matchedAsset.rate || "")
    }
  }

  
  const handleSubmit = async (e) => {
    e.preventDefault()

    const eventPayload = {
      eventName,
      eventType,
      banquetHall, 
      eventDate,
      startTime,
      endTime,
      expectedGuests: Number(expectedGuests),
      contactPerson,
      email,
      phone,
      hallRental: Number(hallRental || 0),
      catering: Number(catering || 0),
      decoration: Number(decoration || 0),
      paidAmount: Number(paidAmount || 0),
      totalAmount: calculatedTotal,
      specialRequests,
      internalNotes,
      status: status.toLowerCase()
    }

    try {
      const res = await api.post("/event", eventPayload) // Targeted events endpoint explicitly
      if (res.data.message == "Event Created") {
        navigate("/admin/banquet") // Redirects back to main Banquet space dashboard
      } else {
        alert("Failed to submit event: " + (res.data.message || "Unknown error"))
      }
    } catch (err) {
      console.error("Event creation request failed:", err)
      alert("Error saving event. Please check required fields.")
    }
  }

  return (
    <div className="add-event-container">
      <div className="form-header-row">
        <button className="btn-back" type="button" onClick={() => navigate("/admin/banquet")}>
          <FaArrowLeft /> Back
        </button>
        <div className="header-title-text">
          <h1>Add New Event</h1>
          <p>Create a new banquet event record</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-content-layout">
          <div className="form-left-sections">

           
            <div className="form-card">
              <h3>Event Information</h3>
              <div className="form-grid">
                <div className="form-group full-width">
                  <input
                    type="text"
                    placeholder="Event Name *"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    required
                  >
                    <option value="">Select Event Type *</option>
                    <option value="wedding">Wedding</option>
                    <option value="corporate">Corporate</option>
                    <option value="birthday">Birthday Celebration</option>
                    <option value="social">Social Gathering</option>
                  </select>
                </div>
                <div className="form-group">
                  <select
                    value={banquetHall}
                    onChange={handleHallChange}
                    required
                    disabled={loadingAssets}
                  >
                    <option value="">{loadingAssets ? "Loading available spaces..." : "Select Banquet Hall *"}</option>
                    {banquetHalls.map((hall) => (
                      <option key={hall._id} value={hall._id}>
                        {hall.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="number"
                    placeholder="Expected Guests *"
                    value={expectedGuests}
                    onChange={(e) => setExpectedGuests(e.target.value)}
                    required
                    min="1"
                  />
                </div>
              </div>
            </div>

            
            <div className="form-card">
              <h3>Contact Information</h3>
              <div className="form-grid">
                <div className="form-group full-width">
                  <input
                    type="text"
                    placeholder="Contact Person / Client Name *"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    required
                  />
                </div>
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
            </div>

            
            <div className="form-card">
              <h3>Pricing Parameters ($)</h3>
              <div className="form-grid">
                <div className="form-group">
                  <input
                    type="number"
                    placeholder="Hall Rental Fee ($) *"
                    value={hallRental}
                    onChange={(e) => setHallRental(e.target.value)}
                    required
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <input
                    type="number"
                    placeholder="Catering Services Fee ($)"
                    value={catering}
                    onChange={(e) => setCatering(e.target.value)}
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <input
                    type="number"
                    placeholder="Decoration Services Fee ($)"
                    value={decoration}
                    onChange={(e) => setDecoration(e.target.value)}
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <input
                    type="number"
                    placeholder="Paid Deposit Amount ($)"
                    value={paidAmount}
                    onChange={(e) => setPaidAmount(e.target.value)}
                    min="0"
                  />
                </div>
              </div>
            </div>

            
            <div className="form-card">
              <h3>Additional Details</h3>
              <div className="form-group full-width">
                <textarea
                  placeholder="Special Requests (Theme colors, staging layouts...)"
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                ></textarea>
              </div>
              <div className="form-group full-width" style={{ marginTop: "15px" }}>
                <textarea
                  placeholder="Internal Administrative Notes (Private records...)"
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                ></textarea>
              </div>
            </div>
          </div>

         
          <div className="form-right-sidebar">
            <div className="form-card">
              <h3>Workflow Status</h3>
              <div className="form-group">
                <select className="status-select" value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                </select>
              </div>
            </div>

            
            <div className="form-card summary-card-ui" style={{ backgroundColor: "#fafafa" }}>
              <h3>Financial Summary</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "5px 0" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#666" }}>Gross Invoice:</span>
                  <span style={{ fontWeight: "600" }}>${calculatedTotal}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#666" }}>Deposited:</span>
                  <span style={{ fontWeight: "600", color: "#2e7d32" }}>-${paidAmount || 0}</span>
                </div>
                <hr style={{ border: "0", borderTop: "1px dashed #ccc", margin: "5px 0" }} />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.1rem" }}>
                  <span style={{ fontWeight: "bold" }}>Remaining Balance:</span>
                  <span style={{ fontWeight: "bold", color: calculatedBalance > 0 ? "#d32f2f" : "#2e7d32" }}>
                    ${calculatedBalance}
                  </span>
                </div>
              </div>
            </div>

            <button className="btn-submit-gold" type="submit"><FaSave /> Create Event</button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default AddEvent