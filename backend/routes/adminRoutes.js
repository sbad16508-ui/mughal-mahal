import express from 'express'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { addRoom, getRoom, getRooms, updateRoom, deleteRoom, removeRoomImage } from '../controllers/roomController.js'
import { addDining, getDining, getDinings, updateDining, deleteDining } from '../controllers/diningController.js'
import { addDiningBooking, getDiningBookings, getDiningBooking, deleteDiningBooking, updateDiningBooking, getDiningTableBookings, getRedboxBookings, getRedboxBooking, deleteRedboxBooking } from '../controllers/diningBookingController.js'
import { addBooking, getBooking, getBookings, updateBooking, deleteBooking } from '../controllers/bookingController.js'
import { getBanquet, getBanquets, updateBanquet } from '../controllers/banquetController.js'
import { getConferenceRoom, getConferenceRooms, updateConferenceRoom } from '../controllers/conferenceRoomController.js'
import multer from 'multer'
import { getEvent, getEvents, addEvent, updateEvent, deleteEvent } from '../controllers/eventController.js'
import { getConference, getConferences, addConferenceBooking, updateConference, deleteConference } from '../controllers/conferenceController.js'
import { addContact, getContacts } from '../controllers/contactController.js'
import { verifyToken } from '../middlewares/authMiddleware.js'

const router = express.Router()

// ensure uploads/rooms directory exists
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const uploadDir = path.join(__dirname, '..', 'uploads', 'rooms')
if (!fs.existsSync(uploadDir)) {
	fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
	destination: (req, file, cb) => cb(null, uploadDir),
	filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
})
const upload = multer({ storage })

router.post('/room', verifyToken, upload.single('image'), addRoom)
router.get('/rooms', getRooms)
router.get('/room/:id', getRoom)
router.put('/room/:id', verifyToken, upload.single('image'), updateRoom)
router.delete('/room/:id', verifyToken, deleteRoom)
router.put('/room/:id/remove-image', verifyToken, removeRoomImage)

router.post('/dining', verifyToken, addDining)
router.get('/dinings', getDinings)
router.get('/dining/:id', getDining)
router.put('/dining/:id', verifyToken, updateDining)
router.delete('/dining/:id', verifyToken, deleteDining)

// Dining booking queries for admin
router.get('/dining-queries', getDiningBookings)
router.get('/dining-query/:id', getDiningBooking)
router.put('/dining-query/:id', verifyToken, updateDiningBooking)
router.delete('/dining-query/:id', verifyToken, deleteDiningBooking)
router.get('/dining-table-bookings', getDiningTableBookings)
router.get('/redbox-orders', getRedboxBookings)
router.get('/redbox-order/:id', getRedboxBooking)
router.delete('/redbox-order/:id', verifyToken, deleteRedboxBooking)

router.post('/booking', verifyToken, addBooking)
router.get('/bookings', getBookings)
router.get('/booking/:id', getBooking)
router.put('/booking/:id', verifyToken, updateBooking)
router.delete('/booking/:id', verifyToken, deleteBooking)

router.get('/banquets', getBanquets)
router.get('/banquet/:id', getBanquet)
router.put('/banquet/:id', verifyToken, updateBanquet)

router.get('/conference/rooms', getConferenceRooms)
router.get('/conference/room/:id', getConferenceRoom)
router.put('/conference/room/:id', verifyToken, updateConferenceRoom)

router.get('/events', getEvents)
router.get('/event/:id', getEvent)
router.post('/event', verifyToken, addEvent)
router.put('/event/:id', verifyToken, updateEvent)
router.delete('/event/:id', verifyToken, deleteEvent)

router.get('/conferences', getConferences)
router.get('/conference/:id', getConference)
router.post('/conference', verifyToken, addConferenceBooking)
router.put('/conference/:id', verifyToken, updateConference)
router.delete('/conference/:id', verifyToken, deleteConference)

// Contact form endpoints
router.post('/contact', addContact)
router.get('/contacts', verifyToken, getContacts)

export default router

// Public route to list profile upload filenames
router.get('/uploads/profile-list', (req, res) => {
	const uploadsDir = path.join(__dirname, '..', 'uploads', 'profile')
	fs.readdir(uploadsDir, (err, files) => {
		if (err) return res.status(500).json({ error: 'Unable to list uploads' })
		// return only filenames
		res.json({ files })
	})
})