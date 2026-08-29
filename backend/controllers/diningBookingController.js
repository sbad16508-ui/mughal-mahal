import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const fallbackFile = path.join(__dirname, '../data/diningBookings.json')

const loadFallbackBookings = () => {
  try {
    if (!fs.existsSync(fallbackFile)) return []
    const raw = fs.readFileSync(fallbackFile, 'utf8')
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch (error) {
    console.error('Failed to read fallback dining bookings file:', error.message)
    return []
  }
}

const saveFallbackBookings = (bookings) => {
  try {
    fs.writeFileSync(fallbackFile, JSON.stringify(bookings, null, 2))
  } catch (error) {
    console.error('Failed to write fallback dining bookings file:', error.message)
  }
}

const saveWithFallback = (bookingPayload, res, successMessage) => {
  const bookings = loadFallbackBookings()
  const fallbackBooking = {
    _id: `${Date.now()}`,
    ...bookingPayload,
    createdAt: new Date().toISOString()
  }
  bookings.unshift(fallbackBooking)
  saveFallbackBookings(bookings)
  return res.status(201).json({ message: successMessage, booking: fallbackBooking, storedLocally: true })
}

export const addDiningBooking = async (req, res) => {
  try {
    const { username, guestName, phone, address, selectedPage, timing, note, numberOfGuests, recommendedTiming, selectedTimeSlot, menuItems, totalAmount, formSource } = req.body
    if (!username || !guestName || !phone) {
      return res.status(400).json({ message: 'username, guestName and phone are required' })
    }

    const bookingPayload = {
      username,
      guestName,
      phone,
      address,
      serviceType: 'Dining',
      selectedPage,
      timing,
      note,
      numberOfGuests,
      recommendedTiming,
      selectedTimeSlot,
      menuItems,
      totalAmount,
      formSource: formSource || 'dining-page',
      status: 'Pending'
    }
    return saveWithFallback(bookingPayload, res, 'Dining query recorded')
  } catch (err) {
    console.error('Add DiningBooking Error:', err)
    return res.status(500).json({ message: err.message })
  }
}

export const addRedboxBooking = async (req, res) => {
  try {
    const {
      username,
      guestName,
      phone,
      address,
      itemCategory,
      itemName,
      itemPrice,
      quantity,
      itemDetails,
      totalAmount,
      timing,
      note
    } = req.body

    const normalizedItems = Array.isArray(itemDetails) && itemDetails.length
      ? itemDetails.map((item) => ({
          itemCategory: item.itemCategory,
          itemName: item.itemName,
          itemPrice: Number(item.itemPrice) || 0,
          quantity: Number(item.quantity) || 1,
          amount: Number(item.amount) || (Number(item.itemPrice) || 0) * (Number(item.quantity) || 1)
        }))
      : [{
          itemCategory,
          itemName,
          itemPrice: Number(itemPrice) || 0,
          quantity: Number(quantity) || 1,
          amount: (Number(itemPrice) || 0) * (Number(quantity) || 1)
        }]

    if (!username || !guestName || !phone || !normalizedItems.length) {
      return res.status(400).json({ message: 'username, guestName, phone, and at least one item are required' })
    }

    const firstItem = normalizedItems[0]
    const bookingPayload = {
      username,
      guestName,
      phone,
      address,
      serviceType: 'Redbox',
      itemCategory: firstItem.itemCategory,
      itemName: firstItem.itemName,
      itemPrice: firstItem.itemPrice,
      quantity: firstItem.quantity,
      itemDetails: normalizedItems,
      totalAmount: Number(totalAmount) || normalizedItems.reduce((sum, item) => sum + item.amount, 0),
      timing,
      note
    }

    return saveWithFallback(bookingPayload, res, 'Redbox order recorded')
  } catch (err) {
    console.error('Add RedboxBooking Error:', err)
    return res.status(500).json({ message: err.message })
  }
}

export const getDiningBookings = async (req, res) => {
  const fallbackBookings = loadFallbackBookings().filter((item) => item.serviceType === 'Dining' && item.formSource === 'dining-page')
  fallbackBookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  return res.status(200).json(fallbackBookings)
}

export const updateDiningBooking = async (req, res) => {
  try {
    const { id } = req.params
    const updates = req.body
    const bookings = loadFallbackBookings()
    const index = bookings.findIndex((item) => item._id === id && item.serviceType === 'Dining')
    if (index === -1) {
      return res.status(404).json({ message: 'Dining query not found' })
    }

    const existingBooking = bookings[index]
    const updatedBooking = {
      ...existingBooking,
      ...updates,
      updatedAt: new Date().toISOString()
    }
    bookings[index] = updatedBooking
    saveFallbackBookings(bookings)
    return res.status(200).json({ message: 'Dining query updated', booking: updatedBooking })
  } catch (err) {
    console.error('Update DiningBooking Error:', err)
    return res.status(500).json({ message: err.message })
  }
}

export const getRedboxBookings = async (req, res) => {
  const fallbackBookings = loadFallbackBookings().filter((item) => item.serviceType === 'Redbox')
  return res.status(200).json(fallbackBookings)
}

export const getDiningBooking = async (req, res) => {
  const { id } = req.params
  const booking = loadFallbackBookings().find((item) => item._id === id)
  if (!booking) return res.status(404).json({ message: 'Not found' })
  return res.status(200).json(booking)
}

export const getRedboxBooking = async (req, res) => {
  const { id } = req.params
  const booking = loadFallbackBookings().find((item) => item._id === id)
  if (!booking) return res.status(404).json({ message: 'Not found' })
  return res.status(200).json(booking)
}

export const deleteRedboxBooking = async (req, res) => {
  try {
    const { id } = req.params
    const bookings = loadFallbackBookings()
    const index = bookings.findIndex((item) => item._id === id && item.serviceType === 'Redbox')
    if (index === -1) {
      return res.status(404).json({ message: 'Redbox order not found' })
    }

    bookings.splice(index, 1)
    saveFallbackBookings(bookings)
    return res.status(200).json({ message: 'Redbox order deleted successfully' })
  } catch (err) {
    console.error('Delete RedboxBooking Error:', err)
    return res.status(500).json({ message: err.message })
  }
}

export const getUserDiningBookings = async (req, res) => {
  const { username } = req.params
  if (!username) return res.status(400).json({ message: 'username required' })
  const bookings = loadFallbackBookings().filter((item) => item.username === username && item.serviceType === 'Dining')
  return res.status(200).json(bookings)
}

export const getDiningTableBookings = async (req, res) => {
  const fallbackBookings = loadFallbackBookings().filter((item) => item.serviceType === 'Dining Table')
  fallbackBookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  return res.status(200).json(fallbackBookings)
}

export const deleteDiningBooking = async (req, res) => {
  try {
    const { id } = req.params
    const bookings = loadFallbackBookings()
    const index = bookings.findIndex((item) => item._id === id && item.serviceType === 'Dining')
    if (index === -1) {
      return res.status(404).json({ message: 'Dining query not found' })
    }

    bookings.splice(index, 1)
    saveFallbackBookings(bookings)
    return res.status(200).json({ message: 'Dining query deleted successfully' })
  } catch (err) {
    console.error('Delete DiningBooking Error:', err)
    return res.status(500).json({ message: err.message })
  }
}

export const getUserRedboxBookings = async (req, res) => {
  const { username } = req.params
  if (!username) return res.status(400).json({ message: 'username required' })
  const bookings = loadFallbackBookings().filter((item) => item.username === username && item.serviceType === 'Redbox')
  return res.status(200).json(bookings)
}

export const addDiningTableBooking = async (req, res) => {
  try {
    const {
      username,
      guestName,
      phone,
      email,
      serviceType,
      selectedPage,
      selectedTableType,
      selectedTableNumber,
      numberOfGuests,
      diningDate,
      diningTime,
      itemDetails,
      totalAmount,
      note
    } = req.body

    if (!username || !guestName || !phone || !selectedTableType || !selectedTableNumber) {
      return res.status(400).json({ message: 'Missing required booking details' })
    }

    const normalizedItems = Array.isArray(itemDetails) && itemDetails.length
      ? itemDetails.map((item) => ({
          itemCategory: item.categoryName || item.itemCategory,
          itemName: item.itemName,
          itemPrice: Number(item.itemPrice) || 0,
          quantity: Number(item.quantity) || 1,
          amount: Number(item.itemPrice || 0) * Number(item.quantity || 1)
        }))
      : []

    const bookingPayload = {
      username,
      guestName,
      phone,
      email,
      address: '',
      serviceType: 'Dining Table',
      selectedPage,
      selectedTableType,
      selectedTableNumber,
      numberOfGuests,
      diningDate,
      diningTime,
      itemDetails: normalizedItems,
      totalAmount: Number(totalAmount) || normalizedItems.reduce((sum, item) => sum + item.amount, 0),
      note
    }

    return saveWithFallback(bookingPayload, res, 'Table booking confirmed successfully')
  } catch (err) {
    console.error('Add DiningTableBooking Error:', err)
    return res.status(500).json({ message: err.message })
  }
}
