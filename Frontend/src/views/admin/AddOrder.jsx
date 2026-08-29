import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaPlus, FaTrash, FaSave } from "react-icons/fa";
import "./AddOrder.css";

const AddOrder = () => {
  const navigate = useNavigate();
  const [table, setTable] = useState("");
  const [orderItems, setOrderItems] = useState([{ name: "", qty: 1, price: 15 }]); // Default sample data
  
  const menuOptions = [
    { name: "Grilled Salmon", price: 28 },
    { name: "Caesar Salad", price: 12 },
    { name: "Lobster Bisque", price: 18 }
  ];

  const addItem = () => setOrderItems([...orderItems, { name: "", qty: 1, price: 0 }]);
  
  const updateItem = (index, field, value) => {
    const updated = [...orderItems];
    if (field === "name") {
      const selected = menuOptions.find(i => i.name === value);
      updated[index].name = value;
      updated[index].price = selected ? selected.price : 0;
    } else {
      updated[index][field] = value;
    }
    setOrderItems(updated);
  };

  const removeItem = (index) => setOrderItems(orderItems.filter((_, i) => i !== index));
  
  const subtotal = orderItems.reduce((acc, item) => acc + (item.price * item.qty), 0);

  return (
    <div className="add-order-container">
      <div className="add-order-header">
        <button className="btn-back-sq" onClick={() => navigate(-1)}><FaArrowLeft /> Back</button>
        <div className="header-text">
          <h1>New Dining Order</h1>
          <p>Create a new order for restaurant tables</p>
        </div>
      </div>

      <div className="add-order-grid">
        <div className="form-main-content">
          <div className="form-card">
            <h3>Table Selection</h3>
            <select className="full-width" value={table} onChange={(e) => setTable(e.target.value)}>
              <option value="">Select Table *</option>
              {['T-01', 'T-02', 'T-03', 'T-04', 'T-05'].map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div className="form-card">
            <h3>Order Items</h3>
            {orderItems.map((item, index) => (
              <div key={index} className="order-item-row">
                <select value={item.name} onChange={(e) => updateItem(index, "name", e.target.value)}>
                  <option value="">Select Item</option>
                  {menuOptions.map(m => <option key={m.name} value={m.name}>{m.name}</option>)}
                </select>
                <input type="number" value={item.qty} onChange={(e) => updateItem(index, "qty", e.target.value)} min="1" />
                <span className="item-total">${item.price * item.qty}</span>
                <button className="btn-del" onClick={() => removeItem(index)}><FaTrash /></button>
              </div>
            ))}
            <button className="btn-add-item" onClick={addItem}><FaPlus /> Add Item</button>
          </div>
        </div>

        <div className="form-sidebar">
          <div className="form-card billing-summary">
            <h3>Bill Summary</h3>
            <div className="bill-row"><span>Subtotal:</span> <span>${subtotal}</span></div>
            <div className="bill-row"><span>Tax (10%):</span> <span>${(subtotal * 0.1).toFixed(2)}</span></div>
            <div className="bill-row total"><span>Total:</span> <span>${(subtotal * 1.1).toFixed(2)}</span></div>
            <button className="btn-create-order" onClick={() => alert("Order Placed!")}>
              <FaSave /> Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddOrder;