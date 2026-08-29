import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { FaArrowLeft, FaRegEdit, FaTrashAlt, FaBed } from "react-icons/fa"
import api from "../../api"
import "./RoomDetails.css"

const RoomDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [roomData, setRoomData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const normalizeAmenities = (value) => {
    const isString = (input) => typeof input === 'string'
    const isObject = (input) => input && typeof input === 'object'

    const parseJsonString = (input) => {
      if (!isString(input)) return input
      const trimmed = input.trim()
      if (!trimmed) return []
      try {
        return JSON.parse(trimmed)
      } catch (e) {
        if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
          try {
            return JSON.parse(trimmed)
          } catch (_inner) {
            // fall through
          }
        }
        const firstIndex = trimmed.indexOf('[')
        if (firstIndex === -1) return input
        let depth = 0
        for (let i = firstIndex; i < trimmed.length; i += 1) {
          const char = trimmed[i]
          if (char === '[') depth += 1
          if (char === ']') {
            depth -= 1
            if (depth === 0) {
              const substring = trimmed.slice(firstIndex, i + 1)
              try {
                return JSON.parse(substring)
              } catch (_inner) {
                return input
              }
            }
          }
        }
        return input
      }
    }

    const cleanStringTokens = (items) => {
      const invalidTokens = new Set(['"', '\\', '[', ']', ',', '{', '}', "'", '`'])
      return items.flatMap((item) => {
        if (typeof item !== 'string') return []
        const trimmed = item.trim()
        if (!trimmed || invalidTokens.has(trimmed)) return []
        if (trimmed.includes(',')) {
          return trimmed.split(',').map((part) => part.trim()).filter(Boolean)
        }
        return [trimmed]
      })
    }

    const deepParse = (input) => {
      let current = input
      let attempts = 0
      while (isString(current) && attempts < 10) {
        const parsed = parseJsonString(current)
        if (parsed === current) break
        current = parsed
        attempts += 1
      }
      return current
    }

    const normalize = (item) => {
      const parsed = deepParse(item)
      if (Array.isArray(parsed)) {
        const elements = parsed.flatMap((entry) => {
          const normalizedEntry = normalize(entry)
          return Array.isArray(normalizedEntry) ? normalizedEntry : [normalizedEntry]
        })
        const cleaned = cleanStringTokens(elements)
        if (cleaned.length > 0 && cleaned.some((entry) => entry.length > 1)) {
          return cleaned
        }
        const candidate = elements.filter(isString).join('')
        const candidateParsed = deepParse(candidate)
        if (Array.isArray(candidateParsed)) {
          return normalize(candidateParsed)
        }
        return cleaned
      }
      if (isObject(parsed)) {
        return normalize(Object.values(parsed))
      }
      if (isString(parsed)) {
        return parsed.split(',').map((entry) => entry.trim()).filter(Boolean)
      }
      return []
    }

    return normalize(value)
  }

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        setLoading(true)
        const response = await api.get(`/room/${id}`)
        setRoomData({
          ...response.data,
          amenities: normalizeAmenities(response.data.amenities)
        })
        setLoading(false)
      } catch (err) {
        console.error("Error fetching room details:", err)
        setError("Could not load the room details.")
        setLoading(false)
      }
    }

    if (id) fetchRoomDetails()
  }, [id])

  
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to permanently delete this room?")) {
      try {
        await api.delete(`/room/${id}`)
        navigate("/admin/room") // Redirect back to list page upon deletion
      } catch (err) {
        alert("Failed to delete this room. Please try again.")
      }
    }
  }

  if (loading) return <div style={{ padding: "40px", textAlign: "center" }}>Loading room details...</div>
  if (error) return <div style={{ padding: "40px", color: "red", textAlign: "center" }}>{error}</div>
  if (!roomData) return <div style={{ padding: "40px", textAlign: "center" }}>No room data found.</div>

  return (
    <div className="details-page">
      <div className="header-nav">
        <div className="left-header">
          <button type="button" className="back-btn" onClick={() => navigate("/admin/room")}>
            <FaArrowLeft /> Back
          </button>
          <div className="title-text">
            <h1>Room {roomData.roomNo}</h1>
            <p>{roomData.roomType}</p>
          </div>
        </div>
        <div className="right-header">
          <button type="button" className="edit-btn" onClick={() => navigate(`/admin/room/edit/${roomData._id}`)}>
            <FaRegEdit /> Edit
          </button>
          <button type="button" className="delete-btn" onClick={handleDelete}>
            <FaTrashAlt /> Delete
          </button>
        </div>
      </div>

      <div className="details-layout">
        <div className="main-info">
          <div className="card shadow-sm">
            <div className="room-image-box">
              <FaBed className="bed-icon" />
              <span>{roomData.roomNo}</span>
            </div>
            <div className="description-section">
              <h3>Description</h3>
              <p>{roomData.description || "No description provided for this room."}</p>

              <h3>Amenities</h3>
              <div className="amenities-tags">
                {roomData.amenities && roomData.amenities.length > 0 ? (
                  roomData.amenities.map((item, index) => (
                    <div key={index} className="tag">
                      <span className="dot"></span> {item}
                    </div>
                  ))
                ) : (
                  <p style={{ color: "#888", fontSize: "14px" }}>No custom amenities configured.</p>
                )}
              </div>
            </div>
          </div>

          
          <div className="card shadow-sm mt-25">
            <h3>Maintenance History</h3>
            <div className="history-list">
              <div className="history-item">
                <div>
                  <p className="task-name">AC Servicing</p>
                  <p className="task-date">Recent check</p>
                </div>
                <span className="status-badge completed">Completed</span>
              </div>
            </div>
          </div>
        </div>

        <div className="side-info">
          <div className="card shadow-sm">
            <h3>Details</h3>
            <div className="info-row"><span>Room ID:</span> <strong>{roomData._id}</strong></div>
            <div className="info-row"><span>Floor:</span> <strong>{roomData.floor}</strong></div>
            <div className="info-row"><span>Size:</span> <strong>{roomData.size}</strong></div>
            <div className="info-row"><span>Bed Type:</span> <strong>{roomData.bedType}</strong></div>
            <div className="info-row"><span>View:</span> <strong>{roomData.viewType || "Standard View"}</strong></div>
            <div className="info-row"><span>Capacity:</span> <strong>{roomData.capacity} Guests</strong></div>
          </div>

          <div className="card shadow-sm mt-25">
            <h3>Pricing & Status</h3>
            <div className="price-section">
              <span className="label">Price:</span>
              <span className="price-tag">PKR {roomData.price}/night</span>
            </div>
            <div className="status-section">
              <span className="label">Status:</span>
              <span className={`status-tag ${roomData.status?.toLowerCase()}`}>{roomData.status}</span>
            </div>
            <div className="last-cleaned">
              <p>Database Tracking Status</p>
              <strong>Active Sync Enabled</strong>
            </div>
          </div>
          <button type="button" className="book-btn" onClick={() => navigate("/admin/bookings")}>Book This Room</button>
        </div>
      </div>
    </div>
  )
}

export default RoomDetails