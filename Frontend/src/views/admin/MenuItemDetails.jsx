import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { FaArrowLeft, FaRegEdit, FaTrashAlt, FaRegClock, FaStar, FaUtensils } from "react-icons/fa"
import api from "../../api"
import "./MenuItemDetails.css"

const MenuItemDetails = () => {
  const { id } = useParams() 
  const navigate = useNavigate()

  const [itemData, setItemData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

 
  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        setLoading(true)
        
        const response = await api.get(`/dining/${id}`)
        setItemData(response.data)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching menu item details:", err)
        setError("Could not load the menu item data.")
        setLoading(false)
      }
    }

    if (id) fetchItemDetails()
  }, [id])

  
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to permanently delete this menu item?")) {
      try {
        await api.delete(`/dining/${id}`)
        navigate("/admin/dining") // Redirect back to menu dashboard on delete
      } catch (err) {
        alert("Failed to delete this item. Please try again.")
      }
    }
  }

  if (loading) return <div style={{ padding: "40px", textAlign: "center" }}>Loading menu item details...</div>
  if (error) return <div style={{ padding: "40px", color: "red", textAlign: "center" }}>{error}</div>
  if (!itemData) return <div style={{ padding: "40px", textAlign: "center" }}>Menu item not found.</div>

  return (
    <div className="item-details-page">
      <div className="details-header">
        <div className="header-left">
          <button type="button" className="back-btn" onClick={() => navigate(-1)}>
            <FaArrowLeft /> Back
          </button>
          <div className="title-section">
            <h1>{itemData.itemName}</h1>
            <p>{itemData.category}</p>
          </div>
        </div>
        <div className="header-actions">
          <button
            type="button"
            className="btn-edit-outline"
            onClick={() => navigate(`/admin/menu/edit/${itemData._id}`)}
          >
            <FaRegEdit /> Edit
          </button>
          <button
            type="button"
            className="btn-delete-outline"
            onClick={handleDelete}
          >
            <FaTrashAlt /> Delete
          </button>
        </div>
      </div>

      <div className="details-grid">
        <div className="details-main-card">
          <div className="item-image-placeholder">
            <FaUtensils className="placeholder-icon" />
            <h2>{itemData.itemName}</h2>
          </div>

          <div className="info-section">
            <h3>Description</h3>
            <p className="description-text">{itemData.description || "No description provided for this item."}</p>
          </div>

          <div className="info-section">
            <h3>Ingredients</h3>
            <div className="tag-container">
              {itemData.ingredients && itemData.ingredients.length > 0 ? (
                itemData.ingredients.map((ing, i) => (
                  <span key={i} className="tag ingredient-tag">{ing}</span>
                ))
              ) : (
                <span style={{ color: "#888", fontSize: "14px" }}>Standard recipe formulation.</span>
              )}
            </div>
          </div>

          <div className="info-section">
            <h3>Allergens</h3>
            <div className="tag-container">
              {itemData.allergens && itemData.allergens.length > 0 ? (
                itemData.allergens.map((alg, i) => (
                  <span key={i} className="tag allergen-tag">{alg}</span>
                ))
              ) : (
                <span style={{ color: "#27ae60", fontSize: "14px", fontWeight: "bold" }}>Allergen Free</span>
              )}
            </div>
          </div>
        </div>

        <div className="details-sidebar">
          <div className="sidebar-card">
            <h3>Details</h3>
            <div className="sidebar-row">
              <span>Item ID:</span>
              <strong>{itemData._id}</strong>
            </div>
            <div className="sidebar-row">
              <span>Category:</span>
              <strong>{itemData.category}</strong>
            </div>
            <div className="sidebar-row">
              <span>Prep Time:</span>
              <strong><FaRegClock /> {itemData.preparationTime} min</strong>
            </div>
            <div className="sidebar-row">
              <span>Calories:</span>
              <strong>{itemData.calories ? `${itemData.calories} kcal` : "—"}</strong>
            </div>
            <div className="sidebar-row">
              <span>Serving Size:</span>
              <strong>{itemData.servingSize || "Standard"}</strong>
            </div>
          </div>

          <div className="sidebar-card">
            <h3>Pricing & Status</h3>
            <div className="sidebar-row">
              <span>Price:</span>
              <span className="price-text">${itemData.price}</span>
            </div>
            <div className="sidebar-row">
              <span>Status:</span>
              <span className={`status-badge ${itemData.availability === "available" ? "available" : "unavailable"}`}>
                {itemData.availability === "available" ? "Available" : "Unavailable"}
              </span>
            </div>
          </div>

          
          <div className="sidebar-card">
            <h3>Statistics</h3>
            <div className="sidebar-row">
              <span>Rating:</span>
              <strong><FaStar className="star-icon" style={{ color: "#f39c12" }} /> 4.7</strong>
            </div>
            <div className="sidebar-row">
              <span>Popularity:</span>
              <span className="popularity-text">High</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MenuItemDetails