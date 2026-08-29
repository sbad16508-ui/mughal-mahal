import React, { useState, useEffect } from 'react'
import bookingApi from '../../bookingApi'
import './BanquetQueryModal.css'

const BanquetQueryModal = ({ show, onClose, prefill }) => {
  const [eventId, setEventId] = useState('')
  const [eventName, setEventName] = useState('')
  const [venue, setVenue] = useState('Sheesh Mahal')
  const [subHall, setSubHall] = useState('S-M1')
  const [eventDate, setEventDate] = useState('')
  const [timeSlot, setTimeSlot] = useState('9am - 12pm')
  const [guestName, setGuestName] = useState('')
  const [phone, setPhone] = useState('')
  const [note, setNote] = useState('')
  const [status, setStatus] = useState('Pending')
  const [price, setPrice] = useState(0)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const priceMap = {
    'S-M1': 80000,
    'S-M2': 75000,
    'H-H1': 65000,
    'H-H2': 71000
  }

  const subHallsMap = {
    'Sheesh Mahal': ['S-M1', 'S-M2'],
    'Husnain Hall': ['H-H1', 'H-H2']
  }

  const timeSlots = ['9am - 12pm', '1pm - 3pm', '4pm - 7pm']

  // Generate Event ID on mount
  useEffect(() => {
    if (show && !eventId) {
      const newEventId = 'EV' + Date.now()
      setEventId(newEventId)
    }
  }, [show])

  // Prefill user data
  useEffect(() => {
    if (prefill && show) {
      setGuestName(`${prefill.firstName || ''} ${prefill.lastName || ''}`.trim())
      setPhone(prefill.phone || '')
    }
  }, [prefill, show])

  // Update sub-hall when venue changes
  useEffect(() => {
    const subHalls = subHallsMap[venue]
    if (subHalls && !subHalls.includes(subHall)) {
      setSubHall(subHalls[0])
    }
  }, [venue])

  // Update price when sub-hall changes
  useEffect(() => {
    setPrice(priceMap[subHall] || 0)
  }, [subHall])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    const username = localStorage.getItem('bookingUser')
    if (!username) {
      setError('You must be logged in to submit a booking query.')
      return
    }

    if (!eventName || !eventDate) {
      setError('Please fill in Event Name and Date')
      return
    }

    try {
      const payload = {
        username,
        eventId,
        eventName,
        venue,
        subHall,
        eventDate,
        timeSlot,
        guestName,
        phone,
        note,
        status,
        price
      }
      const res = await bookingApi.post('/booking/banquet-query', payload)
      setSuccess(res.data.message || 'Banquet query submitted successfully')
      setTimeout(() => {
        onClose()
        // Reset form
        setEventName('')
        setEventDate('')
        setVenue('Sheesh Mahal')
        setSubHall('S-M1')
        setTimeSlot('9am - 12pm')
        setGuestName('')
        setPhone('')
        setNote('')
        setStatus('Pending')
      }, 900)
    } catch (err) {
      setError(err?.response?.data?.message || 'Submission failed')
    }
  }

  if (!show) return null

  return (
    <div className="bq-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bq-modal">
        <button className="bq-close" onClick={onClose}>×</button>
        <h2 className="bq-title">Banquet Booking Query</h2>
        
        <form className="bq-form" onSubmit={handleSubmit}>
          {/* Row 1: Event ID & Event Name */}
          <div className="bq-row">
            <div className="bq-field bq-field-half">
              <input type="text" value={eventId} disabled className="bq-disabled" placeholder="Event ID" />
            </div>
            <div className="bq-field bq-field-half">
              <input type="text" placeholder="Event Name" value={eventName} onChange={(e) => setEventName(e.target.value)} required />
            </div>
          </div>

          {/* Row 2: Venue & Sub-Hall */}
          <div className="bq-row">
            <div className="bq-field bq-field-half">
              <select value={venue} onChange={(e) => setVenue(e.target.value)}>
                <option>Sheesh Mahal</option>
                <option>Husnain Hall</option>
              </select>
            </div>
            <div className="bq-field bq-field-half">
              <select value={subHall} onChange={(e) => setSubHall(e.target.value)}>
                {subHallsMap[venue].map((hall) => (
                  <option key={hall} value={hall}>{hall}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 3: Date & Time Slot */}
          <div className="bq-row">
            <div className="bq-field bq-field-half">
              <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} required />
            </div>
            <div className="bq-field bq-field-half">
              <select value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)}>
                {timeSlots.map((slot) => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 4: Status & Price */}
          <div className="bq-row">
            <div className="bq-field bq-field-half">
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option>Pending</option>
                <option>Confirmed</option>
                <option>Cancelled</option>
              </select>
            </div>
            <div className="bq-field bq-field-half">
              <input type="text" value={`Rs. ${price.toLocaleString()}`} disabled className="bq-disabled" placeholder="Price" />
            </div>
          </div>

          {/* Row 5: Guest Name & Phone */}
          <div className="bq-row">
            <div className="bq-field bq-field-half">
              <input type="text" placeholder="Guest Name" value={guestName} onChange={(e) => setGuestName(e.target.value)} />
            </div>
            <div className="bq-field bq-field-half">
              <input type="tel" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
          </div>

          {/* Row 6: Note/Action */}
          <div className="bq-row">
            <div className="bq-field bq-field-full">
              <textarea placeholder="Note / Special Request" value={note} onChange={(e) => setNote(e.target.value)} />
            </div>
          </div>

          {/* Messages */}
          {error && <div className="bq-error">{error}</div>}
          {success && <div className="bq-success">{success}</div>}

          {/* Action Buttons */}
          <div className="bq-actions">
            <button type="submit" className="bq-submit">Submit Query</button>
            <button type="button" className="bq-cancel" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default BanquetQueryModal
