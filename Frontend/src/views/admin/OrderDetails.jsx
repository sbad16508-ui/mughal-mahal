import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { FaArrowLeft, FaUser, FaClock, FaDollarSign } from "react-icons/fa"
import "./OrderDetails.css"

const OrderDetails = () => {
  const navigate = useNavigate()

  const [orderData, setOrderData] = useState({
    orderId: "ORD-145",
    status: "In Progress",
    server: "John Doe",
    orderTime: "10:30 AM",
    table: "T-05",
    guests: 4,
    billing: {
      subtotal: "$98",
      tax: "$9.80",
      total: "$107.80"
    },
    items: [
      {
        qty: "2x",
        name: "Grilled Salmon",
        note: "Note: Well done",
        priceEach: "$28 each",
        total: "$56",
        status: "Preparing",
      },
      {
        qty: "2x",
        name: "Caesar Salad",
        note: "Note: No croutons",
        priceEach: "$12 each",
        total: "$24",
        status: "Ready",
      },
      {
        qty: "1x",
        name: "Lobster Bisque",
        note: "",
        priceEach: "$18 each",
        total: "$18",
        status: "Preparing",
      }
    ]
  })

  return (
    <div className="order-details-page">
      <div className="order-details-header">
        <button type="button" className="back-btn" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Back
        </button>
        <div className="header-title-section">
          <div className="title-row">
            <h1>Order {orderData.orderId}</h1>
            <span className="status-pill in-progress">{orderData.status}</span>
          </div>
          <p>Order details and status</p>
        </div>
      </div>

      <div className="details-main-content">
        <div className="order-items-card">
          <h3>Order Items</h3>
          <div className="items-list-container">
            {orderData.items.map((item, index) => (
              <div key={index} className="order-item-row">
                <div className="item-qty-name">
                  <span className="item-qty">{item.qty}</span>
                  <div className="item-info-text">
                    <h4>{item.name}</h4>
                    {item.note && <p className="item-note">{item.note}</p>}
                    <span className={`item-status-tag ${item.status.toLowerCase()}`}>
                      {item.status}
                    </span>
                  </div>
                </div>
                <div className="item-price-info">
                  <span className="price-each">{item.priceEach}</span>
                  <span className="price-total">{item.total}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="order-sidebar-column">
          <div className="info-card">
            <h3>Order Info</h3>
            <div className="info-item">
              <FaUser className="info-icon" />
              <div>
                <span>Server</span>
                <p>{orderData.server}</p>
              </div>
            </div>
            <div className="info-item">
              <FaClock className="info-icon" />
              <div>
                <span>Order Time</span>
                <p>{orderData.orderTime}</p>
              </div>
            </div>
            <div className="info-text-block">
              <span>Table</span>
              <p>{orderData.table}</p>
            </div>
            <div className="info-text-block">
              <span>Guests</span>
              <p>{orderData.guests}</p>
            </div>
          </div>

          <div className="billing-card">
            <h3>Bill Summary</h3>
            <div className="bill-row">
              <span>Subtotal:</span>
              <span>{orderData.billing.subtotal}</span>
            </div>
            <div className="bill-row">
              <span>Tax (10%):</span>
              <span>{orderData.billing.tax}</span>
            </div>
            <div className="bill-total-row">
              <span>Total:</span>
              <span className="final-amount">{orderData.billing.total}</span>
            </div>
          </div>

          <button type="button" className="process-payment-btn">
            <FaDollarSign /> Process Payment
          </button>
        </div>
      </div>
    </div>
  )
}

export default OrderDetails