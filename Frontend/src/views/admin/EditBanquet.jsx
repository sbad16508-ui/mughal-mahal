import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaSave } from "react-icons/fa";
import api from "../../api";
import "./EditBanquet.css";

const EditBanquet = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Updated State
  const [name, setName] = useState("");
  const [hallType, setHallType] = useState(""); // Added
  const [floor, setFloor] = useState("");       // Added
  const [capacity, setCapacity] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState("Available");
  const [description, setDescription] = useState("");
  const [amenities, setAmenities] = useState([]);
  
  const availableAmenities = ["WiFi", "Sound System", "AC", "Stage", "Catering", "Parking", "Projector", "Generator"];

  const handleAmenityClick = (amenity) => {
    setAmenities(prev => prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]);
  };

  useEffect(() => {
    const fetchBanquetDetails = async () => {
      try {
        const res = await api.get(`/banquets/${id}`);
        const b = res.data;
        setName(b.name || "");
        setHallType(b.hallType || "");     // Added
        setFloor(b.floor || "");           // Added
        setCapacity(b.capacity || "");
        setPrice(b.price || "");
        setStatus(b.status || "Available");
        setDescription(b.description || "");
        setAmenities(b.amenities || []);
      } catch (err) { console.error(err); }
    };
    if (id) fetchBanquetDetails();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/banquets/${id}`, { name, hallType, floor, capacity, price, status, description, amenities });
      navigate("/admin/banquet");
    } catch (err) { alert("Error updating hall"); }
  };

  return (
    <div className="add-room-page">
      <div className="top-section">
        <button className="back-btn" onClick={() => navigate("/admin/banquet")}><FaArrowLeft /> Back</button>
        <div className="title-area"><h1>Edit Banquet Hall</h1></div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="room-layout">
          <div className="left-side">
            <div className="card-box">
              <h2>Basic Information</h2>
              <div className="form-grid">
                <input type="text" value={name} placeholder="Hall Name" onChange={(e) => setName(e.target.value)} required />
                <select value={hallType} onChange={(e) => setHallType(e.target.value)} className="white-input">
                  <option value="">Select Hall Type</option>
                  <option value="Banquet Hall">Banquet Hall</option>
                  <option value="Open Lawn">Open Lawn</option>
                  <option value="Conference Room">Conference Room</option>
                </select>
                <input type="text" value={floor} placeholder="Floor" onChange={(e) => setFloor(e.target.value)} />
                <input type="number" value={capacity} placeholder="Capacity (Guests)" onChange={(e) => setCapacity(e.target.value)} required />
                <input type="number" value={price} placeholder="Price per Day ($)" onChange={(e) => setPrice(e.target.value)} required />
              </div>
              <textarea className="white-input mt-3" value={description} placeholder="Description" onChange={(e) => setDescription(e.target.value)} style={{width: '100%'}} />
            </div>

            <div className="card-box mt-4">
              <h2>Amenities</h2>
              <div className="amenities-grid" style={{display: 'flex', flexWrap: 'wrap', gap: '10px'}}>
                {availableAmenities.map(a => (
                  <span key={a} className={`amenity-item ${amenities.includes(a) ? "active" : ""}`} onClick={() => handleAmenityClick(a)}>
                    {a}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="right-side">
            <div className="card-box">
              <h2>Status</h2>
               <input type="text" value={status} placeholder="Room Status" onChange={(e) => setStatus(e.target.value)} required />
            </div>
            
            <div className="card-box mt-4">
              <h2>Visuals</h2>
              <div className="upload-box" style={{border: '2px dashed #ddd', padding: '20px', textAlign: 'center'}}>
                <p>Upload Hall Images</p>
              </div>
            </div>

            <button className="create-room-btn mt-4" type="submit"><FaSave /> Update Hall</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditBanquet;