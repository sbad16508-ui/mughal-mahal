import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Billing.css'
const Billing = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const stats = [
    { label: "Total Revenue", value: "PKR 0", icon: "PKR", type: "revenue" },
    { label: "Outstanding", value: "PKR 0", icon: "!", type: "outstanding" },
    { label: "Paid Invoices", value: "0", icon: "📄", type: "paid-count" },
    { label: "Pending", value: "0", icon: "📄", type: "pending-count" },
  ]
  const [invoices, setInvoices] = useState([])
  const [recentPayments, setRecentPayments] = useState([])
  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.invoiceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.guest.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = statusFilter === "All" || inv.status === statusFilter
    return matchesSearch && matchesFilter
  })
  const handleFilterToggle = () => {
    if (statusFilter === "All") setStatusFilter("Paid")
    else if (statusFilter === "Paid") setStatusFilter("Pending")
    else if (statusFilter === "Pending") setStatusFilter("Partial")
    else if (statusFilter === "Partial") setStatusFilter("Overdue")
    else setStatusFilter("All")
  }
  return (
    <div className="billing-container">
      <div className="billing-header">
        <div>
          <h1>Billing & Invoices</h1>
          <p>Manage invoices and payment records</p>
        </div>
        <button className="export-btn">📤 Export Report</button>
      </div>
      <div className="billing-stats-grid">
        {stats.map((stat, idx) => (
          <div key={idx} className="b-stat-card">
            <div className="b-stat-info">
              <span className="b-stat-label">{stat.label}</span>
              <h2 className="b-stat-value">{stat.value}</h2>
            </div>
            <div className={`b-stat-icon ${stat.type}`}>{stat.icon}</div>
          </div>
        ))}
      </div>
      <div className="billing-filter-strip">
        <div className="search-input-box">
          <input type="text" placeholder="Search invoices..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <button className="filter-options-btn" onClick={handleFilterToggle}>⏳ Filter: {statusFilter}</button>
      </div>
      <div className="invoices-list-card">
        <h3>Invoices</h3>
        <div className="table-wrapper">
          <table className="invoices-data-table">
            <thead>
              <tr>
                <th>Invoice ID</th>
                <th>Booking ID</th>
                <th>Guest Name</th>
                <th>Date</th>
                <th>Due Date</th>
                <th>Amount</th>
                <th>Paid</th>
                <th>Balance</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((inv, index) => (
                <tr key={index}>
                  <td className="txt-bold">{inv.invoiceId}</td>
                  <td>{inv.bookingId}</td>
                  <td className="txt-muted-wrap">{inv.guest}</td>
                  <td>{inv.date}</td>
                  <td>{inv.dueDate}</td>
                  <td className="txt-bold">{inv.amount}</td>
                  <td className="txt-success-bold">{inv.paid}</td>
                  <td className={inv.balance === "PKR 0" ? "txt-muted" : "txt-warning-bold"}>{inv.balance}</td>
                  <td>
                    <span className={`status-pill-ui ${inv.status.toLowerCase()}`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="action-row-btns">
                    <button className="action-view-btn" onClick={() => navigate(`/admin/billing/details/${inv.invoiceId}`)}>👁</button>
                    <button className="action-download-btn">📥</button>
                  </td>
                </tr>
              ))}
              {filteredInvoices.length === 0 && (
                <tr>
                  <td colSpan="10" style={{ textAlign: "center", padding: "20px" }}>No invoices found matching your criteria.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="recent-payments-card">
        <h3>Recent Payments</h3>
        <div className="payments-list-wrapper">
          {recentPayments.map((pay, idx) => (
            <div key={idx} className="payment-item-row">
              <div className="payment-left-side">
                <div className="success-icon-badge">$</div>
                <div className="payment-meta-details">
                  <h4>{pay.guest}</h4>
                  <p>{pay.meta}</p>
                </div>
              </div>
              <div className="payment-right-side">
                <span className="payment-amount-txt">{pay.amount}</span>
                <span className="payment-time-txt">{pay.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
export default Billing