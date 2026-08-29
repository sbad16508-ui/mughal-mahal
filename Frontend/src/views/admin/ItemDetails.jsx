import { FaArrowLeft, FaEdit, FaTrash, FaBox } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./ItemDetails.css";

const ItemDetails = () => {
  const navigate = useNavigate();

  const item = {
    name: "Bed Linens - King", id: "INV-001", cat: "Rooms", qty: "145 sets", 
    min: "50 sets", supplier: "Luxury Textiles Inc.", loc: "Warehouse A - Shelf 12",
    price: "$45", total: "$6,525", status: "In Stock", lastRestocked: "Mar 28, 2026"
  };

  const history = [
    { change: "+50 sets", user: "John Admin", date: "Mar 28, 2026" },
    { change: "+75 sets", user: "Sarah Admin", date: "Feb 15, 2026" },
    { change: "+100 sets", user: "Mike Admin", date: "Jan 20, 2026" }
  ];

  return (
    <div className="details-page">
      
      <div className="top-bar">
  <button className="back-btn" onClick={() => navigate(-1)}><FaArrowLeft/> Back</button>
  <div className="actions">
    <button className="edit-btn"><FaEdit /> Edit</button>
    <button className="del-btn"><FaTrash /> Delete</button>
  </div>
</div>

      <div className="details-header">
        <h1>{item.name}</h1>
        <p>{item.id}</p>
      </div>

      <div className="details-layout">
        <div className="left-column">
          
          <div className="main-info-card">
            <div className="img-box">
              <FaBox size={60} color="#3b82f6" />
              <h3>{item.name}</h3>
            </div>
            <div className="info-grid">
              <div><p>Item ID</p><strong>{item.id}</strong></div>
              <div><p>Category</p><strong>{item.cat}</strong></div>
              <div><p>Current Quantity</p><strong>{item.qty}</strong></div>
              <div><p>Minimum Stock</p><strong>{item.min}</strong></div>
              <div><p>Supplier</p><strong>{item.supplier}</strong></div>
              <div><p>Location</p><strong>{item.loc}</strong></div>
              <div><p>Unit Price</p><strong>{item.price}</strong></div>
              <div><p>Total Value</p><strong>{item.total}</strong></div>
            </div>
          </div>

          
          <div className="history-card">
            <h3>Restock History</h3>
            {history.map((h, i) => (
              <div key={i} className="history-item">
                <div><strong>{h.change}</strong><p>By {h.user}</p></div>
                <span>{h.date}</span>
              </div>
            ))}
          </div>
        </div>

        
        <div className="right-column">
          <div className="status-card">
            <h3>Status</h3>
            <div className="stat-row"><span>Stock Status:</span> <span className="pill in-stock">{item.status}</span></div>
            <div className="stat-row"><span>Last Restocked:</span> <strong>{item.lastRestocked}</strong></div>
            <div className="stat-row"><span>Reorder Point:</span> <strong>{item.min}</strong></div>
            <button className="restock-btn">Restock Item</button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ItemDetails;