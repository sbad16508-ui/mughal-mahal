import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import authRoutes from './routes/authRoutes.js'
import bookingAuthRoutes from './routes/bookingAuthRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import diningRoutes from './routes/diningRoutes.js'
import checkBanquetHalls from './services/checkBanquetHalls.js'
import checkConferenceRooms from './services/checkConferenceRoom.js'
import { setDatabaseAvailable } from './controllers/conferenceController.js'

dotenv.config()

const server = express()
const port = process.env.PORT || 3000

const startServer = async () => {
    if (process.env.MONGO_URI) {
        try {
            await mongoose.connect(process.env.MONGO_URI)
            await checkBanquetHalls()
            await checkConferenceRooms()
            setDatabaseAvailable(true)
            console.log('MongoDB connected successfully')
        } catch (err) {
            console.error('MongoDB connection error:', err.message)
            setDatabaseAvailable(false)
            console.warn('Continuing without MongoDB. Some database-backed features may not work.')
        }
    } else {
        console.warn('MONGO_URI is not configured. Starting backend without MongoDB.')
        setDatabaseAvailable(false)
    }

    const allowedOrigins = [
        'http://localhost:5173',
        'http://localhost:5174',
        'http://127.0.0.1:5173',
        'http://127.0.0.1:5174',
        process.env.FRONTEND_URL
    ].filter(Boolean)

    const isLocalhostOrigin = (origin) => {
        if (!origin) return false
        return /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin)
    }

    const isAllowedOrigin = (origin) => {
        if (!origin) return false
        if (isLocalhostOrigin(origin)) return true
        return allowedOrigins.includes(origin)
    }

    const corsOptions = {
        origin: (origin, callback) => {
            if (!origin || isAllowedOrigin(origin)) {
                callback(null, true)
                return
            }
            callback(new Error(`Origin not allowed by CORS: ${origin}`))
        },
        credentials: true
    }

    server.use(helmet({
        crossOriginResourcePolicy: {
            policy: 'cross-origin'
        }
    }))
    server.use(cors(corsOptions))
    server.use(express.json())
    server.use(cookieParser())

    const __filename = fileURLToPath(import.meta.url)
    const __dirname = path.dirname(__filename)
    server.use('/uploads', (req, res, next) => {
        res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin')
        next()
    }, express.static(path.join(__dirname, 'uploads')))

    server.use('/api', authRoutes)
    server.use('/api/booking', bookingAuthRoutes)
    server.use('/api/dining', diningRoutes)
    server.use('/api', adminRoutes)

    server.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`)
    })
}

startServer()