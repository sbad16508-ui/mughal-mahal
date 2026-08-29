import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { FaArrowLeft, FaEdit, FaTrashAlt, FaUsers } from "react-icons/fa"
import "./EventDetails.css"
import api from "../../api" // Connected your Axios instance

const EventDetails = () => {
  const navigate = useNavigate()
  const { id } = useParams()

  const [event, setEvent] = useState(null)
  const [banquetHalls, setBanquetHalls] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true)

        const hallsRes = await api.get("/banquets")
        setBanquetHalls(hallsRes.data)

        if (id) {
          const eventRes = await api.get(`/event/${id}`)
          setEvent(eventRes.data)
        }
      } catch (err) {
        console.error("Failed event data details:", err)
        alert("Error retrieving event records.")
      } finally {
        setLoading(false)
      }
    }

    fetchAllData()
  }, [id])

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to permanently delete this event record?")) {
      try {
        const res = await api.delete(`/event/${id}`)
        if (res.status === 200 || res.data.message === "Event Deleted") {
          navigate("/admin/banquet")
        } else {
          alert("Failed to remove event: " + (res.data.message || "Unknown error"))
        }
      } catch (err) {
        console.error("Event deletion attempt failed:", err)
        alert("Error processing deletion sequence request.")
      }
    }
  }

  if (loading) {
    return (
      <div style={{ padding: "40px", textAlign: "center", fontSize: "1.2rem", color: "#666" }}>
        Loading event information profiles...
      </div>
    )
  }

  if (!event) {
    return (
      <div style={{ padding: "40px", textAlign: "center", fontSize: "1.2rem", color: "#d32f2f" }}>
        Error: Event details not found.
      </div>
    )
  }

  const getHallName = () => {
    if (!event.banquetHall) return "Unspecified"

    const matchedHall = banquetHalls.find((h) => h._id === event.banquetHall)
    return matchedHall ? matchedHall.name : "Unknown Hall Space"
  }

  const calculatedTotal = Number(event.hallRental || 0) + Number(event.catering || 0) + Number(event.decoration || 0)
  const calculatedBalance = calculatedTotal - Number(event.paidAmount || 0)

  return (
    <div className="add-event-container">
      <div className="form-header-row">
        <button className="btn-back" type="button" onClick={() => navigate("/admin/banquet")}>
          <FaArrowLeft /> Back
        </button>
        <div className="header-title-text">
          <h1>Event Overview: {event.eventName}</h1>
          <p>Event ID: {event._id}</p>
        </div>
      </div>

      <div className="form-content-layout">
        <div className="form-left-sections">
          <div className="form-card">
            <h3>Event Information</h3>
            <div className="form-grid">
              <div className="form-group full-width">
                <div style={{ padding: "10px 0", fontSize: "1.05rem" }}>{event.eventName}</div>
              </div>
              <div className="form-group">
                <div style={{ padding: "10px 0", textTransform: "capitalize" }}>{event.eventType}</div>
              </div>
              <div className="form-group">
                <div style={{ padding: "10px 0", fontWeight: "600", color: "#bf9b30" }}>{getHallName()}</div>
              </div>
              <div className="form-group">
                <div style={{ padding: "10px 0" }}>{event.eventDate ? event.eventDate.split("T")[0] : "N/A"}</div>
              </div>
              <div className="form-group">
                <div style={{ padding: "10px 0" }}>{event.startTime || "N/A"}</div>
              </div>
              <div className="form-group">
                <div style={{ padding: "10px 0" }}>{event.endTime || "N/A"}</div>
              </div>
              <div className="form-group">
                <div style={{ padding: "10px 0" }}><FaUsers size={14} /> {event.expectedGuests || 0} Guests</div>
              </div>
            </div>
          </div>
          <div className="form-card">
            <h3>Contact Information</h3>
            <div className="form-grid">
              <div className="form-group full-width">
                <div style={{ padding: "10px 0", fontWeight: "bold" }}>{event.contactPerson}</div>
              </div>
              <div className="form-group">
                <div style={{ padding: "10px 0" }}>{event.email}</div>
              </div>
              <div className="form-group">
                <div style={{ padding: "10px 0" }}>{event.phone}</div>
              </div>
            </div>
          </div>
          <div className="form-card">
            <h3>Pricing Breakdown Parameters (PKR)</h3>
            <div className="form-grid">
              <div className="form-group">
                <div style={{ padding: "10px 0" }}>PKR {Number(event.hallRental || 0).toLocaleString()}</div>
              </div>
              <div className="form-group">
                <div style={{ padding: "10px 0" }}>PKR {Number(event.catering || 0).toLocaleString()}</div>
              </div>
              <div className="form-group">
                <div style={{ padding: "10px 0" }}>PKR {Number(event.decoration || 0).toLocaleString()}</div>
              </div>
              <div className="form-group">
                <div style={{ padding: "10px 0", color: "#2e7d32", fontWeight: "600" }}>
                  PKR {Number(event.paidAmount || 0).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
          <div className="form-card">
            <h3>Additional Details</h3>
            <div className="form-group full-width">
              <p style={{ background: "#fdfdfd", padding: "12px", borderRadius: "6px", border: "1px solid #eee", marginTop: "5px" }}>
                {event.specialRequests || "Nothing"}
              </p>
            </div>
            <div className="form-group full-width" style={{ marginTop: "15px" }}>
              <p style={{ background: "#fdfdfd", padding: "12px", borderRadius: "6px", border: "1px solid #eee", marginTop: "5px", color: "#c62828" }}>
                {event.internalNotes || "Nothing"}
              </p>
            </div>
          </div>
        </div>
        <div className="form-right-sidebar">
          <div className="form-card">
            <h3>Workflow Status</h3>
            <div style={{ padding: "10px 0" }}>
              <span className="status-select" style={{ display: "inline-block", textTransform: "uppercase", fontWeight: "bold", letterSpacing: "0.5px", fontSize: "0.9rem", textAlign: "center" }}>
                {event.status || "pending"}
              </span>
            </div>
          </div>
          <div className="form-card summary-card-ui" style={{ backgroundColor: "#fafafa" }}>
            <h3>Financial Summary</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "5px 0" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#666" }}>Gross Invoice:</span>
                <span style={{ fontWeight: "600" }}>${calculatedTotal.toLocaleString()}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#666" }}>Deposited:</span>
                <span style={{ fontWeight: "600", color: "#2e7d32" }}>-${Number(event.paidAmount || 0).toLocaleString()}</span>
              </div>
              <hr style={{ border: "0", borderTop: "1px dashed #ccc", margin: "5px 0" }} />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.1rem" }}>
                <span style={{ fontWeight: "bold" }}>Remaining Balance:</span>
                <span style={{ fontWeight: "bold", color: calculatedBalance > 0 ? "#d32f2f" : "#2e7d32" }}>
                  ${calculatedBalance.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <button
            className="btn-submit-gold"
            type="button"
            onClick={() => navigate(`/admin/event/edit/${event._id}`)}
            style={{ width: "100%", marginBottom: "10px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
          >
            <FaEdit /> Modify Event
          </button>

          <button
            className="btn-cancel-event"
            type="button"
            onClick={handleDelete}
            style={{ width: "100%", backgroundColor: "#d32f2f", color: "white", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
          >
            <FaTrashAlt /> Delete Event
          </button>
        </div>
      </div>
    </div>
  )
}

export default EventDetails