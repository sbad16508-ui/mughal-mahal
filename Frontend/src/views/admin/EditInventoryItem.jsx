import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./EditInventoryItem.css";

const EditInventoryItem = () => {
  const navigate = useNavigate();

  return (
    <div className="edit-item-page">
      <button className="back-btn" onClick={() => navigate(-1)}><FaArrowLeft/> Back</button>
      <h1>Edit Inventory Item</h1>
      <p>Update inventory item</p>

      <div className="edit-container">
        
        <div className="form-card">
          <h3>Item Information</h3>
          <div className="grid-form">
            <input type="text" placeholder="Item Name *" defaultValue="Bed Linens - King" />
            <input type="text" placeholder="Category *" />
            <input type="text" placeholder="Unit *" />
            <input type="number" placeholder="Current Quantity" />
            <input type="number" placeholder="Minimum Stock Level"  />
            <input type="number" placeholder="Reorder Point" /> 
            <input type="number" placeholder="Unit Price ($)"  />
            <input type="text" placeholder="Supplier" />
            <input type="text" placeholder="Storage Location" />
          </div>
          <textarea placeholder="Enter item description..."></textarea>
        </div>

        
        <div className="side-panel">
          <div className="form-card">
            <h3>Status</h3>
            <select><option>Stock Status *</option><option>In Stock</option><option>Low Stock</option><option>Critical</option></select>
          </div>
          <div className="form-card">
            <h3>Image</h3>
            <div className="upload-box">Upload item image</div>
          </div>
          <div className="action-btns">
            <button className="update-btn">Update Item</button>
            <button className="cancel-btn">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default EditInventoryItem;