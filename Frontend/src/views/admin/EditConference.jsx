
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { FaArrowLeft, FaSave } from "react-icons/fa"
import api from "../../api"
import "./EditConference.css"

const EditConference = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    capacity: "",
    layout: "",
    price: "",
    status: "Available",
    description: "",
    tags: []
  })

  const availableTags = ["WiFi", "Projector", "Sound System", "AC", "Whiteboard", "Catering", "Video Conferencing"]

  useEffect(() => {
    const fetchHall = async () => {
      try {
        const response = await api.get(`/conference/rooms/${id}`)
        setFormData(response.data)
      } catch (err) {
        console.error("Error fetching hall:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchHall()
  }, [id])

  const toggleTag = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) 
        ? prev.tags.filter(t => t !== tag) 
        : [...prev.tags, tag]
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.put(`/conference/rooms/${id}`, formData)
      navigate("/admin/conference")
    } catch (err) {
      alert("Failed to update hall")
    }
  }

  if (loading) return <div className="loading-state">Loading conference details...</div>

  return (
    <div className="add-room-page">
      <div className="top-section">
        <button className="back-btn" onClick={() => navigate("/admin/conference")}>
          <FaArrowLeft /> Back
        </button>
        <div className="title-area">
          <h1>Edit Hall</h1>
          <p>Update {formData.name} configuration</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="room-layout">
          <div className="left-side">
            <div className="card-box">
              <h2>Basic Information</h2>
              <div className="form-grid">
                <input type="text" placeholder="Hall Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                <input type="number" placeholder="Capacity" value={formData.capacity} onChange={(e) => setFormData({...formData, capacity: e.target.value})} required />
                <input type="text" placeholder="Layout" value={formData.layout} onChange={(e) => setFormData({...formData, layout: e.target.value})} />
                <input type="number" placeholder="Price per Day" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} required />
              </div>
              <textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}></textarea>
            </div>

            <div className="card-box mt-4">
              <h2>Amenities</h2>
              <div className="amenities-grid">
                {availableTags.map((tag) => (
                  <span key={tag} className={`amenity-item ${formData.tags.includes(tag) ? "active" : ""}`} onClick={() => toggleTag(tag)}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="right-side">
            <div className="card-box">
              <h2>Status</h2>
              <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                <option value="Available">Available</option>
                <option value="Booked">Booked</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>
            <button className="create-btn mt-4" type="submit"><FaSave /> Update Hall</button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default EditConference