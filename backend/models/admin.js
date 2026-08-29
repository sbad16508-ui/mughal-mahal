import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const adminSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    }
})

adminSchema.pre('save', async function () {
    if (this.isModified('password')) {
        try {
            this.password = await bcrypt.hash(this.password, 14)
        } catch (err) {
            throw new Error('Error hashing password: ' + err.message)
        }
    }
})

adminSchema.pre('findOneAndUpdate', async function () {
    try {
        const update = this.getUpdate()
        if (update.password) {
            update.password = await bcrypt.hash(update.password, 14)
        }
    } catch (err) {
        throw new Error('Error hashing password: ' + err.message)
    }
})

export default mongoose.model('Admin', adminSchema)