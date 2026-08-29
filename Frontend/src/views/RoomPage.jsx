import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import api from "../api"
import "./RoomPage.css"
import heroImage from "../assets/Mediacenter/room/a1.PNG"
import featureImage1 from "../assets/Mediacenter/room/by10.PNG"
import featureImage2 from "../assets/Mediacenter/room/by109.PNG"

const RoomPage = () => {
  const { slug } = useParams()
  const navigate = useNavigate()

  const roomTypeMap = {
    "deluxe-twin-room-2-people": "Deluxe Twin",
    "deluxe-king-room-2-people": "Deluxe King",
    "executive-room-2-people": "Executive Room",
    "executive-suite-2-people": "Executive Suite",
    "premier-suite-2-people": "Premier Suite",
  }

  const [backendRooms, setBackendRooms] = useState([])
  const [selectedRoomNo, setSelectedRoomNo] = useState("")
  const [loadingRooms, setLoadingRooms] = useState(true)
  const [roomFetchError, setRoomFetchError] = useState(false)

  const fallbackRoom = {
    title: slug ? slug.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase()) : "Room",
    topbar: ["King Bed", "City View", "Free Wifi", "2 People", "Rs: 16,000 + Tax / Night"],
    description: "Experience a premier room with comfortable amenities and a welcoming atmosphere.",
    details: Array.from({ length: 10 }, (_, index) => ({
      roomNo: `${101 + index}`,
      floor: "1",
      capacity: 2,
      price: 14000,
      bedType: "Twin",
      viewType: "City",
      status: "Available",
    })),
    amenities: ["Free Wi-Fi", "Flat-screen TV", "Mini Bar", "Work Desk", "Bathtub", "Prayer Mats", "Slippers", "Tea/Coffee"],
  }

  useEffect(() => {
    const loadRooms = async () => {
      setLoadingRooms(true)
      setRoomFetchError(false)
      try {
        const response = await api.get("/rooms")
        const rooms = Array.isArray(response.data) ? response.data : []
        const matchedType = roomTypeMap[slug]
        const filtered = matchedType
          ? rooms.filter((item) => item.roomType === matchedType)
          : []
        const availableRooms = filtered.filter((item) => String(item.status).toLowerCase() === 'available')
        const roomList = availableRooms.length ? availableRooms : filtered

        if (roomList.length) {
          setBackendRooms(roomList)
          setSelectedRoomNo((prev) => {
            const found = roomList.some((item) => item.roomNo === prev)
            return found ? prev : roomList[0].roomNo
          })
        } else {
          setBackendRooms([])
          setSelectedRoomNo("")
        }
      } catch (error) {
        setRoomFetchError(true)
        setBackendRooms([])
        setSelectedRoomNo("")
      } finally {
        setLoadingRooms(false)
      }
    }

    loadRooms()
  }, [slug])

  const selectedRoom = backendRooms.find((item) => item.roomNo === selectedRoomNo) || backendRooms[0] || null

  const displayRoom = selectedRoom || fallbackRoom
  const roomDetails = backendRooms.length ? backendRooms.map((item) => ({
    roomNo: item.roomNo,
    floor: item.floor,
    capacity: item.capacity,
    price: item.price,
    bedType: item.bedType,
    viewType: item.viewType,
    status: item.status,
  })) : fallbackRoom.details

  const isBooked = selectedRoom && String(selectedRoom.status).toLowerCase() !== "available"

  const topbar = selectedRoom
    ? [
        `${selectedRoom.bedType} Bed`,
        `${selectedRoom.viewType} View`,
        "Free Wifi",
        `${selectedRoom.capacity} People`,
        `Rs: ${selectedRoom.price} + Tax / Night`,
        isBooked ? selectedRoom.status : "Available",
      ]
    : fallbackRoom.topbar

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

  const displayAmenities = (() => {
    const normalized = normalizeAmenities(selectedRoom?.amenities)
    if (Array.isArray(normalized) && normalized.length > 0) {
      return normalized.map((item) => (typeof item === 'string' ? item : String(item?.name || item || '').trim())).filter(Boolean)
    }
    return fallbackRoom.amenities
  })()

  const displayDescription = selectedRoom?.description || fallbackRoom.description

  const displayTitle = selectedRoom
    ? `${selectedRoom.roomType} - ${selectedRoom.capacity} people`
    : fallbackRoom.title

  const displayTopbar = topbar

  const roomDetailsSource = roomDetails.length ? roomDetails : fallbackRoom.details

  const backendBase = api.defaults.baseURL ? api.defaults.baseURL.replace(/\/api\/?$/, '') : ''
  const imageList = selectedRoom?.images?.length > 0 ? selectedRoom.images : (displayRoom.images || [])

  const handleBookNow = () => {
    const navBtn = document.getElementById("bookNowButton")
    if (navBtn) {
      navBtn.click()
      return
    }
    if (!localStorage.getItem("bookingUser")) {
      alert("Please Login to Book")
      return
    }
    navigate("/book-now")
  }

  return (
    <div className="room-page-wrapper">
      <div className="room-page-topbar">
        {displayTopbar.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>

      <div className="room-page-content">
        <div className="room-page-image">
          <img src={heroImage} alt={displayTitle} />
        </div>

        <div className="room-page-copy">
          <p className="room-page-label">{displayTitle}</p>
          <h1>{displayTitle}</h1>
          <p>{displayDescription}</p>
          <div className="room-page-action-row">
            <button type="button" onClick={() => navigate("/rooms")}>Back to Rooms</button>
            <button type="button" className="book-btn" onClick={handleBookNow} disabled={isBooked}>
              {isBooked ? "Booked" : "Book Now"}
            </button>
          </div>
        </div>
      </div>

      <section className="room-details-section">
        <div className="room-details-table">
          <h2>{roomDetailsSource.length} Room Details</h2>
          <div className="room-details-dropdown">
            <label htmlFor="room-select">Choose a room</label>
            <select
              id="room-select"
              value={selectedRoomNo}
              onChange={(e) => setSelectedRoomNo(e.target.value)}
            >
              {roomDetailsSource.map((item) => (
                <option key={item.roomNo} value={item.roomNo}>
                  {item.roomNo} — {item.status}
                </option>
              ))}
            </select>
          </div>

          {selectedRoom ? (
            <div className="room-details-card">
              <div className="room-details-card-row">
                <span>Room No</span>
                <strong>{selectedRoom.roomNo}</strong>
              </div>
              <div className="room-details-card-row">
                <span>Floor</span>
                <strong>{selectedRoom.floor}</strong>
              </div>
              <div className="room-details-card-row">
                <span>Capacity</span>
                <strong>{selectedRoom.capacity}</strong>
              </div>
              <div className="room-details-card-row">
                <span>Price / Night</span>
                <strong>Rs. {selectedRoom.price}</strong>
              </div>
              <div className="room-details-card-row">
                <span>Bed Type</span>
                <strong>{selectedRoom.bedType}</strong>
              </div>
              <div className="room-details-card-row">
                <span>View</span>
                <strong>{selectedRoom.viewType}</strong>
              </div>
              <div className="room-details-card-row">
                <span>Status</span>
                <strong className={String(selectedRoom.status).toLowerCase() === "available" ? "status-available" : "status-booked"}>
                  {selectedRoom.status}
                </strong>
              </div>
            </div>
          ) : (
            <p>No rooms available.</p>
          )}
        </div>

        {/* Large room image block between room details and amenities */}
        {imageList && imageList.length > 0 ? (
          <div className="room-image-gallery">
            <div className="room-image-feature">
              <img
                src={`${backendBase}/uploads/rooms/${imageList[0]}`}
                alt={`${displayTitle} featured image`}
              />
            </div>

            {imageList.length > 1 ? (
              <div className="room-image-thumbs">
                {imageList.slice(1).map((img) => (
                  <img
                    key={img}
                    className="room-image-thumb"
                    src={`${backendBase}/uploads/rooms/${img}`}
                    alt={`${displayTitle} thumbnail`}
                  />
                ))}
              </div>
            ) : null}
          </div>
        ) : null}

        <div className="room-amenities-panel">
          <h2>Amenities</h2>
          <ul>
            {displayAmenities.map((amenity) => (
              <li key={amenity}>{amenity}</li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  )
}

export default RoomPage
