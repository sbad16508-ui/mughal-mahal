import mongoose from 'mongoose'

const orderItemSchema = new mongoose.Schema({
  itemCategory: { type: String },
  itemName: { type: String },
  itemPrice: { type: Number, default: 0 },
  quantity: { type: Number, default: 1 },
  amount: { type: Number, default: 0 }
}, { _id: false })

const diningBookingSchema = new mongoose.Schema({
  username: { type: String, required: true },
  guestName: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String },
  serviceType: {
    type: String,
    required: true,
    enum: ['Dining', 'Redbox'],
    default: 'Dining'
  },
  selectedPage: { type: String },
  itemCategory: { type: String },
  itemName: { type: String },
  itemPrice: { type: Number, default: 0 },
  quantity: { type: Number, default: 1 },
  itemDetails: { type: [orderItemSchema], default: [] },
  totalAmount: { type: Number, default: 0 },
  timing: { type: String },
  note: { type: String }
}, { timestamps: true })

export default mongoose.model('DiningBooking', diningBookingSchema)
