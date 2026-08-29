import React, { useState, useEffect } from 'react'
import bookingApi from '../../bookingApi'
import './RedboxOrderModal.css'

const menuItems = [
  { category: 'Frozen Drinks', items: [
      { name: 'Cappuccino', price: 280 },
      { name: 'Passion Fruit', price: 280 },
      { name: 'Raspberry', price: 280 },
      { name: 'Strawberry', price: 280 },
      { name: 'Guava', price: 280 },
      { name: 'Hurricane', price: 280 },
      { name: 'Papaya', price: 280 },
      { name: 'Mint Margarita', price: 280 },
      { name: 'Ice Cream', price: 280 }
    ]
  },
  { category: 'Cake Pieces (Sweet Affairs)', items: [
      { name: 'Cadbury', price: 250 },
      { name: 'Bounty', price: 250 },
      { name: 'Kitkat', price: 250 },
      { name: 'Snacker', price: 250 },
      { name: 'Galaxy', price: 250 },
      { name: 'Fudge', price: 250 },
      { name: 'Dairy Milk', price: 250 },
      { name: 'Black Forest', price: 180 },
      { name: 'Special Pineapple', price: 180 },
      { name: 'Special Mango (Seasonal)', price: 180 }
    ]
  },
  { category: 'Burger Sandwiches & Pizza', items: [
      { name: 'Grilled Chicken Sandwich', price: 275 },
      { name: 'Chicken Club Sandwich', price: 350 },
      { name: 'Juicy Fried Chicken Burger', price: 325 },
      { name: 'Jalapeno Chicken Burger', price: 350 },
      { name: 'Chicken Tikka Pizza', price: 870 },
      { name: 'Chicken Fajita Pizza', price: 860 },
      { name: 'Chicken Milano Pizza', price: 860 },
      { name: 'Chicken Pineapple Pizza', price: 880 }
    ]
  },
  { category: 'Special Drinks', items: [
      { name: 'Love Story', price: 250 },
      { name: 'Kiss Me', price: 250 },
      { name: 'Singapore Supreme', price: 250 },
      { name: 'Blue Dove', price: 250 },
      { name: 'Mint Margarita', price: 250 },
      { name: 'Cold Coffee', price: 250 },
      { name: 'Pink Lady', price: 250 },
      { name: 'Raspberry Cooler', price: 250 },
      { name: 'Green Apple Friz', price: 250 },
      { name: 'Strawberryade', price: 250 },
      { name: 'Pina Colada', price: 250 },
      { name: 'Iced Coffee', price: 250 }
    ]
  },
  { category: 'Ice Cream', items: [
      { name: 'Mango (S./Scoop)', price: 75 },
      { name: 'Mango (D./Scoop)', price: 140 },
      { name: 'Pistachio (S./Scoop)', price: 75 },
      { name: 'Pistachio (D./Scoop)', price: 140 },
      { name: 'Chocolate Chip (S./Scoop)', price: 75 },
      { name: 'Chocolate Chip (D./Scoop)', price: 140 },
      { name: 'Caramel Crunch (S./Scoop)', price: 75 },
      { name: 'Caramel Crunch (D./Scoop)', price: 140 },
      { name: 'Strawberry (S./Scoop)', price: 75 },
      { name: 'Strawberry (D./Scoop)', price: 140 },
      { name: 'Vanilla (S./Scoop)', price: 75 },
      { name: 'Vanilla (D./Scoop)', price: 140 },
      { name: 'Kulfa (S./Scoop)', price: 75 },
      { name: 'Kulfa (D./Scoop)', price: 140 },
      { name: 'Tutti Fruity (S./Scoop)', price: 75 },
      { name: 'Tutti Fruity (D./Scoop)', price: 140 },
      { name: 'Chocolate (S./Scoop)', price: 75 },
      { name: 'Chocolate (D./Scoop)', price: 140 }
    ]
  },
  { category: 'Cold Beverages', items: [
      { name: 'Soft Drink', price: 60 },
      { name: 'Fresh Lime', price: 75 },
      { name: 'Can Soft Drinks', price: 85 },
      { name: 'Mineral Water (L)', price: 95 },
      { name: 'Green Tea', price: 60 },
      { name: 'Mix Tea', price: 70 }
    ]
  },
  { category: 'Hot Beverages', items: [
      { name: 'Cappuccino', price: 150 },
      { name: 'Cafe Latte', price: 150 },
      { name: 'Café Mocca', price: 150 },
      { name: 'Espresso', price: 120 },
      { name: 'American Coffee', price: 120 },
      { name: 'Hot Chocolate', price: 200 }
    ]
  },
  { category: 'Milk Shake', items: [
      { name: 'Apple', price: 280 },
      { name: 'Banana', price: 280 },
      { name: 'Strawberry', price: 280 },
      { name: 'Date Shake', price: 280 },
      { name: 'Almond Shake', price: 280 },
      { name: 'Ice Cream Shake (Any Flavor)', price: 280 },
      { name: 'Pineapple Shake', price: 280 },
      { name: 'Mango', price: 280 },
      { name: 'Chocolate', price: 280 },
      { name: 'Coconut', price: 280 }
    ]
  }
]

const getInitialOrderItem = () => ({
  id: Date.now() + Math.random(),
  category: menuItems[0].category,
  itemName: menuItems[0].items[0].name,
  quantity: 1
})

const RedboxOrderModal = ({ prefill }) => {
  const [orderItems, setOrderItems] = useState([getInitialOrderItem()])
  const [guestName, setGuestName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [timing, setTiming] = useState('9:00 AM')
  const [note, setNote] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (prefill) {
      setGuestName(`${prefill.firstName || ''} ${prefill.lastName || ''}`.trim())
      setPhone(prefill.phone || '')
      setAddress(prefill.address || '')
    }
  }, [prefill])

  const updateOrderItem = (id, key, value) => {
    setOrderItems((prev) => prev.map((item) => {
      if (item.id !== id) return item
      const next = { ...item }
      if (key === 'category') {
        next.category = value
        const category = menuItems.find((cat) => cat.category === value)
        next.itemName = category?.items[0]?.name || ''
      } else if (key === 'itemName') {
        next.itemName = value
      } else if (key === 'quantity') {
        next.quantity = Math.max(1, Number(value) || 1)
      }
      return next
    }))
  }

  const addOrderItem = () => {
    setOrderItems((prev) => [...prev, getInitialOrderItem()])
  }

  const removeOrderItem = (id) => {
    if (orderItems.length === 1) return
    setOrderItems((prev) => prev.filter((item) => item.id !== id))
  }

  const getItemDetail = (item) => {
    const category = menuItems.find((cat) => cat.category === item.category) || menuItems[0]
    const itemData = category.items.find((menuItem) => menuItem.name === item.itemName) || category.items[0]
    return { category, item: itemData }
  }

  const orderDetails = orderItems.map((item) => {
    const { category, item: itemData } = getItemDetail(item)
    const qty = Math.max(1, Number(item.quantity) || 1)
    const amount = itemData.price * qty
    return {
      itemCategory: category.category,
      itemName: itemData.name,
      itemPrice: itemData.price,
      quantity: qty,
      amount
    }
  })

  const totalAmount = orderDetails.reduce((sum, item) => sum + item.amount, 0)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    const username = localStorage.getItem('bookingUser')
    if (!username) {
      setError('Login required to place Redbox order.')
      return
    }

    if (!orderDetails.length) {
      setError('Add at least one order item.')
      return
    }

    try {
      const payload = {
        username,
        guestName,
        phone,
        address,
        itemDetails: orderDetails,
        totalAmount,
        timing,
        note
      }
      const res = await bookingApi.post('/booking/redbox-order', payload)
      setSuccess(res.data.message || 'Order submitted')
      setOrderItems([getInitialOrderItem()])
      setTiming('9:00 AM')
      setNote('')
    } catch (err) {
      setError(err?.response?.data?.message || 'Order submission failed')
    }
  }

  return (
    <div className="redbox-order-panel">
      <div className="redbox-order-modal">
        <h3>Redbox Order Form</h3>
        <form className="redbox-order-form" onSubmit={handleSubmit}>
          <label>Order Items</label>
          <div className="redbox-order-items">
            {orderItems.map((orderItem, index) => {
              const { category, item } = getItemDetail(orderItem)
              return (
                <div className="redbox-order-item-card" key={orderItem.id}>
                  <div className="redbox-order-item-header">
                    <span>Item {index + 1}</span>
                    <button
                      type="button"
                      className="redbox-order-item-remove"
                      onClick={() => removeOrderItem(orderItem.id)}
                    >
                      Remove
                    </button>
                  </div>

                  <div className="redbox-order-item-fields">
                    <div className="redbox-order-item-field">
                      <label>Category</label>
                      <select
                        value={orderItem.category}
                        onChange={(e) => updateOrderItem(orderItem.id, 'category', e.target.value)}
                      >
                        {menuItems.map((cat) => (
                          <option key={cat.category} value={cat.category}>{cat.category}</option>
                        ))}
                      </select>
                    </div>

                    <div className="redbox-order-item-field">
                      <label>Item</label>
                      <select
                        value={orderItem.itemName}
                        onChange={(e) => updateOrderItem(orderItem.id, 'itemName', e.target.value)}
                      >
                        {category.items.map((menuItem) => (
                          <option key={menuItem.name} value={menuItem.name}>{menuItem.name} — Rs. {menuItem.price}</option>
                        ))}
                      </select>
                    </div>

                    <div className="redbox-order-item-field">
                      <label>Qty</label>
                      <input
                        type="number"
                        min="1"
                        value={orderItem.quantity}
                        onChange={(e) => updateOrderItem(orderItem.id, 'quantity', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="redbox-order-item-summary">
                    {`${item.name} x ${orderItem.quantity} = Rs. ${item.price * orderItem.quantity}`}
                  </div>
                </div>
              )
            })}
          </div>

          <button type="button" className="redbox-order-add-item" onClick={addOrderItem}>
            + Add another item
          </button>

          <label>Your Name</label>
          <input value={guestName} onChange={(e) => setGuestName(e.target.value)} placeholder="Enter your name" />

          <label>Phone</label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Enter phone" />

          <label>Address</label>
          <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Enter address" />

          <label>Timing</label>
          <select value={timing} onChange={(e) => setTiming(e.target.value)}>
            {Array.from({ length: 15 }, (_, i) => {
              const hour = 9 + i
              const h12 = ((hour + 11) % 12) + 1
              const suffix = hour < 12 ? 'AM' : 'PM'
              return `${h12}:00 ${suffix}`
            }).map((time) => <option key={time} value={time}>{time}</option>)}
          </select>

          <label>Note / Request</label>
          <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Any additional request" />

          <div className="redbox-order-summary">Total: Rs. {totalAmount}</div>
          {error && <div className="redbox-order-error">{error}</div>}
          {success && <div className="redbox-order-success">{success}</div>}
          <div className="redbox-order-actions">
            <button type="submit" className="redbox-order-submit">Place Order</button>
            <button type="button" className="redbox-order-cancel" onClick={() => {
              setOrderItems([getInitialOrderItem()])
              setTiming('9:00 AM')
              setNote('')
              setError('')
              setSuccess('')
            }}>Reset</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RedboxOrderModal
