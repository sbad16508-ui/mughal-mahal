import { useState, useEffect } from "react"
import { FaArrowLeft, FaEdit, FaTrash } from "react-icons/fa"
import { useNavigate, useParams } from "react-router-dom"
import "./OfferDetails.css"
import api from "../../api"

const OfferDetails = () => {
  const navigate = useNavigate()
  const { id } = useParams()

  const [offer, setOffer] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOfferData = async () => {
      try {
        setLoading(true)
        const res = await api.get(`/offer/${id}`)
        setOffer(res.data)
      } catch (err) {
        console.error("Failed downloading operational offer detail configuration:", err)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchOfferData()
    }
  }, [id])

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to permanently delete this promotional offer?")) {
      try {
        await api.delete(`/offer/${id}`)
        navigate("/admin/offers")
      } catch (err) {
        console.error("Action execution sequence failure deleting promotion:", err)
        alert("Failed removing the requested promotional offer record.")
      }
    }
  }

  if (loading) {
    return (
      <div style={{ padding: "120px", textTransform: "uppercase", letterSpacing: "1px", textAlign: "center", color: "#666", fontWeight: "bold" }}>
        Loading dynamic campaign assets...
      </div>
    )
  }

  if (!offer) {
    return (
      <div style={{ padding: "40px", textAlign: "center", fontSize: "1.2rem", color: "#d32f2f", fontWeight: "bold" }}>
        Error: Selected promotional criteria profile not found.
      </div>
    )
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    })
  }

  const calculatedRevenue = offer.totalRevenueGenerated || offer.revenue || 0
  const isPercentage = offer.discountType !== "Fixed Amount ($)"

  return (
    <div className="offer-details-page">
      <div className="top-bar">
        <button type="button" className="back-btn" onClick={() => navigate("/admin/offers")}>
          <FaArrowLeft /> Back
        </button>
        <div className="action-btns">
          <button type="button" className="edit-btn" onClick={() => navigate(`/admin/offers/edit/${offer._id || offer.id}`)}>
            <FaEdit /> Edit
          </button>
          <button type="button" className="del-btn" onClick={handleDelete}>
            <FaTrash /> Delete
          </button>
        </div>
      </div>

      <div className="details-header">
        <h1>{offer.title}</h1>
        <p>{offer._id || offer.id}</p>
      </div>

      <div className="details-layout">
        <div className="left-column">

          <div className="highlight-card">
            <div className="icon-box">{isPercentage ? "%" : "$"}</div>
            <span className={`status-badge ${(offer.status || "draft").toLowerCase()}`}>
              {offer.status || "Draft"}
            </span>
            <h2>{offer.title}</h2>
            <p>{offer.description}</p>
            <div className="divider"></div>
            <h1>
              {isPercentage
                ? `${offer.discountValue || 0}% OFF`
                : `PKR ${Number(offer.discountValue || 0).toLocaleString()} OFF`
              }
            </h1>
          </div>

          <div className="side-card">
            <h3>Terms & Conditions</h3>
            <p>{offer.terms || "No special terms specified for this campaign item."}</p>
          </div>
        </div>

        <div className="right-column">
          <div className="side-card">
            <h3>Offer Details</h3>
            <div className="info-row"><span className="code-pill">{offer.code}</span></div>
            <div className="info-row"><strong>{offer.category || "General"}</strong></div>
          </div>

          <div className="side-card">
            <h3>Validity Period</h3>
            <div className="info-row"><strong>{formatDate(offer.validFrom)}</strong></div>
            <div className="info-row"><strong>{formatDate(offer.validTo)}</strong></div>
          </div>

          <div className="side-card">
            <h3>Performance</h3>
            <div className="info-row"><strong>{offer.totalRedeemed || 0} Redemptions</strong></div>
            <div className="info-row"><strong className="price">${Number(calculatedRevenue).toLocaleString()}</strong></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OfferDetails