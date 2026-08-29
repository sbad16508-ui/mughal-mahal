import mongoose from 'mongoose'

const eventSchema = new mongoose.Schema({
    eventName: { type: String, required: true },
    eventType: { type: String, required: true },
    banquetHall: { type: String, required: true },
    eventDate: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    expectedGuests: { type: Number, required: true },
    contactPerson: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: false },
    hallRental: { type: String, required: false },
    catering: { type: String, required: false },
    decoration: { type: String, required: false },
    paidAmount: { type: Number, required: false },
    specialRequests: { type: String, required: false },
    internalNotes: { type: String, required: false },
    status: { type: String, required: true }
})

export default mongoose.model('Event', eventSchema)