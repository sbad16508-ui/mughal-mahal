import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "./Login.css"
import api from '../../api.js'
const Login = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  useEffect(() => {
    try {
      const user = localStorage.getItem('user')
      if (user) navigate('/admin/dashboard')
    } catch (e) {
      /* ignore */
    }
  }, [navigate])
const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await api.post("/login", { email, password })
      const message = res.data?.message?.toLowerCase?.() || ''
      if (message.includes('login') && message.includes('successful')) {
        localStorage.setItem('user', JSON.stringify(res.data.info))
        if (res.data.token) {
          localStorage.setItem('adminToken', res.data.token)
        }
        navigate("/admin/dashboard")
      } else {
        alert(res.data.message || 'Login failed')
      }
    } catch (err) {
      alert(err?.response?.data?.message || 'Login request failed')
    }
  }
 return (
    <div className="mm-absolute-viewport">
      <div className="mm-absolute-card">
         <div className="mm-absolute-badge">
          <svg viewBox="0 0 100 100" className="mm-absolute-svg">
            <path
              d="M50,18 C64,18 70,30 70,48 L70,76 L30,76 L30,48 C30,30 36,18 50,18 Z"
              fill="none"
              stroke="#d4a017"
              strokeWidth="5"
            />
            <circle cx="50" cy="45" r="6" fill="#d4a017" />
            <polygon points="46,51 54,51 56,68 44,68" fill="#d4a017" />
          </svg>
        </div>
        <div className="mm-absolute-header">
          <h1 className="mm-absolute-title">MUGHAL MAHAL</h1>
          <p className="mm-absolute-tagline">Sign in to manage your royal destination.</p>
        </div>
        <form onSubmit={handleSubmit} className="mm-absolute-form">
           <div className="mm-absolute-field-block">
            <input
              type="email"
              className="mm-absolute-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              required
            />
          </div>
           <div className="mm-absolute-field-block">
            <input
              type="password"
              className="mm-absolute-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
          </div>
          <button type="submit" className="mm-absolute-btn">
            Sign In
          </button>
        </form>
        <div className="mm-absolute-footer">
          <span className="mm-absolute-link" onClick={() => navigate("/")}>
            ← Back to Website
          </span>
        </div>
        </div>
    </div>
  )
}
export default Login