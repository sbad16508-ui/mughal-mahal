import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { sendOtpEmail } from '../services/emailService.js'
import DiningBooking from '../models/diningBooking.js'
import bcrypt from 'bcrypt'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const dataDir = path.join(__dirname, '../data')
const usersFile = path.join(dataDir, 'bookingUsers.json')

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString()

const ensureStorage = async () => {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
  if (!fs.existsSync(usersFile)) {
    await fs.promises.writeFile(usersFile, '[]', 'utf8')
  }
}

const readUsers = async () => {
  await ensureStorage()
  const content = await fs.promises.readFile(usersFile, 'utf8')
  try {
    return JSON.parse(content || '[]')
  } catch {
    return []
  }
}

const writeUsers = async (users) => {
  await ensureStorage()
  await fs.promises.writeFile(usersFile, JSON.stringify(users, null, 2), 'utf8')
}

export const registerInit = async (req, res) => {
  try {
    const { firstName, lastName, email, username, password, city, address, phone } = req.body
    if (!firstName || !lastName || !email || !username || !password || !city || !address || !phone) {
      return res.status(400).json({ message: 'All registration fields are required.' })
    }

    const users = await readUsers()
    const existingEmail = users.find((u) => u.email.toLowerCase() === email.toLowerCase())
    if (existingEmail && existingEmail.isVerified) {
      return res.status(409).json({ message: 'Email already registered.' })
    }

    const existingUsername = users.find((u) => u.username.toLowerCase() === username.toLowerCase())
    if (existingUsername && existingUsername.isVerified && existingUsername.email.toLowerCase() !== email.toLowerCase()) {
      return res.status(409).json({ message: 'Username already taken.' })
    }

    const otpCode = generateOtp()
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString()
    const profileImage = req.file ? req.file.filename : undefined
    const hashedPassword = await bcrypt.hash(password, 14)

    let user = existingEmail || existingUsername
    if (user) {
      user.firstName = firstName
      user.lastName = lastName
      user.email = email
      user.username = username
      user.password = hashedPassword
      user.city = city
      user.address = address
      user.phone = phone
      user.profileImage = profileImage || user.profileImage
      user.isVerified = false
      user.otpCode = otpCode
      user.otpExpiresAt = otpExpiresAt
    } else {
      user = {
        firstName,
        lastName,
        email,
        username,
        password: hashedPassword,
        city,
        address,
        phone,
        profileImage,
        isVerified: false,
        otpCode,
        otpExpiresAt,
        createdAt: new Date().toISOString()
      }
      users.push(user)
    }

    await writeUsers(users)
    await sendOtpEmail({ email, otp: otpCode })
    res.status(200).json({ message: 'OTP sent to email', email })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: error.message })
  }
}

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body
    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required.' })
    }

    const users = await readUsers()
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase())
    if (!user) return res.status(404).json({ message: 'User not found.' })
    if (user.isVerified) return res.status(400).json({ message: 'User is already verified.' })
    if (!user.otpCode || !user.otpExpiresAt) return res.status(400).json({ message: 'OTP not requested.' })
    if (new Date(user.otpExpiresAt) < new Date()) return res.status(400).json({ message: 'OTP has expired.' })
    if (user.otpCode !== otp) return res.status(400).json({ message: 'Invalid OTP code.' })

    user.isVerified = true
    user.otpCode = undefined
    user.otpExpiresAt = undefined
    await writeUsers(users)

    const responseUser = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username,
      city: user.city,
      address: user.address,
      phone: user.phone,
      profileImage: user.profileImage
    }

    res.status(200).json({ message: 'Verification successful', user: responseUser })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: error.message })
  }
}

export const getBookingProfile = async (req, res) => {
  try {
    const { username } = req.params
    if (!username) {
      return res.status(400).json({ message: 'Username is required.' })
    }

    const users = await readUsers()
    const user = users.find((u) => u.username.toLowerCase() === username.toLowerCase())
    if (!user) {
      return res.status(404).json({ message: 'User not found.' })
    }

    // attach user's dining queries (if Mongo is available)
    let diningQueries = []
    try {
      diningQueries = await DiningBooking.find({ username: user.username }).sort({ createdAt: -1 })
    } catch (err) {
      // ignore DB errors (server may be running without Mongo)
      diningQueries = []
    }

    res.status(200).json({ user: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username,
      city: user.city,
      address: user.address,
      phone: user.phone,
      profileImage: user.profileImage,
      diningQueries
    }})
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: error.message })
  }
}

export const updateBookingProfile = async (req, res) => {
  try {
    const { currentUsername, firstName, lastName, email, username, city, address, phone } = req.body || {}
    if (!currentUsername) {
      return res.status(400).json({ message: 'Current username is required.' })
    }

    const users = await readUsers()
    const user = users.find((u) => u.username.toLowerCase() === currentUsername.toLowerCase())
    if (!user) {
      return res.status(404).json({ message: 'User not found.' })
    }

    const emailTaken = users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.username.toLowerCase() !== currentUsername.toLowerCase())
    if (emailTaken) {
      return res.status(409).json({ message: 'Email already used by another account.' })
    }

    const usernameTaken = users.find((u) => u.username.toLowerCase() === username.toLowerCase() && u.username.toLowerCase() !== currentUsername.toLowerCase())
    if (usernameTaken) {
      return res.status(409).json({ message: 'Username already taken.' })
    }

    user.firstName = firstName || user.firstName
    user.lastName = lastName || user.lastName
    user.email = email || user.email
    user.username = username || user.username
    user.city = city || user.city
    user.address = address || user.address
    user.phone = phone || user.phone

    if (req.file) {
      user.profileImage = req.file.filename
    }

    await writeUsers(users)

    res.status(200).json({ user: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username,
      city: user.city,
      address: user.address,
      phone: user.phone,
      profileImage: user.profileImage
    }})
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: error.message })
  }
}

export const loginBookingUser = async (req, res) => {
  try {
    const { username, email, password } = req.body || {}
    const loginIdentifier = (username || email || '').trim().toLowerCase()
    if (!loginIdentifier || !password) {
      return res.status(400).json({ message: 'Username/email and password are required.' })
    }

    const users = await readUsers()
    const user = users.find((u) => {
      const storedUsername = (u.username || '').toLowerCase()
      const storedEmail = (u.email || '').toLowerCase()
      return storedUsername === loginIdentifier || storedEmail === loginIdentifier
    })
    if (!user) return res.status(404).json({ message: 'User not found.' })
    const allowUnverifiedLogin = process.env.ALLOW_UNVERIFIED_LOGIN === 'true' || process.env.NODE_ENV !== 'production'
    if (!user.isVerified && !allowUnverifiedLogin) {
      return res.status(403).json({ message: 'Please verify your email before login.' })
    }

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) return res.status(401).json({ message: 'Invalid credentials.' })

    res.status(200).json({ message: 'Login successful', user: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username,
      city: user.city,
      address: user.address,
      phone: user.phone,
      profileImage: user.profileImage
    }})
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: error.message })
  }
}
