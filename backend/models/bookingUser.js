import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const bookingUserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  city: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  profileImage: { type: String },
  isVerified: { type: Boolean, default: false },
  otpCode: { type: String },
  otpExpiresAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
})

bookingUserSchema.pre('save', async function () {
  if (this.isModified('password')) {
    try {
      this.password = await bcrypt.hash(this.password, 14)
    } catch (err) {
      throw new Error('Error hashing password: ' + err.message)
    }
  }
})

bookingUserSchema.pre('findOneAndUpdate', async function () {
  const update = this.getUpdate()
  if (update.password) {
    update.password = await bcrypt.hash(update.password, 14)
  }
})

export default mongoose.model('BookingUser', bookingUserSchema)
