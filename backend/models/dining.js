import mongoose from 'mongoose'

const diningSchema = new mongoose.Schema({
    itemName: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    preparationTime: {
        type: Number,
        required: true
    },
    servingSize: {
        type: String
    },
    calories: {
        type: Number
    },
    description: {
        type: String
    },
    ingredients: {
        type: [String]
    },
    allergens: {
        type: [String]
    },
    availability: {
        type: String,
        enum: ['available', 'unavailable'],
        default: 'available'
    }
})

export default mongoose.model('Dining', diningSchema)