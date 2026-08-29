import mongoose from 'mongoose'

const bookingSchema = new mongoose.Schema({
    guestName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        type: String,
        trim: true,
        default: ''
    },
    bookingType: {
        type: String,
        required: true,
        enum: ['Room', 'Banquet', 'Conference'],
        default: 'Room'
    },
    roomVenue: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
    },
    checkInDate: {
        type: Date,
        required: true,
    },
    checkOutDate: {
        type: Date,
        required: true
    },
    specialRequests: {
        type: String,
        trim: true,
        default: ''
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ['cash', 'card']
    },
    paymentStatus: {
        type: String,
        required: true,
        enum: ['paid', 'pending'],
        default: 'pending'
    },
    totalAmount: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    paidAmount: {
        type: Number,
        min: 0,
        default: 0
    },
    internalNotes: {
        type: String,
        trim: true,
        default: ''
    },
    status: {
        type: String,
        required: true,
        enum: ['confirmed', 'pending', 'cancelled'],
        default: 'confirmed'
    }
})

export default mongoose.model('Booking', bookingSchema)