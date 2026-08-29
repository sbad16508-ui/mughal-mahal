import { useEffect, useState } from "react";
import { FaPlus, FaBell, FaFilter, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import "./AdminRedbox.css";

const AdminRedbox = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRedboxOrders = async () => {
      setLoading(true);
      try {
        const response = await api.get("/redbox-orders");
        setOrders(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error("Error fetching redbox orders:", err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRedboxOrders();
  }, []);

  const today = new Date().toISOString().slice(0, 10);
  const metrics = [
    { label: "Total Orders", value: orders.length },
    { label: "Orders Today", value: orders.filter((order) => order.createdAt?.startsWith(today)).length },
    {
      label: "Avg Order",
      value: `PKR ${(
        orders.reduce((sum, order) => sum + Number(order.totalAmount || 0), 0) /
        (orders.length || 1)
      ).toFixed(0)}`,
    },
    { label: "Latest Status", value: orders[0]?.note ? "Live" : "Idle" },
  ];

  const handleDelete = async (orderId, guestName) => {
    if (!window.confirm(`Delete redbox order for ${guestName || "this guest"}?`)) return;

    try {
      await api.delete(`/redbox-order/${orderId}`);
      setOrders((prev) => prev.filter((order) => order._id !== orderId));
    } catch (err) {
      console.error("Failed to delete redbox order:", err);
      alert("Unable to delete order, please try again.");
    }
  };

  return (
    <div className="redbox-page">
      <div className="rb-header">
        <div className="rb-header-copy">
          <h1>Inventory Management</h1>
          <p>Manage hotel inventory and supplies</p>
        </div>
        <div className="rb-actions">
          <button className="btn-alert" onClick={() => navigate("/admin/alerts")}> <FaBell /> View Alerts </button>
        </div>
      </div>

      <div className="metrics-row">
        {metrics.map((metric) => (
          <div key={metric.label} className="metric-card">
            <p>{metric.label}</p>
            <h3>{metric.value}</h3>
          </div>
        ))}
      </div>

      <div className="rb-main-card">
        <div className="table-top">
          <div className="search-wrapper">
            <FaSearch className="search-icon" />
            <input type="text" placeholder="Search inventory..." />
          </div>
          <button className="btn-filter"> <FaFilter /> Filter </button>
        </div>

        {loading ? (
          <div className="loading-state">Loading redbox orders...</div>
        ) : (
          <div className="table-scroll">
            <table className="rb-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Guest</th>
                  <th>Items</th>
                  <th>Amount</th>
                  <th>Timing</th>
                  <th>Contact</th>
                  <th>Notes</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id || order.id || JSON.stringify(order)}>
                    <td>{order._id?.slice(-6).toUpperCase() || "�"}</td>
                    <td>{order.guestName || "�"}</td>
                    <td>
                      {order.itemDetails?.map((item) => `${item.itemName} x ${item.quantity}`).join(", ") || order.itemName || "�"}
                    </td>
                    <td>PKR {Number(order.totalAmount || 0).toLocaleString()}</td>
                    <td>{order.timing || "�"}</td>
                    <td>{order.phone || "�"}</td>
                    <td>{order.note || "�"}</td>
                    <td>
                      <button className="delete-order-btn" onClick={() => handleDelete(order._id, order.guestName)} title="Delete order">�</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="rb-activity-card">
        <h3>Recent Activity</h3>
        {orders.slice(0, 4).map((order, i) => (
          <div key={order._id || i} className="activity-item">
            <span className="dot green" />
            <div>
              <p>{`${order.guestName || "Guest"} placed a redbox order`}</p>
              <small>{order.createdAt ? new Date(order.createdAt).toLocaleString() : "Recently submitted"}</small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminRedbox;
