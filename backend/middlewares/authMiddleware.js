import jwt from 'jsonwebtoken'
import { testUsers } from '../controllers/authController.js'

export const verifyToken = (req, res, next) => {
    let token = req.cookies.access_token
    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1]
    }
    if (!token) return res.status(401).json({ message: "Not authenticated!" })

    const secret = process.env.JWT_SECRET || 'test-secret'
    jwt.verify(token, secret, (err, admin) => {
        if (err) return res.status(401).json({ message: "Token is invalid!" })
        
        // ✅ IMPORTANT: Admin abhi bhi exist karti hai check karo
        const adminExists = testUsers.find(u => u._id.toString() === admin.id)
        if (!adminExists) {
            return res.status(401).json({ message: "Admin no longer exists - Access Denied!" })
        }
        
        req.admin = admin
        next()
    })
}