import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./AdminAlerts.css";

const AdminAlerts = () => {
  const navigate = useNavigate();
  
  const alerts = [
    { name: "Banquet Tables", type: "Critical Stock", curr: 5, min: 15, id: "INV-005", cat: "Banquet", date: "Apr 3, 2026" },
    { name: "Dining Plates", type: "Low Stock", curr: 25, min: 50, id: "INV-003", cat: "Dining", date: "Apr 2, 2026" },
    { name: "Hand Towels", type: "Critical Stock", curr: 8, min: 30, id: "INV-012", cat: "Rooms", date: "Apr 1, 2026" },
    { name: "Coffee Beans", type: "Low Stock", curr: 15, min: 30, id: "INV-018", cat: "Dining", date: "Mar 31, 2026" },
    { name: "Conference Pens", type: "Low Stock", curr: 40, min: 100, id: "INV-022", cat: "Conference", date: "Mar 30, 2026" }
  ];

  return (
    <div className="alerts-container">
      <button className="back-btn" onClick={() => navigate(-1)}><FaArrowLeft/> Back</button>
      
      <div className="alerts-header">
        <h1>Inventory Alerts</h1>
        <p>Low stock and critical inventory items</p>
      </div>

      
      <div className="alert-stats">
        <div className="stat-card"><span>Critical</span><h3>2</h3></div>
        <div className="stat-card"><span>Low Stock</span><h3>3</h3></div>
        <div className="stat-card"><span>Total Alerts</span><h3>5</h3></div>
      </div>

      <h2>All Alerts</h2>
      
      
      <div className="alert-list">
        {alerts.map((a, i) => (
          <div key={i} className={`alert-card ${a.type.toLowerCase().replace(" ", "-")}`}>
            <div className="alert-info">
              <h3>{a.name} <span>{a.type}</span></h3>
              <p>Current stock: <strong>{a.curr}</strong> | Minimum required: <strong>{a.min}</strong></p>
              <small>ID: {a.id} | Category: {a.cat} | {a.date}</small>
            </div>
            <div className="alert-actions">
              <button className="view-btn">View Item</button>
              <button className="restock-btn">Restock</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default AdminAlerts;