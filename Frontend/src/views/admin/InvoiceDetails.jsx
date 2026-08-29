import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { FaArrowLeft } from "react-icons/fa"
import "./InvoiceDetails.css"

const InvoiceDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  // Full data structure as per your initial request
  const [invoiceData] = useState({
    invoiceNo: id || "INV-2134",
    guestName: "John Smith",
    date: "Apr 1, 2026",
    dueDate: "Apr 3, 2026",
    status: "Paid",
    billTo: {
      name: "John Smith",
      address: "123 Main St, New York, NY 10001",
      email: "john.smith@email.com",
      phone: "+1 (555) 123-4567"
    },
    items: [
      { description: "Deluxe Suite 305 - Room Rental", qty: "4 nights", rate: "$180", amount: "$720" },
      { description: "Room Service", qty: "3 orders", rate: "$25", amount: "$75" },
      { description: "Laundry Service", qty: "2 services", rate: "$15", amount: "$30" }
    ],
    summary: {
      subtotal: "$825",
      tax: "$82.50",
      discount: "$0",
      total: "$907.50"
    },
    paymentDetails: {
      amountPaid: "$907.50",
      method: "Credit Card",
      date: "Apr 1, 2026",
      transactionId: "TXN-789456123"
    }
  })

  return (
    <div className="invoice-details-container">
      
      <div className="invoice-top-actions">
        <button type="button" className="back-arrow-btn" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Back
        </button>
        <div className="action-right-group">
          <button type="button" className="action-white-btn">📥 Download PDF</button>
          <button type="button" className="action-white-btn" onClick={() => window.print()}>🖨 Print</button>
        </div>
      </div>

      <div className="invoice-grid-layout">
        
        <div className="invoice-paper-card">
          <div className="invoice-paper-header">
            <div className="brand-meta">
              <h2>Hotel Admin</h2>
              <p>123 Luxury Ave</p>
              <p>New York, NY 10001</p>
            </div>
            <div className="invoice-title-meta">
              <h1>INVOICE</h1>
              <p><strong>Invoice #:</strong> {invoiceData.invoiceNo}</p>
              <p><strong>Date:</strong> {invoiceData.date}</p>
              <p><strong>Due Date:</strong> {invoiceData.dueDate}</p>
            </div>
          </div>

          <hr className="paper-divider" />

          <div className="invoice-bill-to">
            <h3>Bill To:</h3>
            <p className="client-name">{invoiceData.billTo.name}</p>
            <p>{invoiceData.billTo.address}</p>
            <p>{invoiceData.billTo.email}</p>
            <p>{invoiceData.billTo.phone}</p>
          </div>

          <table className="invoice-items-table">
            <thead>
              <tr>
                <th>Description</th><th>Qty</th><th>Rate</th><th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoiceData.items.map((item, index) => (
                <tr key={index}>
                  <td>{item.description}</td>
                  <td>{item.qty}</td>
                  <td>{item.rate}</td>
                  <td className="txt-right-bold">{item.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="invoice-summary-block">
            <div className="summary-row"><span>Subtotal:</span> <strong>{invoiceData.summary.subtotal}</strong></div>
            <div className="summary-row"><span>Tax (10%):</span> <strong>{invoiceData.summary.tax}</strong></div>
            <div className="summary-row"><span>Discount:</span> <strong>{invoiceData.summary.discount}</strong></div>
            <hr className="summary-line" />
            <div className="summary-row total">
              <span>Total:</span> <span className="gold-total-text">{invoiceData.summary.total}</span>
            </div>
          </div>

          {invoiceData.status === "Paid" && (
            <div className="payment-success-banner">
              <h4>✓ Payment Received</h4>
              <p><strong>Amount Paid:</strong> {invoiceData.paymentDetails.amountPaid}</p>
              <p><strong>Payment Method:</strong> {invoiceData.paymentDetails.method}</p>
              <p><strong>Payment Date:</strong> {invoiceData.paymentDetails.date}</p>
              <p><strong>Transaction ID:</strong> {invoiceData.paymentDetails.transactionId}</p>
            </div>
          )}
        </div>

        
        <div className="invoice-sidebar-panel">
          <div className="side-panel-card">
            <h3>Invoice Status</h3>
            <span className={`status-badge-pill ${invoiceData.status.toLowerCase()}`}>
              {invoiceData.status}
            </span>
          </div>

          <div className="side-panel-card">
            <h3>Payment Summary</h3>
            <div className="panel-row"><span>Total Amount:</span> <strong className="txt-dark">{invoiceData.summary.total}</strong></div>
            <div className="panel-row"><span>Amount Paid:</span> <strong className="txt-green">{invoiceData.paymentDetails.amountPaid}</strong></div>
            <hr className="panel-divider-line" />
            <div className="panel-row"><span>Balance:</span> <strong className="txt-gold">$0</strong></div>
          </div>

          <div className="side-panel-card">
            <h3>Related Booking</h3>
            <button 
              type="button" 
              className="view-booking-btn"
              onClick={() => navigate(`/admin/bookings/details/${invoiceData.invoiceNo.replace("INV", "BK")}`)}
            >
              View Booking {invoiceData.invoiceNo.replace("INV", "BK")}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InvoiceDetails