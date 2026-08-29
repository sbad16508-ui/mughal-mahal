import mongoose from "mongoose"

const conferenceSchema = new mongoose.Schema({
    organizationName: {
        type: String,
        required: true,
        trim: true,
    },
    eventType: {
        type: String,
        required: true,
        enum: ["conference", "seminar", "workshop"],
        trim: true,
    },
    conferenceHallId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ConferenceRoom",
        required: true,
    },
    eventDate: {
        type: Date,
        required: true,
    },
    startTime: {
        type: String,
        required: true,
    },
    endTime: {
        type: String,
        required: true,
    },
    expectedAttendees: {
        type: Number,
        required: true,
        min: 1,
    },
    contactPerson: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        match: /.+\@.+\..+/,
    },
    phone: {
        type: String,
        required: true,
        trim: true,
    },
    pricingBreakdown: {
        hallRental: {
            type: Number,
            default: 0,
            min: 0,
        },
        equipment: {
            type: Number,
            default: 0,
            min: 0,
        },
        catering: {
            type: Number,
            default: 0,
            min: 0,
        },
        totalAmount: {
            type: Number,
            required: true,
            default: 0,
        },
        paidAmount: {
            type: Number,
            default: 0,
            min: 0,
        },
        remainingBalance: {
            type: Number,
            required: true,
            default: 0,
        },
    },
    requirements: {
        type: String,
        trim: true,
        default: "",
    },
    internalNotes: {
        type: String,
        trim: true,
        default: "",
    },
    status: {
        type: String,
        enum: ["pending", "confirmed", "cancelled"],
        default: "pending",
        lowercase: true,
    },
});

conferenceSchema.pre("save", function () {
    this.pricingBreakdown.totalAmount =
        Number(this.pricingBreakdown.hallRental || 0) +
        Number(this.pricingBreakdown.equipment || 0) +
        Number(this.pricingBreakdown.catering || 0);

    this.pricingBreakdown.remainingBalance =
        this.pricingBreakdown.totalAmount - Number(this.pricingBreakdown.paidAmount || 0);
});

export default mongoose.model("Conference", conferenceSchema);