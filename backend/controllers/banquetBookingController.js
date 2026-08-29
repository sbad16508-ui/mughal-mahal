import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const fallbackFile = path.join(__dirname, '../data/banquetBookings.json')

const loadFallbackBookings = () => {
  try {
    if (!fs.existsSync(fallbackFile)) return []
    const raw = fs.readFileSync(fallbackFile, 'utf8')
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch (error) {
    console.error('Failed to read fallback banquet bookings file:', error.message)
    return []
  }
}

const saveFallbackBookings = (bookings) => {
  try {
    fs.writeFileSync(fallbackFile, JSON.stringify(bookings, null, 2))
  } catch (error) {
    console.error('Failed to write fallback banquet bookings file:', error.message)
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

export const addBanquetBooking = async (req, res) => {
  try {
    const {
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
    } = req.body

    if (!username || !eventId || !eventName || !phone) {
      return res.status(400).json({ message: 'username, eventId, eventName, and phone are required' })
    }

    const bookingPayload = {
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
      price,
      serviceType: 'Banquet'
    }
    return saveWithFallback(bookingPayload, res, 'Banquet query recorded successfully')
  } catch (err) {
    console.error('Add BanquetBooking Error:', err)
    return res.status(500).json({ message: err.message })
  }
}

export const getUserBanquetBookings = async (req, res) => {
  try {
    const { username } = req.params
    if (!username) {
      return res.status(400).json({ message: 'username parameter is required' })
    }
    const bookings = loadFallbackBookings()
    const userBookings = bookings.filter((booking) => booking.username === username)
    return res.json(userBookings)
  } catch (err) {
    console.error('Get BanquetBookings Error:', err)
    return res.status(500).json({ message: err.message })
  }
}

export const getAllBanquetBookings = async (req, res) => {
  try {
    const bookings = loadFallbackBookings()
    return res.json(bookings)
  } catch (err) {
    console.error('Get All Banquet Bookings Error:', err)
    return res.status(500).json({ message: err.message })
  }
}
