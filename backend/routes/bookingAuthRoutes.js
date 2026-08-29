import express from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { registerInit, verifyOtp, loginBookingUser, getBookingProfile, updateBookingProfile } from '../controllers/bookingAuthController.js'
import { addDiningBooking, addRedboxBooking, getUserDiningBookings, getUserRedboxBookings, addDiningTableBooking } from '../controllers/diningBookingController.js'
import { addBanquetBooking, getUserBanquetBookings, getAllBanquetBookings } from '../controllers/banquetBookingController.js'
import { addBooking } from '../controllers/bookingController.js'
import { addConferenceBooking } from '../controllers/conferenceController.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const uploadDir = path.join(__dirname, '../uploads/profile')

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now()
    const cleanName = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_')
    cb(null, `${timestamp}-${cleanName}`)
  }
})

const upload = multer({ storage })
const router = express.Router()

router.post('/register-init', upload.single('profileImage'), registerInit)
router.post('/verify-otp', verifyOtp)
router.post('/login', loginBookingUser)
router.get('/user/profile/:username', getBookingProfile)
router.put('/user/update-profile', upload.single('profileImage'), updateBookingProfile)
router.post('/dining-query', addDiningBooking)
router.post('/dining-table-booking', addDiningTableBooking)
router.post('/banquet-query', addBanquetBooking)
router.post('/redbox-order', addRedboxBooking)
router.post('/create-room-booking', addBooking)
router.post('/conference-booking', addConferenceBooking)
router.get('/user/dining-queries/:username', getUserDiningBookings)
router.get('/user/banquet-bookings/:username', getUserBanquetBookings)
router.get('/banquet-bookings', getAllBanquetBookings)
router.get('/user/redbox-orders/:username', getUserRedboxBookings)
router.get('/user/ping', (req, res) => res.json({ ok: true, route: 'user/ping' }))

console.log('BookingAuthRoutes loaded:', router.stack.filter((layer) => layer.route).map((layer) => ({ path: layer.route.path, methods: layer.route.methods })))

export default router
