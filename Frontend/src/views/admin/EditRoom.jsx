import { useState, useEffect, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { FaArrowLeft, FaRegCopy } from "react-icons/fa"
import "./AddRoom.css"
import api from "../../api"

const EditRoom = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [roomNo, setRoomNo] = useState("")
  const [roomType, setRoomType] = useState("")
  const [status, setStatus] = useState("")
  const [floor, setFloor] = useState("")
  const [size, setSize] = useState("")
  const [capacity, setCapacity] = useState("")
  const [price, setPrice] = useState("")
  const [bedType, setBedType] = useState("")
  const [viewType, setViewType] = useState("")
  const [description, setDescription] = useState("")
  const [amenities, setAmenities] = useState([])
  const [imageFile, setImageFile] = useState(null)
  const [roomImages, setRoomImages] = useState([])
  const availableAmenities = [
    "WiFi", "TV", "AC", "Mini Bar", "Kitchen", "Balcony",
    "Safe", "Coffee Maker", "Hair Dryer", "Iron", "Room Service", "Desk"
  ]
  const handleAmenityClick = (amenity) => {
    if (amenities.includes(amenity)) {
      setAmenities(amenities.filter((item) => item !== amenity))
    } else {
      setAmenities([...amenities, amenity])
    }
  }

  const handleFileChange = (e) => {
    const f = e.target.files && e.target.files[0]
    if (f) setImageFile(f)
    else setImageFile(null)
  }
  const fileInputRef = useRef(null)
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
        const response = await api.get(`/room/${id}`)
        setRoomNo(response.data.roomNo)
        setRoomType(response.data.roomType)
        setFloor(response.data.floor)
        setSize(response.data.size)
        setCapacity(response.data.capacity)
        setPrice(response.data.price)
        setBedType(response.data.bedType)
        setViewType(response.data.viewType)
        setDescription(response.data.description)
        setAmenities(normalizeAmenities(response.data.amenities))
        setStatus(response.data.status)
        setRoomImages(response.data.images || [])
      } catch (err) {
        console.error("Error fetching room details:", err)
      }
    }

    if (id) fetchRoomDetails()
  }, [id])
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      // Use FormData for file upload
      const formData = new FormData()
      formData.append('roomNo', roomNo)
      formData.append('roomType', roomType)
      formData.append('floor', floor)
      formData.append('size', size)
      formData.append('capacity', capacity)
      formData.append('price', price)
      formData.append('bedType', bedType)
      formData.append('viewType', viewType)
      formData.append('description', description)
      formData.append('status', status)
      // amenities as JSON string
      formData.append('amenities', JSON.stringify(amenities || []))
      if (imageFile) formData.append('image', imageFile)

      const res = await api.put(`/room/${id}`, formData)

      if (res.data?.message === 'Room Updated') {
        navigate('/admin/room')
      } else {
        alert(`Error updating room: ${res.data?.message || 'Unknown response'}`)
      }
    } catch (err) {
      console.error('Room update failed:', err)
      alert(`Update failed: ${err.response?.data?.message || err.message || 'Unable to update room'}`)
    }
  }
  return (
    <div className="add-room-page">
      <div className="top-section">
        <button className="back-btn" type="button" onClick={() => navigate("/admin/room")}>
          <FaArrowLeft /> Back
        </button>
        <div className="title-area">
          <h1>Edit Room</h1>
          <p>Update room information</p>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="room-layout">
          <div className="left-side">
            <div className="card-box">
              <h2>Basic Information</h2>
              <div className="form-grid">
                <div className="form-group">
                  <input type="text" value={roomNo} placeholder="Room Number" onChange={(e) => setRoomNo(e.target.value)} required />
                </div>
                <div className="form-group">
                  <input type="text" value={roomType} placeholder="Room Type" onChange={(e) => setRoomType(e.target.value)} required />
                </div>
                <div className="form-group">
                  <input type="text" value={floor} placeholder="Floor" onChange={(e) => setFloor(e.target.value)} required />
                </div>
                <div className="form-group">
                  <input type="text" value={size} placeholder="Size (sq ft)" onChange={(e) => setSize(e.target.value)} required />
                </div>
                <div className="form-group">
                  <input type="text" value={capacity} placeholder="Capacity (Guests)" className="filled-input" onChange={(e) => setCapacity(e.target.value)} required />
                </div>
                <div className="form-group">
                  <input type="text" value={price} placeholder="Price per Night ($)" className="filled-input" onChange={(e) => setPrice(e.target.value)} required />
                </div>
                <div className="form-group">
                  <input type="text" value={bedType} placeholder="Bed Type" onChange={(e) => setBedType(e.target.value)} required />
                </div>
                <div className="form-group">
                  <input type="text" value={viewType} placeholder="View Type" onChange={(e) => setViewType(e.target.value)} />
                </div>
              </div>
              <div className="form-group full-width">
                <textarea className="filled-input" value={description} placeholder="Description" onChange={(e) => setDescription(e.target.value)}></textarea>
              </div>
            </div>
            <div className="card-box mt-4">
              <h2>Amenities</h2>
              <div className="amenities-grid">
                {availableAmenities.map((amenity) => (
                  <span key={amenity} className={`amenity-item ${amenities.includes(amenity) ? "active" : ""}`} onClick={() => handleAmenityClick(amenity)}>
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="right-side">
            <div className="card-box">
              <h2>Status</h2>
              <div className="form-group">
                <input type="text" value={status} placeholder="Room Status" onChange={(e) => setStatus(e.target.value)} required />
              </div>
            </div>
            <div className="card-box mt-4">
              <h2>Images</h2>
              <div className="upload-box">
                {/* existing images gallery */}
                {roomImages && roomImages.length > 0 ? (
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {roomImages.map((img) => {
                      const src = `${api.defaults.baseURL.replace('/api','')}/uploads/rooms/${img}`
                      return (
                        <div key={img} style={{ position: 'relative', width: 100, height: 70, borderRadius: 6, overflow: 'hidden', border: '1px solid #eee' }}>
                          <img src={src} alt={img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <button type="button" onClick={async () => {
                            if (!confirm('Remove this image?')) return
                            try {
                              const res = await api.put(`/room/${id}/remove-image`, { filename: img })
                              if (res.data?.message) {
                                setRoomImages(roomImages.filter(f => f !== img))
                              }
                            } catch (err) {
                              alert('Unable to remove image')
                            }
                          }} style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none', borderRadius: 4, padding: '2px 6px', cursor: 'pointer' }}>X</button>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div style={{ padding: 8 }}>
                    {imageFile ? (
                      <div>
                        <strong>{imageFile.name}</strong>
                        <div style={{ marginTop: 8 }}>
                          <img src={URL.createObjectURL(imageFile)} alt="preview" style={{ maxWidth: '100%', borderRadius: 8 }} />
                        </div>
                      </div>
                    ) : (
                      <p>Click to choose an image to upload</p>
                    )}
                  </div>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
              </div>
              <div style={{ marginTop: 8, textAlign: 'center' }}>
                <button type="button" className="upload-btn" onClick={() => fileInputRef.current && fileInputRef.current.click()}>
                  Upload Image
                </button>
              </div>
            </div>
            <div className="action-buttons">
              <button className="create-btn mt-4" type="submit">
                <FaRegCopy /> Update Room
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
export default EditRoom