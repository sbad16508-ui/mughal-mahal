import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { FaArrowLeft, FaSave } from "react-icons/fa"
import "./EventEdit.css"
import api from "../../api"

const EventEdit = () => {
  const navigate = useNavigate()
  const { id } = useParams()

  const [banquetHalls, setBanquetHalls] = useState([])
  const [loadingAssets, setLoadingAssets] = useState(true)
  const [loadingData, setLoadingData] = useState(true)

  const [eventName, setEventName] = useState("")
  const [eventType, setEventType] = useState("")
  const [banquetHall, setBanquetHall] = useState("")
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
        const res = await api.get("/banquets")
        setBanquetHalls(res.data)
      } catch (err) {
        console.error("Failed downloading banquet halls list:", err)
      } finally {
        setLoadingAssets(false)
      }
    }
    loadBanquets()
  }, [])

  useEffect(() => {
    const fetchEventDetails = async () => {
      if (!id) return
      try {
        setLoadingData(true)
        const res = await api.get(`/event/${id}`)
        const data = res.data

        if (data) {
          setEventName(data.eventName || "")
          setEventType(data.eventType || "")
          setBanquetHall(data.banquetHall?._id || data.banquetHall || "")
          setEventDate(data.eventDate ? data.eventDate.split("T")[0] : "")
          setStartTime(data.startTime || "")
          setEndTime(data.endTime || "")
          setExpectedGuests(data.expectedGuests || "")
          setContactPerson(data.contactPerson || "")
          setEmail(data.email || "")
          setPhone(data.phone || "")
          setHallRental(data.hallRental || "")
          setCatering(data.catering || "")
          setDecoration(data.decoration || "")
          setPaidAmount(data.paidAmount || "")
          setSpecialRequests(data.specialRequests || "")
          setInternalNotes(data.internalNotes || "")
          setStatus(data.status || "pending")
        }
      } catch (err) {
        console.error("Failed retrieving event record data details:", err)
        alert("Error loading this event.")
      } finally {
        setLoadingData(false)
      }
    }

    if (!loadingAssets) {
      fetchEventDetails()
    }
  }, [id, loadingAssets])

  const calculatedTotal = Number(hallRental || 0) + Number(catering || 0) + Number(decoration || 0)
  const calculatedBalance = calculatedTotal - Number(paidAmount || 0)

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
      const res = await api.put(`/event/${id}`, eventPayload)
      if (res.status === 200 || res.data.message === "Event Updated") {
        navigate("/admin/banquet") // Redirects back smoothly to master dashboard panel space
      } else {
        alert("Failed to update event: " + (res.data.message || "Unknown error occurred"))
      }
    } catch (err) {
      console.error("Event mutation network execution string failed:", err)
      alert("Error saving record. Please review configuration inputs.")
    }
  }

  if (loadingData || loadingAssets) {
    return (
      <div style={{ padding: "40px", textAlign: "center", fontSize: "1.2rem", color: "#666" }}>
        Loading configuration details profiles...
      </div>
    )
  }

  return (
    <div className="edit-event-container">
      <div className="edit-header">
        <button type="button" className="back-btn" onClick={() => navigate("/admin/banquet")}>
          <FaArrowLeft /> Back
        </button>
        <div className="header-text">
          <h2>Edit Event</h2>
          <p>Update system records for the banquet event</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="edit-grid">
        <div className="form-main">
          <div className="form-card">
            <h3>Event Information</h3>
            <div className="input-row">
              <div className="input-group full">
                <input
                  type="text"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="input-row">
              <div className="input-group">
                <select value={eventType} onChange={(e) => setEventType(e.target.value)} required>
                  <option value="">Select Event Type</option>
                  <option value="wedding">Wedding</option>
                  <option value="corporate">Corporate</option>
                  <option value="birthday">Birthday Celebration</option>
                  <option value="social">Social Gathering</option>
                </select>
              </div>
              <div className="input-group">
                <select value={banquetHall} onChange={handleHallChange} required>
                  <option value="">Select Banquet Hall</option>
                  {banquetHalls.map((hall) => (
                    <option key={hall._id} value={hall._id}>
                      {hall.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="input-row">
              <div className="input-group">
                <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} required />
              </div>
              <div className="input-group">
                <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
              </div>
            </div>
            <div className="input-row">
              <div className="input-group">
                <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
              </div>
              <div className="input-group">
                <input type="number" value={expectedGuests} onChange={(e) => setExpectedGuests(e.target.value)} min="1" required />
              </div>
            </div>
          </div>
          <div className="form-card">
            <h3>Contact Information</h3>
            <div className="input-row">
              <div className="input-group full">
                <input type="text" value={contactPerson} onChange={(e) => setContactPerson(e.target.value)} required />
              </div>
            </div>
            <div className="input-row">
              <div className="input-group">
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="input-group">
                <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} required />
              </div>
            </div>
          </div>
          <div className="form-card">
            <h3>Pricing Parameters ($)</h3>
            <div className="input-row">
              <div className="input-group">
                <input type="number" value={hallRental} onChange={(e) => setHallRental(e.target.value)} min="0" required />
              </div>
              <div className="input-group">
                <input type="number" value={catering} onChange={(e) => setCatering(e.target.value)} min="0" />
              </div>
            </div>
            <div className="input-row">
              <div className="input-group">
                <input type="number" value={decoration} onChange={(e) => setDecoration(e.target.value)} min="0" />
              </div>
              <div className="input-group">
                <input type="number" value={paidAmount} onChange={(e) => setPaidAmount(e.target.value)} min="0" />
              </div>
            </div>
          </div>
          <div className="form-card">
            <h3>Additional Details</h3>
            <div className="input-group full">
              <textarea value={specialRequests} placeholder="Theme, menu preferences..." onChange={(e) => setSpecialRequests(e.target.value)}></textarea>
            </div>
            <div className="input-group full" style={{ marginTop: '15px' }}>
              <textarea value={internalNotes} placeholder="Add administrative notes..." onChange={(e) => setInternalNotes(e.target.value)}></textarea>
            </div>
          </div>
        </div>
        <div className="form-sidebar">
          <div className="form-card">
            <h3>Workflow Status</h3>
            <div className="input-group full">
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          <div className="form-card" style={{ backgroundColor: "#fafafa" }}>
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
          <button type="submit" className="btn-update-event"><FaSave /> Update Event</button>
        </div>
      </form>
    </div>
  )
}

export default EventEdit