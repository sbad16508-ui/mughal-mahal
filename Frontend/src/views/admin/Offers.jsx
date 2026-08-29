import { useState, useEffect } from "react"
import { FaPlus, FaSearch, FaEdit, FaTrash, FaFilter, FaTag } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import "./Offers.css"
import api from "../../api"

const Offers = () => {
  const navigate = useNavigate()
  const [offers, setOffers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")

  const fetchOffers = async () => {
    try {
      setLoading(true)
      const res = await api.get("/offers")
      setOffers(res.data || [])
    } catch (err) {
      console.error("Failed connecting to offers API records:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOffers()
  }, [])

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to permanently remove this promotional offer?")) {
      try {
        await api.delete(`/offers/${id}`)
        setOffers((prev) => prev.filter((offer) => (offer._id || offer.id) !== id))
      } catch (err) {
        console.error("Error executing dynamic delete sequence:", err)
        alert("Could not remove the selected offer.")
      }
    }
  }

  const activeCount = offers.filter((o) => o.status?.toLowerCase() === "active").length
  const expiredCount = offers.filter((o) => o.status?.toLowerCase() === "expired").length

  const totalRedeemedCount = offers.reduce((sum, current) => sum + Number(current.totalRedeemed || 0), 0)

  const filteredOffers = offers.filter((offer) => {
    const oId = offer._id || offer.id || ""
    const oTitle = offer.title || ""
    const oCode = offer.code || ""

    const matchTargets = `${oId} ${oTitle} ${oCode}`.toLowerCase()
    const matchesSearch = matchTargets.includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "All" || offer.status?.toLowerCase() === statusFilter.toLowerCase()

    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div style={{ padding: "120px", textTransform: "uppercase", letterSpacing: "1px", textAlign: "center", color: "#666", fontWeight: "bold" }}>
        Syncing active promotional campaigns...
      </div>
    )
  }

  return (
    <div className="offers-page">
      <div className="rb-header">
        <div>
          <h1>Offers & Promotions</h1>
          <p>Create and manage hotel promotional offers</p>
        </div>
        <button className="btn-add" onClick={() => navigate("/admin/offer/add")}>
          <FaPlus /> Create New Offer
        </button>
      </div>

      {/* Dynamic Metric Display Row */}
      <div className="metrics-row">
        <div className="metric-card">
          <p>Active Offers</p>
          <h3>{activeCount}</h3>
        </div>
        <div className="metric-card">
          <p>Total Redeemed</p>
          <h3>{totalRedeemedCount}</h3>
        </div>
        <div className="metric-card">
          <p>Expired</p>
          <h3>{expiredCount}</h3>
        </div>
      </div>

      <div className="rb-main-card">
        <div className="table-top">
          <div className="search-wrapper">
            <FaSearch className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search by offer name or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-wrapper" style={{ display: "flex", alignItems: "center", border: "1px solid #ccc", borderRadius: "4px", padding: "4px 8px", background: "#fff" }}>
            <FaFilter style={{ color: "#888", marginRight: "6px" }} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ border: "none", outline: "none", background: "transparent", fontSize: "14px", cursor: "pointer" }}
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Expired">Expired</option>
            </select>
          </div>
        </div>

        <table className="rb-table">
          <thead>
            <tr>
              <th>Offer Title</th>
              <th>Code</th>
              <th>Discount</th>
              <th>Validity</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOffers.map((offer) => {
              const targetId = offer._id || offer.id

              const displayValidity = offer.valid || (offer.validFrom && offer.validUntil
                ? `${offer.validFrom} - ${offer.validUntil}`
                : "Open Window")

              return (
                <tr key={targetId}>
                  <td>
                    <div className="offer-title">
                      <FaTag className="tag-icon" />
                      <strong>{offer.title}</strong>
                    </div>
                  </td>
                  <td><span className="code-pill">{offer.code}</span></td>
                  <td>{offer.discount}%</td>
                  <td>{displayValidity}</td>
                  <td>
                    <span className={`pill ${(offer.status || "active").toLowerCase()}`}>
                      {offer.status || "Active"}
                    </span>
                  </td>
                  <td className="row-actions">
                    <FaEdit
                      className="edit-icon"
                      onClick={() => navigate(`/admin/offers/details/${targetId}`)}
                    />
                    <FaTrash
                      className="del-icon"
                      onClick={() => handleDelete(targetId)}
                      style={{ cursor: "pointer" }}
                    />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {filteredOffers.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px", color: "#aaa", fontSize: "0.95rem" }}>
            No matching promotional campaigns found.
          </div>
        )}
      </div>
    </div>
  )
}

export default Offers