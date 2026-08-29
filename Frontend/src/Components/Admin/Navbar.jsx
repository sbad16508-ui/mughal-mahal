import { motion } from "framer-motion";
import { FaUserCircle, FaSignOutAlt, FaUser } from "react-icons/fa";
import { useState } from "react";
import './Navbar.css';
import api from "../../api";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/Mediacenter/ItemsImages/logo.png";

const Navbar = () => {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const logout = async () => {
    try {
      const res = await api.post('/logout')
      if (res.data.message === 'Logout') {
        localStorage.removeItem('user')
        localStorage.removeItem('adminToken')
        setOpen(false)
        navigate('/admin/login')
      }
    } catch (err) {
      console.error('Logout failed', err)
      localStorage.removeItem('user')
      localStorage.removeItem('adminToken')
      setOpen(false)
      navigate('/admin/login')
    }
  }

  return (
    <motion.nav
      className="navbar animated-navbar d-flex align-items-center"
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <div className="navbar-left">
        <a href="/" className="hotel-logo">
          <img src={logo} alt="logo" />
          <h4 className="brand-animate">Mughal Mehal</h4>
        </a>
      </div>

      <div className="navbar-center">
        <h2 className="navbar-title">Admin Panel</h2>
      </div>

      <div className="navbar-right">
        <div className="user-dropdown">
          <div
            className="user-trigger"
            onClick={() => setOpen(!open)}
          >
            <FaUserCircle className="user-icon" />
            <span className="user-name">Admin</span>
          </div>

          {open && (
            <motion.div
              className={`dropdown-menu-custom ${open ? 'show' : ''}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <button
                type="button"
                className="dropdown-link"
                onClick={() => {
                  navigate('/admin/profile')
                  setOpen(false)
                }}
              >
                <FaUser /> Profile
              </button>
              <div className="dropdown-divider"></div>
              <button className="logout-btn" onClick={logout}>
                <FaSignOutAlt /> Logout
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.nav>
  );
  
};

export default Navbar;
