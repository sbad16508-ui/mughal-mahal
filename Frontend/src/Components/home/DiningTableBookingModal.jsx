import React, { useState, useEffect } from 'react'
import bookingApi from '../../bookingApi'
import './DiningTableBookingModal.css'

const DiningTableBookingModal = ({ 
  show, 
  onClose, 
  selectedTableType, 
  selectedTable,
  venueOptions = [],
  menuData = [],
  prefill 
}) => {
  const [diningDate, setDiningDate] = useState('')
  const [diningTime, setDiningTime] = useState('7:00 PM')
  const [guestName, setGuestName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [numberOfGuests, setNumberOfGuests] = useState(selectedTableType?.capacity || 2)
  const [selectedVenue, setSelectedVenue] = useState(venueOptions[0] || '')
  const [selectedItems, setSelectedItems] = useState([])
  const [specialRequests, setSpecialRequests] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (prefill) {
      setGuestName(`${prefill.firstName || ''} ${prefill.lastName || ''}`.trim())
      setPhone(prefill.phone || '')
      setEmail(prefill.email || '')
    }
    // Set default date to today
    const today = new Date().toISOString().split('T')[0]
    setDiningDate(today)
  }, [prefill, show])

  const handleAddMenuItem = (category, item) => {
    const newItem = {
      id: `${category.categoryId}-${item.name}`,
      categoryName: category.categoryName,
      itemName: item.name,
      itemPrice: typeof item.price === 'number' ? item.price : 0,
      quantity: 1
    }
    setSelectedItems([...selectedItems, newItem])
  }

  const handleRemoveMenuItem = (itemId) => {
    setSelectedItems(selectedItems.filter(item => item.id !== itemId))
  }

  const handleUpdateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return
    setSelectedItems(
      selectedItems.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    )
  }

  const calculateTotal = () => {
    return selectedItems.reduce((sum, item) => sum + (item.itemPrice * item.quantity), 0)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    const username = localStorage.getItem('bookingUser')
    if (!username) {
      setError('You must be logged in to book a table.')
      return
    }

    if (!diningDate || !diningTime) {
      setError('Please select date and time')
      return
    }

    if (!guestName || !phone) {
      setError('Please provide your name and phone number')
      return
    }

    try {
      setLoading(true)
      const totalAmount = calculateTotal()
      
      const payload = {
        username,
        guestName,
        phone,
        email,
        address: '',
        serviceType: 'Dining Table',
        selectedPage: selectedVenue,
        selectedTableType: selectedTableType?.tableTypeId,
        selectedTableNumber: selectedTable?.tableNumber,
        numberOfGuests,
        diningDate,
        diningTime,
        itemDetails: selectedItems,
        totalAmount,
        note: specialRequests
      }

      const res = await bookingApi.post('/booking/dining-table-booking', payload)
      setSuccess('Table booked successfully! You will receive a confirmation email.')
      
      setTimeout(() => {
        onClose()
      }, 1500)
    } catch (err) {
      setError(err?.response?.data?.message || 'Booking failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!show) return null

  const timeSlots = (() => {
    const times = []
    for (let h = 11; h <= 23; h++) {
      const hour12 = ((h + 11) % 12) + 1
      const suffix = h < 12 ? 'AM' : 'PM'
      times.push(`${hour12}:00 ${suffix}`)
    }
    return times
  })()

  return (
    <div className="dtb-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="dtb-modal">
        <button className="dtb-close" onClick={onClose}>×</button>
        
        <div className="dtb-header">
          <h2>Book Your Table</h2>
          {selectedTableType && selectedTable && (
            <div className="dtb-table-info">
              <span className="dtb-info-badge">{selectedTableType.tableTypeName}</span>
              <span className="dtb-info-badge">Table {selectedTable.tableNumber}</span>
            </div>
          )}
        </div>

        <form className="dtb-form" onSubmit={handleSubmit}>
          {/* Personal Details Section */}
          <div className="dtb-section">
            <h3>Your Details</h3>
            <div className="dtb-row">
              <input
                type="text"
                placeholder="Full Name *"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                required
              />
              <input
                type="tel"
                placeholder="Phone Number *"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <div className="dtb-row">
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <select value={numberOfGuests} onChange={(e) => setNumberOfGuests(parseInt(e.target.value))}>
                <option value="">Number of Guests *</option>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20].map((num) => (
                  <option key={num} value={num}>{num} Guest{num > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Dining Details Section */}
          <div className="dtb-section">
            <h3>Dining Details</h3>
            <div className="dtb-row">
              <div className="dtb-input-group">
                <label>Date *</label>
                <input
                  type="date"
                  value={diningDate}
                  onChange={(e) => setDiningDate(e.target.value)}
                  required
                />
              </div>
              <div className="dtb-input-group">
                <label>Time *</label>
                <select value={diningTime} onChange={(e) => setDiningTime(e.target.value)} required>
                  {timeSlots.map((time) => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>
            </div>
            {venueOptions.length > 1 && (
              <div className="dtb-row">
                <select value={selectedVenue} onChange={(e) => setSelectedVenue(e.target.value)}>
                  {venueOptions.map((venue) => (
                    <option key={venue} value={venue}>{venue}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Menu Selection Section */}
          {menuData.length > 0 && (
            <div className="dtb-section">
              <h3>Browse Menu Items (Optional)</h3>
              <div className="dtb-menu-categories">
                {menuData.map((category) => (
                  <div key={category.categoryId} className="dtb-category">
                    <h4>{category.categoryName}</h4>
                    <div className="dtb-items-list">
                      {category.items.slice(0, 5).map((item) => (
                        <button
                          key={item.name}
                          type="button"
                          className="dtb-menu-item-btn"
                          onClick={() => handleAddMenuItem(category, item)}
                          title={`Add ${item.name} - Rs. ${item.price}`}
                        >
                          <span className="dtb-item-name">{item.name}</span>
                          <span className="dtb-item-price">Rs. {item.price}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Selected Items Section */}
          {selectedItems.length > 0 && (
            <div className="dtb-section">
              <h3>Selected Items</h3>
              <div className="dtb-selected-items">
                {selectedItems.map((item) => (
                  <div key={item.id} className="dtb-selected-item">
                    <div className="dtb-item-details">
                      <div className="dtb-item-name">{item.itemName}</div>
                      <div className="dtb-item-category">{item.categoryName}</div>
                    </div>
                    <div className="dtb-item-controls">
                      <button
                        type="button"
                        className="dtb-qty-btn"
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                      >
                        −
                      </button>
                      <span className="dtb-qty">{item.quantity}</span>
                      <button
                        type="button"
                        className="dtb-qty-btn"
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    <div className="dtb-item-price">Rs. {item.itemPrice * item.quantity}</div>
                    <button
                      type="button"
                      className="dtb-remove-btn"
                      onClick={() => handleRemoveMenuItem(item.id)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              <div className="dtb-total">
                <span>Total Amount:</span>
                <span className="dtb-total-amount">Rs. {calculateTotal().toLocaleString('en-PK')}</span>
              </div>
            </div>
          )}

          {/* Special Requests */}
          <div className="dtb-section">
            <h3>Special Requests (Optional)</h3>
            <textarea
              placeholder="Any special dietary requirements, preferences, or requests? (e.g., Vegetarian only, Allergies, Celebration details)"
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              rows="3"
            />
          </div>

          {/* Error and Success Messages */}
          {error && <div className="dtb-error">{error}</div>}
          {success && <div className="dtb-success">{success}</div>}

          {/* Actions */}
          <div className="dtb-actions">
            <button type="submit" className="dtb-submit" disabled={loading}>
              {loading ? 'Processing...' : 'Complete Booking'}
            </button>
            <button type="button" className="dtb-cancel" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default DiningTableBookingModal
