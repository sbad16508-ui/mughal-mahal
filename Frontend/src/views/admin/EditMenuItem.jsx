import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { FaArrowLeft, FaSave } from "react-icons/fa"
import "./AddMenuItem.css"
import api from "../../api"

const EditMenuItem = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [itemName, setItemName] = useState("")
  const [category, setCategory] = useState("")
  const [price, setPrice] = useState("")
  const [preparationTime, setPreparationTime] = useState("")
  const [servingSize, setServingSize] = useState("")
  const [calories, setCalories] = useState("")
  const [description, setDescription] = useState("")
  const [ingredients, setIngredients] = useState("")
  const [allergens, setAllergens] = useState("")
  const [availability, setAvailability] = useState("available")

  useEffect(() => {
    const fetchMenuDetails = async () => {
      try {
        const response = await api.get(`/dining/${id}`)
        setItemName(response.data.itemName)
        setCategory(response.data.category)
        setPrice(response.data.price)
        setPreparationTime(response.data.preparationTime)
        setServingSize(response.data.servingSize)
        setCalories(response.data.calories)
        setDescription(response.data.description)
        setIngredients(response.data.ingredients)
        setAllergens(response.data.allergens)
        setAvailability(response.data.availability)
      } catch (err) {
        console.error("Error fetching menu details:", err)
      }
    }

    if (id) fetchMenuDetails()
  }, [id])
  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await api.put(`/dining/${id}`, { itemName, category, price, preparationTime, servingSize, calories, description, ingredients, allergens, availability })
    if (res.data.message === "Dining Updated") {
      navigate("/admin/dining")
    } else {
      alert("Error updating menu item")
    }
  }

  return (
    <div className="add-menu-item-page">
      <div className="form-header">
        <button className="back-btn" type="button" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Back
        </button>
        <div className="header-text">
          <h1>Edit Menu Item</h1>
          <p>Update the details of an existing menu item</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-content-grid">
          <div className="form-main-card">
            <h3>Basic Information</h3>

            <div className="form-group">
              <input
                type="text"
                placeholder="Grilled Salmon"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value="">Select category</option>
                  <option value="main">Main Course</option>
                  <option value="appetizer">Appetizer</option>
                  <option value="dessert">Dessert</option>
                </select>
              </div>
              <div className="form-group">
                <input
                  type="number"
                  placeholder="28"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <input
                  type="text"
                  placeholder="25"
                  value={preparationTime}
                  onChange={(e) => setPreparationTime(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="350g"
                  value={servingSize}
                  onChange={(e) => setServingSize(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <input
                type="text"
                placeholder="450 kcal"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
              />
            </div>

            <div className="form-group">
              <textarea
                placeholder="Enter item description..."
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
            </div>

            <div className="form-group">
              <input
                type="text"
                placeholder="Salmon, Lemon, Butter, Garlic..."
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
              />
            </div>

            <div className="form-group">
              <input
                type="text"
                placeholder="Fish, Dairy..."
                value={allergens}
                onChange={(e) => setAllergens(e.target.value)}
              />
            </div>
          </div>

          <div className="form-sidebar">
            <div className="sidebar-card">
              <h3>Status</h3>
              <div className="form-group">
                <select
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                >
                  <option value="available">Available</option>
                  <option value="unavailable">Unavailable</option>
                </select>
              </div>
            </div>

            <div className="sidebar-card">
              <h3>Image</h3>
              <div className="image-upload-box">
                <input type="file" id="item-image" hidden />
                <label htmlFor="item-image" className="upload-label">
                  <span>Upload item image</span>
                </label>
              </div>
            </div>

            <div className="action-buttons">
              <button className="btn-create" type="submit">
                <FaSave /> Update Item
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default EditMenuItem