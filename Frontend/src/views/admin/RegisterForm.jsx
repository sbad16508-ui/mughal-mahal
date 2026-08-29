import { useState } from 'react'
import { FaUser, FaEnvelope, FaLock, FaUserShield, FaHotel } from 'react-icons/fa'
import './RegisterForm.css'
import api from '../../api.js'
import { useNavigate } from 'react-router-dom'

const RegisterForm = () => {
  const navigate = useNavigate()
  const [fullname, setFullname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const role = 'Admin'
 const handleSubmit = async (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      alert("Passwords do not match!")
      return
    }

    try {
      const res = await api.post('/register', { fullname, email, password })
      const message = res.data?.message?.toLowerCase?.() || ''
      if (message.includes('register') && message.includes('success')) {
        localStorage.setItem('user', JSON.stringify(res.data.info))
        navigate("/admin/dashboard")
      } else {
        alert(res.data.message || 'Registration failed')
      }
    } catch (err) {
      alert(err?.response?.data?.message || 'Registration request failed')
    }
  }
 return (
    <div className="rf-auth-container">
      <div className="rf-auth-card">
        <div className="rf-brand-header">
          <FaHotel className="rf-brand-icon" />
          <h2>Mughal Mehal</h2>
          <p>Create an administrative account</p>
        </div>
        <form onSubmit={handleSubmit} className="rf-form-body">
          <div className="rf-input-group">
            <div className="rf-input-wrapper">
              <FaUser className="rf-field-icon" />
              <input
                type="text"
                name="fullname"
                placeholder="John Smith"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="rf-input-group">
            <div className="rf-input-wrapper">
              <FaEnvelope className="rf-field-icon" />
              <input
                type="email"
                name="email"
                placeholder="admin@mughalmehal.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="rf-input-group">
            <div className="rf-input-wrapper">
              <FaLock className="rf-field-icon" />
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="rf-input-group">
            <div className="rf-input-wrapper">
              <FaLock className="rf-field-icon" />
              <input
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <button type="submit" className="rf-submit-btn">
            Register Account
          </button>
        </form>
        <div className="rf-footer-redirect">
          <p>Already have an admin account? <a href="/admin">Sign In</a></p>
        </div>
          </div>
    </div>
  )
}
export default RegisterForm