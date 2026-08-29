import { useState, useEffect } from "react"
import { FaArrowLeft, FaSave } from "react-icons/fa"
import { useNavigate, useParams } from "react-router-dom"
import "./EditOffer.css"
import api from "../../api"

const EditOffer = () => {
  const navigate = useNavigate()
  const { id } = useParams()

  const [loading, setLoading] = useState(true)
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

  useEffect(() => {
    const fetchExistingOffer = async () => {
      try {
        setLoading(true)
        const res = await api.get(`/offer/${id}`)
        const data = res.data

        const cleanDate = (isoString) => {
          if (!isoString) return ""
          return isoString.split("T")[0]
        }

        setFormData({
          title: data.title || "",
          description: data.description || "",
          code: data.code || "",
          category: data.category || "",
          discountType: data.discountType || "",
          discountValue: data.discountValue || "",
          validFrom: cleanDate(data.validFrom),
          validTo: cleanDate(data.validTo),
          minimumStay: data.minimumStay || "",
          maximumDiscount: data.maximumDiscount || "",
          terms: data.terms || "",
          status: data.status || "",
          usageLimit: data.usageLimit || ""
        })
      } catch (err) {
        console.error("Failed connecting to historical campaign document profile:", err)
        alert("Error retrieving selected coupon record details.")
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchExistingOffer()
    }
  }, [id])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.title || !formData.description || !formData.code || !formData.terms) {
      alert("Please ensure all critical parameters marked with an asterisk (*) are updated.")
      return
    }

    try {
      const updatedPayload = {
        ...formData,
        code: formData.code.toUpperCase(),
        discountValue: Number(formData.discountValue || 0),
        maximumDiscount: formData.maximumDiscount ? Number(formData.maximumDiscount) : null,
        usageLimit: formData.usageLimit ? Number(formData.usageLimit) : null
      }

      const res = await api.put(`/offer/${id}`, updatedPayload)
      if (res.status === 200 || res.data) {
        navigate(`/admin/offers/details/${id}`)
      }
    } catch (err) {
      console.error("Database tracking validation error updating campaign:", err)
      alert(err.response?.data?.message || "Failed committing your modification updates.")
    }
  }

  if (loading) {
    return (
      <div style={{ padding: "120px", textTransform: "uppercase", letterSpacing: "1px", textAlign: "center", color: "#666", fontWeight: "bold" }}>
        Re-building system configuration matrices...
      </div>
    )
  }

  return (
    <div className="edit-offer-page">
      <div className="top-bar">
        <button type="button" className="back-btn" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Back
        </button>
      </div>

      <div className="details-header">
        <h1>Edit Offer</h1>
        <p>Update offer details</p>
      </div>

      <form onSubmit={handleSubmit} className="edit-layout">
        <div className="left-column">

          <div className="form-card">
            <h3>Offer Information</h3>
            <div className="form-group">
              <input
                type="text"
                name="title"
                placeholder="Offer Title *"
                value={formData.title}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <textarea
                name="description"
                placeholder="Description *"
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-row">
              <input
                type="text"
                name="code"
                placeholder="Offer Code *"
                value={formData.code}
                onChange={handleInputChange}
              />
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
              >
                <option value="">Category *</option>
                <option value="Rooms">Rooms</option>
                <option value="Conferences">Conferences</option>
                <option value="Banquets">Banquets</option>
              </select>
            </div>

            <div className="form-row">
              <select
                name="discountType"
                value={formData.discountType}
                onChange={handleInputChange}
              >
                <option value="">Discount Type *</option>
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
            </div>

            <div className="form-row">
              <input
                type="date"
                name="validFrom"
                placeholder="Valid From *"
                value={formData.validFrom}
                onChange={handleInputChange}
              />
              <input
                type="date"
                name="validTo"
                placeholder="Valid To *"
                value={formData.validTo}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-card">
            <h3>Terms & Conditions</h3>
            <textarea
              name="terms"
              className="terms-area"
              placeholder="Terms *"
              value={formData.terms}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="right-column">
          <div className="side-card">
            <h3>Status</h3>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
            >
              <option value="">Offer Status *</option>
              <option value="Active">Active</option>
              <option value="Draft">Draft</option>
              <option value="Expired">Expired</option>
            </select>
          </div>

          <div className="side-card">
            <h3>Usage Limits</h3>
            <input
              type="number"
              name="usageLimit"
              placeholder="Usage Limit"
              value={formData.usageLimit}
              onChange={handleInputChange}
            />
          </div>

          <button type="submit" className="btn-update">
            <FaSave /> Update Offer
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditOffer