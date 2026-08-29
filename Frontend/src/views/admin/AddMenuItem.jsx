import { useState } from "react"
import { FaArrowLeft, FaSave } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import "./AddMenuItem.css"
import api from "../../api"

const AddMenuItem = () => {
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await api.post("/dining", { itemName, category, price, preparationTime, servingSize, calories, description, ingredients, allergens, availability })
    if (res.data.message === "Dining Created") {
      navigate("/admin/dining")
    } else {
      alert("Error creating menu item: " + res.data.message)
    }
  }

  return (
    <div className="add-menu-item-page">
      <div className="form-header">
        <button className="back-btn" type="button" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Back
        </button>
        <div className="header-text">
          <h1>Add Menu Item</h1>
          <p>Create a new menu item</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-content-grid">
          <div className="form-main-card">
            <h3>Basic Information</h3>

            <div className="form-group">
              <input
                type="text"
                placeholder="Dish Name"
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
                  placeholder="Price"
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
                  placeholder="Preparation Time"
                  value={preparationTime}
                  onChange={(e) => setPreparationTime(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Serving Size"
                  value={servingSize}
                  onChange={(e) => setServingSize(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <input
                type="text"
                placeholder="Calories"
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
                placeholder="Ingredients (comma-separated)"
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
              />
            </div>

            <div className="form-group">
              <input
                type="text"
                placeholder="Allergens (comma-separated)"
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
                <FaSave /> Create Item
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default AddMenuItem