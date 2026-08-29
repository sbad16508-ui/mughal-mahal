import { NavLink } from "react-router-dom";
import {
  FaHotel,
  FaBed,
  FaUtensils,
  FaGlassCheers,
  FaUsers,
  FaChartLine,
  FaBoxOpen,
  FaUserCircle,
} from "react-icons/fa";
import "./Sidebar.css";

const Sidebar = () => {
  const menuItems = [
    { name: "Dashboard", link: "/admin/dashboard", icon: <FaChartLine /> },
    { name: "Profile", link: "/admin/profile", icon: <FaUserCircle /> },
    { name: "Rooms", link: "/admin/room", icon: <FaBed /> },
    { name: "Dining", link: "/admin/dining", icon: <FaUtensils /> },
    { name: "Redbox", link: "/admin/redbox", icon: <FaBoxOpen /> },
    { name: "Conference Room", link: "/admin/conference", icon: <FaUsers /> },
    { name: "Banquet", link: "/admin/banquet", icon: <FaGlassCheers /> },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <div className="sidebar-brand">
          <FaHotel size={28} color="#fff" />
          <span>Admin Panel</span>
        </div>
        <div className="sidebar-user">
          <FaUserCircle className="sidebar-user-icon" />
          <div className="sidebar-user-info">
            <p className="sidebar-user-name">Admin</p>
            <p className="sidebar-user-email">test@gmail.com</p>
          </div>
        </div>
      </div>

      <ul className="sidebar-menu">
        {menuItems.map((item) => (
          <li key={item.name}>
            <NavLink
              to={item.link}
              className={({ isActive }) =>
                `anchor-clear${isActive ? " active" : ""}`
              }
            >
              {item.icon} {item.name}
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;