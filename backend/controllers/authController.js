import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Admin from '../models/admin.js'
import mongoose from 'mongoose'

// In-memory admin user storage for fallback auth
let testUsers = [
    {
        _id: new mongoose.Types.ObjectId(),
        fullname: 'Armish',
        email: 'aarn69870@gmail.com',
        password: '$2b$10$FXgu1eITzdHt8Hnq152QOOO.HDJKY3LSsJU2.t5gwjoxPazyHN0IW',
        role: 'Admin'
    },
    {
        _id: new mongoose.Types.ObjectId(),
        fullname: 'Maryum',
        email: 'maryamchfishfarm2003@gmail.com',
        password: '$2b$10$fpCVed0YNfTaxy1ggmLWTeP1VtxvItGCImuNPLPuJE/.amqhhBqpy',
        role: 'Admin'
    },
    {
        _id: new mongoose.Types.ObjectId(),
        fullname: 'Sinha',
        email: 'sinhatuljannat0@gmail.com',
        password: '$2b$10$9uu2KkKU9q0X1WKwUGsL2eKMr7csS.fzqj/dIy9sKeH8Bi8gjTGWm',
        role: 'Admin'
    }
]

export const login = async (req, res) => {
    const { email, password } = req.body
    try {
        let admin = null

        if (mongoose.connection.readyState === 1) {
            admin = await Admin.findOne({ email })
        }

        if (!admin) {
            admin = testUsers.find((u) => u.email === email)
        }

        if (!admin) return res.status(404).json({ message: 'Admin not found' })

        const allowedRoles = ['admin', 'administrator']
        if (!admin.role || !allowedRoles.includes(String(admin.role).toLowerCase())) {
            return res.status(403).json({ message: 'Admin access only' })
        }

        const isPasswordValid = await bcrypt.compare(password, admin.password)
        if (!isPasswordValid) return res.status(401).json({ message: 'Invalid credentials' })

        const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET || 'test-secret', {
            expiresIn: '1h'
        })

        const cookieOptions = {
            httpOnly: true,
            maxAge: 60 * 60 * 1000,
            sameSite: 'none',
            secure: process.env.NODE_ENV === 'production'
        }

        const { password: pwd, ...info } = admin
        res
            .status(201)
            .cookie('access_token', token, cookieOptions)
            .json({ message: 'Login Successfully', info, token })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const register = async (req, res) => {
    const { fullname, email, password } = req.body
    try {
        // Check if user already exists in test users
        const existingUser = testUsers.find(u => u.email === email)
        if (existingUser) return res.status(400).json({ message: 'User already exists' })
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10)
        
        // Create new admin object
        const newUser = {
            _id: new mongoose.Types.ObjectId(),
            fullname,
            email,
            password: hashedPassword,
            role: 'Admin'
        }
        
        // Add to test users (in-memory storage)
        testUsers.push(newUser)
        
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET || 'test-secret', { expiresIn: '1h' })
        const cookieOptions = {
            httpOnly: true,
            maxAge: 60 * 60 * 1000,
            sameSite: 'none',
            secure: process.env.NODE_ENV === 'production'
        }
        const { password: pwd, ...info } = newUser
        res.status(201).cookie('access_token', token, cookieOptions).json({ message: 'Register Successfully', info, token })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const logout = (req, res) => {
    res.clearCookie('access_token').json({ message: 'Logout' })
}

export const changePassword = async (req, res) => {
    const { email, oldPassword, newPassword } = req.body
    try {
        // Admin find karo
        let admin = testUsers.find(u => u.email === email)
        if (!admin) return res.status(404).json({ message: 'Admin not found' })

        // Purana password verify karo
        const isPasswordValid = await bcrypt.compare(oldPassword, admin.password)
        if (!isPasswordValid) return res.status(401).json({ message: 'Old password is incorrect' })

        // Naya password hash karo
        const hashedPassword = await bcrypt.hash(newPassword, 10)
        
        // Update karo
        admin.password = hashedPassword
        
        res.status(200).json({ message: 'Password changed successfully' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Export testUsers for middleware use
export { testUsers }