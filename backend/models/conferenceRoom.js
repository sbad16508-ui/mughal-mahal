import mongoose from 'mongoose'

const conferenceRoomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    capacity: {
        type: Number,
        required: true,
        min: 1
    },
    layout: {
        type: String,
        default: "Standard Style",
    },
    price: {
        type: Number,
        required: true,
        default: 0
    },
    tags: {
        type: [String],
        default: ["WiFi", "Projector"]
    },
    status: {
        type: String,
        enum: ["available", "booked", "maintenance", "Available", "Booked", "Maintenance"],
        default: "Available"
    }
})

export default mongoose.model('ConferenceRoom', conferenceRoomSchema)