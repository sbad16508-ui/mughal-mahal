import mongoose from 'mongoose'

const roomSchema = new mongoose.Schema({
    roomNo: {
        type: String,
        required: true
    },
    roomType: {
        type: String,
        required: true
    },
    floor: {
        type: String,
        required: true
    },
    size: {
        type: String,
        required: true
    },
    capacity: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    bedType: {
        type: String,
        required: true
    },
    viewType: {
        type: String
    },
    description: {
        type: String
    },
    amenities: {
        type: [String]
    },
    images: {
        type: [String]
    },
    status: {
        type: String,
        required: true
    }
})

export default mongoose.model('Room', roomSchema)