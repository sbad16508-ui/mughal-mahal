import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { FaArrowLeft, FaSave } from "react-icons/fa"
import "./AddConferenceBooking.css"
import api from "../../api"

const AddConferenceBooking = () => {
  const navigate = useNavigate()

  const [conferenceHalls, setConferenceHalls] = useState([])
  const [loadingHalls, setLoadingHalls] = useState(true)

  const [OrganizationName, setOrganizationName] = useState("")
  const [EventType, setEventType] = useState("")
  const [ConferenceHall, setConferenceHall] = useState("")
  const [DateVal, setDateVal] = useState("")
  const [StartTime, setStartTime] = useState("")
  const [EndTime, setEndTime] = useState("")
  const [ExpectedAttendees, setExpectedAttendees] = useState("")

  const [ContactPerson, setContactPerson] = useState("")
  const [Email, setEmail] = useState("")
  const [Phone, setPhone] = useState("")

  const [HallRental, setHallRental] = useState("")
  const [Equipment, setEquipment] = useState("")
  const [Catering, setCatering] = useState("")
  const [PaidAmount, setPaidAmount] = useState("")

  const [EquipmentRequirements, setEquipmentRequirements] = useState("")
  const [InternalNotes, setInternalNotes] = useState("")
  const [Status, setStatus] = useState("pending")

  useEffect(() => {
    const fetchHalls = async () => {
      try {
        setLoadingHalls(true)
        const res = await api.get("/conference/rooms")
        setConferenceHalls(res.data || [])
      } catch (err) {
        console.error("Error connecting structural conference hall assets:", err)
      } finally {
        setLoadingHalls(false)
      }
    }
    fetchHalls()
  }, [])

  const calculatedTotal = Number(HallRental || 0) + Number(Equipment || 0) + Number(Catering || 0)
  const calculatedBalance = calculatedTotal - Number(PaidAmount || 0)

  const handleHallSelectionChange = (e) => {
    const selectedId = e.target.value
    setConferenceHall(selectedId)

    const matchedHall = conferenceHalls.find(h => h._id === selectedId)
    if (matchedHall) {
      setHallRental(matchedHall.price || matchedHall.rate || "")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const bookingPayload = {
      organizationName: OrganizationName,
      eventType: EventType,
      conferenceHallId: ConferenceHall,
      eventDate: DateVal,
      startTime: StartTime,
      endTime: EndTime,
      expectedAttendees: Number(ExpectedAttendees),
      contactPerson: ContactPerson,
      email: Email,
      phone: Phone,
      pricingBreakdown: {
        hallRental: Number(HallRental || 0),
        equipment: Number(Equipment || 0),
        catering: Number(Catering || 0),
        totalAmount: calculatedTotal,
        paidAmount: Number(PaidAmount || 0),
        remainingBalance: calculatedBalance
      },
      requirements: EquipmentRequirements,
      internalNotes: InternalNotes,
      status: Status.toLowerCase()
    }

    try {
      const res = await api.post("/conference", bookingPayload)
      if (res.data.message === "Booking Created") {
        navigate('/admin/conference')
      } else {
        alert("Failed to register dynamic booking metadata: " + (res.data.message || "Unknown error"))
      }
    } catch (err) {
      console.error("Conference session persistence request error:", err)
      alert("Error parsing schema configuration criteria maps.")
    }
  }

  return (
    <div className="add-booking-container">
      <div className="add-booking-header">
        <button className="btn-back-sq" onClick={() => navigate('/admin/conference')}>
          <FaArrowLeft /> Back
        </button>
        <div className="header-text">
          <h1>Add New Booking</h1>
          <p>Create a new conference booking profile</p>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="add-booking-grid">
          <div className="form-main-content">
            <div className="form-card">
              <h3>Organization Details</h3>
              <div className="form-row">
                <div className="form-group full-width">
                  <input
                    type="text"
                    placeholder="Organization Name * (e.g., Tech Innovations Inc.)"
                    value={OrganizationName}
                    onChange={(e) => setOrganizationName(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <select
                    value={EventType}
                    onChange={(e) => setEventType(e.target.value)}
                    required
                  >
                    <option value="">Select Event Type *</option>
                    <option value="conference">Annual Conference</option>
                    <option value="seminar">Seminar</option>
                    <option value="workshop">Workshop</option>
                  </select>
                </div>
                <div className="form-group">
                  <select
                    value={ConferenceHall}
                    onChange={handleHallSelectionChange}
                    required
                    disabled={loadingHalls}
                  >
                    <option value="">{loadingHalls ? "Loading available structural halls..." : "Select Conference Hall *"}</option>
                    {conferenceHalls.map((hall) => (
                      <option key={hall._id} value={hall._id}>
                        {hall.name} ({hall.capacity || "N/A"} max capacity)
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <input
                    type="date"
                    value={DateVal}
                    onChange={(e) => setDateVal(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="time"
                    value={StartTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <input
                    type="time"
                    value={EndTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="number"
                    placeholder="Expected Attendees * (e.g., 450)"
                    value={ExpectedAttendees}
                    onChange={(e) => setExpectedAttendees(e.target.value)}
                    required
                    min="1"
                  />
                </div>
              </div>
            </div>


            <div className="form-card">
              <h3>Contact Information</h3>
              <div className="form-row">
                <div className="form-group full-width">
                  <input
                    type="text"
                    placeholder="Contact Person * (e.g., John Miller)"
                    value={ContactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <input
                    type="email"
                    placeholder="Email Address * (e.g., john@company.com)"
                    value={Email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Phone Number * (e.g., +1 (555) 234-5678)"
                    value={Phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>


            <div className="form-card">
              <h3>Pricing Parameters ($)</h3>
              <div className="form-row">
                <div className="form-group">
                  <input
                    type="number"
                    placeholder="Hall Rental Fee ($) * (e.g., 1500)"
                    value={HallRental}
                    onChange={(e) => setHallRental(e.target.value)}
                    required
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <input
                    type="number"
                    placeholder="Equipment Services Fee ($) (e.g., 500)"
                    value={Equipment}
                    onChange={(e) => setEquipment(e.target.value)}
                    min="0"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <input
                    type="number"
                    placeholder="Catering Services Fee ($) (e.g., 2000)"
                    value={Catering}
                    onChange={(e) => setCatering(e.target.value)}
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <input
                    type="number"
                    placeholder="Paid Deposit Amount ($) (e.g., 2000)"
                    value={PaidAmount}
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
                  placeholder="Equipment Requirements (Projector, sound system, active staging components...)"
                  value={EquipmentRequirements}
                  onChange={(e) => setEquipmentRequirements(e.target.value)}
                ></textarea>
              </div>
              <div className="form-group full-width" style={{ marginTop: "15px" }}>
                <textarea
                  placeholder="Internal Administrative Notes (Private compliance records...)"
                  value={InternalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                ></textarea>
              </div>
            </div>
          </div>

          <div className="form-sidebar">
            <div className="form-card">
              <h3>Booking Status</h3>
              <div className="form-group full-width">
                <select className="status-select" value={Status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="form-card" style={{ backgroundColor: "#fafafa", padding: "15px" }}>
              <h3>Financial Invoice</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.95rem", marginTop: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#555" }}>Gross Invoice:</span>
                  <span style={{ fontWeight: "600" }}>${calculatedTotal}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#555" }}>Deposited:</span>
                  <span style={{ fontWeight: "600", color: "#2e7d32" }}>-${PaidAmount || 0}</span>
                </div>
                <hr style={{ border: "0", borderTop: "1px dashed #ccc", margin: "4px 0" }} />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.05rem" }}>
                  <span style={{ fontWeight: "700" }}>Balance Remaining:</span>
                  <span style={{ fontWeight: "700", color: calculatedBalance > 0 ? "#d32f2f" : "#2e7d32" }}>
                    ${calculatedBalance}
                  </span>
                </div>
              </div>
            </div>
            <button className="btn-create-booking" type="submit">
              <FaSave /> Create Booking
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default AddConferenceBooking