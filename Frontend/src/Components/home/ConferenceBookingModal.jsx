import React, { useState, useEffect } from 'react'
import api from '../../api'
import bookingApi from '../../bookingApi'
import './ConferenceBookingModal.css'

const ConferenceBookingModal = ({ show, onClose }) => {
  // Pricing Matrix
  const PRICING_MATRIX = {
    'Conference Room': {
      conference: 12000,
      seminar: 10000,
      workshop: 15000,
    },
    'Meeting Room': {
      conference: 12000,
      seminar: 10000,
      workshop: 15000,
    },
  }

  // Dynamic Hall Options
  const HALL_OPTIONS = {
    'Conference Room': ['Conference 1', 'Conference 2', 'Conference 3'],
    'Meeting Room': ['Meeting 1', 'Meeting 2', 'Meeting 3'],
  }

  const FALLBACK_HALLS = [
    { _id: 'conf-room-1', name: 'Conference 1' },
    { _id: 'conf-room-2', name: 'Conference 2' },
    { _id: 'conf-room-3', name: 'Conference 3' },
    { _id: 'meeting-room-1', name: 'Meeting 1' },
    { _id: 'meeting-room-2', name: 'Meeting 2' },
    { _id: 'meeting-room-3', name: 'Meeting 3' }
  ]

  // Room Type & Basic Info
  const [roomType, setRoomType] = useState('Conference Room')
  const [customerName, setCustomerName] = useState('')
  const [bookingId, setBookingId] = useState('')
  const [contact, setContact] = useState('')
  const [email, setEmail] = useState('')

  // Booking Details
  const [roomCategory, setRoomCategory] = useState('Conference') // Conference or Meeting Room
  const categoryPrefix = roomCategory.toLowerCase().startsWith('meeting') ? 'meeting' : 'conference'
  const [halls, setHalls] = useState(FALLBACK_HALLS)
  const [selectedHall, setSelectedHall] = useState(
    FALLBACK_HALLS.find((room) => room.name?.toLowerCase().startsWith('conference'))?._id || ''
  )
  const [eventType, setEventType] = useState('conference')
  const [eventDate, setEventDate] = useState('')
  const [startTime, setStartTime] = useState('09:00')
  const [endTime, setEndTime] = useState('11:00') // 2 hours duration
  const [duration, setDuration] = useState('2 hours')
  const [expectedAttendees, setExpectedAttendees] = useState('')
  const [status, setStatus] = useState('available') // available or booked
  const [checkingAvailability, setCheckingAvailability] = useState(false)

  // Pricing & Notes
  const [pricingBreakdown, setPricingBreakdown] = useState({
    hallRental: 12000,
    equipment: 0,
    catering: 0,
    subtotal: 12000,
    gst: 600,
    totalAmount: 12600,
  })
  const [requirements, setRequirements] = useState('')
  const [internalNotes, setInternalNotes] = useState('')

  // UI States
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  // Fetch conference halls on mount
  useEffect(() => {
    const fetchHalls = async () => {
      try {
        const res = await api.get('/conference/rooms')
        const rooms = res.data || []
        if (rooms.length > 0) {
          setHalls(rooms)
          const defaultRoom = rooms.find((room) => room.name?.toLowerCase().startsWith(categoryPrefix)) || rooms[0]
          setSelectedHall(defaultRoom._id)
        } else {
          setHalls(FALLBACK_HALLS)
          const defaultRoom = FALLBACK_HALLS.find((room) => room.name?.toLowerCase().startsWith(categoryPrefix))
          if (defaultRoom) setSelectedHall(defaultRoom._id)
        }
      } catch (err) {
        console.error('Failed to fetch conference halls:', err)
        setHalls(FALLBACK_HALLS)
        const defaultRoom = FALLBACK_HALLS.find((room) => room.name?.toLowerCase().startsWith(categoryPrefix))
        if (defaultRoom) setSelectedHall(defaultRoom._id)
      }
    }
    fetchHalls()
  }, [categoryPrefix])

  // Handle room category change - update hall selection
  useEffect(() => {
    if (!halls.length) {
      setSelectedHall('')
      return
    }
    const firstHall = halls.find((room) => room.name?.toLowerCase().startsWith(categoryPrefix))
    if (firstHall) {
      setSelectedHall(firstHall._id)
    }
  }, [roomCategory, halls, categoryPrefix])

  // Check availability whenever date, time, or hall changes
  useEffect(() => {
    if (!eventDate || !startTime || !selectedHall) {
      setStatus('available')
      return
    }

    const checkAvailability = async () => {
      setCheckingAvailability(true)
      try {
        const res = await api.get('/conferences')
        const bookings = res.data || []
        
        // Check if there's a booking for this date, time, and hall
        const isBooked = bookings.some((booking) => {
          const bookingDate = new Date(booking.eventDate).toDateString()
          const selectedDate = new Date(eventDate).toDateString()
          
          if (bookingDate !== selectedDate) return false

          const bookingHallId = typeof booking.conferenceHallId === 'object'
            ? booking.conferenceHallId._id || booking.conferenceHallId.id || booking.conferenceHallId
            : booking.conferenceHallId

          if (bookingHallId !== selectedHall) return false
          
          // Check if time overlaps
          const bookingStart = booking.startTime
          const bookingEnd = booking.endTime
          
          return (
            (startTime >= bookingStart && startTime < bookingEnd) ||
            (endTime > bookingStart && endTime <= bookingEnd) ||
            (startTime <= bookingStart && endTime >= bookingEnd)
          )
        })
        
        setStatus(isBooked ? 'booked' : 'available')
      } catch (err) {
        console.error('Failed to check availability:', err)
        setStatus('available')
      } finally {
        setCheckingAvailability(false)
      }
    }

    checkAvailability()
  }, [eventDate, startTime, endTime, selectedHall])

  // Calculate pricing based on room type and event type
  useEffect(() => {
    const hallPrice = PRICING_MATRIX[roomType]?.[eventType] || 12000
    const subtotal = hallPrice
    const gst = Math.round(subtotal * 0.05)
    const total = subtotal + gst

    setPricingBreakdown({
      hallRental: hallPrice,
      equipment: 0,
      catering: 0,
      subtotal: subtotal,
      gst: gst,
      totalAmount: total,
    })
  }, [roomType, eventType])

  // Calculate end time (2 hours from start time)
  const calculateEndTime = (start) => {
    if (!start) return '11:00'
    const [hours, mins] = start.split(':').map(Number)
    const endHour = (hours + 2) % 24
    return `${String(endHour).padStart(2, '0')}:${String(mins).padStart(2, '0')}`
  }

  // Handle start time change
  const handleStartTimeChange = (time) => {
    setStartTime(time)
    setEndTime(calculateEndTime(time))
  }



  // Generate booking ID
  useEffect(() => {
    if (show) {
      const random = Math.floor(Math.random() * 1000) + 1
      const formattedId = `CB-${String(random).padStart(4, '0')}`
      setBookingId(formattedId)
    }
  }, [show])

  // Ensure modal overlay sits above page and hide navbar while modal is open
  useEffect(() => {
    let _oldNavVis = null
    let _oldNavPointer = null
    let _overlayStyles = null
    let _modalStyles = null

    if (show) {
      document.body.classList.add('cbm-modal-open')

      const nav = document.querySelector('nav')
      if (nav) {
        _oldNavVis = nav.style.visibility
        _oldNavPointer = nav.style.pointerEvents
        nav.style.visibility = 'hidden'
        nav.style.pointerEvents = 'none'
      }

      // Hide header/logo elements that cause overlap (store old display values)
      const headerSelectors = ['.hotel-logo', '.hotel-logo img', '.logo', '.animated-navbar .hotel-logo']
      const _oldDisplays = []
      headerSelectors.forEach((sel) => {
        document.querySelectorAll(sel).forEach((el) => {
          _oldDisplays.push({ el, display: el.style.display || '' })
          el.style.display = 'none'
        })
      })

      const overlay = document.querySelector('.cbm-overlay')
      if (overlay) {
        _overlayStyles = { zIndex: overlay.style.zIndex || '', position: overlay.style.position || '', pointerEvents: overlay.style.pointerEvents || '' }
        overlay.style.position = 'fixed'
        overlay.style.zIndex = '2147483646'
        overlay.style.pointerEvents = 'auto'
      }

      const modal = document.querySelector('.cbm-modal')
      if (modal) {
        _modalStyles = { zIndex: modal.style.zIndex || '', position: modal.style.position || '' }
        modal.style.zIndex = '2147483647'
        modal.style.position = 'relative'
      }
    } else {
      document.body.classList.remove('cbm-modal-open')
    }

    return () => {
      document.body.classList.remove('cbm-modal-open')
      const nav = document.querySelector('nav')
      if (nav) {
        if (_oldNavVis !== null) nav.style.visibility = _oldNavVis
        else nav.style.removeProperty('visibility')
        if (_oldNavPointer !== null) nav.style.pointerEvents = _oldNavPointer
        else nav.style.removeProperty('pointer-events')
      }
      const overlay = document.querySelector('.cbm-overlay')
      if (overlay && _overlayStyles) {
        overlay.style.zIndex = _overlayStyles.zIndex || ''
        overlay.style.position = _overlayStyles.position || ''
        overlay.style.pointerEvents = _overlayStyles.pointerEvents || ''
      }
      const modal = document.querySelector('.cbm-modal')
      if (modal && _modalStyles) {
        modal.style.zIndex = _modalStyles.zIndex || ''
        modal.style.position = _modalStyles.position || ''
      }

      // Restore any hidden header/logo elements
      const headerSelectors = ['.hotel-logo', '.hotel-logo img', '.logo', '.animated-navbar .hotel-logo']
      headerSelectors.forEach((sel) => {
        document.querySelectorAll(sel).forEach((el) => {
          el.style.removeProperty('display')
        })
      })
    }
  }, [show])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!customerName || !contact || !email || !eventDate || !expectedAttendees || !selectedHall) {
      setError('Please fill all required fields')
      return
    }

    if (status === 'booked') {
      setError('This time slot is already booked. Please select a different time or date.')
      return
    }

    setLoading(true)
    try {
      const selectedHallName = halls.find((room) => room._id === selectedHall)?.name || selectedHall
      const payload = {
        organizationName: customerName,
        eventType,
        conferenceHallId: selectedHall,
        eventDate,
        startTime,
        endTime,
        expectedAttendees: Number(expectedAttendees),
        contactPerson: customerName,
        email,
        phone: contact,
        pricingBreakdown,
        requirements,
        internalNotes: `Room Category: ${roomCategory}, Hall: ${selectedHallName}, Booking ID: ${bookingId}, Booking Status: ${status}`,
        status: 'pending',
      }

      await bookingApi.post('/booking/conference-booking', payload)
      setSuccess('Booking submitted successfully!')
      setTimeout(() => {
        onClose()
      }, 1500)
    } catch (err) {
      setError(err?.response?.data?.message || 'Submission failed')
    } finally {
      setLoading(false)
    }
  }

  if (!show) return null

  return (
    <div className="cbm-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="cbm-modal">
        <button className="cbm-close" onClick={onClose}>×</button>
        <h2>Conference Booking Form</h2>

        <form className="cbm-form" onSubmit={handleSubmit}>
          {/* Room Type Selection */}
          <div className="cbm-section">
            <h3>Room Type</h3>
            <select
              value={roomType}
              onChange={(e) => setRoomType(e.target.value)}
              className="cbm-select"
            >
              <option>Conference Room</option>
              <option>Meeting Room</option>
            </select>
          </div>

          {/* Customer Information */}
          <div className="cbm-section">
            <h3>Customer Information</h3>
            <div className="cbm-grid-2">
              <div>
                <label>Customer Name *</label>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                  className="cbm-input"
                />
              </div>
              <div>
                <label>Contact *</label>
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  required
                  className="cbm-input"
                />
              </div>
            </div>
            <div className="cbm-grid-2">
              <div>
                <label>Email *</label>
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="cbm-input"
                />
              </div>
              <div>
                <label>Booking ID</label>
                <input
                  type="text"
                  value={bookingId}
                  disabled
                  className="cbm-input cbm-disabled"
                />
              </div>
            </div>
          </div>

          {/* Booking Details */}
          <div className="cbm-section">
            <h3>Booking Details</h3>
            <div className="cbm-grid-2">
              <div>
                <label>Room Category *</label>
                <select
                  value={roomCategory}
                  onChange={(e) => setRoomCategory(e.target.value)}
                  className="cbm-select"
                >
                  <option value="Conference">Conference</option>
                  <option value="Meeting">Meeting Room</option>
                </select>
              </div>
              <div>
                <label>Hall *</label>
                <select
                  value={selectedHall}
                  onChange={(e) => setSelectedHall(e.target.value)}
                  className="cbm-select"
                  required
                  disabled={!halls.length}
                >
                  {halls.filter((room) => room.name?.toLowerCase().startsWith(categoryPrefix)).map((room) => (
                    <option key={room._id} value={room._id}>{room.name}</option>
                  ))}
                </select>
                {!halls.length && <small style={{ color: '#e74c3c', display: 'block', marginTop: '6px' }}>Loading halls...</small>}
              </div>
            </div>
            <div className="cbm-grid-2">
              <div>
                <label>Event Type *</label>
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  required
                  className="cbm-select"
                >
                  <option value="conference">Conference</option>
                  <option value="seminar">Seminar</option>
                  <option value="workshop">Workshop</option>
                </select>
              </div>
              <div>
                <label>Event Date *</label>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  required
                  className="cbm-input"
                />
              </div>
            </div>
            <div className="cbm-grid-2">
              <div>
                <label>Expected Attendees *</label>
                <input
                  type="number"
                  placeholder="Number of attendees"
                  value={expectedAttendees}
                  onChange={(e) => setExpectedAttendees(e.target.value)}
                  required
                  min="1"
                  className="cbm-input"
                />
              </div>
              <div></div>
            </div>
          </div>

          {/* Duration */}
          <div className="cbm-section">
            <h3>Duration (2 Hours)</h3>
            <div className="cbm-grid-3">
              <div>
                <label>Start Time</label>
                <select
                  value={startTime}
                  onChange={(e) => handleStartTimeChange(e.target.value)}
                  className="cbm-select"
                >
                  <option value="08:00">08:00 AM</option>
                  <option value="09:00">09:00 AM</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="12:00">12:00 PM</option>
                  <option value="13:00">01:00 PM</option>
                  <option value="14:00">02:00 PM</option>
                  <option value="15:00">03:00 PM</option>
                  <option value="16:00">04:00 PM</option>
                  <option value="17:00">05:00 PM</option>
                  <option value="18:00">06:00 PM</option>
                  <option value="19:00">07:00 PM</option>
                  <option value="20:00">08:00 PM</option>
                  <option value="21:00">09:00 PM</option>
                  <option value="22:00">10:00 PM</option>
                </select>
              </div>
              <div>
                <label>End Time (Auto: +2 Hrs)</label>
                <input
                  type="time"
                  value={endTime}
                  disabled
                  className="cbm-input cbm-disabled"
                />
              </div>
              <div>
                <label>Availability Status</label>
                <div className="cbm-status-display">
                  {checkingAvailability ? (
                    <span className="cbm-checking">⏳ Checking...</span>
                  ) : status === 'available' ? (
                    <span className="cbm-available">✓ Available</span>
                  ) : (
                    <span className="cbm-booked">✗ Booked</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Breakdown */}
          <div className="cbm-section">
            <h3>Pricing Breakdown</h3>
            <div className="cbm-grid-3">
              <div>
                <label>Hall Rental (PKR)</label>
                <input
                  type="number"
                  value={pricingBreakdown.hallRental}
                  disabled
                  className="cbm-input cbm-disabled"
                />
                <small style={{ color: '#7f8c8d', marginTop: '4px', display: 'block' }}>
                  Auto calculated
                </small>
              </div>
            </div>

            {/* Summary */}
            <div className="cbm-pricing-summary">
              <div className="cbm-summary-row">
                <span>Subtotal:</span>
                <span>PKR {pricingBreakdown.subtotal.toLocaleString()}</span>
              </div>
              <div className="cbm-summary-row">
                <span>GST (5%):</span>
                <span style={{ color: '#e74c3c' }}>+ PKR {pricingBreakdown.gst.toLocaleString()}</span>
              </div>
              <div className="cbm-summary-row cbm-summary-total">
                <strong>Total Price:</strong>
                <strong style={{ color: '#8e44ad', fontSize: '18px' }}>
                  PKR {pricingBreakdown.totalAmount.toLocaleString()}
                </strong>
              </div>
            </div>
          </div>

          {/* Requirements & Notes */}
          <div className="cbm-section">
            <h3>Additional Information</h3>
            <div>
              <label>Special Requirements</label>
              <textarea
                placeholder="e.g., AV Setup, Catering, Transportation..."
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                rows="3"
                className="cbm-textarea"
              />
            </div>
            <div>
              <label>Internal Notes</label>
              <textarea
                placeholder="Notes for staff..."
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                rows="2"
                className="cbm-textarea"
              />
            </div>
          </div>

          {/* Messages */}
          {error && <div className="cbm-error">{error}</div>}
          {success && <div className="cbm-success">{success}</div>}

          {/* Actions */}
          <div className="cbm-actions">
            <button
              type="submit"
              className="cbm-submit"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Booking'}
            </button>
            <button
              type="button"
              className="cbm-cancel"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ConferenceBookingModal
