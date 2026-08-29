import { useState, useRef, useEffect } from "react"
import { FaArrowLeft, FaRegCopy } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import "./AddRoom.css"
import api from "../../api"
import roomCards from "../../data/roomData"

const AddRoom = () => {
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
  const fileInputRef = useRef(null)
  const [existingRooms, setExistingRooms] = useState([])
  const [showRoomChoice, setShowRoomChoice] = useState(true)
  const [selectedRoomType, setSelectedRoomType] = useState(roomCards[0]?.id || "")
  const [roomQuantity, setRoomQuantity] = useState("1")
  const [addingRooms, setAddingRooms] = useState(false)
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
    const file = e.target.files && e.target.files[0]
    setImageFile(file || null)
  }

  useEffect(() => {
    api.get("/rooms")
      .then((response) => {
        const data = Array.isArray(response.data) ? response.data : response.data?.rooms || []
        setExistingRooms(data)
      })
      .catch((error) => console.error("Failed to load room templates:", error))
  }, [])

  const handleRoomChoice = async (e) => {
    e.preventDefault()
    const count = Number(roomQuantity)
    const card = roomCards.find((item) => item.id === selectedRoomType)
    if (!card || !Number.isInteger(count) || count < 1) {
      alert("Please select a room type and enter a valid quantity.")
      return
    }

    const roomTypeName = card.title.split(" - ")[0].replace(/ Room$/, "")
    const template = existingRooms.find((room) => String(room.roomType || "").toLowerCase().replace(/ room$/, "") === roomTypeName.toLowerCase())
    const usedNumbers = existingRooms.map((room) => Number(room.roomNo)).filter(Number.isInteger)
    let nextRoomNumber = Math.max(0, ...usedNumbers) + 1
    setAddingRooms(true)

    try {
      for (let index = 0; index < count; index += 1) {
        await api.post("/room", {
          roomNo: String(nextRoomNumber++),
          roomType: template?.roomType || roomTypeName,
          floor: template?.floor || "1",
          size: template?.size || "35 sqm",
          capacity: template?.capacity || 2,
          price: template?.price || card.price.match(/[\d,]+/)?.[0]?.replace(/,/g, "") || 0,
          bedType: template?.bedType || "King",
          viewType: template?.viewType || "City",
          description: template?.description || card.description,
          amenities: template?.amenities || [],
          status: "Available"
        })
      }
      navigate("/admin/room")
    } catch (error) {
      console.error("Failed to add rooms:", error)
      alert(error.response?.data?.message || "Unable to add rooms.")
    } finally {
      setAddingRooms(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const formData = new FormData()
      formData.append("roomNo", roomNo)
      formData.append("roomType", roomType)
      formData.append("floor", floor)
      formData.append("size", size)
      formData.append("capacity", capacity)
      formData.append("price", price)
      formData.append("bedType", bedType)
      formData.append("viewType", viewType)
      formData.append("description", description)
      formData.append("status", status)
      formData.append("amenities", JSON.stringify(amenities))
      if (imageFile) formData.append("image", imageFile)

      const res = await api.post("/room", formData)
      if (res.data?.message === "Room Created") {
        navigate("/admin/room")
      } else {
        alert("Error creating room: " + (res.data?.message || "Unknown response"))
      }
    } catch (err) {
      console.error("Room creation failed:", err)
      alert(`Creation failed: ${err.response?.data?.message || err.message || "Unable to create room"}`)
    }
  }
  return (
    <div className="add-room-page">
      {showRoomChoice && (
        <div style={{ position: "fixed", inset: 0, zIndex: 20, background: "rgba(0, 0, 0, 0.45)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <form onSubmit={handleRoomChoice} style={{ width: "min(440px, 100%)", background: "white", borderRadius: 10, padding: 24, boxShadow: "0 12px 35px rgba(0,0,0,0.2)" }}>
            <h2 style={{ marginTop: 0 }}>Add New Room</h2>
            <p style={{ color: "#666", marginBottom: 20 }}>Which room type would you like to add?</p>
            <label style={{ display: "block", marginBottom: 7, fontWeight: 600 }}>Room Type</label>
            <select value={selectedRoomType} onChange={(e) => setSelectedRoomType(e.target.value)} style={{ width: "100%", padding: 10, marginBottom: 16 }}>
              {roomCards.map((card) => <option key={card.id} value={card.id}>{card.title}</option>)}
            </select>
            <label style={{ display: "block", marginBottom: 7, fontWeight: 600 }}>How many rooms would you like to add?</label>
            <input type="number" min="1" max="100" value={roomQuantity} onChange={(e) => setRoomQuantity(e.target.value)} style={{ width: "100%", padding: 10, marginBottom: 22 }} required />
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button type="button" onClick={() => navigate("/admin/room")} style={{ padding: "10px 18px", border: "1px solid #ddd", background: "white", borderRadius: 5, cursor: "pointer" }}>Cancel</button>
              <button type="submit" disabled={addingRooms} style={{ padding: "10px 18px", border: "none", background: "#d4af37", color: "white", borderRadius: 5, cursor: addingRooms ? "wait" : "pointer", fontWeight: 600 }}>{addingRooms ? "Adding..." : "Yes, Add Rooms"}</button>
            </div>
          </form>
        </div>
      )}
      <div className="top-section">
        <button className="back-btn" type="button" onClick={() => navigate("/admin/room")}>
          <FaArrowLeft /> Back
        </button>
        <div className="title-area">
          <h1>Add New Room</h1>
          <p>Create a new room</p>
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
                {imageFile ? (
                  <div>
                    <strong>{imageFile.name}</strong>
                    <div style={{ marginTop: 8 }}>
                      <img src={URL.createObjectURL(imageFile)} alt="preview" style={{ maxWidth: "100%", borderRadius: 8 }} />
                    </div>
                  </div>
                ) : (
                  <p>Click to choose an image to upload</p>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />
              </div>
              <div style={{ marginTop: 8, textAlign: "center" }}>
                <button type="button" className="upload-btn" onClick={() => fileInputRef.current?.click()}>
                  Upload Image
                </button>
              </div>
            </div>
            <div className="action-buttons">
              <button className="create-btn mt-4" type="submit">
                <FaRegCopy /> Create Room
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
export default AddRoom