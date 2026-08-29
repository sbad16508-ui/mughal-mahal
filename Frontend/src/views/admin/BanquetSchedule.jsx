import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { FaArrowLeft, FaChevronLeft, FaChevronRight } from "react-icons/fa"
import "./BanquetSchedule.css"
import api from "../../api"

const BanquetSchedule = () => {
  const navigate = useNavigate()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentDate, setCurrentDate] = useState(new Date())

  useEffect(() => {
    const loadSchedules = async () => {
      try {
        setLoading(true)
        const res = await api.get("/events")
        setEvents(Array.isArray(res.data) ? res.data : res.data.events || [])
      } catch (err) {
        console.error("Failed fetching event grids:", err)
      } finally {
        setLoading(false)
      }
    }
    loadSchedules()
  }, [])

  const viewYear = currentDate.getFullYear()
  const viewMonth = currentDate.getMonth()

  const totalDaysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const startOffset = new Date(viewYear, viewMonth, 1).getDay()
  const gridCells = []

  for (let i = 0; i < startOffset; i++) {
    gridCells.push({ dayNumber: null, dayEvents: [] })
  }

  for (let day = 1; day <= totalDaysInMonth; day++) {
    const dayEvents = events.filter((e) => {
      if (!e.eventDate) return false
      const d = new Date(e.eventDate)
      return d.getDate() === day && d.getMonth() === viewMonth && d.getFullYear() === viewYear
    })
    gridCells.push({ dayNumber: day, dayEvents })
  }

  return (
    <div className="banquet-schedule-container">
      <main className="schedule-main-content">
        <div className="page-title-section">
          <button className="back-navigation-btn" onClick={() => navigate("/admin/banquet")}>
            <FaArrowLeft size={16} /> <span>Back</span>
          </button>
          <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
            <div>
              <h1 className="main-heading">Banquet Schedule</h1>
              <p className="sub-heading-date">{currentDate.toLocaleString("en-US", { month: "long", year: "numeric" })}</p>
            </div>
            <div>
              <button className="btn-secondary" onClick={() => setCurrentDate(new Date(viewYear, viewMonth - 1, 1))}><FaChevronLeft /></button>
              <button className="btn-secondary" onClick={() => setCurrentDate(new Date(viewYear, viewMonth + 1, 1))} style={{ marginLeft: "8px" }}><FaChevronRight /></button>
            </div>
          </div>
        </div>
        <section className="calendar-card-panel">
          <div className="weekdays-grid-header">
            <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
          </div>
          <div className="calendar-days-matrix">
            {gridCells.map((cell, idx) => (
              <div key={idx} className={`calendar-day-box ${cell.dayNumber === null ? "empty-offset-cell" : ""}`}>
                {cell.dayNumber && <span className="day-number-label">{cell.dayNumber}</span>}
                {cell.dayEvents.map((evt) => (
                  <div key={evt._id} className={`calendar-event-sticker ${evt.status === "confirmed" ? "gold-badge" : "pending-badge"}`} onClick={() => navigate(`/admin/event/details/${evt._id}`)}>
                    <p className="sticker-title-text">{evt.eventName}</p>
                    <p className="sticker-hall-text">{evt.banquetHall?.name || "Space Space"}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>
        <section className="upcoming-events-panel">
          <h2 className="section-subtitle-heading">Upcoming Events Schedule</h2>
          <div className="events-vertical-list">
            {events.map((evt) => (
              <div key={evt._id} className="event-row-card-item" onClick={() => navigate(`/admin/event/details/${evt._id}`)} style={{ cursor: "pointer" }}>
                <div className="event-meta-details">
                  <h3 className="event-main-title">{evt.eventName}</h3>
                  <p className="event-secondary-breadcrumbs">
                    {evt.banquetHall?.name || "Hall Venue"} • {evt.eventDate ? new Date(evt.eventDate).toLocaleDateString() : ""} • {evt.startTime || "00:00"}
                  </p>
                </div>
                <div className="event-badge-action-status">
                  <span className={`status-pill-badge ${evt.status === "confirmed" ? "gold-badge" : "pending-badge"}`}>{evt.status || "Pending"}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

export default BanquetSchedule