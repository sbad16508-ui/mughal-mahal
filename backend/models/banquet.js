import mongoose from 'mongoose'

const banquetSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    capacity: {
        type: String,
        required: true
    },
    area: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    tags: {
        type: [String],
        default: []
    }
})

const Banquet = mongoose.models.Banquet || mongoose.model('Banquet', banquetSchema)
export default Banquet