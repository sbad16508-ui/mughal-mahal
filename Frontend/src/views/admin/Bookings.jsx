import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { FaSearch, FaCalendarAlt, FaPlus, FaEye, FaEdit, FaTimes } from "react-icons/fa"
import "./Bookings.css"
import api from "../../api"

const Bookings = () => {
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [loading, setLoading] = useState(true)

  
  const fetchBookings = async () => {
    try {
      setLoading(true)
      const res = await api.get("/bookings")
      const data = Array.isArray(res.data) ? res.data : res.data.bookings || []
      setBookings(data)
    } catch (err) {
      console.error("Error fetching bookings:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  
  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return
    try {
      // Direct integration with updateBooking controller endpoint 
      const current = bookings.find(b => b._id === id)
      if (!current) return

      const res = await api.put(`/booking/${id}`, {
        ...current,
        status: "cancelled"
      })

      if (res.data.message === "Booking Updated" || res.status === 200) {
        // Optimistically update status locally or re-fetch database
        setBookings(prev => prev.map(b => b._id === id ? { ...b, status: "cancelled" } : b))
      } else {
        alert("Failed to update status on server: " + res.data.message)
      }
    } catch (err) {
      console.error("Error processing cancel action:", err)
      alert("Error processing cancellation request.")
    }
  }

  
  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    const options = { year: 'numeric', month: 'short', day: 'numeric' }
    return new Date(dateString).toLocaleDateString('en-US', options)
  }

  
  const getCalculatedStats = () => {
    const todayStr = new Date().toISOString().split('T')[0]

    const total = bookings.length
    const pending = bookings.filter(b => b.status?.toLowerCase() === "pending").length

    const checkInsToday = bookings.filter(b => {
      const bDate = b.checkInDate ? b.checkInDate.split('T')[0] : ""
      return bDate === todayStr && b.status?.toLowerCase() !== "cancelled"
    }).length

    const checkOutsToday = bookings.filter(b => {
      const bDate = b.checkOutDate ? b.checkOutDate.split('T')[0] : ""
      return bDate === todayStr && b.status?.toLowerCase() !== "cancelled"
    }).length

    return [
      { label: "Total Bookings", value: total.toString() },
      { label: "Check-ins Today", value: checkInsToday.toString() },
      { label: "Check-outs Today", value: checkOutsToday.toString() },
      { label: "Pending Approval", value: pending.toString() }
    ]
  }

  const stats = getCalculatedStats()

  
  const filteredBookings = bookings.filter(b => {
    const searchTarget = `${b._id} ${b.guestName} ${b.roomVenue}`.toLowerCase()
    const matchesSearch = searchTarget.includes(searchTerm.toLowerCase())

    const matchesStatus = selectedStatus === "All" || b.status?.toLowerCase() === selectedStatus.toLowerCase()
    return matchesSearch && matchesStatus
  })

  return (
    <div className="bookings-mgmt-container">
      <div className="bookings-mgmt-header">
        <div className="header-info">
          <h1>Bookings Management</h1>
          <p>Manage all live operations and user reservations</p>
        </div>
        <button className="btn-new-booking" onClick={() => navigate("/admin/bookings/add")}>
          <FaPlus /> New Booking
        </button>
      </div>

      
      <div className="bookings-stats-row">
        {stats.map((s, i) => (
          <div key={i} className="b-stat-card">
            <span className="b-stat-label">{s.label}</span>
            <h2 className="b-stat-value">{s.value}</h2>
          </div>
        ))}
      </div>

      <div className="bookings-table-card">
        <div className="table-controls">
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by name, item, or database identifier..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="action-btns">
            <button className="btn-control"><FaCalendarAlt /> Date Range</button>
            <select
              className="btn-control"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              style={{ padding: "0 10px", height: "100%", cursor: "pointer", border: "1px solid #ccc", borderRadius: "4px" }}
            >
              <option value="All">All Status</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Pending">Pending</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="table-responsive">
          {loading ? (
            <div style={{ padding: "40px", textTransform: "uppercase", textAlign: "center", fontWeight: "bold", color: "#888" }}>
              Loading reservations data...
            </div>
          ) : (
            <table className="b-table">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Guest Name</th>
                  <th>Type</th>
                  <th>Room/Venue</th>
                  <th>Check-In</th>
                  <th>Check-Out</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Payment</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan="10" style={{ textAlign: "center", padding: "30px", color: "#999" }}>
                      No matching records discovered in the schema database.
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((b) => (
                    <tr key={b._id}>
                      <td className="bold-id" title={b._id}>
                        {b._id ? `${b._id.substring(b._id.length - 7).toUpperCase()}` : "N/A"}
                      </td>
                      <td>{b.guestName}</td>
                      <td>
                        <span className={`type-tag ${(b.bookingType || "room").toLowerCase()}`}>
                          {b.bookingType}
                        </span>
                      </td>
                      <td>{typeof b.roomVenue === 'object' && b.roomVenue !== null
                        ? (b.roomVenue.roomNo || b.roomVenue.name || b.roomVenue.title)
                        : (b.roomVenue || "Not Specified")}</td>
                      <td>{formatDate(b.checkInDate)}</td>
                      <td>{formatDate(b.checkOutDate)}</td>
                      <td className="bold-amt">${b.totalAmount ?? 0}</td>
                      <td>
                        <span className={`status-pill ${(b.status || "pending").toLowerCase()}`}>
                          {b.status}
                        </span>
                      </td>
                      <td>
                        <span className={`pay-pill ${(b.paymentStatus || "pending").toLowerCase()}`}>
                          {b.paymentStatus}
                        </span>
                      </td>
                      <td className="table-actions">
                        <FaEye
                          className="action-view"
                          onClick={() => navigate(`/admin/bookings/details/${b._id}`)}
                          style={{ cursor: "pointer" }}
                        />
                        <FaEdit
                          className="action-edit"
                          onClick={() => navigate(`/admin/bookings/edit/${b._id}`)}
                          style={{ cursor: "pointer" }}
                        />
                        {b.status?.toLowerCase() === "pending" && (
                          <FaTimes
                            className="action-cancel"
                            onClick={() => handleCancel(b._id)}
                            style={{ cursor: "pointer" }}
                          />
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

export default Bookings