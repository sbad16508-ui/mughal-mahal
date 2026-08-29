import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { FaPlus, FaSearch, FaFilter, FaTrashAlt, FaUsers, FaCalendarAlt, FaSync, FaCheck, FaRegEdit } from "react-icons/fa"
import "./Banquet.css"
import api from "../../api"

const Banquet = () => {
  const navigate = useNavigate()

  const [halls, setHalls] = useState([])
  const [events, setEvents] = useState([])
  const [guestInquiries, setGuestInquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [refreshing, setRefreshing] = useState(false)
  const autoRefreshIntervalRef = useRef(null)

  const fetchDashboardData = async () => {
    try {
      setRefreshing(true)

      let hallsData = []
      let eventsData = []
      let banquetQueries = []

      try {
        const banquetQueriesRes = await api.get("/booking/banquet-bookings")
        banquetQueries = Array.isArray(banquetQueriesRes.data) ? banquetQueriesRes.data : []
      } catch (err) {
        console.error("Failed to load banquet inquiries:", err)
      }

      try {
        const hallsRes = await api.get("/banquets")
        hallsData = hallsRes.data || []
      } catch (err) {
        console.warn("Failed to load banquet halls:", err)
      }

      try {
        const eventsRes = await api.get("/events")
        eventsData = eventsRes.data || []
      } catch (err) {
        console.warn("Failed to load banquet events:", err)
      }

      setHalls(hallsData)
      setEvents(eventsData)
      setGuestInquiries(banquetQueries)
    } catch (err) {
      console.error("Unexpected error fetching banquet dashboard data:", err)
      setHalls([])
      setEvents([])
      setGuestInquiries([])
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()

    // Auto-refresh every 3 seconds when page is visible
    const startAutoRefresh = () => {
      autoRefreshIntervalRef.current = setInterval(() => {
        if (document.visibilityState === "visible") {
          fetchDashboardData()
        }
      }, 3000)
    }

    const stopAutoRefresh = () => {
      if (autoRefreshIntervalRef.current) {
        clearInterval(autoRefreshIntervalRef.current)
      }
    }

    startAutoRefresh()

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        startAutoRefresh()
        fetchDashboardData()
      } else {
        stopAutoRefresh()
      }
    }

    const handleFocus = () => {
      if (!autoRefreshIntervalRef.current) {
        startAutoRefresh()
      }
      fetchDashboardData()
    }

    window.addEventListener("focus", handleFocus)
    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      stopAutoRefresh()
      window.removeEventListener("focus", handleFocus)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [])

  const handleDeleteItem = async (itemOrId) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) return

    // If an ID string is provided, treat as event deletion
    if (typeof itemOrId === 'string') {
      const id = itemOrId
      try {
        await api.delete(`/events/${id}`)
        setEvents((prev) => prev.filter((event) => event._id !== id))
      } catch (err) {
        alert("Failed to delete event. Please try again.")
      }
      return
    }

    const item = itemOrId
    if (item.source === 'Inquiry') {
      setGuestInquiries((prev) => prev.filter((inquiry) => inquiry._id !== item._id))
      return
    }

    try {
      await api.delete(`/events/${item._id}`)
      setEvents((prev) => prev.filter((event) => event._id !== item._id))
    } catch (err) {
      alert("Failed to delete event. Please try again.")
    }
  }

  const handleToggleConfirm = async (item) => {
    const eventId = item._id
    const currentlyConfirmed = ((item.status || '').toLowerCase() === 'confirmed')
    const newStatus = currentlyConfirmed ? 'Pending' : 'Confirmed'

    // If this is an inquiry (no backend event), update inquiries locally and return
    if (item.source === 'Inquiry') {
      setGuestInquiries((prev) => prev.map((inq) => (inq._id === eventId ? { ...inq, status: newStatus } : inq)))
      return
    }

    // Optimistic UI update for real events
    setEvents((prev) => prev.map((ev) => (ev._id === eventId ? { ...ev, status: newStatus } : ev)))

    try {
      // Build full payload matching backend's Event schema to avoid partial-update issues
      const origEvent = events.find((ev) => ev._id === eventId) || item
      const payload = {
        eventName: origEvent.eventName || '',
        eventType: origEvent.eventType || '',
        banquetHall: typeof origEvent.banquetHall === 'object' && origEvent.banquetHall !== null ? (origEvent.banquetHall.name || '') : (origEvent.banquetHall || ''),
        eventDate: origEvent.eventDate || null,
        startTime: origEvent.startTime || '',
        endTime: origEvent.endTime || '',
        expectedGuests: origEvent.expectedGuests || 0,
        contactPerson: origEvent.contactPerson || '',
        email: origEvent.email || '',
        phone: origEvent.phone || '',
        hallRental: origEvent.hallRental || '',
        catering: origEvent.catering || '',
        decoration: origEvent.decoration || '',
        paidAmount: origEvent.paidAmount || 0,
        specialRequests: origEvent.specialRequests || '',
        internalNotes: origEvent.internalNotes || '',
        status: newStatus
      }

      await api.put(`/event/${eventId}`, payload)
    } catch (err) {
      // Revert on failure
      setEvents((prev) => prev.map((ev) => (ev._id === eventId ? { ...ev, status: currentlyConfirmed ? 'Confirmed' : 'Pending' } : ev)))
      console.error('Status update failed', err)
      const msg = err?.response?.data?.message || err?.message || 'Unknown error'
      alert(`Failed to update status: ${msg}`)
    }
  }

  const banquetInquiryEvents = guestInquiries.map((inquiry) => ({
    ...inquiry,
    banquetHall: {
      name: inquiry.venue ? `${inquiry.venue}${inquiry.subHall ? ` (${inquiry.subHall})` : ''}` : ''
    },
    contactPerson: inquiry.guestName,
    source: 'Inquiry'
  }))

  const combinedEvents = [...events, ...banquetInquiryEvents]
  const totalInquiries = guestInquiries.length

  const thisMonthInquiries = guestInquiries.filter((e) => {
    if (!e.eventDate) return false
    return new Date(e.eventDate).getMonth() === new Date().getMonth()
  }).length

  const totalRevenue = guestInquiries.reduce((sum, curr) => {
    return sum + Number(curr.price || 0)
  }, 0)

  const filteredEvents = combinedEvents.filter((event) => {
    const hallName = typeof event.banquetHall === "object" && event.banquetHall !== null
      ? (event.banquetHall.name || "")
      : ""
    const searchTarget = `${event._id} ${event.eventName || ""} ${event.contactPerson || ""} ${hallName}`.toLowerCase()

    const matchesSearch = searchTarget.includes(searchTerm.toLowerCase())
    const matchesFilter = statusFilter === "All" || event.status?.toLowerCase() === statusFilter.toLowerCase()

    return matchesSearch && matchesFilter
  })

  const handleFilterClick = () => {
    if (statusFilter === "All") setStatusFilter("Confirmed")
    else if (statusFilter === "Confirmed") setStatusFilter("Pending")
    else setStatusFilter("All")
  }

  if (loading) return <div style={{ padding: "100px", textAlign: "center" }}>Loading Banquet Data...</div>

  return (
    <div className="banquet-container">
      <div className="banquet-header">
        <div>
          <h1>Banquet Management</h1>
          <p>Manage banquet halls and events</p>
        </div>
        <div className="header-actions">
          <button 
            className="btn-secondary" 
            onClick={fetchDashboardData}
            disabled={refreshing}
            title="Refresh data"
            style={{ marginRight: "10px", display: "flex", alignItems: "center", gap: "5px" }}
          >
            <FaSync style={{ animation: refreshing ? "spin 1s linear infinite" : "none" }} />
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>

        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div className="banquet-stats-grid">
        <div className="b-stat-card"><span>Total Inquiries</span><h2>{totalInquiries}</h2></div>
        <div className="b-stat-card"><span>This Month Inquiries</span><h2>{thisMonthInquiries}</h2></div>
        <div className="b-stat-card"><span>Revenue Total</span><h2>Rs. {totalRevenue.toLocaleString()}</h2></div>
      </div>

      <h3 className="section-title">Banquet Halls</h3>
      <div className="halls-grid">
        {halls.map((hall) => (
          <div key={hall._id} className="hall-card">
            <div className="hall-image-placeholder">
              <FaUsers size={40} />
              <h4>{hall.name}</h4>
            </div>
            <div className="hall-content">
              <div className="hall-id-row">
                <span>ID: {hall._id.substring(hall._id.length - 4).toUpperCase()}</span>
                <span className={`status-pill ${(hall.status || "available").toLowerCase()}`}>{hall.status || "Available"}</span>
              </div>
              <p><strong>Capacity:</strong> {hall.capacity} guests</p>
              <h3 className="hall-price">PKR {hall.price}/day</h3>
              <div className="hall-actions">
                <button className="btn-view-schedule" onClick={() => navigate("/admin/banquet/schedule")}>
                  <FaCalendarAlt /> Schedule
                </button>
                <button className="btn-edit-icon" onClick={() => navigate(`/admin/banquet/edit/${hall._id}`)}><FaRegEdit /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="events-section">
        <div className="table-header">
          <h3>Banquet Guest Inquiries</h3>
        </div>
        <div className="table-responsive">
          <table className="events-table">
            <thead>
              <tr>
                <th>Event ID</th>
                <th>Guest Name</th>
                <th>Venue</th>
                <th>Sub Hall</th>
                <th>Event Date</th>
                <th>Time Slot</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {guestInquiries.map((inquiry) => (
                <tr key={inquiry._id}>
                  <td>{inquiry.eventId}</td>
                  <td>{inquiry.guestName}</td>
                  <td>{inquiry.venue}</td>
                  <td>{inquiry.subHall}</td>
                  <td>{inquiry.eventDate ? new Date(inquiry.eventDate).toLocaleDateString() : "—"}</td>
                  <td>{inquiry.timeSlot}</td>
                  <td>{inquiry.phone}</td>
                  <td><span className={`status-pill ${(inquiry.status || "pending").toLowerCase()}`}>{inquiry.status}</span></td>
                  <td>Rs. {inquiry.price?.toLocaleString() || "0"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="events-section">
        <div className="table-header">
          <h3>Upcoming Events</h3>
          <div className="header-tools">
            <div className="search-box-mini">
              <FaSearch />
              <input type="text" placeholder="Search events..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <button className="btn-filter" onClick={handleFilterClick}>
              <FaFilter /> Status: {statusFilter}
            </button>
          </div>
        </div>

        <div className="table-responsive">
          <table className="events-table">
            <thead>
              <tr>
                <th>Event ID</th>
                <th>Event Name</th>
                <th>Hall</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map((e) => (
                <tr key={e._id} onClick={() => navigate(`/admin/event/details/${e._id}`)} className="clickable-row" style={{ cursor: "pointer" }}>
                  <td>{e._id.substring(e._id.length - 6).toUpperCase()}</td>
                  <td className="bold-text">{e.eventName}</td>
                  <td>{e.banquetHall?.name || "Assigned Space"}</td>
                  <td>{e.eventDate ? new Date(e.eventDate).toLocaleDateString() : "N/A"}</td>
                  <td><span className={`status-pill ${(e.status || "pending").toLowerCase()}`}>{e.status}</span></td>
                  <td>
                    <div className="action-icons-group" onClick={(evt) => evt.stopPropagation()}>
                      <FaCheck
                        className="confirm-icon"
                        onClick={() => handleToggleConfirm(e)}
                        style={{ cursor: 'pointer', color: (e.status || '').toLowerCase() === 'confirmed' ? 'green' : '#bdbdbd', marginRight: '8px' }}
                        title={((e.status || '').toLowerCase() === 'confirmed') ? 'Confirmed — click to mark Pending' : 'Mark as Confirmed'}
                      />
                      <FaTrashAlt
                        className="action-icon-delete"
                        onClick={() => handleDeleteItem(e._id)}
                        style={{ cursor: "pointer", color: "#e74c3c" }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Banquet