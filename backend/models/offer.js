import mongoose from 'mongoose'

const offerSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    code: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        uppercase: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    discountType: {
        type: String,
        required: true,
        enum: ["Percentage (%)", "Fixed Amount ($)"],
        default: "Percentage (%)"
    },
    discountValue: {
        type: Number,
        required: true,
        min: 0,
    },
    validFrom: {
        type: Date,
        required: true,
    },
    validTo: {
        type: Date,
        required: true,
    },
    minimumStay: {
        type: String,
        default: ""
    },
    maximumDiscount: {
        type: Number,
        default: null
    },
    terms: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        required: true,
        enum: ["Active", "Draft", "Expired"],
        default: "Draft"
    },
    usageLimit: {
        type: Number,
        default: null
    },
    totalRedeemed: {
        type: Number,
        default: 0
    }
})

export default mongoose.model('Offer', offerSchema)