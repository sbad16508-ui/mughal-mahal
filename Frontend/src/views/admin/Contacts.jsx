import { useEffect, useState } from 'react'
import api from '../../api'
import './Contacts.css'

const ContactMessages = () => {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true)
        const res = await api.get('/contacts')
        setMessages(Array.isArray(res.data) ? res.data : [])
      } catch (err) {
        console.error('Failed to load contacts', err)
      } finally {
        setLoading(false)
      }
    }
    fetchMessages()
  }, [])

  const totalMessages = messages.length
  const totalRevenue = messages.reduce((sum, msg) => sum + 0, 0)

  return (
    <div className="contacts-page">
      <div className="contacts-header">
        <div>
          <h1>Contact Messages</h1>
          <p>All website contact form submissions from the public site.</p>
        </div>
      </div>

      <div className="contact-stats-grid">
        <div className="contact-stat-card">
          <h3>Total Messages</h3>
          <p>{totalMessages}</p>
        </div>
        <div className="contact-stat-card">
          <h3>Revenue Impact</h3>
          <p>PKR 0</p>
        </div>
      </div>

      <div className="contacts-table-wrap">
        <table className="contacts-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Message</th>
              <th>Submitted</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="loading-row">Loading messages...</td>
              </tr>
            ) : messages.length === 0 ? (
              <tr>
                <td colSpan={4} className="empty-row">No messages yet.</td>
              </tr>
            ) : (
              messages.map((msg) => (
                <tr key={msg._id || msg.createdAt}>
                  <td>{msg.name}</td>
                  <td>{msg.email}</td>
                  <td>{msg.message}</td>
                  <td>{new Date(msg.createdAt).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ContactMessages
