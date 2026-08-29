import React, { useState, useEffect } from 'react'
import bookingApi from '../../bookingApi'
import './DiningQueryModal.css'

const DiningQueryModal = ({ show, onClose, prefill, venueOptions = ['Anarkali'], modalTitle = 'Dining Booking', menuData = [], formSource = 'dining-page' }) => {
  // Dining venue & table data
  const venueData = {
    Anarkali: { tables: [
      { tableTypeId: 'T1', tableTypeName: 'T1 - 2 Seats', capacity: 2, available: 4 },
      { tableTypeId: 'T2', tableTypeName: 'T2 - 4 Seats', capacity: 4, available: 6 },
      { tableTypeId: 'T3', tableTypeName: 'T3 - 6 Seats', capacity: 6, available: 7 },
      { tableTypeId: 'T4', tableTypeName: 'T4 - 8 Seats', capacity: 8, available: 6 },
      { tableTypeId: 'T5', tableTypeName: 'T5 - Family', capacity: 10, available: 8 },
      { tableTypeId: 'T6', tableTypeName: 'T6 - King', capacity: 12, available: 8 }
    ]},
    'Koh-i-Noor': { tables: [
      { tableTypeId: 'T1', tableTypeName: 'T1 - 2 Seats', capacity: 2, available: 3 },
      { tableTypeId: 'T2', tableTypeName: 'T2 - 4 Seats', capacity: 4, available: 5 },
      { tableTypeId: 'T3', tableTypeName: 'T3 - 6 Seats', capacity: 6, available: 6 },
      { tableTypeId: 'T4', tableTypeName: 'T4 - 8 Seats', capacity: 8, available: 4 },
      { tableTypeId: 'T5', tableTypeName: 'T5 - Family', capacity: 10, available: 7 },
      { tableTypeId: 'T6', tableTypeName: 'T6 - King', capacity: 12, available: 6 }
    ]},
    'Diwan-e-Khas': { tables: [
      { tableTypeId: 'T1', tableTypeName: 'T1 - 2 Seats', capacity: 2, available: 5 },
      { tableTypeId: 'T2', tableTypeName: 'T2 - 4 Seats', capacity: 4, available: 4 },
      { tableTypeId: 'T3', tableTypeName: 'T3 - 6 Seats', capacity: 6, available: 8 },
      { tableTypeId: 'T4', tableTypeName: 'T4 - 8 Seats', capacity: 8, available: 5 },
      { tableTypeId: 'T5', tableTypeName: 'T5 - Family', capacity: 10, available: 6 },
      { tableTypeId: 'T6', tableTypeName: 'T6 - King', capacity: 12, available: 7 }
    ]},
    'Little China': { tables: [
      { tableTypeId: 'T1', tableTypeName: 'T1 - 2 Seats', capacity: 2, available: 4 },
      { tableTypeId: 'T2', tableTypeName: 'T2 - 4 Seats', capacity: 4, available: 6 },
      { tableTypeId: 'T3', tableTypeName: 'T3 - 6 Seats', capacity: 6, available: 7 },
      { tableTypeId: 'T4', tableTypeName: 'T4 - 8 Seats', capacity: 8, available: 6 },
      { tableTypeId: 'T5', tableTypeName: 'T5 - Family', capacity: 10, available: 8 },
      { tableTypeId: 'T6', tableTypeName: 'T6 - King', capacity: 12, available: 8 }
    ]},
    'Wild Safar': { tables: [
      { tableTypeId: 'T1', tableTypeName: 'T1 - 2 Seats', capacity: 2, available: 3 },
      { tableTypeId: 'T2', tableTypeName: 'T2 - 4 Seats', capacity: 4, available: 5 },
      { tableTypeId: 'T3', tableTypeName: 'T3 - 6 Seats', capacity: 6, available: 6 },
      { tableTypeId: 'T4', tableTypeName: 'T4 - 8 Seats', capacity: 8, available: 4 },
      { tableTypeId: 'T5', tableTypeName: 'T5 - Family', capacity: 10, available: 7 },
      { tableTypeId: 'T6', tableTypeName: 'T6 - King', capacity: 12, available: 6 }
    ]},
    'Rooftop Buffet': { tables: [
      { tableTypeId: 'T1', tableTypeName: 'T1 - 2 Seats', capacity: 2, available: 4 },
      { tableTypeId: 'T2', tableTypeName: 'T2 - 4 Seats', capacity: 4, available: 6 },
      { tableTypeId: 'T3', tableTypeName: 'T3 - 6 Seats', capacity: 6, available: 7 },
      { tableTypeId: 'T4', tableTypeName: 'T4 - 8 Seats', capacity: 8, available: 6 },
      { tableTypeId: 'T5', tableTypeName: 'T5 - Family', capacity: 10, available: 8 },
      { tableTypeId: 'T6', tableTypeName: 'T6 - King', capacity: 12, available: 8 }
    ]}
  }

  // Full menu with 10 categories
  const fullMenuData = [
    { categoryName: 'Appetizers', items: [
      { name: 'Crispy Fried Prawn (7 Pcs)', price: 2840 },
      { name: 'Tempura Prawn (7 Pcs)', price: 2830 },
      { name: 'Panko Fried Fish (7 Pcs)', price: 2290 }
    ]},
    { categoryName: 'BBQ', items: [
      { name: 'Royal BBQ Platter', price: 10530 },
      { name: 'Chicken BBQ Platter', price: 4800 },
      { name: 'Mutton Nali', price: 2850 }
    ]},
    { categoryName: 'Pakistani Mutton', items: [
      { name: 'Mutton Karahi', price: 3200 },
      { name: 'Nihari', price: 2800 },
      { name: 'Paya', price: 2400 }
    ]},
    { categoryName: 'Pakistani Chicken', items: [
      { name: 'Chicken Karahi', price: 2500 },
      { name: 'Biryani', price: 1800 },
      { name: 'Chicken Tandoori', price: 2200 }
    ]},
    { categoryName: 'Chinese Gravies', items: [
      { name: 'Chilli Garlic Prawn', price: 3200 },
      { name: 'Sweet & Sour Chicken', price: 2200 },
      { name: 'Soy Sauce Fish', price: 2500 }
    ]},
    { categoryName: 'Chinese Soups', items: [
      { name: 'Hot & Sour Soup', price: 800 },
      { name: 'Corn Soup', price: 750 },
      { name: 'Prawn Soup', price: 1200 }
    ]},
    { categoryName: 'Continental', items: [
      { name: 'Grilled Fish Steak', price: 3500 },
      { name: 'Herb Marinated Chicken', price: 2800 },
      { name: 'Mushroom Risotto', price: 1800 }
    ]},
    { categoryName: 'Salad & Roti', items: [
      { name: 'Green Salad', price: 400 },
      { name: 'Naan', price: 150 },
      { name: 'Paratha', price: 200 }
    ]},
    { categoryName: 'Desserts', items: [
      { name: 'Kheer', price: 600 },
      { name: 'Gulab Jamun', price: 400 },
      { name: 'Ice Cream', price: 300 }
    ]},
    { categoryName: 'Drinks', items: [
      { name: 'Lassi', price: 350 },
      { name: 'Fresh Juice', price: 300 },
      { name: 'Coffee', price: 250 }
    ]}
  ]

  const [selectedPage, setSelectedPage] = useState(venueOptions[0] || 'Anarkali')
  const [guestName, setGuestName] = useState('')
  const [phone, setPhone] = useState('')
  const [numberOfGuests, setNumberOfGuests] = useState('2')
  const [selectedTableType, setSelectedTableType] = useState(null)
  const [selectedMenuItems, setSelectedMenuItems] = useState([])
  const [activeMenuCategory, setActiveMenuCategory] = useState(0)
  const [note, setNote] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('')
  const [bookedTables, setBookedTables] = useState({})

  // Use passed menuData or fallback to fullMenuData
  const displayMenuData = menuData && menuData.length > 0 ? menuData : fullMenuData

  // Function to get suggested table type based on guest count
  const getSuggestedTableType = (guests) => {
    const guestNum = parseInt(guests)
    const currentVenueTables = venueData[selectedPage]
    
    if (guestNum <= 2) return currentVenueTables.tables.find(t => t.capacity === 2)
    if (guestNum <= 4) return currentVenueTables.tables.find(t => t.capacity === 4)
    if (guestNum <= 6) return currentVenueTables.tables.find(t => t.capacity === 6)
    if (guestNum <= 8) return currentVenueTables.tables.find(t => t.capacity === 8)
    if (guestNum <= 10) return currentVenueTables.tables.find(t => t.capacity === 10)
    return currentVenueTables.tables.find(t => t.capacity === 12)
  }

  // Calculate timing based on party size
  const getRecommendedTiming = () => {
    const guests = parseInt(numberOfGuests)
    if (guests <= 4) return '1.5 hours'
    if (guests <= 8) return '2.5 hours'
    return '3 hours'
  }

  const getDiningDuration = () => {
    const timing = getRecommendedTiming()
    if (timing === '1.5 hours') return 1.5
    if (timing === '2.5 hours') return 2.5
    return 3
  }

  const formatTime = (minutes) => {
    const hour = Math.floor(minutes / 60)
    const minute = minutes % 60
    const period = hour < 12 ? 'AM' : 'PM'
    const hour12 = hour % 12 === 0 ? 12 : hour % 12
    return `${hour12}:${minute.toString().padStart(2, '0')} ${period}`
  }

  // Generate time slots from 7 AM to 11 PM based on dining duration
  const getTimeSlots = () => {
    const duration = getDiningDuration() * 60
    const slots = []
    const startOfDay = 7 * 60
    const endOfDay = 23 * 60

    for (let start = startOfDay; start + duration <= endOfDay; start += duration) {
      const end = start + duration
      slots.push(`${formatTime(start)} - ${formatTime(end)}`)
    }
    return slots
  }

  // Handle guest count change and auto-select table
  const handleGuestChange = (guests) => {
    setNumberOfGuests(guests)
    const suggestedTable = getSuggestedTableType(guests)
    setSelectedTableType(suggestedTable)
  }

  const handleAddMenuItem = (item) => {
    setSelectedMenuItems([...selectedMenuItems, { ...item, id: Date.now() }])
  }

  const handleRemoveMenuItem = (itemId) => {
    setSelectedMenuItems(selectedMenuItems.filter(i => i.id !== itemId))
  }

  const calculateTotal = () => {
    return selectedMenuItems.reduce((sum, item) => sum + (item.price || 0), 0)
  }

  useEffect(() => {
    if (prefill) {
      setGuestName(`${prefill.firstName || ''} ${prefill.lastName || ''}`.trim())
      setPhone(prefill.phone || '')
    }
  }, [prefill, show])

  useEffect(() => {
    // Auto-select table type when guests change
    const suggestedTable = getSuggestedTableType(numberOfGuests)
    setSelectedTableType(suggestedTable)
  }, [numberOfGuests, selectedPage])

  useEffect(() => {
    const slots = getTimeSlots()
    if (slots.length > 0 && !slots.includes(selectedTimeSlot)) {
      setSelectedTimeSlot(slots[0])
    }
  }, [numberOfGuests, selectedTimeSlot])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    const username = localStorage.getItem('bookingUser')
    if (!username) {
      setError('You must be logged in to submit a booking query.')
      return
    }

    if (!guestName || !phone) {
      setError('Please fill in all required fields.')
      return
    }

    try {
      const menuItems = selectedMenuItems.map(item => ({
        name: item.name,
        price: item.price,
        category: displayMenuData.find(cat => cat.items && cat.items.some(i => i.name === item.name))?.categoryName || ''
      }))

      const payload = {
        username,
        guestName,
        phone,
        selectedPage,
        selectedTableType,
        numberOfGuests,
        menuItems,
        recommendedTiming: getRecommendedTiming(),
        selectedTimeSlot: selectedTimeSlot,
        totalAmount: calculateTotal(),
        specialRequests: note,
        formSource
      }
      const res = await bookingApi.post('/booking/dining-query', payload)
      setSuccess(res.data.message || 'Query submitted successfully')
      setTimeout(() => {
        onClose()
      }, 900)
    } catch (err) {
      setError(err?.response?.data?.message || 'Submission failed')
    }
  }

  if (!show) return null

  const currentVenueTables = venueData[selectedPage] || venueData['Anarkali']

  return (
    <div className="dq-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="dq-modal">
        <button className="dq-close" onClick={onClose}>×</button>
        <h2 className="dq-title">{modalTitle}</h2>
        <form className="dq-form" onSubmit={handleSubmit}>
          
          {/* Dining Venue Section */}
          <div className="dq-section">
            <h3 className="dq-section-title">Select Dining Venue</h3>
            <div className="dq-input-group">
              <select 
                value={selectedPage} 
                onChange={(e) => {
                  setSelectedPage(e.target.value)
                  setSelectedTableType(null)
                }}
                className="dq-select"
              >
                {Object.keys(venueData).map(venue => (
                  <option key={venue} value={venue}>{venue}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Guest Details Section */}
          <div className="dq-section">
            <h3 className="dq-section-title">Guest Details</h3>
            <div className="dq-input-row">
              <div className="dq-input-group">
                <input 
                  placeholder="Full Name *" 
                  value={guestName} 
                  onChange={(e) => setGuestName(e.target.value)}
                  className="dq-input"
                  required
                />
              </div>
              <div className="dq-input-group">
                <input 
                  placeholder="Phone Number *" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)}
                  className="dq-input"
                  required
                />
              </div>
            </div>
            <div className="dq-input-row">
              <div className="dq-input-group">
                <label>Number of Guests *</label>
                <select 
                  value={numberOfGuests} 
                  onChange={(e) => handleGuestChange(e.target.value)}
                  className="dq-select"
                >
                  {[2,4,6,8,10,12].map(n => (
                    <option key={n} value={n}>{n} Guest{n > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
              <div className="dq-input-group">
                <label>Dining Duration</label>
                <div className="dq-timing-badge">{getRecommendedTiming()}</div>
              </div>
            </div>
          </div>

          {/* Table Selection Section */}
          <div className="dq-section">
            <h3 className="dq-section-title">Auto-Selected Table Type</h3>
            {selectedTableType && (
              <div className="dq-table-selected" style={{ backgroundColor: '#e8f5e9', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#2e7d32', marginBottom: '8px' }}>✓ Auto-Selected for {numberOfGuests} Guests:</div>
                <div style={{ fontSize: '1rem', color: '#1b5e20' }}><strong>{selectedTableType.tableTypeName}</strong></div>
                <div style={{ fontSize: '0.9rem', color: '#558b2f', marginTop: '5px' }}>Capacity: {selectedTableType.capacity} | Overall Available: {selectedTableType.available}</div>
              </div>
            )}
            <p style={{ fontSize: '0.9rem', color: '#666', fontStyle: 'italic' }}>Table automatically selected based on guest count. Check availability below for your selected time slot.</p>
          </div>

          {/* Availability Check Section */}
          <div className="dq-section" style={{ backgroundColor: '#f5f5f5', padding: '15px', borderRadius: '8px' }}>
            <h3 className="dq-section-title">Availability Check</h3>
            <div className="dq-input-group" style={{ marginBottom: '15px' }}>
              <label>Select Time Slot (7 AM - 11 PM)</label>
              <select 
                value={selectedTimeSlot} 
                onChange={(e) => setSelectedTimeSlot(e.target.value)}
                className="dq-select"
              >
                {getTimeSlots().map(slot => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
            </div>
            {selectedTableType && (
              <div style={{ backgroundColor: '#fff', padding: '12px', borderRadius: '6px', border: '1px solid #ddd' }}>
                <div style={{ fontSize: '0.95rem', marginBottom: '10px' }}>
                  <strong>Time Slot:</strong> {selectedTimeSlot}
                </div>
                <div style={{ fontSize: '0.95rem', marginBottom: '10px' }}>
                  <strong>Table Type:</strong> {selectedTableType.tableTypeName} (Capacity: {selectedTableType.capacity})
                </div>
                <div style={{ fontSize: '0.95rem', color: '#2e7d32', fontWeight: 'bold' }}>
                  ✓ {selectedTableType.available} tables available for {selectedTimeSlot}
                </div>
              </div>
            )}
          </div>

          {/* Menu Categories Section */}
          <div className="dq-section">
            <h3 className="dq-section-title">Browse Menu ({displayMenuData.length} Categories)</h3>
            <div className="dq-menu-categories-list">
              {displayMenuData.map((category, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`dq-menu-category-btn ${activeMenuCategory === idx ? 'active' : ''}`}
                  onClick={() => setActiveMenuCategory(idx)}
                >
                  {category.categoryName}
                </button>
              ))}
            </div>

            {/* Menu Items for Active Category */}
            <div className="dq-menu-items-grid">
              {displayMenuData[activeMenuCategory] && displayMenuData[activeMenuCategory].items && displayMenuData[activeMenuCategory].items.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="dq-menu-item-btn"
                  onClick={() => handleAddMenuItem(item)}
                >
                  <div className="dq-menu-item-name">{item.name}</div>
                  <div className="dq-menu-item-price">Rs. {item.price}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Selected Items Section */}
          {selectedMenuItems.length > 0 && (
            <div className="dq-section">
              <h3 className="dq-section-title">Selected Items ({selectedMenuItems.length})</h3>
              <div className="dq-selected-items-list">
                {selectedMenuItems.map((item) => (
                  <div key={item.id} className="dq-selected-item">
                    <div className="dq-item-info">
                      <div className="dq-item-name">{item.name}</div>
                      <div className="dq-item-price">Rs. {item.price}</div>
                    </div>
                    <button
                      type="button"
                      className="dq-remove-item-btn"
                      onClick={() => handleRemoveMenuItem(item.id)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              <div className="dq-total-amount">
                <strong>Total: Rs. {calculateTotal().toLocaleString()}</strong>
              </div>
            </div>
          )}

          {/* Special Requests Section */}
          <div className="dq-section">
            <h3 className="dq-section-title">Special Requests (Optional)</h3>
            <div className="dq-input-group">
              <textarea 
                placeholder="Any special requirements or preferences?" 
                value={note} 
                onChange={(e) => setNote(e.target.value)}
                className="dq-textarea"
                rows="3"
              />
            </div>
          </div>

          {/* Error/Success Messages */}
          {error && <div className="dq-error">{error}</div>}
          {success && <div className="dq-success">{success}</div>}

          {/* Action Buttons */}
          <div className="dq-actions">
            <button type="submit" className="dq-submit">Submit Booking Query</button>
            <button type="button" className="dq-cancel" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default DiningQueryModal
