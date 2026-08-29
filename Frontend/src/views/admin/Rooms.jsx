import { useMemo, useState, useEffect } from "react"
import { FaCheckCircle, FaRegCircle, FaEdit, FaTrash, FaPlus } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import api from "../../api"
import roomCards from "../../data/roomData"
import "./Rooms.css"

export default function AdminRooms() {
  // Edit rooms functionality
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [updatingId, setUpdatingId] = useState(null)
  const [rooms, setRooms] = useState([])
  const [showEditSection, setShowEditSection] = useState(false)
  const [loadingRooms, setLoadingRooms] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newRoomType, setNewRoomType] = useState(roomCards[0]?.id || '')
  const [newRoomCount, setNewRoomCount] = useState('1')
  const [addingRooms, setAddingRooms] = useState(false)

  useEffect(() => {
    let mounted = true
    const fetchBookings = async () => {
      try {
        const res = await api.get('/bookings')
        const data = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.value)
            ? res.data.value
            : res.data.bookings || []
        const roomBookings = data.filter(b => (b.bookingType || 'room').toLowerCase() === 'room')
        if (mounted) setBookings(roomBookings)
      } catch (err) {
        console.error('Failed fetching bookings:', err)
        if (mounted) setBookings([])
      }
    }
    fetchBookings()
    return () => { mounted = false }
  }, [])

  const fetchRooms = async () => {
    setLoadingRooms(true)
    try {
      const res = await api.get('/rooms')
      const data = Array.isArray(res.data) ? res.data : res.data.rooms || []
      setRooms(data)
    } catch (err) {
      console.error('Failed fetching rooms:', err)
      setRooms([])
    } finally {
      setLoadingRooms(false)
    }
  }

  useEffect(() => {
    if (showEditSection && rooms.length === 0) {
      fetchRooms()
    }
  }, [showEditSection])

  const roomBookingCounts = useMemo(() => {
    return bookings.reduce((acc, booking) => {
      const type = typeof booking.roomVenue === 'object'
        ? String(booking.roomVenue.type || booking.roomVenue.roomType || booking.roomVenue.id || '').toLowerCase()
        : String(booking.roomVenue || '').toLowerCase()
      if (!type) return acc
      acc[type] = (acc[type] || 0) + 1
      return acc
    }, {})
  }, [bookings])

  const handleDelete = async (booking) => {
    const id = booking._id || booking.id
    if (!id) return alert('Unable to identify this booking for deletion')
    const ok = window.confirm(`Delete booking for ${booking.guestName || booking.email || 'guest'}?`)
    if (!ok) return
    try {
      await api.delete(`/booking/${id}`)
      setBookings((prev) => prev.filter((b) => (b._id || b.id) !== id))
    } catch (err) {
      console.error('Failed to delete booking', err)
      alert('Failed to delete booking')
    }
  }

  const handleDeleteRoom = async (room) => {
    const id = room._id || room.id
    if (!id) return alert('Unable to identify this room for deletion')
    const ok = window.confirm(`Delete room ${room.roomNo}?`)
    if (!ok) return
    try {
      await api.delete(`/room/${id}`)
      setRooms((prev) => prev.filter((r) => (r._id || r.id) !== id))
      alert('Room deleted successfully')
    } catch (err) {
      console.error('Failed to delete room', err)
      alert('Failed to delete room')
    }
  }

  const normalizeRoomType = (value) => String(value || '').toLowerCase().replace(/ room$/, '').trim()

  const getRoomTemplate = (card) => {
    const roomTypeName = card.title.split(' - ')[0].replace(/ Room$/, '')
    return rooms.find((room) => normalizeRoomType(room.roomType) === normalizeRoomType(roomTypeName)) || {
      roomType: roomTypeName,
      floor: '',
      size: '',
      capacity: 2,
      price: card.price.match(/[\d,]+/)?.[0]?.replace(/,/g, '') || '',
      bedType: 'King',
      viewType: 'City',
      description: card.description,
      amenities: [],
      status: 'Available'
    }
  }

  const handleAddRooms = async (event) => {
    event.preventDefault()
    const count = Number(newRoomCount)
    const card = roomCards.find((item) => item.id === newRoomType)
    if (!card || !Number.isInteger(count) || count < 1) {
      alert('Please select a room type and enter a valid quantity.')
      return
    }

    const template = getRoomTemplate(card)
    const usedNumbers = rooms
      .map((room) => Number(room.roomNo))
      .filter((roomNumber) => Number.isInteger(roomNumber))
    let nextRoomNumber = Math.max(0, ...usedNumbers) + 1

    setAddingRooms(true)
    try {
      const createdRooms = []
      for (let index = 0; index < count; index += 1) {
        const roomData = {
          roomNo: String(nextRoomNumber++),
          roomType: template.roomType,
          floor: template.floor || '1',
          size: template.size || '35 sqm',
          capacity: template.capacity || 2,
          price: template.price || 0,
          bedType: template.bedType || 'King',
          viewType: template.viewType || 'City',
          description: template.description || card.description,
          amenities: template.amenities || [],
          status: 'Available'
        }
        const response = await api.post('/room', roomData)
        createdRooms.push(response.data.room || roomData)
      }
      setRooms((previousRooms) => [...createdRooms, ...previousRooms])
      setShowAddModal(false)
      setNewRoomCount('1')
      alert(`${count} room${count > 1 ? 's' : ''} added successfully.`)
    } catch (error) {
      console.error('Failed to add rooms:', error)
      alert(error.response?.data?.message || 'Unable to add rooms.')
    } finally {
      setAddingRooms(false)
    }
  }

  const toggleBookingStatus = async (booking) => {
    const id = booking._id || booking.id
    if (!id) return

    const currentStatus = (booking.status || 'pending').toLowerCase()
    const nextStatus = currentStatus === 'confirmed' ? 'pending' : 'confirmed'

    setUpdatingId(id)
    try {
      await api.put(`/booking/${id}`, { status: nextStatus })
      setBookings((prev) => prev.map((b) => ((b._id || b.id) === id ? { ...b, status: nextStatus } : b)))
    } catch (err) {
      console.error('Failed to update booking status', err)
      alert('Unable to update booking status')
    } finally {
      setUpdatingId(null)
    }
  }

  const liveRoomTypes = roomCards.map((card) => {
    const roomTypeName = card.title.split(' - ')[0].replace(/ Room$/, '')
    const roomsForType = rooms.filter(
      (room) => String(room.roomType).toLowerCase() === roomTypeName.toLowerCase()
    )
    const total = roomsForType.length > 0 ? roomsForType.length : card.roomCount
    const booked = roomsForType.filter(
      (room) => String(room.status).toLowerCase() !== 'available'
    ).length
    const available = Math.max(0, total - booked)
    return { ...card, booked, available, total }
  })

  return (
    <div className="rooms-page">
      <div className="rooms-header">
        <div>
          <h1>Rooms</h1>
          <p>Room bookings submitted from /book-now are shown here.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            style={{
              padding: '10px 20px',
              backgroundColor: '#d4af37',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '7px'
            }}
          >
            <FaPlus /> Add Room
          </button>
          <button
            type="button"
            className="edit-rooms-btn"
            onClick={() => setShowEditSection(!showEditSection)}
            style={{
              padding: '10px 20px',
              backgroundColor: showEditSection ? '#dc3545' : '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              transition: 'all 0.3s'
            }}
          >
            {showEditSection ? 'Hide Edit Rooms' : 'Edit Rooms'}
          </button>
        </div>
      </div>

      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 20, background: 'rgba(0, 0, 0, 0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <form onSubmit={handleAddRooms} style={{ width: 'min(440px, 100%)', background: 'white', borderRadius: 10, padding: 24, boxShadow: '0 12px 35px rgba(0,0,0,0.2)' }}>
            <h2 style={{ marginTop: 0 }}>Add Rooms</h2>
            <p style={{ color: '#666', marginBottom: 20 }}>Select the room type and number of rooms to add.</p>
            <label style={{ display: 'block', marginBottom: 7, fontWeight: 600 }}>Room Type</label>
            <select value={newRoomType} onChange={(event) => setNewRoomType(event.target.value)} style={{ width: '100%', padding: 10, marginBottom: 16 }}>
              {roomCards.map((card) => <option key={card.id} value={card.id}>{card.title}</option>)}
            </select>
            <label style={{ display: 'block', marginBottom: 7, fontWeight: 600 }}>How many rooms?</label>
            <input type="number" min="1" max="100" value={newRoomCount} onChange={(event) => setNewRoomCount(event.target.value)} style={{ width: '100%', padding: 10, marginBottom: 22 }} required />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button type="button" onClick={() => setShowAddModal(false)} style={{ padding: '10px 18px', border: '1px solid #ddd', background: 'white', borderRadius: 5, cursor: 'pointer' }}>Cancel</button>
              <button type="submit" disabled={addingRooms} style={{ padding: '10px 18px', border: 'none', background: '#d4af37', color: 'white', borderRadius: 5, cursor: addingRooms ? 'wait' : 'pointer', fontWeight: 600 }}>{addingRooms ? 'Adding...' : 'Yes, Add Rooms'}</button>
            </div>
          </form>
        </div>
      )}

      {showEditSection && (
        <section className="white-card-section">
          <h3>Edit Rooms</h3>
          {loadingRooms ? (
            <div style={{ padding: 18, color: '#666' }}>Loading rooms...</div>
          ) : rooms.length === 0 ? (
            <div style={{ padding: 18, color: '#666' }}>No rooms found.</div>
          ) : (
            <div className="rooms-edit-table">
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>Room No</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>Type</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>Floor</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>Capacity</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>Price</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>Status</th>
                    <th style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rooms.map((room) => (
                    <tr key={room._id || room.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                      <td style={{ padding: '12px' }}>{room.roomNo}</td>
                      <td style={{ padding: '12px' }}>{room.roomType}</td>
                      <td style={{ padding: '12px' }}>{room.floor}</td>
                      <td style={{ padding: '12px' }}>{room.capacity}</td>
                      <td style={{ padding: '12px' }}>Rs. {room.price}</td>
                      <td style={{ padding: '12px' }}>
                        <span style={{
                          padding: '4px 8px',
                          backgroundColor: room.status === 'Available' ? '#d4edda' : '#f8d7da',
                          color: room.status === 'Available' ? '#155724' : '#721c24',
                          borderRadius: '3px',
                          fontSize: '12px'
                        }}>
                          {room.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <button
                          onClick={() => navigate(`/admin/room/edit/${room._id || room.id}`)}
                          style={{
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: '3px',
                            cursor: 'pointer',
                            marginRight: '8px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px'
                          }}
                          title="Edit room"
                        >
                          <FaEdit /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteRoom(room)}
                          style={{
                            backgroundColor: '#dc3545',
                            color: 'white',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: '3px',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px'
                          }}
                          title="Delete room"
                        >
                          <FaTrash /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      <section className="white-card-section">
        <h3>Live Room Booking Status</h3>
        <div className="tables-status-grid">
          {liveRoomTypes.map((room) => (
            <div key={room.id} className="table-status-box">
              <span className="table-name">{room.title}</span>
              <span className="table-capacity">{room.total} total</span>
              <span className={`status-tag ${room.available > 0 ? 'available' : 'occupied'}`}>
                {room.available} available, {room.booked} booked
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="white-card-section">
        <h3>Recent Room Bookings</h3>
        {bookings.length === 0 ? (
          <div style={{ padding: 18, color: '#666' }}>No room bookings submitted yet.</div>
        ) : (
          <div className="bookings-list">
            {bookings.map((b) => {
              const rawRoomType = typeof b.roomVenue === 'object' ? b.roomVenue.type || b.roomVenue.roomType || 'room' : b.roomVenue || 'room'
              const roomInfo = roomCards.find((r) => r.id === rawRoomType)
              const roomType = roomInfo ? roomInfo.title : rawRoomType
              const roomNumber = typeof b.roomVenue === 'object' && b.roomVenue.selectedRoom ? b.roomVenue.selectedRoom : (b.roomVenue && b.roomVenue.roomNo) || 'Not assigned'

              return (
                <div key={b._id || b.id || `${b.email}-${b.checkInDate}`} className="booking-row">
                  <div className="booking-left">
                    <div className="booking-name">{b.guestName || b.fullname || 'Guest'}</div>
                    <div className="booking-meta-inline">
                      <span><strong>Contact:</strong> {b.phone || b.email || 'N/A'}</span>
                      <span><strong>Room Type:</strong> {roomType}</span>
                      <span><strong>Room #:</strong> {roomNumber}</span>
                    </div>
                  </div>
                  <div className="booking-right">
                    <div className="booking-dt"><strong>Check-In:</strong> {b.checkInDate ? new Date(b.checkInDate).toLocaleString() : '—'}</div>
                    <div className="booking-dt"><strong>Check-Out:</strong> {b.checkOutDate ? new Date(b.checkOutDate).toLocaleString() : '—'}</div>
                    <div className="booking-actions-row">
                      <button
                        className={`status-toggle ${(b.status || 'pending').toLowerCase() === 'confirmed' ? 'confirmed' : 'pending'}`}
                        onClick={() => toggleBookingStatus(b)}
                        disabled={updatingId === (b._id || b.id)}
                        title={((b.status || 'pending').toLowerCase() === 'confirmed') ? 'Confirmed' : 'Pending'}
                      >
                        {((b.status || 'pending').toLowerCase() === 'confirmed') ? <FaCheckCircle /> : <FaRegCircle />}
                      </button>
                      <button className="action-btn delete-btn" onClick={() => handleDelete(b)} title="Delete booking">×</button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}