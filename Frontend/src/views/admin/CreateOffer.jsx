import { useState } from "react"
import { FaArrowLeft, FaSave } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import "./CreateOffer.css"
import api from "../../api" // Connected your Axios instance

const CreateOffer = () => {
  const navigate = useNavigate()

  // Single consolidated object tracking all individual form controls dynamically
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    code: "",
    category: "",
    discountType: "",
    discountValue: "",
    validFrom: "",
    validTo: "",
    minimumStay: "",
    maximumDiscount: "",
    terms: "",
    status: "",
    usageLimit: ""
  })

  // Universal text input tracking modifier pipeline logic
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  // Handle data compilation transmission payload delivery 
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Enforce essential operational field boundaries manually
    if (!formData.title || !formData.description || !formData.code || !formData.terms) {
      alert("Please populate all crucial required form blocks marked with an asterisk (*).")
      return
    }

    try {
      // Process sanitization payload to make values match Mongoose data types
      const normalizedPayload = {
        ...formData,
        code: formData.code.toUpperCase(),
        discountValue: Number(formData.discountValue || 0),
        maximumDiscount: formData.maximumDiscount ? Number(formData.maximumDiscount) : null,
        usageLimit: formData.usageLimit ? Number(formData.usageLimit) : null,
        // Fallback default dropdown choices if left unselected by the browser user
        discountType: formData.discountType === "Discount Type *" || !formData.discountType ? "Percentage (%)" : formData.discountType,
        status: formData.status === "Offer Status *" || !formData.status ? "Draft" : formData.status
      }

      const response = await api.post("/offers", normalizedPayload)
      if (response.status === 201 || response.data) {
        navigate("/admin/offers") // Smooth return navigation redirect back to data tables
      }
    } catch (err) {
      console.error("Transmission breakdown saving offer criteria fields:", err)
      alert(err.response?.data?.message || "Failed committing new promo criteria record.")
    }
  }

  return (
    <div className="offer-page">
      <div className="top-bar">
        <button type="button" className="back-btn" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Back
        </button>
      </div>

      <div className="header-section">
        <h1>Create New Offer</h1>
        <p>Create a new promotional offer</p>
      </div>

      <form onSubmit={handleSubmit} className="offer-layout">
        {/* Main Form Fields (Left Side Grid Content Blocks) */}
        <div className="main-form">
          <div className="form-card">
            <h3>Offer Information</h3>
            <div className="form-grid">
              <input
                type="text"
                name="title"
                className="full-width"
                placeholder="Offer Title *"
                value={formData.title}
                onChange={handleInputChange}
              />
              <textarea
                name="description"
                className="full-width"
                placeholder="Description *"
                rows="3"
                value={formData.description}
                onChange={handleInputChange}
              ></textarea>
              <input
                type="text"
                name="code"
                placeholder="Offer Code *"
                value={formData.code}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="category"
                placeholder="Category *"
                value={formData.category}
                onChange={handleInputChange}
              />
              <select
                name="discountType"
                value={formData.discountType}
                onChange={handleInputChange}
              >
                <option>Discount Type *</option>
                <option value="Percentage (%)">Percentage (%)</option>
                <option value="Fixed Amount ($)">Fixed Amount ($)</option>
              </select>
              <input
                type="number"
                name="discountValue"
                placeholder="Discount Value *"
                value={formData.discountValue}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="validFrom"
                placeholder="Valid From *"
                value={formData.validFrom}
                onFocus={(e) => e.target.type = "date"}
                onBlur={(e) => !e.target.value && (e.target.type = "text")}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="validTo"
                placeholder="Valid To *"
                value={formData.validTo}
                onFocus={(e) => e.target.type = "date"}
                onBlur={(e) => !e.target.value && (e.target.type = "text")}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="minimumStay"
                placeholder="Minimum Stay (if applicable)"
                value={formData.minimumStay}
                onChange={handleInputChange}
              />
              <input
                type="number"
                name="maximumDiscount"
                placeholder="Maximum Discount ($)"
                value={formData.maximumDiscount}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-card">
            <h3>Terms & Conditions</h3>
            <textarea
              name="terms"
              placeholder="Terms *"
              rows="3"
              value={formData.terms}
              onChange={handleInputChange}
            ></textarea>
          </div>
        </div>

        {/* Sidebar Configuration Parameters Workspace (Right Side Panel) */}
        <div className="side-panel">
          <div className="side-card">
            <h3>Status</h3>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
            >
              <option>Offer Status *</option>
              <option value="Active">Active</option>
              <option value="Draft">Draft</option>
            </select>
          </div>

          <div className="side-card">
            <h3>Usage Limits</h3>
            <input
              type="number"
              name="usageLimit"
              placeholder="Usage Limit (Leave empty for unlimited)"
              value={formData.usageLimit}
              onChange={handleInputChange}
            />
          </div>

          <button type="submit" className="create-btn">
            <FaSave /> Create Offer
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateOffer