import { FaArrowLeft, FaCheckCircle } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import "./ActiveOrders.css"

const ActiveOrders = () => {
  const navigate = useNavigate()
  const orders = [
    {
      id: "ORD-145",
      table: "T-05",
      time: "10:30 AM",
      status: "In Progress",
      server: "John Doe",
      total: "PKR 98",
      items: [
        { name: "2x Grilled Salmon", price: "PKR 28", itemStatus: "Preparing" },
        { name: "2x Caesar Salad", price: "PKR 12", itemStatus: "Ready" },
        { name: "1x Lobster Bisque", price: "PKR 18", itemStatus: "Preparing" },
      ],
    },
    {
      id: "ORD-146",
      table: "T-08",
      time: "10:45 AM",
      status: "Ready",
      server: "Jane Smith",
      total: "$65",
      items: [
        { name: "1x Beef Wellington", price: "$45", itemStatus: "Ready" },
        { name: "2x Tiramisu", price: "$10", itemStatus: "Ready" },
      ],
    },
    {
      id: "ORD-147",
      table: "T-03",
      time: "09:15 AM",
      status: "Completed",
      server: "John Doe",
      total: "$120",
      items: [
        { name: "3x Grilled Salmon", price: "$28", itemStatus: "Completed" },
        { name: "3x Chocolate Lava Cake", price: "$12", itemStatus: "Completed" },
      ],
    },
  ]

  return (
    <div className="active-orders-page">
      <div className="orders-header">
       
        <button className="back-btn" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Back
        </button>
        <div className="header-title">
          <h1>Active Orders</h1>
          <p>Manage dining orders</p>
        </div>
      </div>
      <div className="orders-stats-row">
        <div className="order-stat-card">
          <span>Active Orders</span>
          <h2>12</h2>
        </div>
        <div className="order-stat-card">
          <span>Ready to Serve</span>
          <h2 className="text-green">5</h2>
        </div>
        <div className="order-stat-card">
          <span>Average Prep Time</span>
          <h2>18 min</h2>
        </div>
      </div>
      <div className="orders-grid">
        {orders.map((order, idx) => (
          <div key={idx} className="order-main-card">
            <div className="order-card-header">
              <div className="order-info">
                <h3>{order.id}</h3>
                <span>{order.table} • {order.time}</span>
              </div>
              <span className={`order-status-pill ${order.status.toLowerCase().replace(" ", "-")}`}>
                {order.status}
              </span>
            </div>
            <div className="order-items-list">
              {order.items.map((item, i) => (
                <div key={i} className="order-item">
                  <div className="item-detail">
                    <p>{item.name}</p>
                    <span className={`item-tag ${item.itemStatus.toLowerCase()}`}>
                      {item.itemStatus}
                    </span>
                  </div>
                  <span className="item-price">{item.price}</span>
                </div>
              ))}
            </div>
            <div className="order-card-footer">
              <div className="footer-info">
                <span>Server: {order.server}</span>
                <span className="footer-total">{order.total}</span>
              </div>
              <div className="footer-btns">
               
                <button 
                  className="btn-view-details" 
                  onClick={() => navigate(`/admin/order/details/${order.id}`)}
                >
                    View Details
                </button>
                 {order.status === "Ready" && (
                  <button className="btn-serve"><FaCheckCircle /> Serve</button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
export default ActiveOrders