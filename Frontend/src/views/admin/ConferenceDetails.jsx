import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { FaArrowLeft, FaRegEdit, FaTrashAlt, FaVideo, FaUsers, FaCheckCircle } from "react-icons/fa"
import api from "../../api"
import "./ConferenceDetails.css"

const ConferenceDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [hallData, setHallData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHallDetails = async () => {
      
      try {
        const response = await api.get(`/conference/room/${id}`)
        setHallData(response.data)
      } catch (err) {
        console.error("Error fetching hall details:", err)
      } finally {
        setLoading(false)
      }
    }
    if (id) fetchHallDetails()
  }, [id])

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this conference hall?")) {
      try {
        await api.delete(`/conference/rooms/${id}`)
        navigate("/admin/conference")
      } catch (err) {
        alert("Failed to delete hall.")
      }
    }
  }

  if (loading) return <div className="loading-msg">Loading hall profile...</div>
  if (!hallData) return <div className="loading-msg">Hall not found.</div>

  return (
    <div className="details-page">
      <div className="header-nav">
        <div className="left-header">
          <button className="back-btn" onClick={() => navigate("/admin/conference")}>
            <FaArrowLeft /> Back
          </button>
          <div className="title-text">
            <h1>{hallData.name}</h1>
            <p>ID: {hallData._id.slice(-6).toUpperCase()}</p>
          </div>
        </div>
        <div className="right-header">
          <button className="edit-btn" onClick={() => navigate(`/admin/conference/edit/${hallData._id}`)}>
            <FaRegEdit /> Edit
          </button>
          <button className="delete-btn" onClick={handleDelete}>
            <FaTrashAlt /> Delete
          </button>
        </div>
      </div>

      <div className="details-layout">
        <div className="main-info">
          <div className="card">
            <div className="hall-image-box">
              <FaVideo className="hall-icon" />
              <span>{hallData.name}</span>
            </div>
            <div className="description-section">
              <h3>Description</h3>
              <p>{hallData.description || "No description provided for this hall."}</p>
              
              <h3>Amenities</h3>
              <div className="amenities-tags">
                {(hallData.tags || hallData.amenities || []).map((item, index) => (
                  <div key={index} className="tag">
                    <FaCheckCircle style={{ color: "#2b6cb0" }} /> {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="side-info">
          <div className="card">
            <h3>Hall Specifications</h3>
            <div className="info-row"><span>Capacity:</span> <strong>{hallData.capacity} People</strong></div>
            <div className="info-row"><span>Layout:</span> <strong>{hallData.layout || "Standard"}</strong></div>
            <div className="info-row"><span>Status:</span> 
              <span className={`status-pill ${hallData.status?.toLowerCase()}`}>{hallData.status}</span>
            </div>
          </div>

          <div className="card mt-25">
            <h3>Financials</h3>
            <div className="price-section">
              <span className="label">Daily Rate:</span>
              <span className="price-tag">PKR {Number(hallData.price).toLocaleString()}</span>
            </div>
            <button className="book-btn" onClick={() => navigate("/admin/conference/add")}>
              <FaUsers /> Create Booking
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConferenceDetails