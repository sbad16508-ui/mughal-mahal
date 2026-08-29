import React from 'react'
import { useNavigate } from 'react-router-dom'
import Footer from '../../Components/home/Footer'
import './AdminEntry.css'

const AdminEntry = () => {
  const navigate = useNavigate()
  return (
    <div className="admin-entry-page">
      <header className="ae-header">
        <div className="ae-brand">MUGHAL MAHAL</div>
        <nav className="ae-nav">
          <button className="ae-btn" onClick={() => navigate('/')}>Home</button>
          <button className="ae-btn ae-admin" onClick={() => navigate('/admin/login')}>Admin Login</button>
        </nav>
      </header>

      <main className="ae-main">
        <h2>Admin Area</h2>
        <p>This page does not expose the admin UI. Use the button above to sign in.</p>
      </main>

      <Footer />
    </div>
  )
}

export default AdminEntry
